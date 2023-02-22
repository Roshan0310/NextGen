const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

//Regiseter a user 

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is sample id",
            url:"profilepicUrl"
        }
    });

    sendToken(user,201,res);
});


//Login User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{


    const { email, password } = req.body;

    //Checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("please Enter and Password",400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

   sendToken(user,200,res);

});

//Logout user
exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })


    res.status(200).json({
        sucess:true,
        message:"Logged Out"
    })
});


//Forgot Password 
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404))
    }

    //Get resetPassword Token 
   const resetToken =  user.getResetPasswordToken();

   await user.save({validateBeforeSave:false});


   const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

   const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please igonore it `;

   try {

    await sendEmail({
        email:user.email,
        subject:`NextGen Password Recovery`,
        message
    })

    res.status(200).json({
        sucess:true,
        message:`Email send to ${user.email} successfully`
    })

   } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined
    
    await user.save({validateBeforeSave:false});

    return next(new ErrorHandler(error.message,500))
   }

   
});

//Reset password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    //Creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });


    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired",400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't match",400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined

    await user.save();

    sendToken(user,200,res);

});
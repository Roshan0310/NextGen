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

//Get user Detials
exports.getuserDetails = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        sucess:true,
        user
    });
});

//Update user Password
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password doesn't matched",400))
    }

    user.password = req.body.newPassword;

   await  user.save()

   sendToken(user,200,res);
});



//Update user Profile
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }

    //we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

   res.status(200).json({
    success:true,
   })
});

//Get all users --Admin
exports.getAllUser = catchAsyncErrors(async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        sucess:true,
        users
    })

});

//Get Single user --Admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,404))
    }

    res.status(200).json({
        sucess:true,
        user
    });

});


//Update user Role --Admin
exports.updateUserRole = catchAsyncErrors(async (req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400))
    }

   res.status(200).json({
    success:true,
   })
});


//Delete user --Admin
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{

    const user = await User.findById(req.params.id);
    //we will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400))
    }

    await user.remove();

   res.status(200).json({
    success:true,
    message:"User Deleted Successfully"
   })
});


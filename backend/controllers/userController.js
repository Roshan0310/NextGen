const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWare/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");


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

   await user.save({validateBeforeSave:false})

   
})
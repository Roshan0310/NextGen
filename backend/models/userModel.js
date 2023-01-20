const mongoose = require("mongoose");
const validate = require("validator");
const byscryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30,"Name Cannot exeed 30 characters"],
    minLenghth: [4,"Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true,"Please Enter Your Email"],
    unique: true,
    validate: [validate.isEmail,"Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true,"Please Enter Your Password"],
    minLenghth: [8,"Name should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model("User",userSchema);

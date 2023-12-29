const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // validation of content form

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please is required all details");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error(
      "your password is to easy and less must be up to 6 character"
    );
  }

  // check if email already exist

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("email already exists");
  }

  // encrypt password before saving in database

  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword= await bcrypt.hash(password,salt)

  //create new user

  const user = await User.create({
    name,
    password,
    email,
  });
  // generate the token for the user

  const token = generateToken(user._id);

  // send http cookie

  res.cookie("token", token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400),// 1 day
    sameSite:"none",
    secure:true

  })

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }

  // if (!req.body.email){
  //     res.status(400)
  //     throw new Error("please add an email")
  // }
  // res.send("register user");
});

module.exports = {
  registerUser,
};

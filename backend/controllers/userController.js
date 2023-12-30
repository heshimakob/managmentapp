const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};


//Register user 




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

  });

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

//login user 

const loginUser = asyncHandler(async(req,res)=>{
    res.send("login user ");
    const {email,password}=req.body;

    if (!email || !password){
        res.status(400);
    throw new Error("please add email and password ");

    }
    // check if user exist 
    const  user =await User.findOne({email})

    if (!user){
        res.status(400);
    throw new Error("user not found");

    }

    // user exist check password is correct 
    const passwordIsCorrect=await bcrypt.compare(password, user.password)

      // generate the token for the user

  const token = generateToken(user._id);

  // send http cookie

  res.cookie("token", token,{
    path:"/",
    httpOnly:true,
    expires:new Date(Date.now()+1000*86400),// 1 day
    sameSite:"none",
    secure:true

  });
    if (user && passwordIsCorrect){
        const { _id, name, email, photo, phone, bio } = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
          });
    }else{
        res.status(400);
        throw new Error("invalid email or password ")
    }

}); 

const logout =asyncHandler(async(req,res)=>{
    res.cookie("token", "",{
        path:"/",
        httpOnly:true,
        expires:new Date(0),
        sameSite:"none",
        secure:true
    
      });
      return res.status(200).json({message:"success logout"})

});

// get user in the database

const getUser =asyncHandler(async(res,req)=>{
  const user = await User.findById(req.user._id)

    if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,

    });
  } else {
    res.status(400);
    throw new Error("user not found");
  }

});
// get login status 

const loginStatus =asyncHandler(async(req,res)=>{
  const token=req.cookies.token
  if(!token){
   return res.json(false)
  }
    //verified the token

    const verified=jwt.verify(token,process.env.JWT_SECRET)
    if(verified){
      return res.json(true)
    }
    return res.json(false)
});

//update user
const updateUser=asyncHandler(async(req,res)=>{

  const user= await User.findById(req.user._id)
  if(user){
    const { name, email, photo, phone, bio }=user;
    user.email=email;
    user.name=req.body.name || name;
    user.phone=req.body.phone || phone;
    user.photo=req.body.photo || photo;
    user.bio=req.body.bio || bio;

    const updatedUser=await user.save()
    res.status(200).json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      photo:updatedUser.photo,
      phone:updatedUser.phone,
      bio:updatedUser.bio,
    });
  }else{
    res.status(400)
    throw new Error ("User not found")
  }

});

//update password function

const changePassword=asyncHandler(async(req,res)=>{
const user = await User.findById(req.user._id);


const {oldPassword,password}=req.body;
if(!user){
  res.status(400)
  throw new Error("user not found ")
}


//verifier and validate password
if(!oldPassword || !password){
  res.status(400)
  throw new Error("password incorrect")
}
//check if password is correct 
const passwordIsCorrect= await bcrypt.compare(oldPassword, user.password);

// save new password 

if(user && passwordIsCorrect){

  user.password=password
  await user.save()
  res.status(200).send("password change successfully")
}else{
  res.status(400)
  throw new Error("old password is incorrect")
}

});
const forgotPassword=asyncHandler(async(res,req)=>{

})
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
};

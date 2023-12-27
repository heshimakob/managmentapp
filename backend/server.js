const dotenv= require("dotenv").config();
const mongoose=require("mongoose");
const cors =require("cors");
const express=require("express");
const bodyParser=require("body-parser")


const app =express();
const PORT =process.env.PORT || 500;

//connexion databa and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`server running on port ${PORT}`)
        })
    })
    .catch((err)=>console.log(err))

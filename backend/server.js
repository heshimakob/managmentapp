const dotenv= require("dotenv").config();
const mongoose=require("mongoose");
const cors =require("cors");
const express=require("express");
const bodyParser=require("body-parser");
const cookieParser= require("cookie-parser")

//routes  frontend initialize importation
const userRoute=require("./routes/userRoute")

const errorHandler=require("./middleWare/errorMiddleware")


const app =express();

//middleware

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

//route middleware 

app.use("/api/users", userRoute)

//routes
app.get("/",(req, res)=>{
    res.send("homepage");
});

// error middleware 
app.use(errorHandler);

const PORT =process.env.PORT || 5000;


//connexion databa and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`server running on port ${PORT}`)
        })
    })
    .catch((err)=>console.log(err))

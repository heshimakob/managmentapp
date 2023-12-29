const mongoose = require("mongoose")
const bcrypt=require(bcryptjs)


const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true, "please ass name"]
    },
    email:{
        type:String,
        required:[true, "add email"],
        unique:true,
        trim:true,
        match:[ /^([a-zA-Z0-9_-.]+)@([a-zA-Z0-9_-.]+).([a-zA-Z]{2,5})$/, "add valid email" ] 
    },
    password:{

        type:String,
        required:[true, "please ass name"],
        minLength:[6,"Password must b up 6 character"],
        // maxLength:[23,"Password must be less or more than 23 character"]
    },
    photo:{
        type:String,
        required:[true, "please add photo"],
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Ffr.freepik.com%2Fphotos-vecteurs-libre%2Favatars-png&psig=AOvVaw2fKgKfT-txHSrTRT135WWz&ust=1703837658885000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDygojYsYMDFQAAAAAdAAAAABAE"


    },
    phone:{
        type:String,
       default:"+243"
    },
    bio:{
        type:String,
        maxLength:[250,"bio must be less or more than 250 character"],
        default:"bio"

    }

},
{
    timestamps:true,
});
//Encrypt password before to save to database

userSchema.pre("save", async function(next){
    if (!this.isModify("password")){
        return next()
    }

    // hash password 

const salt = await bcrypt.genSalt(10)
const hashedPassword= await bcrypt.hash(this.password,salt)
this.password=hashedPassword;
next()

})


const User=mongoose.model("User",userSchema)
module.exports=User
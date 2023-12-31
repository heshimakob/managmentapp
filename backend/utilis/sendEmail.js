const nodemailer=require("nodemailer")

const sendEmail =(res,req)=>{

    const transporter =nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:537,
        auth:{
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls:{
            rejectUnauthorized:false
        }
    })

}

module.exports=sendEmail;
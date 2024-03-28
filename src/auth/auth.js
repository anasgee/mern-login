const jwt = require("jsonwebtoken");
const Register = require("../models/register");




const auth = async(req,res,next)=>{

    try{
        const token = req.cookies.jwtCookie;
       const verifyUser=jwt.verify(token, process.env.SecretKey)
    //    console.log(verifyUser);

        const user =await Register.findOne({_id:verifyUser._id})
        console.log(user.email);

        req.token =  token;
        req.user=  user

        next();

    }catch(error){
res.status(400).send(error)
    }
}



module.exports = auth;
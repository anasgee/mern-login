const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,

    },
    password:{
        type:String,
        required:true,

    },
    cpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
        
    }]
    
})





// To apply jWT Token, use this code to apply that token

registerSchema.methods.generateAuthToken = async function(next){
    try {
        // for assigning jwt on register event...
        const token = jwt.sign({_id:this._id.toString()},process.env.SecretKey);    
        
        // For storing jwt token in data base
        // here this.token  == token is equal to token we are assigning on registeration.
        // Concat() method is used for storing a this or token from jwt => towards database

        this.tokens= this.tokens.concat({token:token});
        await this.save();
        // console.log(token)
        // cpassword= undefined

        return token;
    } catch (error) {
res.status(400).send("This is error message" +error) ;
console.log(error)   }
    next()
}



// to hash password, just enter save method in first parameter and then anonymous funtion to code hash method
registerSchema.pre("save", async function(next){
    try{
 
        if(this.isModified("password")){
            // console.log(`The current password is ${this.password}`);
            this.password = await bcrypt.hash(this.password,10);
            this.cpassword = await bcrypt.hash(this.cpassword,10);
            // console.log(`The current password is ${this.password}`);
            
            // this.cpassword =undefined;
        }
    }catch(err){
        throw new Error(err)
    }
    next()
})




const Register = new mongoose.model("Register",registerSchema);
module.exports = Register;

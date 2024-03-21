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

registerSchema.methods.generateAuthToken = async function(){
    try {
        // for assigning jwt on register event...
        const token = jwt.sign({_id:this._id},"MyNameISMuhammadAnasAndIamayoutubertechyoutuberandreviewer");
        
        // For storing jwt token in data base
        // here this.token  == token is equal to token we are assigning on registeration.
        this.tokens= this.tokens.concat({token:token});
        await this.save();
        // console.log(token)

        return token;
    } catch (error) {
        res.send("this is error " + error)
        console.log("this is " + error)
    }
}



// to hash password, just enter save method in first parameter and then anonymous funtion to code hash method
registerSchema.pre("save", async function(next){
    try{
 
        if(this.isModified("password")){
            // console.log(`The current password is ${this.password}`);
            this.password = await bcrypt.hash(this.password,10);
            // console.log(`The current password is ${this.password}`);
            
            this.cpassword =undefined;
        }
    }catch(err){
        throw new Error(err)
    }
    next()
})




const Register = new mongoose.model("Register",registerSchema);
module.exports = Register;

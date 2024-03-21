const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/registerationForm").then(()=>{
    console.log("MONGODB connection successfull")
}).catch((err)=>{
    console.log(err)
});
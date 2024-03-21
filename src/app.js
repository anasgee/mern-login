const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const hbs = require("hbs");
const Register = require("./models/register");
require("./db/conn");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");






// Paths
const staticPath= path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials")


// App.use

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialsPath)





// Routes for the pages and post/get request
app.get("",(req,res)=>{
    res.render("index")
});
app.post("/register",async(req,res)=>{

    try{
        const password=req.body.password;
        const cpassword=req.body.cpassword
        if(password===cpassword){
            const getFormData= new Register({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                gender:req.body.gender,
                email:req.body.email,
                password:password,
                cpassword:cpassword

            });

            // getFormData is our instance and Register is our collection.  jab b ham kisi instance k sath work kr rahy hon to ham 
            // methods() use krty hain for the sake of task we are going to perform
            console.log("the success part" + getFormData)
            const token = await getFormData.generateAuthToken();
            console.log("the token part " + token)

            const formRegistered = await getFormData.save();
            console.log("the page part" + formRegistered);
            res.status(201).render("index");
        }
    }catch(err){
        console.log("an erorr is occured",err);
        res.status(400).send(err)
    }
})
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login", (req,res)=>{
    res.render("login")
})
app.post("/login", async(req,res)=>{

try{
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await Register.findOne({email:email});
    // console.log(userEmail)

    const compareHash = await bcrypt.compare(password, userEmail.password)

    if(compareHash){
        res.status(201).render("index");
    }else{
        res.send("invalid login")
    }

    // console.log( `your email address is ${email} and password is ${password}`)
}catch{
    res.status(400).send("invalid Login");
}});

// Hasshing password;



// const securePassword =async(password) => {
//     try{
//         const hashPassword =await bcrypt.hash(password,10);
//         // console.log(hashPassword);


//         const compareHash= await bcrypt.compare(password,hashPassword);   ///True
//         // const compareHash= await bcrypt.compare("password",hashPassword);   ///False
//         // console.log(compareHash)
//     }catch(err){
//         console.log(err)
//     }
// };

// securePassword("anasraza")






// JWT    ======================>>>>>>>>>>>>>>>>>>>> JSON WEB TOKEN <<<<<<<<<<<<<<<<<<<<<<<==========================

// ------------------->>>>>>>>>>>       state list           <<<<<<<<------------
//  State list is something means server k pass hamara data hta hai token ni hota.     token only communicate krwata hai between your web
//  browser and client ....... so thake it easy and dont hesitate while working with the jwt token web based.



// const createToken = async(_id)=>{

//     const cToken = await jwt.sign({_id}, "I'mAnasRazaATechYoutuberandReviewerAndDoUnboxingAndReviews");

//     console.log(cToken);

//     const verifyUser = await jwt.verify(cToken,"I'mAnasRazaATechYoutuberandReviewerAndDoUnboxingAndReviews" );
//     console.log(verifyUser)


// }

// createToken("65fa8103ed01ac39ce426360")

// =--------------------------There is another way to assign token dynamically.
// , that is used in post method of req.body before saving fetched data


// 
app.listen(port,()=>{
    console.log(`server is listening to the port ${port}`);
})
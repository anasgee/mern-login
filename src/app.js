require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const hbs = require("hbs");
const Register = require("./models/register");
require("./db/conn");
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./auth/auth")







// Paths
const staticPath= path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials")


// App.use

app.use(express.static(staticPath));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialsPath);





// Routes for the pages and post/get request
app.get("",(req,res)=>{
    res.render("index")
});
app.get("/secret",auth,(req,res)=>{

    // console.log(`This is cookie ${req.cookies.jwtCookie}`)
    res.render("secret")
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
            console.log("the success part" + getFormData);


            const token = await getFormData.generateAuthToken();
            console.log("the token part " + token)

            // use
            res.cookie("jwtCookie",token,{
                expires:new Date(Date.now()+30000),
                httpOnly:true
            });

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
app.get("/logout",auth,async (req,res)=>{
    try{
        console.log("Logut Successfully");

                            //--------------- For deleting only current cookie..
        // req.user.tokens = req.user.tokens.filter((currElem)=>{
        //     return currElem.token !== req.token
        // })


                            //--------------- for deleting all users
        req.user.tokens =[];

        
        res.clearCookie("jwtCookie");
        await req.user.save();

    }catch(error){
        res.status(400).send(error)
    }

    res.render("index");
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

    const compareHash = await bcrypt.compare(password, userEmail.password);

    const token = await userEmail.generateAuthToken();
    console.log(" this is login -------------- "+ token);

    


    if(compareHash){
        res.status(201).render("index");
        res.cookie("jwtCookie",token,{
            expires:new Date(Date.now()+30000),
            httpOnly:true,
            // secure:true
        });

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

require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 80;
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
const mongo_url = process.env.MONGO_URL;

async function main(){
   await mongoose.connect(mongo_url);
}

main().then(() => {
    console.log("connection successful to db");
}).catch((err) => {
    console.log(err);
})

const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //curr logged in user

    next(); //donot forget or else well be stuck here
});

// app.get("/demouser" , async(req,res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/",userRouter);

// app.get("/Listing",async(req,res)=>{
//     let sampleListing= new Listing({
//         title : "My home",
//         description : "sample image testing",
//         image :"",
//         location : "Hyd",
//     });
//     await sampleListing.save();
//     res.send("saved to db"); 
// })

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.all("*" , (req,res,next) => {
    next(new ExpressError(404 , "Page doesn't exist"));
})

function castError(err,req,res){
    return res.status(400).send("Invalid ID format.");
}

app.use((err,req,res,next) => {
    let {status , message} = err;
    console.log(err);
    if(err.name === "CastError"){
        return castError(err,req,res);
    }
    res.status(status).render("listings/error.ejs",{message});
    //res.status(status || 500).send(message || "Something went wrong");
    //next();
})

app.listen(PORT , () =>{
    console.log("Listening to the port 8080");
})
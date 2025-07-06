const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));


const sessionOptions = {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : true
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.succMssgs = req.flash("success"); //key of the flash
    res.locals.errorMssgs = req.flash("error");
    next();
})

app.get("/register" , (req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;

    if(name === "anonymous"){
        req.flash("error" , "user not registered");
    }else{
        req.flash("success" , "User registered succesfull");
    }
    res.redirect("/hello");
})

app.get("/hello" , (req,res) => {
    res.render("page.ejs", {name : req.session.name })
    //res.render("page.ejs" , {name : req.session.name , msg : req.flash("info")});
})

// app.get("/reqcount" , (req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }
//     else
//         req.session.count = 1;
//     res.send(`sent a request ${req.session.count} times`);
// })

// app.get("/testroute" , (req,res) => {
//     res.send("test successful!")
// });

















// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie" , (req,res) => {
//     res.cookie("madein", "india",{signed:true});
//     res.send("signed cookie sent");
// })

// app.get("/verify" ,(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/getcookies" , (req,res) => {
//     res.cookie("greet" , "hello");
//     res.cookie("country" , "india");
//     res.send("sent you some cookies!");
// })

// app.get("/",(req,res) => {
//     console.dir(req.cookies);
//     res.send("root");
// })

// app.use("/greet" , (req,res) => {
//     let {name = "anonymous"} =  req.cookies;
//     res.send(`Namaste ${name} !`);
// })

app.use("/users",users); //common path is written is mapped in users file
app.use("/posts",posts);


// app.post("/posts/id",(req,res) => {
//     res.send("post get");
// })

// app.get("/posts",(req,res) => {
//     res.send("post show");
// })


// app.delete("/posts/id",(req,res) => {
//     res.send("post delete");
// })

app.listen(3000 , ()=>{
 console.log("listening")
})
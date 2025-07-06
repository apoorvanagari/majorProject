const LocalStrategy = require("passport-local");
const User = require("../models/user.js");
const flash = require("connect-flash");
const ExpressError = require("../utils/ExpressError.js");

module.exports.renderSignupForm = (req , res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res,next) => {
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success" , "SignUp successful!")
            res.redirect("/listings");
    })
    console.log(registeredUser);
    }
    catch(err){
        req.flash("error" , "A user with the given username is already registered");
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    let {username , password} = req.body;
    req.flash("success","Welcome back to Wanderlust");
    //console.log(res.locals.redirectUrl);

    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out")
        res.redirect("/listings");
    })
};
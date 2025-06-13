const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
   await mongoose.connect(mongo_url);
}

main().then(() => {
    console.log("connection successful to db");
}).catch((err) => {
    console.log(err);
})

const validateListing = (req,res,next) => {
    const result = listingSchema.validate(req.body);

    if(result.error){
        const errMsg = result.error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(404 , errMsg);
    }else{
        next();
    }
};

app.get("/",(req , res) => {
    res.send("Welcome to our new project!");
});

app.get("/listings",wrapAsync(async (req , res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));


// new route
// keep it before :id . If we dont then it takes new as id
app.get("/listings/new",(req , res) => {
    res.render("listings/new.ejs");
});

app.post("/listings",validateListing , wrapAsync(async (req,res,next) => {
    //go near hopscotch and directly check for http://localhost:8080/listings with post request - undefined will go because nothing gets entered
    //so through hopscotch empty or fault data can be entered

    // if(!req.body.listing){
    //     return next(new ExpressError(400 , "The body is undefined"));
    // }

    
    const newListing = new Listing(req.body.listing); //js object hence new
    
    // if(!newListing.description){
    //    return next(new ExpressError(400 , "Enter description")); //simillarly for all fields, but this method is tedious
    // }
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",validateListing,wrapAsync(async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
    
}));

app.delete("/listings/:id",wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


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

app.listen(port , () =>{
    console.log("Listening to the port 8080");
})
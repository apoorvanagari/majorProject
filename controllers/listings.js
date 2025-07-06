const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const cloudinary = require("cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });

module.exports.index = async (req , res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req,res,next) => {
    //go near hopscotch and directly check for http://localhost:8080/listings with post request - undefined will go because nothing gets entered
    //so through hopscotch empty or fault data can be entered

    // if(!req.body.listing){
    //     return next(new ExpressError(400 , "The body is undefined"));
    // }

    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send();


    const newListing = new Listing(req.body.listing); //js object hence new
    newListing.owner = req.user._id;
    newListing.image = req.files.map((file) => ({
        filename: file.filename,
        url: file.path
    }));

    newListing.geometry =  response.body.features[0].geometry;
    let savedListing = await newListing.save();
    req.flash("success", "new Listing created"),
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The requested listing doesnot exist.");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image[0].url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

module.exports.updateListing = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,{...req.body.listing});

    if(req.files && req.files.length > 0){ 
    let newImages = req.files.map((file) => ({
        filename: file.filename,
        url: file.path
    }));

    await listing.image.push(...newImages);
    await listing.save();
    }
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.showListing= async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path : "reviews",
            populate : {
                path : "author"
            }
        })
    .populate("owner");  //owner of the listing
    if(!listing){
        req.flash("error" , "The listing you requested for does not exist.");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs",{listing,maptoken: process.env.MAP_TOKEN });
    
};

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing is deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
};


module.exports.destroyImage = async(req,res) =>{
   let {id , filename} = req.params;
   //delete it from cloudinary
   const decodedFilename = decodeURIComponent(filename);

    await cloudinary.uploader.destroy(decodedFilename);

    await Listing.findByIdAndUpdate(id, {
    $pull: { image: { filename: decodedFilename } }
    });
   req.flash("success" , "Image is deleted!");
    res.redirect(`/listings/${id}`);
}

module.exports.categoryListing = async(req,res) => {
    const {category} = req.params;
    try{
        let listings = await Listing.find({category});
        res.render("listings/category.ejs" , {listings});
    }
    catch(err){
        console.log(err);
        res.send("wait");
    }
}

module.exports.countryListing = async(req,res) => {
    const {country} = req.params;
    try{
        let listings = await Listing.find({ country: { $regex: new RegExp(`^${country}$`, "i") } });
        res.render("listings/country.ejs" , {listings});
    }
    catch(err){
        console.log(err);
        res.send("wait");
    }
}

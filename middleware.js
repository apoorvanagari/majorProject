const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectedUrl = req.originalUrl;
        req.flash("error" , "Please signup/login to add a new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectedUrl){
        res.locals.redirectUrl = req.session.redirectedUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req,res,next) => {
    const result = listingSchema.validate(req.body);

    if(result.error){
        const errMsg = result.error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(404 , errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    const result = reviewSchema.validate(req.body);

    if(result.error){
        const errMsg = result.error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(404 , errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id} = req.params;
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

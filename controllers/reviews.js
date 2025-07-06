const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js");

module.exports.createReview = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id);

    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success" , "new review added!");
    res.redirect(`/listings/${id}`);
    
};

module.exports.destroyReview = async(req,res,next) => {
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success" , "Review is Deleted!");
    res.redirect(`/listings/${id}`);
};
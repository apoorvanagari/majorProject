const mongoose = require("mongoose");
const { reviewSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : [{
        url : String,
        filename: String,
    }],
    price : {
        type : Number,
    },
    location :{
        type : String,
    },
    country :{
        type : String,
    },

    reviews:[{
        type: Schema.Types.ObjectId,
        ref : "Review"
    }],

    owner :{
        type:Schema.Types.ObjectId,
        ref :"User"
    },

    geometry :{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates :{
            type:[Number],
            required:true
        }
    },

    category:{
        type: String,
        enum: [
        "islands", "rooms", "iconic-cities", "mountains", "castles",
        "amazing-pools", "camping", "farms", "arctic-pools", "domes", "boats"
        ],
        required: true
    }
});

listingSchema.post("findOneAndDelete" , async (listing) => { //listing is sent when the originsl list is deleted
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
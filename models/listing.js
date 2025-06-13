const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvbWV8ZW58MHx8MHx8fDA%3D",
        set: (v) => v==="" ? "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvbWV8ZW58MHx8MHx8fDA%3D": v,
    },
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
    }]
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
   await mongoose.connect(mongo_url);
}

main().then(() => {
    console.log("connection successful to db");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj , owner :"685f9b1a608eaf442a916221"}));
    await Listing.insertMany(initdata.data); //initdata(data : ListingSample) is the object , .data is the key 
    console.log("data was initialised");
};

initDB();



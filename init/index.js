const mongoose=require("mongoose");
const data=require("../data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("Mongoose Connection success");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}


const initDb=async()=>{
   await Listing.insertMany(data);
}

initDb(); 
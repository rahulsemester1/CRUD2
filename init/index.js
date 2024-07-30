const mongoose=require("mongoose");
const data=require("../data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("Mongoose Connection success");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://user2000:rarashna5@cluster0.qofttry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}


const initDb=async()=>{
   await Listing.insertMany(data);
}

initDb(); 
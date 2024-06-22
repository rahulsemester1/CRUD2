const mongoose=require("mongoose");
const listSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
       
    },
    description:String,
    image:{
        // url:String,
        // filename:String,
        type:String,
        required:true
        // type:String,
        //  default:"https://img.freepik.com/free-photo/nature-beauty-reflected-tranquil-mountain-lake-generative-ai_188544-12625.jpg?t=st=1717316160~exp=1717319760~hmac=7493cfa55f86902fb24167054df3cfc365ce86f1ecaec6d5fd33833eafcbf5a6&w=1060",
        // set:(v)=> v===""?"https://img.freepik.com/free-photo/nature-beauty-reflected-tranquil-mountain-lake-generative-ai_188544-12625.jpg?t=st=1717316160~exp=1717319760~hmac=7493cfa55f86902fb24167054df3cfc365ce86f1ecaec6d5fd33833eafcbf5a6&w=1060":v,    //this will not work untill we set default value because humm idhr iss
        //line mei value toh aa rhi hai from frontend but khali aa rhi hai ;so when we call this it  will not show image because image toh humne bheji nhi so that why we use default above
    },
    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listSchema);
module.exports=Listing;
const express=require("express");
const app= express();
const ExpressError=require("./ExpressError");

app.get("/err",(req,res)=>{
    abcd=abcd;   
    console.log("root");
    res.send("root path");
  
});

// app.get("/listing",async(req,res))=>{
//   let data=await Listing.find({});
 
// })


// app.use("/",(req,res,next)=>{
//     console.log("2nd middleware ");
//     next();
// });

// app.use("/random",(req,res,next)=>{
//     console.log("1st middleware ")
//     next();
// });

app.get("/api/user",(req,res)=>{
    throw new ExpressError(404,"Page not found");
})

app.get("/random",(req,res,next)=>{
    let {token}=req.query;
    if(token ==="accessgranted")
        {    console.log("1st middleware ")
            res.send("data Received");
            
        }
        else{
            throw new ExpressError(401,"ACCESS DENIED!");
        }
});
app.use((err,req,res,next)=>{
    res.send(err);
    console.log("---ERROR------");
    // next(err);
});



// app.get("/random",(req,res)=>{
//     console.log("random");
//     res.send("data Received");
  
    
// });

// app.use((req,res)=>{
//     res.status(404).send("page not found");
// })

let port=3000;
app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
});
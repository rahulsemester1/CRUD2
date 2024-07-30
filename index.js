require('dotenv').config()

const express=require("express");
const app=express();
const ExpressError=require("./ExpressError");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const data=require("./data.js");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));  
app.use(express.json()); 
const methodOverride=require("method-override");
app.use(methodOverride('_method'));  
const ejsMate=require("ejs-mate");
const {listSchema}=require("./Schema_joi.js");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const passport=require("passport");
const passportLocal=require("passport-local");
const User=require("./models/login.js");

const flash=require("connect-flash");
app.use(flash());
const signup=require("./routes/signup");
const {isLoggedIn}=require("./middleware/loggedin");
const multer  = require('multer');
const {storage}=require("./cloudConfig.js");
const upload = multer({storage});
 const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});
app.use(session({store,secret:process.env.SECRET,resave:false,saveUninitialized:true}));     //session MW



app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{                      // Global MW for flash package
  res.locals.successMsg=req.flash("success");
  res.locals.updateMsg=req.flash("update");
  res.locals.deleteMsg=req.flash("delete");
  res.locals.errorMsg=req.flash("error");           //when deleted user address is again entered into address bar 
  res.locals.currentUser=req.user; 
  next();
});




app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
let port=3000;  



main().then(()=>{
    console.log("Mongoose Connection success");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl
  ,{
    tls: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase the server selection timeout
    socketTimeoutMS: 45000, });
};

app.use("/api",signup);

app.get("/listing",(async(req,res)=>{
  let data=await Listing.find({});
  res.render("listing/list.ejs",{data}); 
})) ;

 //add new user
app.post("/listing",upload.single("list[image]"),async(req,res,next)=>{                
  let result=listSchema.validate(req.body);
    if(result.error){
      next(new ExpressError(400,result.error.details[0].message));
    }
    else{
      const user=new Listing(req.body.list);
      if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename
        user.image=url;
      }else
      {
        url="https://img.freepik.com/free-photo/nature-beauty-reflected-tranquil-mountain-lake-generative-ai_188544-12625.jpg?t=st=1717316160~exp=1717319760~hmac=7493cfa55f86902fb24167054df3cfc365ce86f1ecaec6d5fd33833eafcbf5a6&w=1060";
        user.image=url;
      }


      await user.save();
      req.flash("success","New Listing created");
      res.redirect("/listing"); 



      // app.use((req,res,next)=>{                      //for flash package
      //   res.locals.successMsg=req.flash("success");
      //   res.locals.updateMsg=req.flash("update");
      //   res.locals.deleteMsg=req.flash("delete");
      //   res.locals.errorMsg=req.flash("error");           //when deleted user address is again entered into address bar 
      //   res.locals.currentUser=req.user; 
      //   next();
      // });
    }
    // app.use((err,req,res,next)=>{
    //   // res.send(err);
    //   let {status=500,message}=err;
    //   res.status=err.status;
    //   res.render("listing/error.ejs",{status,message});
    //   console.log(err.status,message);
    // });
  });
  // app.post("/listing",upload.single("list[image]"),async(req,res,next)=>{                
  //   let result=listSchema.validate(req.body);
  //     if(result.error){
  //       next(new ExpressError(400,result.error.details[0].message));
  //     }
  //     else{
  //       const user=new Listing(req.body.list);
  //       let url=req.file.path;
  //       let filename=req.file.filename;
  //       user.image=url;
  //       await user.save();
  //       req.flash("success","New Listing created");
  //       res.redirect("/listing"); 



app.get("/listing/new",isLoggedIn,(req,res)=>{
    res.render("listing/new.ejs",{Listing});  
});


//Show Route
app.get("/listing/:id",async(req,res,next)=>{
  
  let {id}=req.params;  
  let data=await Listing.findById(id);
  if(!data){
      req.flash("error","Requested Listing does not exists!");
      res.redirect("/listing"); 
    }
  else{
  res.render("listing/show.ejs",{data});
  }
});

//Getting Data to edit
app.get("/listing/:id/edit",isLoggedIn,async(req,res,)=>{
let {id}=req.params;
let data=await Listing.findById(id);

 if(!data){
  req.flash("error","Requested Listing Does not Exist! ");
  res.redirect("/listing");
   }
else{
  res.render("listing/edit.ejs",{data});
 }
});


//Edit Route
app.put("/listing/:id/edit",async(req,res,next)=>{
  let id=req.params.id;
  let result=listSchema.validate(req.body);
  // console.log(result);
  if(result.error){
    next(new ExpressError(400,result.error.details[0].message));
  }
  else{
    await Listing.findByIdAndUpdate(id,{...req.body.list});
    req.flash("update","Listing Updated!");
    res.redirect("/listing"); 
    
 }
//   try{
//   if(!req.body.list){
//     next(new ExpressError(400,"Wrong Request"));
//   }else{
//      let id=req.params.id;
//   // console.log({...req.body});
//      const price=req.body.list.price;
//      if(price<="0"){
//        next(new ExpressError(422,"Data Must be larger than 0")); 
//     }else{ 
  //     await Listing.findByIdAndUpdate(id,{...req.body.list});
  //     res.redirect("/listing"); 
  //  }
// }}catch(err){
//   next(err);
// }
}
);

app.delete("/listing/:id/delete",isLoggedIn,async(req,res)=>{
  let id=req.params.id;
  let delListing=await Listing.findByIdAndDelete(id);
  req.flash("delete",`Listing Deleted! `);
  res.redirect("/listing");
});

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page not found"));
// });

app.use((err,req,res,next)=>{
  // res.send(err);
  let {status=500,message}=err;
  res.status=err.status;
  res.render("listing/error.ejs",{status,message});
  console.log(err.status,message);
});

app.listen(port,()=>{
    console.log(`App is listening on port ${port}`);
});
const express=require("express");
const router=express.Router();
const passport=require("passport");
const User=require("../models/login.js");
const {savedUrl}=require("../middleware/loggedin");


router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    try{
    let {username,email,password}=req.body.list;
    const newUser=new User({email,username});         //Insertion using mongoose syntax
    const registeredUser=await User.register(newUser,password);
    //  console.log(registeredUser);
     req.login(registeredUser,(err)=>{
        if(err){
            console.log(err.message);
        }
        req.flash("success",`Welcome ${req.user.username} to Willy-Wonka`);
        res.redirect("/listing");
    });
       
    }catch(error){                        //error if user already exists
         req.flash("error",error.message);
        res.redirect("/api/signup");   
       }
    });

 router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
 });


 router.post("/login",savedUrl,
    passport.authenticate("local",{failureRedirect:"/api/login",failureFlash:true}),
    async(req,res)=>{
        console.log(req.user);
        console.log(req.session);
        req.flash("success",`Welcome ${req.user.username}  to Willy-Wonka`);
        let value=res.locals.redirectUrl || "/listing";
        res.redirect(value);
 });

// Logout
 router.get("/logout",(req,res)=>{
    
    req.logout((err)=>{
        if(err){
            console.log(err.message);
        }
        req.flash("success","You are successfully Logout!!");
        res.redirect("/listing");   
        
    });     
 });

module.exports=router;

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.url=req.originalUrl;
      req.flash("error","You Must Loggedin");
      return res.redirect("/api/login");
     }
     next();
  };

const savedUrl=(req,res,next)=>{
  if( req.session.url){
    console.log(req.session);
    res.locals.redirectUrl=req.session.url;
  }
  next();
};

module.exports = { savedUrl, isLoggedIn };

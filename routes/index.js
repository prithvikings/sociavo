var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const upload = require("./multer");

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Register route
router.post("/register",async (req,res)=>{
  const{username,email,fullname}=req.body;
  const userData = new userModel({username,email,fullname});

  userModel.register(userData,req.body.password)
  .then(()=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect("/profile");
    })
  })
})

// Register page

// Login route
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),(req,res)=>{
})

//login page
router.get("/login",(req,res)=>{
  res.render("login",{error:req.flash("error")});
})

//logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


// check if user is logged in
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

// Profile route
router.get("/profile",isLoggedIn,async(req,res)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user,
  }).populate("posts");
  res.render("profile",{user});
})

//upload route
router.post("/upload",upload.single("file"),(req,res)=>{
  if(!req.file){
    return res.status(400).send("No files were uploaded");
  }
  res.send("File uploaded successfully");
});

// feed route
router.get("/feed",(req,res)=>{
  res.render("feed");
})
module.exports = router;

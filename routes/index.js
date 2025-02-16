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

router.get("/register",(req,res)=>{
  res.render("register",{error:req.flash("error")});
});

// Register route
router.post("/register",async (req,res)=>{
  const{username,email,fullname}=req.body;
  const userData = new userModel({username,email,fullname});
  
  //if user already exists
  const userExists=await userModel.findOne({username:req.body.username});
  if(userExists){
    req.flash("error","User already exists");
    return res.redirect("/register");
  }

  // Validate required fields before proceeding
if (!username || !email || !fullname || !req.body.password) {
  req.flash("error", "Please fill all the fields");
  return res.redirect("/register");
}

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

//post upload route
router.get("/upload",isLoggedIn,async (req,res)=>{
  const user=await userModel.findOne({
    username:req.session.passport.user,
  }).populate("posts");
  res.render("upload",{user});
})

//upload route
router.post("/uploaded",isLoggedIn,upload.single("file"),async (req,res)=>{
  if(!req.file){
    return res.status(400).send("No files were uploaded");
  }
  const user=await userModel.findOne({
    username:req.session.passport.user,
  })
 const postdata= await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  })
  user.posts.push(postdata._id);
  await user.save();
  res.redirect("/profile");
});

//jo file upload hui hai use save karo as a post and uska postid user ko do and post ko user id do

// feed route
router.get("/feed",(req,res)=>{
  res.render("feed");
})
module.exports = router;

var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/createuser",async (req,res)=>{
  const user= await userModel.create({
    username:"prithvi312",
    email:"prithvi07raj07@gmail.com",
    password:"prithvi",
    fullname:"Prithvi Raj",
    posts:[], // Assuming you have a Post model
  })
  res.send(user);
})

router.get("/createpost",async (req,res)=>{
  const createdpost= await postModel.create({
    posttext:"Hello duniya",
    user:"67a76a268b228b3272700dbe",
    likes:[],
  })
  let user=await userModel.findOne({_id:"67a76a268b228b3272700dbe"});
  user.posts.push(createdpost._id);
  await user.save();
  res.send("done");
})

router.get("/getuser",async (req,res)=>{
  const user= await userModel.find().populate("posts");
  res.send(user);
})

module.exports = router;

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://prithvi312:fsfO7jyoofuv0jz5@cluster0.wrm4e.mongodb.net/sociavo");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dp: {
        type: String, // URL to profile picture
        default: ""
    },
    fullname: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post" // Assuming you have a Post model
    }]
}, { timestamps: true });

module.exports= mongoose.model("User", userSchema);


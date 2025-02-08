const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    imageText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: [],
    },
    image:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);

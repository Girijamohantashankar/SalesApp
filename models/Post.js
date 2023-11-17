const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  pname: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

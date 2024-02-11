const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: { data: Buffer, contentType: String },
    author: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const PostModel = new mongoose.model("post", postSchema);

module.exports = PostModel;

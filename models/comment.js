const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  email: { type: String, required: true, min: 8 },
  message: String,
  postId: { type: Schema.Types.ObjectId, ref: "Post" },
  timestamp: Date,
});

module.exports = mongoose.model("Comment", commentSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  published: { type: Boolean },
  timestamp: { type: Schema.Types.String },
});

module.exports = mongoose.model("Post", postSchema);

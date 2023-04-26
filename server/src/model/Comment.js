const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: { type: String, required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    commentId: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Comment", commentSchema);

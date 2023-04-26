const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    clientId: { type: String, required: true },
    isLiked : {type : Boolean, default : false},
    commentId : {type : String}
  
  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Notification", notificationSchema);

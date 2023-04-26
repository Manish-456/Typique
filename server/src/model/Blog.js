const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    likes: [{ type: String }],
    comment: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    category: { type: String, required: true },
    image: String,
    view: [{type : String}],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Blog", blogSchema);

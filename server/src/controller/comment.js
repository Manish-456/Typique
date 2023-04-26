const CustomErrorHandler = require("../helper/customErrorHandler");
const Comment = require("../model/Comment");

const commentController = {
  async getComments(req, res, next) {
    const { blogId } = req.body;
    const comments = await Comment.find({ blogId }).populate("User");
    return res.status(200).json(comments);
  },
  async createComment(req, res, next) {
    const { text, blogId } = req.body;
    if (!text || !blogId) {
      return next(
        CustomErrorHandler.CustomError(400, "All Fields are mandatory")
      );
    }
    const newComment = new Comment({
      userId: req.id,
      blogId,
      text,
    });
    await newComment.save();
    return res.status(201).json({ message: "Commented successfully" });
  },
};

module.exports = commentController;

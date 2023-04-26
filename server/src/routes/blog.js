const express = require("express");
const BlogController = require("../controller/blog");
const verifyToken = require("../middleware/VerifyToken");
const router = express.Router();

router.get("/", verifyToken ,BlogController.getAllBlogs);
router.post("/", verifyToken, BlogController.createBlog);
router.put("/like_dislike", verifyToken, BlogController.like_unlike_Post);
router.post("/comment/:blogId", verifyToken, BlogController.createComment);
router.put("/update", verifyToken, BlogController.updateBlog);
router.delete("/:id", verifyToken, BlogController.deleteBlog);
router.patch('/comment/edit', verifyToken, BlogController.editComment);
router.patch('/view/:blogId', verifyToken, BlogController.views)
router.delete('/comment/remove', verifyToken, BlogController.deletecomment);

module.exports = router;

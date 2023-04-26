const commentController = require("../controller/comment");
const verifyToken = require("../middleware/VerifyToken");

const router = require("express").Router();

router.post("/", verifyToken, commentController.createComment);
router.get("/", verifyToken, commentController.getComments);

module.exports = router;

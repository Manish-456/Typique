const express = require("express");
const UserController = require("../controller/User");
const verifyToken = require("../middleware/VerifyToken");


const router = express.Router();
router.get("/", verifyToken, UserController.getAllUsers);
router.get("/:id", verifyToken, UserController.getUser);
router.patch("/", verifyToken, UserController.updateUser);


module.exports = router;

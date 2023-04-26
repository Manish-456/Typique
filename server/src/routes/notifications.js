const NotificationController = require("../controller/Notification");

const verifyToken = require("../middleware/VerifyToken");

const router = require("express").Router();


router.get("/", verifyToken, NotificationController.getNotifications);

module.exports = router;

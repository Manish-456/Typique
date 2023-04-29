const AuthController = require("../controller/auth");
const { sendVerificationCode } = require("../controller/emailverificationmail");
const mailer = require("../controller/mail");
const express = require("express");

const router = express.Router();

router.post("/register", AuthController.Register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logOut);
router.post("/mailer", mailer);
router.post("/sendVerificationEmail", sendVerificationCode)

// Get METHOD

router.get("/refresh", AuthController.refresh);
router.get("/getuser", AuthController.getUser);
router.get(
  "/generateOTP",
  AuthController.verifyUser,
  AuthController.generateOTP
);
router.post("/verifyOTP/verify", AuthController.verifyOTP);
router.get("/createSession", AuthController.createResetSession);

// PUT
router.put("/resetpassword", AuthController.resetPassword);

module.exports = router;

const CustomErrorHandler = require("../helper/customErrorHandler");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const optGenerator = require("otp-generator");
const { ACCESS_TOKEN, REFRESH_TOKEN } = require("../config");
const randomString = require(`randomstring`);

const AuthController = {
  OTP: null,
  resetSession: false,
  /* 
   @desc Register user
   @route POST/api/auth/register
   @access Public
  */
  async Register(req, res, next) {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return next(
        CustomErrorHandler.AllFieldsRequired("All fields are required")
      );
    const user = await User.findOne({ email });

    // ? Check if the user already registered or not
    if (user)
      return next(
        CustomErrorHandler.alreadyRegistered(
          "User with this email already registered"
        )
      );

    //? Hash the requested password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = randomString.generate({ length: 10 });
    // ? Now create the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode: verificationCode,
      isVerified: false,
    });

    // ? Check if the user has been created if created then Save the newly created user

    if (newUser) {
      await newUser.save();

      return res
        .status(201)
        .json({
          message: `Please verify your email`,
          verificationCode: verificationCode,
        });
    }

    //  if not created send this error message
    else {
      return next(
        CustomErrorHandler.CustomError(400, "Invalid User Data Received")
      );
    }
  },

  /* 
  @desc login 
  @route POST/api/auth/login
  @access Public
  */

  async login(req, res, next) {
    const { email, password } = req.body;

    //? check if the user with this requested email exists or not
    const user = await User.findOne({ email });
    if (!user) return next(CustomErrorHandler.invalidCredentials());
       
    //? check if the password matched with the original password or not
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return next(CustomErrorHandler.invalidCredentials());
   

    //? check if the verification code matches and the user is not already verified

    if ((req.body.verificationCode === user?.verificationCode) && !user.isVerified) {
      await user.updateOne({
        isVerified: true,
        verificationCode : ""
      }, {
        new : true
      });
    }

    if ((req.body.verificationCode !== user?.verificationCode) && !user.isVerified) {
      return next(
        CustomErrorHandler.CustomError(400,"Please verify your email first")
      );
    }
    const UserInfo = {
      id: user._id,
      username: user.username,
    };
    //? create a new Access Token
    const accessToken = jwt.sign({ UserInfo }, ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    
    //? create a new Refresh Token
    const refreshToken = jwt.sign({ UserInfo }, REFRESH_TOKEN, {
      expiresIn: "7d",
    });
    
    res
      .cookie("token", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  },

  /* 
@desc refresh Token 
@route POST/api/auth/refresh
@access Private
*/

  async refresh(req, res, next) {
    const cookie = req.cookies;

    if (!cookie.token) return next(CustomErrorHandler.unAuthorized());
    const refreshToken = cookie.token;
    jwt.verify(refreshToken, REFRESH_TOKEN, async (err, decoded) => {
      if (err) return next(CustomErrorHandler.CustomError(403, "Forbidden"));

      // ? Check if the user with that decoded token id exists or not
      const foundUser = await User.findById(decoded.UserInfo.id);

      if (!foundUser) return next(CustomErrorHandler.unAuthorized());
      const UserInfo = {
        username: foundUser.username,
        id: foundUser.id,
      };

      // Generating accessToken
      const accessToken = jwt.sign({ UserInfo }, ACCESS_TOKEN, {
        expiresIn: "15m",
      });

      res.json({ accessToken });
    });
  },
  async verifyUser(req, res, next) {
    const { email } = req.method === "GET" ? req.query : req.body;
    if (!email) return next(CustomErrorHandler.unAuthorized());

    const user = await User.findOne({ email });
    if (!user) return next(CustomErrorHandler.notFound("User"));
    next();
  },
  /* 
   @desc logout 
   @route GET/api/auth/getuser
  */
  async getUser(req, res, next) {
    const { email } = req.query;
    const user = await User.findOne({ email }).select("-password");
    if (!user) return next(CustomErrorHandler.notFound("User"));
    return res.json({ user });
  },

  /* 
   @desc Generate OTP 
   @route GET/api/auth/generateOTP
  
  */
  async generateOTP(req, res, next) {
    this.OTP = optGenerator.generate(6, {
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });
    return res.status(201).json({ code: this.OTP });
  },

  /* 
   @desc Verify OTP 
   @route POST/api/auth/verifyOTP
  */
  async verifyOTP(req, res, next) {
    const { code } = req.body;

    const otp = this.OTP;

    if (otp === code) {
      this.OTP = null;
      this.resetSession = true;
      return res.status(200).json({ message: "Your OTP has been verified" });
    }
    return next(CustomErrorHandler.CustomError(400, "Invalid OTP"));
  },

  async createResetSession(req, res, next) {
    if (this.resetSession) {
      return res.status(201).json({ flag: this.resetSession });
    }
    return next(CustomErrorHandler.CustomError(400, "Session expired"));
  },
  /* 
   @desc resetPassword 
   @route POST/api/auth/reset
   
  */
  async resetPassword(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        CustomErrorHandler.AllFieldsRequired("Password field are required!")
      );
    }
    const user = await User.findOne({ email });
    if (!user) return next(CustomErrorHandler.notFound("User"));

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);

    this.resetSession = false;

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { password: req.body.password },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ message: "Record Updated" });
  },

  /* 
   @desc logout 
   @route POST/api/auth/logout
   @access Private => only logged in user can logout
  */
  async logOut(req, res, next) {
    const cookies = req.cookies;
    if (!cookies.token) return res.status(204);
    res
      .clearCookie("token", {
        secure: true,
        httpOnly: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json("Cleared the cookie and logout successfully");
  },
};

module.exports = AuthController;

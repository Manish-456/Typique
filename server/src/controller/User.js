const User = require("../model/User");
const CustomErrorHandler = require("../helper/customErrorHandler");
const fs = require("fs");
const path = require("path");

const UserController = {
  async getAllUsers(req, res, next) {
    const users = await User.find().select("-password");
    if (!users.length) {
      return next(CustomErrorHandler.notFound("User"));
    }
    res.status(200).json(users);
  },

  async getUser(req, res, next) {
    const user = await User.findById({ _id: req.params.id }).select(
      "-password"
    );

    if (!user) return next(CustomErrorHandler.notFound("User"));

    res.status(200).json(user);
  },

  async updateUser(req, res, next) {
    const { id, avatar, username, webLink, country, bio, worksAt } = req.body;
    if (!id)
      return next(
        CustomErrorHandler.CustomError(400, "You can't update your profile")
      );

    const filePath = path.join(__dirname, "..", "..", "./uploads");
    const user = await User.findById(id);
    
      if (user?.avatar !== avatar) {
      
        fs.unlink(`${filePath}/${user.avatar}`, (err, result) => {
          if (err) console.log(err);
          console.log(`record cleared`);
        });
        await User.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              username,
              webLink,
              country,
              bio,
              worksAt,
              avatar,
            },
          },
          {
            new: true,
          }
        );
        return res
          .status(200)
          .json({ message: "Your profile has been updated !!!" });
      }else {
      await User.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            username,
            webLink,
            country,
            bio,
            worksAt,
          },
        },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .json({ message: "Your profile has been updated !!!" });
    }
    }
     
  };


module.exports = UserController;

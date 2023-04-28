const User = require("../model/User");
const CustomErrorHandler = require("../helper/customErrorHandler");
const { uploadImage } = require("../helper/uploadImage");

const UserController = {
    /**
   * @desc  Get all  users
   * @route  GET /api/user
   * @access  private
   */
  async getAllUsers(req, res, next) {
    const users = await User.find().select("-password");
    if (!users.length) {
      return next(CustomErrorHandler.notFound("User"));
    }
    res.status(200).json(users);
  },
    /**
   * @desc  Get an user
   * @route  GET /api/user/:id
   * @access  private
   */
  async getUser(req, res, next) {
    const user = await User.findById({ _id: req.params.id }).select(
      "-password"
    );

    if (!user) return next(CustomErrorHandler.notFound("User"));

    res.status(200).json(user);
  },
  /**
   * @desc  Update User
   * @route  PATCH /api/user
   * @access  private
   */
  async updateUser(req, res, next) {
    const { id, avatar } = req.body;
    if (!id)
      return next(
        CustomErrorHandler.CustomError(400, "You can't update your profile")
      );

   
   
    
      if (avatar) {
       const photoUrl = await uploadImage(avatar, id)
        await User.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
               ...req.body,
              avatar : photoUrl,
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
          ...req.body
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

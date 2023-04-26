const Notification = require("../model/Notification");

const NotificationController = {
  async getNotifications(req, res, next) {
    const notifications = await Notification.find({
      authorId: req.id,
    }).sort({
      createdAt : -1
    });

    return res.status(200).json(notifications)
  },
};

module.exports = NotificationController;

const { ACCESS_TOKEN } = require("../config");
const CustomErrorHandler = require("../helper/customErrorHandler");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(CustomErrorHandler.unAuthorized());
  }

  const token = authHeader?.split(" ")[1];

  jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
    if (err) return next(CustomErrorHandler.CustomError(403, "Forbidden"));
    const { username, id } = decoded.UserInfo;

    req.username = username;
    req.id = id;
    next();
  });
};

module.exports = verifyToken;

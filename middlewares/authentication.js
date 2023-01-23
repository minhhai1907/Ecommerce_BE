const jwt = require("jsonwebtoken");
const config = require("../configs/config");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");
const User = require("../models/User");
const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      return next(new AppError(401, "Login required", "Validation Error"));
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError(401, "Token expired", "Validation Error"));
        } else {
          return next(
            new AppError(401, "Token is invalid", "Validation Error")
          );
        }
      }
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};
authMiddleware.isAdmin = async(req, res, next) => {
  const  userId  = req.userId;
  const user= await User.findById(userId)
  console.log("user.role",user.role,"config",config.role.admin)
  try {
    if (user.role !== config.role.admin) {
      throw new AppError(
        301,
        "only Admin has this right",
        "Authorization error"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authMiddleware;

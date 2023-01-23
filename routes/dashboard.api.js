const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/authentication");
const router = express.Router();

router.get(
  "/",
//   validate(tokenVal.verifyToken, ["headers"]),
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  dashboardController.getAllInfoDashboard
);


module.exports = router;
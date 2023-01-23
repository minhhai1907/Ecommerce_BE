const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const {facebookData,facebookLogin,googleData,googleLogin}=require("../middlewares/passport")
const authController = require("../controllers/auth.controller");

/**
 * @route POST /auth/login
 * @description Log in with email and password
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);
router.post(
  "/resetpassword",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
  ]),
  authController.resetPassword
);

/**
 * @route POST /auth/login/facebook
 * @description Login with facebook
 * @access Public
 */

router.get('/facebook', facebookLogin);
router.get('/facebook/callback',facebookData, authController.loginWithFacebook)

/**
 * @route POST /auth/login/google
 * @description Login with google
 * @access Public
 */
router.get('/google', googleLogin);
router.get('/google/callback',googleData, authController.loginWithFacebook)

module.exports = router;
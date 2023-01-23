const express=require("express")
const router=express.Router()
const userController = require("../controllers/user.controller");
const authMiddleware=require("../middlewares/authentication")
const {body}=require("express-validator")
const validators=require("../middlewares/validators")
/**
 * @route POST /user
 * @description Register new user
 * @access Public
 */
router.post(
    "/",
    validators.validate([
      body("name", "Invalid name").exists().notEmpty(),
      body("email", "Invalid email")
        .exists()
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: false }),
      body("password", "Invalid password").exists().notEmpty(),
    ]),
    userController.register
  );

  /**
 * @route GET /user/me
 * @description Get current user info
 * @access Login required
 */
router.get(
  "/me", 
  authMiddleware.loginRequired, 
  userController.getCurrentUser
  );

  /**
 * @route PUT /user/me
 * @description Update current user info
 * @access Login required
 */
router.put(
  "/me", 
  authMiddleware.loginRequired, 
  userController.updateCurrentUser
  );
  /**
 * @route DELETE /user/me
 * @description Delete current user 
 * @access Login required
 */
router.delete(
  "/me", 
  authMiddleware.loginRequired, 
  userController.deleteCurrentUser
  );
// For Adminstration

/**
 * @route POST /user
 * @description Register new user
 * @access Public
 */
router.post(
  "/create",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);

 /**
 * @route GET /user/:id
 * @description Get  user info by id
 * @access Login required && admin require
 */
 router.get(
  "/:id", 
  authMiddleware.loginRequired, 
  authMiddleware.isAdmin,
  userController.getUserById
  );
 /**
 * @route GET /user/all
 * @description Get  all users info 
 * @access Login required && admin require
 */
 router.get(
  "/", 
  // authMiddleware.loginRequired, 
  // authMiddleware.isAdmin,
  userController.getAllUsersList
  );
  /**
 * @route PUT /user/:id
 * @description Update  user by Id
 * @access Login required && admin require
 */
  router.put(
    "/:id", 
    authMiddleware.loginRequired, 
    authMiddleware.isAdmin,
    userController.updateUserById
    );
  /**
 * @route DELETE /user/:id
 * @description delete  user by id
 * @access Login required && admin require
 */
  router.delete(
    "/:id", 
    authMiddleware.loginRequired, 
    authMiddleware.isAdmin,
    userController.deleteUserById
    );
  


  module.exports=router
const express=require("express");
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/authentication");
const router=express.Router()


/* GET categorys listing. */

router.get(
    "/all",
    categoryController.getAllCategories
  );
  
router.get(
    "/main",
    categoryController.getMainCategories
  );
  
router.get(
    "/sub/:id",
    categoryController.getSubCategories
  );
  
  
//   //adminsitrators
  router.get(
    "/",
    authMiddleware.loginRequired,
    authMiddleware.isAdmin,
    categoryController.getAllCategories
  );
  
  
  router.post(
    "/create",
    authMiddleware.loginRequired,
    authMiddleware.isAdmin,
    categoryController.createCategory
  );
  
  router.post(
    "/createsub/:id",
    authMiddleware.loginRequired,
    authMiddleware.isAdmin,
    categoryController.createSubCategory
  );


  router.put(
    "/update/:id",
    authMiddleware.loginRequired,
    authMiddleware.isAdmin,
    categoryController.updateCategory
  );

  router.delete(
    "/delete/:id",
    authMiddleware.loginRequired,
    authMiddleware.isAdmin,
    categoryController.deleteCategory
  );
  module.exports = router;
  
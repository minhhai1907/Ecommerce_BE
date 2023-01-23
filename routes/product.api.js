const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware=require("../middlewares/authentication")


const router = express.Router();

/* GET products listing. */

router.get(
  "/all",
  productController.getAllProducts
);
router.get(
  "/test",
  productController.testProducts
);

router.get(
  "/product/:id",
  productController.getProductById
);

// //adminsitrators
router.get(
  "/admin/all",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  productController.getAllProducts
);

router.get(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  productController.getProductById
);

router.post(
  "/admin/create",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  productController.createProduct
);

router.put(
  "/admin/update/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  productController.updateProduct
);
router.delete(
  "/admin/delete/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  productController.deleteProduct
);

module.exports = router;

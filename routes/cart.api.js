const express = require("express");
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/authentication");

const router = express.Router();

/* GET carts listing. */

router.get(
  "/me",
  authMiddleware.loginRequired,
  cartController.getCartById
);

router.post(
  "/me/create",
  authMiddleware.loginRequired,
  cartController.createCart
);

router.put(
  "/me/update",
  authMiddleware.loginRequired,
  cartController.updateCartCurrentUser
);

// //adminsitrators
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  cartController.getAllCarts
);

router.get(
  "/:cartId",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  cartController.getCartByCartId
);

router.put(
  "/update/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  cartController.updateCartById
);

router.delete(
  "/delete/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  cartController.deleteCartById
);

module.exports = router;

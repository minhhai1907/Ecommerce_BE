const express = require("express");
const cartItemController = require("../controllers/cartItem.controller");
const authMiddleware = require("../middlewares/authentication");

const router = express.Router();

/* GET carts listing. */

router.put(
  "/me/update/",
  authMiddleware.loginRequired,
  cartItemController.updateCartItem
);

router.delete(
  "/me/delete",
  authMiddleware.loginRequired,
  cartItemController.deleteCartItem
);

module.exports = router;

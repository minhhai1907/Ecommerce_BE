const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/authentication");

const router = express.Router();

/* GET orders listing. */

router.get(
  "/me",
  authMiddleware.loginRequired,
  orderController.getOrderByCurrentUser
);

router.post(
  "/me/create",
  authMiddleware.loginRequired,
  orderController.createOrder
);

router.put(
  "/me/update",
  authMiddleware.loginRequired,
  orderController.updateOrder
);

// //adminsitrators
router.get(
  "/admin/all",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  orderController.getAllOrders
);

router.get(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  orderController.getOrderById
);

router.post(
  "/admin/create",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  orderController.createOrder
);

router.put(
  "/admin/update",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  orderController.updateOrder
);

router.delete(
  "/delete/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  orderController.deleteOrderById
);

module.exports = router;

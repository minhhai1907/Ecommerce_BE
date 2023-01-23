const express = require('express');
const router = express.Router();


const userApi=require("./user.api")
router.use("/user",userApi)


const authApi=require("./auth.api")
router.use("/auth",authApi)

const cartApi=require("./cart.api")
router.use("/cart",cartApi)

const cartItemApi=require("./cartItem.api")
router.use("/cart/items",cartItemApi)

const productApi=require("./product.api")
router.use("/products",productApi)

const categoryApi=require("./category.api")
router.use("/category",categoryApi)

const orderApi=require("./order.api")
router.use("/order",orderApi)

const reactionApi=require("./reaction.api")
router.use("/reaction",reactionApi)

const reviewApi=require("./review.api")
router.use("/review",reviewApi)

const dashboardApi=require("./dashboard.api")
router.use("/dashboard",dashboardApi)


module.exports = router;

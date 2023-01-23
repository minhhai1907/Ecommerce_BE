const { Types } = require("mongoose");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const productController = require("./product.controller");

const cartItemController = {};


cartItemController.calTotalItem = async function (cartId) {
  let totalItem = await CartItem.countDocuments({ cartId });
  const cart = await Cart.findOne({ _id: cartId });
  cart.totalItem = totalItem;
  cart.save();
  return totalItem;
};

cartItemController.getItemsByCartId =  async function(cartId){
  let query = { cartId, populate: "productId", select: "-_id -cartId" };

  const cartItem = await CartItem.paginate(query);

  return { ...cartItem };
};

cartItemController.updateCartItem = catchAsync(async (req, res, next) => {
  const  userId  = req.userId;
  const { productId, action } = req.body;
  let totalItem = 0;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError(
      404,
      "Cart is not found",
      "Add item to cart"
    );
  }

  const product = await productController.checkExistProduct(productId);

  if (!product) {
    throw new AppError(
      404,
      "Product is not found",
      "Add item to cart"
    );
  }

  let cartitem = await CartItem.findOne({ cartId: cart._id, productId });

  if (cartitem) {
    action ? (cartitem.quantity += 1) : (cartitem.quantity -= 1);

    await cartitem.save();
    totalItem = await cartItemController.calTotalItem(cart._id);
  }

  if (!cartitem) {
    cartitem = { cartId: cart._id, productId, quantity: 1 };

    await CartItem.create(cartitem);
    totalItem = await cartItemController.calTotalItem(cart._id);
  }

  return sendResponse(
    res,
    200,
    true,
    totalItem,
    "",
    "Update Cart item  successfully"
  );
});

cartItemController.deleteCartItem = catchAsync(async (req, res, next) => {
  const  userId  = req.userId;
   let  {productId}  = req.body;
   console.log("productId",productId)

  let arrProductId = productId.map((e) => Types.ObjectId(e));

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError(
      404,
      "Cart is not found",
      "Add item to cart"
    );
  }

  const cartItem = await CartItem.find({
    cartId: cart._id,
    productId: { $in: arrProductId },
  });

  if (cartItem.length !== arrProductId.length || !cartItem.length) {
    throw new AppError(
      404,
      "Product is not found",
      "Delete item of cart"
    );
  }

  await CartItem.deleteMany({
    cartId: cart._id,
    productId: { $in: arrProductId },
  });
  const totalItem = await cartItemController.calTotalItem(cart._id);

  return sendResponse(
    res,
    200,
    true,
    totalItem,
    "",
    "Delete Cart successfully"
  );
});

module.exports = cartItemController;

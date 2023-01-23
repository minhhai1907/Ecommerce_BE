const {catchAsync,sendResponse, AppError}=require("../helpers/utils");
const Cart = require("../models/Cart");
const cartItemController = require("./cartItem.controller");

const cartController={}


cartController.createCart = catchAsync(async (req, res, next) => {
    const userId  = req.userId;
    let cart = await Cart.findOne({userId});
    if (cart) {
        throw new AppError(404, "Cart is Exists", "Create cart");
      }  
      cart = await Cart.create({ userId });
 
    return sendResponse(
      res,
      200,
      true,
      cart,
      null,
      "Create Cart successfully"
    );
  });

cartController.getCartById = catchAsync(async (req, res, next) => {
    const userId=req.userId
    let cart = await Cart.findOne({userId});

    if (!cart) {
      throw new AppError(
        404,
        "Cart is not found",
        "Get single cart"
      );
    }
  
    const cartItem = await cartItemController.getItemsByCartId(cart._id);
  
    let carts = { cart, products: cartItem };
  
    return sendResponse(
      res,
      200,
      true,
      carts,
      null,
      "Get Cart successfully"
    );
  
  });
cartController.updateCartCurrentUser = catchAsync(async (req, res, next) => {
  const userId=req.userId
  const cartBody=req.body
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new AppError(404, "Cart Not Found", "Update cart");
  }

  Object.keys(cartBody).forEach((field) => {
    if (cartBody[field] !== undefined) {
      cart[field] = cartBody[field];
    }
  });

  await cart.save();  
  return sendResponse(
    res,
    200,
    true,
    cart,
    null,
    "update Cart successfully"
  );
  
  });

  cartController.getAllCarts=catchAsync(async(req,res,next)=>{
    const query=req.body
    const carts=await Cart.paginate(query)
    sendResponse(
      res,
      200,
      true,
      carts,
      null,
      "Get all Carts successfully"
    )
  })
  cartController.getCartByCartId=catchAsync(async(req,res,next)=>{
    const cartId=req.params.cartId
    const cart=await Cart.findById(cartId)
    if(!cart) throw new AppError(404,"cart not found","Get cart by Id")

    const cartItem= await cartItemController.getItemsByCartId(cartId)
    let carts={cart,products:cartItem}
    sendResponse(
      res,
      200,
      true,
      carts,
      null,
      "Get  Cart by cartId successfully"
    )
  })
  cartController.updateCartById = catchAsync(async (req, res, next) => {
    const cartId=req.params.id
    const cartBody=req.body
    let cart = await Cart.findById(cartId);
  
    if (!cart) {
      throw new AppError(404, "Cart Not Found", "Update cart by Id");
    }
  
    Object.keys(cartBody).forEach((field) => {
      if (cartBody[field] !== undefined) {
        cart[field] = cartBody[field];
      }
    });
  
    await cart.save();  
    return sendResponse(
      res,
      200,
      true,
      cart,
      null,
      "update Cart by Id successfully"
    );
    
    });
  cartController.deleteCartById = catchAsync(async (req, res, next) => {
    const cartId=req.params.id
    let cart = await Cart.findByIdAndUpdate(cartId,{isDeleted:true});
  
    if (!cart) {
      throw new AppError(404, "Cart Not Found", "Delete cart by Id");
    } 
    return sendResponse(
      res,
      200,
      true,
      {},
      null,
      "Delete Cart by Id successfully"
    );
    
    });

  module.exports=cartController
  
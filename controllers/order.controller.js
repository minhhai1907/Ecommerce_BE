const { catchAsync, sendResponse, AppError } = require("../helpers/utils")
const {startSession, default: mongoose}=require("mongoose")
const Order = require("../models/Order")
const Cart = require("../models/Cart")
const CartItem = require("../models/CartItem")



const orderController={}

orderController.createOrder=catchAsync(async(req,res,next)=>{
    const userId=req.userId
    let {orderBody}=req.body
    console.log("orderBody",orderBody)
    // const session = await startSession();

  let { cartId } = orderBody;

  cartId = mongoose.Types.ObjectId(cartId);

   orderBody = { ...orderBody, userId, cartId };

  // session.startTransaction();
  try {
  
    const order = await Order.create([orderBody]);

    await CartItem.deleteMany({ cartId });

    await CartItem.countDocuments({ cartId });

    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { totalItem: 0 }
    );

    // await session.commitTransaction();
    // session.endSession();
    return sendResponse(
        res,
        200,
        true,
        order,
        "",
        "Create Order successfully"
      )
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }

})
orderController.getOrderByCurrentUser=catchAsync(async(req,res,next)=>{
    const userId=req.userId
    const query=req.query
    query.userId = userId;
    query.sortBy = "createdAt.desc";
  
    const { deliveryStart, deliveryEnd } = query;
  
    if (deliveryStart) {
      query.createdAt = {
        $gte: new Date(deliveryStart),
      };
      delete query.deliveryStart;
    } else if (deliveryStart && deliveryEnd) {
      query.createdAt = {
        $gte: new Date(deliveryStart),
        $lte: new Date(new Date(deliveryEnd).setUTCHours(23, 59, 59, 999)),
      };
      delete query.deliveryStart;
      delete query.deliveryEnd;
    }
  
    if (query?.status === "status" || !query?.status) {
      delete query.status;
    }
    const order = await Order.paginate(query);
  
    return sendResponse(
        res,
        200,
        true,
        order,
        "",
        "Get Order successfully"
      );
})
orderController.updateOrder=catchAsync(async(req,res,next)=>{
    let { orderIds, status } = req.body;

    orderIds = orderIds.map((e) =>mongoose.Types.ObjectId(e));
  
    let order = await Order.find({ _id: { $in: orderIds } });
  
    if (order.length !== orderIds.length) {
      throw new AppError(404, "Order Not Found", "Update order");
    }
  
    await Order.updateMany({ _id: { $in: orderIds } }, { status });
  
    return sendResponse(
        res,
        200,
        true,
        order,
        "",
        "Update Order successfully"
      );
})
orderController.getAllOrders=catchAsync(async(req,res,next)=>{
    const query=req.query
    query.populate = "userId";
    query.sortBy = "createdAt.desc";

  const { deliveryStart, deliveryEnd } = query;

  if (deliveryStart) {
    query["shipping.deliveryTime"] = { $gte: new Date(deliveryStart) };
    delete query.deliveryStart;
  } else if (deliveryStart && deliveryEnd) {
    query["shipping.deliveryTime"] = {
      $gte: new Date(deliveryStart),
      $lte: new Date(new Date(deliveryEnd).setUTCHours(23, 59, 59, 999)),
    };

    delete query.deliveryStart;
    delete query.deliveryEnd;
  }

  if (query?.status === "status" || !query?.status) {
    delete query.status;
  }
  const orders = await Order.paginate(query);

  return sendResponse(
    res,
    200,
    true,
    orders,
    "",
    "Get all Orders successfully"
  );
})
orderController.getOrderById=catchAsync(async(req,res,next)=>{
    const orderId=req.params.id
    const order = await Order.findById(orderId);

    if (!orderId) {
      throw new AppError(
        404,
        "Order is not found",
        "Get single order By Id"
      );
    }
    return sendResponse(
        res,
        200,
        true,
        order,
        "",
        "Get  Order by Id successfully"
      );
})
orderController.deleteOrderById=catchAsync(async(req,res,next)=>{
    const orderId=req.params.id
    const order = await Order.findByIdAndUpdate(orderId, {
        isDeleted: true,
      });
      if (!order) {
        throw new AppError(
          404,
          "Order is not found",
          "Delete single order"
        );
      }
      
    return sendResponse(
        res,
        200,
        true,
        {},
        "",
        "Get  Order by Id successfully"
      );
})

module.exports=orderController
const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Cart = require("../models/Cart");
const config = require("../configs/config");


const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) throw new AppError(409, "User already exists", "Register Error");

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({
    name,
    email,
    password,
  });

  let cart = await Cart.findOne({ userId:user._id});

  if (cart) {
    throw new AppError(404, "Cart is Exists", "Create cart");
  }

  cart = await Cart.create({ userId:user._id });
  user.cartId = cart._id;
  await user.save()
  const accessToken = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});
userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId).populate("cartId");
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  return sendResponse(
    res,
    200,
    true,
    {user},
    null,
    "Get current user successful"
  );
});
userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(404, "User not found", "Update User Error");
  if(req.body.password !==undefined){
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const allows = [
    "name",
    "avatarUrl",
    "password",
    "phone",
    "address"
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update User successfully"
  );
});
userController.deleteCurrentUser=catchAsync(async (req,res,next)=>{
  const userId=req.userId
  const user=await User.findByIdAndUpdate(userId,{isDeleted:true})
  if(!user) throw new AppError(404,"User not found", "delete user error")
  return sendResponse(
    res,
    200,
    true,
    {},
    null,
    "Delete User successfully"
  )
});


userController.getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId).populate("cartId");
  if (!user)
    throw new AppError(400, "User not found", "Get Current User Error");

  return sendResponse(
    res,
    200,
    true,
    {user},
    null,
    "Get current user successful"
  );
});
userController.getAllUsersList = catchAsync(async (req, res, next) => {
  // const  userId  = req.userId;
  // const user= await User.findById(userId)
  // if (user.role===config.role.admin) 
  let { page, limit, ...filter } = req.query ;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterConditions = [{ role:config.role.user }];
  if (filter.name) {
    filterConditions.push({
      ["name"]: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("cartId");
  return sendResponse(
    res,
    200,
    true,
    { users, totalPages, count },
    null,
    ""
  );
});
userController.updateUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user)
    throw new AppError(404, "User not found", "Update User Error");
  if(req.body.password !==undefined){
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const allows = [
    "name",
    "avatarUrl",
    "password",
    "phone",
    "address",
    "isDeleted"
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Update User successfully"
  );
});
userController.deleteUserById=catchAsync(async (req,res,next)=>{
  const userId=req.params.id
  const user=await User.findByIdAndUpdate(userId,{isDeleted:true})
  if(!user) throw new AppError(404,"User not found", "delete user error")
  return sendResponse(
    res,
    200,
    true,
    {},
    null,
    "Delete User successfully"
  )
});


module.exports = userController;

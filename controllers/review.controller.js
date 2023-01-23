const { default: mongoose } = require("mongoose")
const { catchAsync, AppError, sendResponse } = require("../helpers/utils")
const Review = require("../models/Reviews")
const User = require("../models/User")
const productController = require("./product.controller")


const reviewController={}
reviewController.createReview=catchAsync(async(req,res,next)=>{
    const userId=req.userId
    let productId=req.params.id
    const reviewBody=req.body
    productId =mongoose.Types.ObjectId(productId);
    if (await !productController.checkExistProduct(productId)) {
      throw new AppError(404, "Product Id is not Exist", "Create review");
    }
    // let filter = { userId, productId, isDeleted: false };
  
    // let review = await Review.findOne(filter);
  
    // if (review) {
    //   throw new AppError(404, "Review is Exist", "Create review");
    // }
  
    let newReview = {};
    Object.keys(reviewBody).forEach((field) => {
      if (reviewBody[field] !== undefined) {
        newReview[field] = reviewBody[field];
      }
    });
    review = await Review.create({ userId, productId, ...newReview });
  
    return sendResponse(
        res,
        200,
        true,
        review,
        "",
        "Create review successfully"
      );
})
reviewController.getReviewByProductId=catchAsync(async(req,res,next)=>{
    const productId=req.params.id
    const {page,limit}=req.query
    let query = { productId,page,limit,isDelete: false, populate: "userId" };

  const review = await Review.paginate(query);

  if (!review) {
    throw new AppError(
      404,
      "Review is not found",
      "Get single review"
    );
  }
  return sendResponse(
    res,
    200,
    true,
    review,
    "",
    "Get single review successfully"
  );
})
reviewController.updateReviewById=catchAsync(async(req,res,next)=>{
    const reviewId=req.params.id
    const userId=req.userId
    const {reviewBody}=req.body
    const user=await User.findById({userId})
    if(!user) throw new AppError(404,"User not found","Update review")
    
    let filter = { _id: reviewId, isDeleted: false };

  let review = await Review.findOne(filter);

  if (!review) {
    throw new AppError(404, "Review Not Found", "Update review");
  }

  if (!review.userId.equals(userId) && user.role !== "admin") {
    throw new AppError(
      401,
      "Unauthorized edit other's review",
      "Update Post error"
    );
  }

  Object.keys(reviewBody).forEach((field) => {
    if (reviewBody[field] !== undefined) {
      review[field] = reviewBody[field];
    }
  });

  await review.save();

  return sendResponse(
    res,
    200,
    true,
    review,
    "",
    "Update review successfully"
  );
})
reviewController.deleteReviewById=catchAsync(async(req,res,next)=>{
    const reviewId=req.params.id
    const userId=req.userId
    const user=await User.findById({userId})
    if(!user) throw new AppError(404,"User not found","Update review")
    
    let filter = { _id: reviewId, isDeleted: false };

  let review = await Review.findOne(filter);

  if (!review) {
    throw new AppError(404, "Review Not Found", "Delete review");
  }

  if (!review.userId.equals(userId) && user.role !== "admin") {
    throw new AppError(
      401,
      "Unauthorized edit other's review",
      "Delete review error"
    );
  }
  review.isDeleted=true
  await review.save();

  return sendResponse(
    res,
    200,
    true,
    {},
    "",
    "Delete review successfully"
  );
})
reviewController.getAllReviews=catchAsync(async(req,res,next)=>{
    const query=req.query
    const reviews=await Review.paginate(query)
    return sendResponse(
        res,
        200,
        true,
        reviews,
        "",
        "Get all reviews successfully"
    )
})
module.exports=reviewController
const express = require("express");
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/authentication");

const router = express.Router();

/* GET reviews listing. */
//customers
router.get(
  "/products/:id",
  reviewController.getReviewByProductId
);

router.post(
  "/me/create/:id",
  authMiddleware.loginRequired,
  reviewController.createReview
);

router.put(
  "/me/update/:id",
  authMiddleware.loginRequired,
  reviewController.updateReviewById
);
router.delete(
  "/me/delete/:id",
  authMiddleware.loginRequired,
  reviewController.deleteReviewById
);

//adminsitrators
router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  reviewController.getAllReviews
);

router.get(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  reviewController.getAllReviews
);

router.post(
  "/create/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  reviewController.createReview
);

router.put(
  "/update/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  reviewController.updateReviewById
);

router.delete(
  "/delete/:id",
  authMiddleware.loginRequired,
  authMiddleware.isAdmin,
  reviewController.deleteReviewById
);

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("../plugins/paginate.plugin");

const reviewSchema = Schema(
  {
    comments: { type: String, required: true },
    image: { type: String },
    isPurchased: { type: Boolean, default: false },
    totalRatings: { type: Number, default: 0 },
    rateAverage: { type: Number, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Products",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

reviewSchema.plugin(paginate);

const Review = mongoose.model("Reviews", reviewSchema);
module.exports = Review;

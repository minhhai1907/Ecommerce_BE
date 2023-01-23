const mongoose = require("mongoose");
const paginate = require("../plugins/paginate.plugin");
const paymentSchema = require("./Payment");
const shippingSchema = require("./Shipping");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "Users",
    },
    shipping: shippingSchema,
    payment: paymentSchema,
    status: {
      type: String,
      enum: ["Cart", "Delivery", "Payment", "Summary"],
      default: "Cart",
    },
    totalItem: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);

cartSchema.plugin(paginate)

const Cart = mongoose.model("Carts", cartSchema);
module.exports = Cart;

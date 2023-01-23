const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("../plugins/paginate.plugin");
const shippingSchema = require("./Shipping");
const paymentSchema = require("./Payment");
const Product = require("./Product");

const orderSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    cartId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Carts",
    },
    isCustomerUpdated: { type: Boolean, default: false },
    shipping: shippingSchema,
    payment: paymentSchema,
    status: {
      type: String,
      enum: ["pending", "delivered", "refunded", "cancel"],
      default: "pending",
    },
    products: [
      {
        productId: [Product.schema],
        quantity: { type: Number },
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(paginate);

const Order = mongoose.model("Orders", orderSchema);
module.exports = Order;

const mongoose = require("mongoose");
const creditCartSchema = require("./CreditCard");
const Schema = mongoose.Schema;

const paymentSchema = Schema(
  {
    total: {
      subTotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    method: {
      type: String,
      enum: ["credit", "cash", "bankOnline"],
    },
    creditCards: creditCartSchema,
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);

module.exports = paymentSchema;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shippingSchema = Schema(
  {
    email: { type: String },
    phone: { type: Number },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    address1: { type: String },
    address2: { type: String },
    deliveryTime: { type: Date },
    method: { type: String, enum: [5, 7, 1] },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);

module.exports = shippingSchema;

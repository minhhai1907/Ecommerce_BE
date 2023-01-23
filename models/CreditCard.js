const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditCartSchema = Schema(
  {
    cardHolder: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expDate: { type: String, required: true },
    cardCVV: { type: String, required: true },
    cardIssuer: { type: String, required: true },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);

module.exports = creditCartSchema;

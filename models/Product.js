const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("../plugins/paginate.plugin");
const toJSON = require("../plugins/toJSON.plugin");
const slug = require("mongoose-slug-updater");

const productSchema = Schema(
  {
    sku: { type: String },
    title: { type: String, require: true },
    metaTitle: { type: String },
    slug: { type: String, slug: ["_id", "title"] },
    imageUrls: [{ type: String }],
    status: {
      type: String,
      enum: ["sale", "new", "comming soon"],
    },
    price: { type: Number, require: true, default: 0, min: 0 },
    discount: { type: Number, default: 0 },
    quantity: { type: Number, require: true, min: 0 },
    totalRatings: { type: Number, default: 0 },
    rateAverage: 0,
    categoryId: { type: Schema.Types.ObjectId, ref: "Categories" },
    attributeId: [{ type: Schema.Types.ObjectId, ref: "Attributes" }],
    descriptions: {
      type: Schema.Types.ObjectId,
      ref: "Descriptions",
      default: null,
    },
    inventoryStatus: { type: String},
    tax: { type: Number, default: 10 },
    shipping: { type: Number, default: 5 },
    priceSale: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
//Plugin là một công cụ để sử dụng lại logic trong nhiều schema.
productSchema.plugin(slug);

productSchema.pre("save", function (next) {
  let product = this;

  //auto update status inventory
  if (product.quantity === 0) {
    product.inventoryStatus = "out of stock";
  } else {
    product.inventoryStatus = "available";
  }

  //auto calculate the price sale
  if (product.isModified("discount") || product.isModified("price")) {
    product.priceSale = parseFloat(
      (product.price - (product.discount * product.price) / 100).toFixed(1)
    );
  }

  next();
});

const Product = mongoose.model("Products", productSchema);
module.exports = Product;

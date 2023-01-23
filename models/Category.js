const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("../plugins/paginate.plugin");
const slug = require("mongoose-slug-updater");

const categorySchema = Schema(
  {
    title: { type: String },
    slug: { type: String, slug: ["title"] },
    icon: { type: String },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);

categorySchema.plugin(paginate);
categorySchema.plugin(slug);

const Category = mongoose.model("Categories", categorySchema);
module.exports = Category;

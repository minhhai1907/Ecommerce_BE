const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("../plugins/paginate.plugin");
const toJSON = require("../plugins/toJSON.plugin");

const descriptionSchema = Schema(
  {
    content: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);
descriptionSchema.plugin(toJSON);
descriptionSchema.plugin(paginate);

const Description = mongoose.model("Descriptions", descriptionSchema);
module.exports = Description;

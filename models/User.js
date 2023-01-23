const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const creditCartSchema = require("./CreditCard");
const config = require("../configs/config");

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isDeleted: { type: Boolean, default: false },
    phone: { type: Number },
    address: { type: String },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: Object.keys(config.role),
      default:config.role.user,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // google:{
    //   name:{type:String},
    //   email:{ type: String, required: true, unique: true },
    //   password:{ type: String, required: true, select: false },
    //   avatarUrl:{ type: String },
    //   googleId:{ type: String,
    //       unique: true,
    //       sparse:true,
    //       index:true}
    // },
    // facebook:{
    //   name:{type:String},
    //   email:{ type: String, required: true, unique: true },
    //   password:{ type: String, required: true, select: false },
    //   avatarUrl:{ type: String },
    //   facebookId:{ type: String,
    //       unique: true,
    //       sparse:true,
    //       index:true}
    // },
    googleId: {
      type: String,
      unique: true,
      sparse:true,
      index:true
    },
    facebookId: {
      type: String,
      unique: true,
      sparse:true,
      index:true
    },
    creditCards: [creditCartSchema],

    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Carts",
      require: true,
      unique: true,
      sparse:true,// fix duplicate error 
      index:true
    },
    isResetPassword: { type: Boolean, default: false },
  },
  {
    timestamps: true, //CreatedAt & UpdatedAt
  }
);
userSchema.methods.generateToken = async function () {
  const user = this;
  const accessToken = await jwt.sign(
    { _id: this._id,role:user.role },
      config.jwt.secret, 
     {
      expiresIn: config.jwt.expireIn,
     });
  return accessToken;
};

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.password;
  // delete obj.isDeleted;
  delete obj.isEmailVerified;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("Users", userSchema);
module.exports = User;

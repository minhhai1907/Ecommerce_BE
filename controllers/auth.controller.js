const {
  AppError,
  catchAsync,
  sendResponse,
  generateRandomHexString
} = require("../helpers/utils");
const User = require("../models/User");
const nodemailer=require("nodemailer")
const bcrypt = require("bcryptjs");
const resetPasswordEmailtemplate = require("../helpers/resetPassword");
const config=require("../configs/config");
const authController = {};
const  {OAuth2Client}  =require("google-auth-library");
const userController = require("./user.controller");
require("dotenv").config()

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email,isDeleted:false }, "+password");
  if (!user)
    return next(new AppError(400, "User is not exist", "Login Error"));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));

  accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});
authController.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email,isDeleted:false }, "+password");
  if (!user)
    return next(new AppError(400, "User is not exist", "Login Error"));
  if (user.isResetPassword) {
      throw new AppError(
        404,
        "Your request was sent to your Email!",
        "Reset Password"
      );
    }
    const newPassword = generateRandomHexString(8);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isResetPassword = true;
    await user.save();
  
    const html = resetPasswordEmailtemplate(newPassword);
    
    const myOAuth2Client = new OAuth2Client(
      config.passport.google.clientID,
      config.passport.google.clientSecret,
    )
    // Set Refresh Token vào OAuth2Client Credentials
    myOAuth2Client.setCredentials({
      refresh_token: config.passport.google.refreshToken,
    })

    const myAccessTokenObject = await myOAuth2Client.getAccessToken()
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token
    const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: 'OAuth2',
            user: config.email.smtp.auth.user,
            clientId: config.email.smtp.auth.clientId,
            clientSecret: config.email.smtp.auth.clientSecret,
            refresh_token: config.email.smtp.auth.refresh_token,
            accessToken: myAccessToken
          },
        })


    await transporter.sendMail({
      from: config.email.from,
      to: email,
      subject: "Reset password from Coder eCommerce",
      html,
    });
  
    return sendResponse(
      res,
      200,
      true,
      {},
      "",
      "Please check your email box!"
    );
});
authController.loginWithFacebook=catchAsync(async(req,res,next)=>{
  console.log("req.user",req.user)
  const facebookUser=req.user
  const { id, displayName, emails, photos } = facebookUser;

  filter = { email: emails[0].value };

  let user = await User.findOne(filter).populate("cartId");

  if (!user) {
    const newUser = {
      name: displayName,
      facebookId: id,
      email: emails[0].value,
      isEmailVerified: true,
      password: generateRandomHexString(8),
      avatarUrl: photos[0].value,
    };

    user = await User.create(newUser);
  }

  const token = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken: token },
    null,
    "Login with facebook successful"
  );
})
authController.loginWithGoogle=catchAsync(async(req,res,next)=>{
  console.log("req.user",req.user)
  const googleUser=req.user
  const { id, displayName, emails, photos } = googleUser;

  filter = { email: emails[0].value };


  let user = await User.findOne(filter).populate("cartId");

  if (!user) {
    const newUser = {
      name: displayName,
      googleId: id,
      email: emails[0].value,
      isEmailVerified: true,
      password: generateRandomHexString(8),
      avatarUrl: photos[0].value,
    };

    user = await User.create(newUser);
  }

  const token = await user.generateToken();

  return sendResponse(
    res,
    200,
    true,
    { user, accessToken: token },
    null,
    "Login with google successful"
  );
})

module.exports = authController;

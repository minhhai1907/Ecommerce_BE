const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy=require("passport-google-oauth2").Strategy
const passport=require("passport");
const User = require("../models/User");
const {generateRandomHexString} = require("../helpers/utils");


  const passportMiddleware = {};
  passport.serializeUser(function(user, done) {
    done(null, user); 
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user); 
  });
    passport.use(new FacebookStrategy({
              clientID: "709598827444249",
              clientSecret: "56cc9e222fe3780b8c1878dc3c49b8c6",
              callbackURL: "https://6cdc-142-114-216-146.ngrok.io/api/auth/facebook/callback",
              state: 'outline',
              profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name']
        },
        // Facebook sẽ gửi lại chuối token và thông tin profile của user
        function(accessToken, refreshToken, profile, cb) {
          console.log("profile",profile)
            return cb(null, profile);
        }
       
        // async (token, refreshToken, profile, done)=> {
        //   console.log("profile",profile)
        //     // asynchronous
        //     // process.nextTick(function () {
        //        let user= await User.findOne({'facebookId': profile.id})
        //        if(user) return done(err)
        //        else{
        //          user =  User.create({
        //           name:profile.displayName ,
        //           email:profile.emails[0].value,
        //           password:generateRandomHexString(8),
        //           avatarUrl:profile.photos[0].value,
        //           facebookId:profile.id
        //         });
        //        }
        //         // try {
        //         //   const newUser = {};
        //         //   newUser.facebookId = profile.id;
        //         //   newUser.avatarUrl=profile.photos[0].value
        //         //   newUser.password= generateRandomHexString(8),
        //         //   newUser.name = profile.displayName ; 
        //         //   newUser.email = profile.emails[0].value; 
        //         // } catch (error) {
        //         //   console.log(error)
        //         // }
                       
        //                 // // lưu vào db
        //                 // const user =  User.create({
        //                 //   name:newUser.name,
        //                 //   email:newUser.email,
        //                 //   password:newUser.password,
        //                 //   avatarUrl:newUser.avatarUrl,
        //                 //   facebookId:newUser.facebookId
        //                 // });
        //                 return done(null, user)
        //             },
    ))
    //      // GOOGLE 
  // passport.use(new GoogleStrategy({
  //         clientID:"417266100572-k66d3kf0sgeocg5g3s3r6bicgdqgtuan.apps.googleusercontent.com",
  //         clientSecret: "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",
  //         callbackURL: "https://1d88-76-68-9-233.ngrok.io/api/auth/google/callback",
  //         passReqToCallback   : true
  //       },
  //       function(request, accessToken, refreshToken, profile, done) {
  //         process.nextTick(function () {
  //           User.findOne({'googleId': profile.id}, function (err, user) {
  //               if (err)
  //                   return done(err);
  //               if (user) {
  //                   return done(null, user); 
  //               } else {
  //                   const newUser = {};
  //                   newUser.googleId = profile.id;
  //                   newUser.avatarUrl=profile.photos[0].value
  //                   newUser.password= generateRandomHexString(8),
  //                   newUser.name = profile.displayName ; 
  //                   newUser.email = profile.emails[0].value; 
  //                   // lưu vào db
  //                   const user = User.create({
  //                     name:newUser.name,
  //                     email:newUser.email,
  //                     password:newUser.password,
  //                     avatarUrl:newUser.avatarUrl,
  //                     googleId:newUser.googleId
  //                   })
  //                   return done(null, user)
  //               }
  //           });
  //       })
  //       }));
  passport.use(new GoogleStrategy(
    {
      clientID:"417266100572-k66d3kf0sgeocg5g3s3r6bicgdqgtuan.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://4691-142-114-216-146.ngrok.io/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile",profile)
        return done(null, profile);
      } catch (error) {
        done(error, false);
      }
    }
  ));
        passportMiddleware.facebookLogin=passport.authenticate('facebook',{
          authType:"rerequest",scope:["email"]
        })
        passportMiddleware.facebookData=passport.authenticate('facebook')


      passportMiddleware.googleLogin=passport.authenticate('google',{
        scope:["email"]
      })
      passportMiddleware.googleData=passport.authenticate('google')


module.exports=passportMiddleware
require("dotenv").config()
const env=process.env


const config={
    role: { user: env.ROLE_USER, admin: env.ROLE_ADMIN },
    jwt: {
        secret: env.JWT_SECRET_KEY,
        expireIn: env.ACCESS_EXPIRATION,
      },
    email: {
        smtp: {
          service: "gmail",
          auth: {
            user: env.ADMIN_EMAIL_ADDRESS,
            clientId: env.GOOGLE_MAILER_CLIENT_ID,
            clientSecret: env.GOOGLE_MAILER_CLIENT_SECRET,
            refresh_token: env.GOOGLE_MAILER_REFRESH_TOKEN,
          },
        },
        from: env.EMAIL_FROM,
      },
      passport: {
        facebook: {
          clientID: env.FACEBOOK_APP_ID,
          clientSecret: env.FACEBOOK_SECRET,
        },
        google: {
          clientID: env.GOOGLE_MAILER_CLIENT_ID,
          clientSecret: env.GOOGLE_MAILER_CLIENT_SECRET,
          refreshToken:env. GOOGLE_MAILER_REFRESH_TOKEN
        },
      },
}

module.exports=config
const express = require('express');
require("dotenv").config()
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session=require("express-session")
const passport=require("passport")
const cors=require("cors")
const { sendResponse } = require("./helpers/utils");

const mongoose = require("mongoose");


const indexRouter = require('./routes/index');

const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

/* DB Connection */
mongoose.set('strictQuery', true)
mongoose
  .connect("mongodb://localhost/ecommerce",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB connected`))
  .catch((err) => console.log(err));

app.use('/api', indexRouter);
// catch 404 and forard to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.statusCode = 404;
    next(err);
  });
  
  /* Initialize Error Handling */
  app.use((err, req, res, next) => {
    console.log("ERROR", err);
    if (err.isOperational) {
      return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        err.errorType
      );
    } else {
      return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        "Internal Server Error"
      );
    }
  });
  

module.exports = app;

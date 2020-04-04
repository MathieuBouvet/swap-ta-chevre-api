require("dotenv").config();
const express = require("express");
const mongooseSetup = require("./utils/setupMongoose");
const errorHandlers = require("./errorHandlers");
const userRouter = require("./routers/user.router");
const passport = require("passport");
const localStrategy = require("./utils/passport-strategies/local.strategy");
const cookies = require("cookies");

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", "loopback");
}
if (process.env.NODE_ENV !== "test") {
  mongooseSetup();
}

app.use(express.json());
app.use(cookies.express());

app.use(passport.initialize());
passport.use(localStrategy);

app.use("/users", userRouter);

app.use("/api/hello", (req, res) => {
  res.status(200).json({
    msg: "Hello api World ;)",
  });
});

if (errorHandlers.length > 0) {
  app.use(errorHandlers);
}
module.exports = app;

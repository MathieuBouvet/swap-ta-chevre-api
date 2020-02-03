const express = require("express");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", "loopback");
}

app.use("/api/hello", (req, res) => {
  res.status(200).json({
    msg: "Hello api World ;)",
  });
});

module.exports = app;

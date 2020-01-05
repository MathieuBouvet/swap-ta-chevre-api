const express = require("express");
const mongoose = require("mongoose");

const app = express();
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", "loopback");
}
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch(error => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection is disconnected");
});

process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log(
      "Mongoose default connection is disconnected due to application termination"
    );
    process.exit(0);
  });
});

app.use("/api/hello", (req, res) => {
  res.status(200).json({
    msg: "Hello api World ;)",
  });
});

module.exports = app;

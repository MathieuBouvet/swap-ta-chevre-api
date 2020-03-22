const mongoose = require("mongoose");
module.exports = () => {
  mongoose
    .connect(
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_FOR_TESTS
        : process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }
    )
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
};

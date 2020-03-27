const mongoose = require("mongoose");
const getMongoDbConnectionString = dbName => {
  if (dbName === "") {
    return process.env.MONGO_URI_DEFAULT;
  }
  return process.env.MONGO_URI_CUSTOM.replace("{customizable}", dbName + "-");
};
module.exports = async (dbName = "") => {
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

  try {
    await mongoose.connect(getMongoDbConnectionString(dbName), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log(`Successfully connected to MongoDB Atlas ${dbName}`);
  } catch (err) {
    console.log("Unable to connect to MongoDB Atlas");
    console.error(err);
  }
};

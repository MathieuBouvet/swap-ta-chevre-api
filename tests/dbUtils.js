const mongoose = require("mongoose");

const setup = async () => {
  await mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
};

const teardown = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = {
  setup,
  teardown,
};

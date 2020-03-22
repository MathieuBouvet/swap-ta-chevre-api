const mongoose = require("mongoose");

const setup = async () => {
  await mongoose.connect(
    global.MONGO_URI,
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

const jestTeardown = async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
  await mongoose.connection.close();
};

module.exports = {
  setup,
  teardown,
  jestTeardown,
};

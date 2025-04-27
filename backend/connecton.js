const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const con = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDb connected ${con.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;

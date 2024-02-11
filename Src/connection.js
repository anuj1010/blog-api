require("dotenv").config({ path: "./Src/.env" });
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;

const connectdb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Database is connected ");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectdb;

import mongoose from "mongoose";
import { myDB } from "../constants.js";
const dbName = myDB;
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${dbName}`
    );
    console.log(
      `MongoDB connected to database! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("Mongo DB connection error: ", err);
    process.exit(1);
  }
};
export default connectDB;

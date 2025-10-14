//APPROACH 2------------------------------
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT || 8000}`
      );
    });
    app.on("error", () => {
      console.log("ERROR");
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed", err);
  });

/*
APPROACH 1-------------------------------
import mongoose from "mongoose";
import { myDB } from "./constants";
import express from "express";
import cors from "cors";
const PORT = process.env.PORT || 3000;
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
//iffi use ; before start of function statements
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${myDB}`);
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    app.on("error", () => {
      console.log("ERROR");
    });
  } catch (err) {
    console.error("ERROR: ", err);
  }
})();
*/

require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");

const app = express();
const cors = require("cors");
app.use(cors());
const port = 3002;

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB for Message Service");

    app.listen(port, () => {
      console.log("Message Service is running on port", port);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB for Message Service:", err);
  });

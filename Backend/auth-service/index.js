const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerDocs = require("./utils/swagger");
const { logger } = require("./src/middlewares/logger");

// parse requests before starting server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Allow all origins by default
const cors = require("cors");
app.use(cors());

require("./src/routes/auth.routes")(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`);
  swaggerDocs(app, port);
});

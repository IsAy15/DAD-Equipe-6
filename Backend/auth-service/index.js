const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
require("dotenv").config();

// parse requests before starting server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./src/routes/auth.routes')(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose
  .connect('mongodb://mongo-auth:27017/authdb')
  .then(() => {
    console.log("Connected to the database!");

    app.listen(port, () => {
    console.log(`Auth service listening on port ${port}`)
  })
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
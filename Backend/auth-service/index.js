const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
require("dotenv").config();
const swaggerDocs = require('./utils/swagger');
const { logger } = require('./src/middlewares/logger');

// parse requests before starting server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

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
    swaggerDocs(app, port);
    console.log(`Swagger docs available at http://localhost:${port}/auth-service-docs`);
  })
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
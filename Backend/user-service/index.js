require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const swaggerDocs = require('./utils/swagger');
const userAuthRoutes = require('./src/routes/user-auth.routes');

const app = express();
const port = 3001;

app.use(express.json());
app.use('/api/users', userAuthRoutes);

mongoose
    .connect('mongodb://mongo-user:27017/userdb')
    .then(() => {
        console.log("Connected to the database!");

        app.listen(port, () => {
            console.log(`User service listening on port ${port}`)
            swaggerDocs(app, port);
            console.log(`Swagger docs available at http://localhost:${port}/user-service-docs`);
        })
    })
    .catch(err => {
        console.error("Database connection error:", err);
});

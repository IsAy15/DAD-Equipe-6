const express = require('express');
const mongoose = require('mongoose');
const messageRoutes = require('./src/routes/message.routes');
require('dotenv').config();

const app = express();
const port = 3002;
app.use(express.json());
app.use('/messages', messageRoutes);

mongoose
    .connect("mongodb://mongo-message:27017/messagedb")
    .then(() => {
        console.log("Connected to the database!");

        app.listen(port, () => {
            console.log(`Message service listening on port ${port}`)
        })
    })
    .catch(err => {
        console.error("Database connection error:", err);
});

require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 3003;

app.use(express.json());

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB for notification Service');

    app.listen(port, () => {
        console.log('Notification Service is running on port', port);
    });
})
.catch(err => {
    console.error('Error connecting to MongoDB for Notification Service:', err);
});

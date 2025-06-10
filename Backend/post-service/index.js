require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 3001;

app.use(express.json());

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB for Post Service');

    app.listen(port, () => {
        console.log('Post Service is running on port', port);
    });
})
.catch(err => {
    console.error('Error connecting to MongoDB for Post Service:', err);
});

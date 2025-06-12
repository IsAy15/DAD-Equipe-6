require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const swaggerDocs = require('./utils/swagger');

const app = express();
const port = 3001;

app.use(express.json());

app.listen(port, () => {
        console.log('Auth Service is running on port', port);
        swaggerDocs(app, port);
    });

// mongoose
// .connect(process.env.MONGODB_URI)
// .then(() => {
//     console.log('Connected to MongoDB for Auth Service');

//     app.listen(port, () => {
//         console.log('Auth Service is running on port', port);
//     });
// })
// .catch(err => {
//     console.error('Error connecting to MongoDB for Auth Service:', err);
// });

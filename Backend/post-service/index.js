require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const { logger } = require('./src/middlewares/logger');
const swaggerDocs = require('./utils/swagger');
const cors = require('cors')

const app = express();
const port = 3003;

app.use(cors())
app.use(express.json());
app.use(logger);

app.use('/api/posts', require('./src/routes/post.routes.js'));
app.use('/api/posts/:post_id/comments', require('./src/routes/comment.routes.js'));
app.use('/api/posts/:post_id/likes', require('./src/routes/like.routes.js'));

mongoose
.connect('mongodb://mongo-post:27017/postdb')
.then(() => {
    console.log('Connected to MongoDB for Post Service');

    app.listen(port, () => {
        console.log('Post Service is running on port', port);
    });
    swaggerDocs(app, port); 
})
.catch(err => {
    console.error('Error connecting to MongoDB for Post Service:', err);
});

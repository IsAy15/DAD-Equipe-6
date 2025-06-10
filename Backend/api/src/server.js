const express = require('express');

const server = express();
const port = process.env.PORT || 3000;
server.use(express.json());

server.use('/api/users', require('./routes/users.routes'));

server.get('/', (req, res) => {
  res.send('Hello, World! This is the backend server.');
});


server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


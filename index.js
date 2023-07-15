// server.js
const express = require('express');
const routes = require('./Routes/messages');

const app = express();

// Middleware
app.use(express.json());

// Register API routes
app.use('/api', routes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

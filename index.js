const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); 

const MessagesRoutes = require('./Routes/messages');
const UserRoutes = require('./Routes/users');

const app = express();
app.use(cors()); 

app.use(express.json());

const server = http.createServer(app);
const io = socketIO(server, { path: '/messages' }); 
MessagesRoutes.io = io;


io.on('connection', (socket) => {
  console.log('A user connected');
  
  io.on('chatMessage', (data) => {
    console.log(data);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


app.use("/", MessagesRoutes);
app.use('/auth', UserRoutes);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

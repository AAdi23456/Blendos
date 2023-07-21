const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); 
const db=require("./Database/MySql")
const MessagesRoutes = require('./Routes/messages');
const UserRoutes = require('./Routes/users');
const  {encryptMessage,decryptMessage}=require("./message-Methods/enc-dec")
const app = express();
app.use(cors()); 

app.use(express.json());
const server = http.createServer(app);
const io = socketIO(server); 


io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('chatMessage', (data) => {
    const { sender, to_user, message, senderid, userid } = data;
    const encryptedMessage = encryptMessage(message);
    const sql = 'INSERT INTO chat (`sender`, `to_user`, `message`, `sender_id`, `user_id`) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [sender, to_user, encryptedMessage, senderid, userid], (err, result) => {
      if (err) {
        console.error('Error creating message:', err);
        return;
      }
      io.emit('chatMessage', {
        sender,
        to_user,
        message: decryptMessage(encryptedMessage), 
        senderid,
        userid,
      });
    });
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

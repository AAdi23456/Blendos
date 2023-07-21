const express = require('express');
const router = express.Router();
const db = require('../Database/MySql');
const socketIO = require('socket.io'); // Import Socket.IO
const Authorization = require('../middleware/Authentication');
const CryptoJS = require('crypto-js');

// Create a new Socket.IO server instance and attach it to the router
const io = socketIO();

// Attach the socket.io instance to the router
router.io = io;

// Socket.IO event handling
// io.on('connection', (socket) => {
//   console.log('A user connected to the chatt.');

//   socket.on('disconnect', () => {
//     console.log('A user disconnected from the chat.');
//   });
// });
// io.on('chatMessage', (messageData) => {
//   const { sender, to_user, message, senderid, userid } = messageData;
//   console.log(messageData);
// })
// router.post('/messages', (req, res) => {
 
// router.io.on('connection', (socket) => {
//   console.log('A user connected to the chatttt.');

  // socket.on('chatMessage', (messageData) => {
    // const { sender, to_user, message, senderid, userid } = messageData;
    // console.log(messageData);

  
    // const encryptedMessage = encryptMessage(message);
    // const sql = 'INSERT INTO chat (`sender`, `to_user`, `message`, `sender_id`, `user_id`) VALUES (?, ?, ?, ?, ?)';
    // db.query(sql, [sender, to_user, encryptedMessage, senderid, userid], (err, result) => {
    //   if (err) {
    //     console.error('Error creating message:', err);
    //     return;
    //   }

    //   // Emit the message to all connected clients on the /messages route
    //   router.io.emit('chatMessage', {
    //     sender,
    //     to_user,
    //     message: decryptMessage(encryptedMessage), // Send the decrypted message
    //     senderid,
    //     userid,
    //   });
    // });
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected from the chat.');
//   });
// });

// The rest of your existing routes and functions...


//})

router.get('/oldmessages',Authorization, (req, res) => {
  //console.log(req.body+"this is userid");
  const sql = 'SELECT * FROM chat WHERE (sender_id = ? AND user_id=?) OR (user_id=? AND sender_id = ?) ORDER BY timestamp;';
  db.query(sql, [req.body.senderid,req.body.userid,req.body.senderid,req.body.userid], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const decryptedMessages = result.map((message) => ({
      ...message,
      message: decryptMessage(message.message),
    }));

  return res.json({ messages: decryptedMessages });
  });
});
router.get('/data', Authorization, (req, res) => {
  //console.log(req.body);
  const sql = 'SELECT * FROM users WHERE id = ?  ';
  db.query(sql, [req.body.senderid], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

   //console.log(result)
    res.json({senderid:result[0].id,sendername:result[0].Name });
  });
});
router.get('/persons', Authorization, (req, res) => {
 //console.log(req.body+"kfv");
  const sql = 'SELECT DISTINCT user_id, to_user  FROM chat WHERE (sender_id = ? ) OR (user_id=?) ';
  db.query(sql, [req.body.senderid,req.body.senderid], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
   // console.log(result);
    res.json({ result });
  });
});

router.get('/newperson', (req, res) => {
 const {email}=req.body
 if(!email){
  return res.status(400).json({msg:"please provide the email!"})
 }
  const sql = 'SELECT id , Name FROM users WHERE email=?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

   

  return res.status(200).json(result[0]);
  });
});
function decryptMessage(encryptedMessage) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, 'encryption-secret-key');
  const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

module.exports = router;

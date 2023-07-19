const express = require('express');
const router = express.Router();
const db = require('../Database/MySql');

const Authorization = require('../middleware/Authentication');
const CryptoJS = require('crypto-js');

router.post('/messages', Authorization, (req, res) => {
  const { sender, to_user, message, id,userid } = req.body;
  console.log(sender);

  const encryptedMessage = encryptMessage(message);
  const sql = 'INSERT INTO chat (`sender`, `to_user`, `message`, `sender_id`,`user_id`) VALUES (?, ?, ?, ?,?)';
  db.query(sql, [sender, to_user, encryptedMessage, id,userid], (err, result) => {
    if (err) {
      console.error('Error creating message:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Message created successfully' });
  });
});

router.get('/messages', Authorization, (req, res) => {
  console.log(req.body);
  const sql = 'SELECT * FROM chat WHERE (sender_id = ? AND user_id=?) OR (user_id=? AND sender_id = ?) ORDER BY timestamp ';
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

    res.json({ messages: decryptedMessages });
  });
});
router.get('/persons', Authorization, (req, res) => {
 
  const sql = 'SELECT  to_user , user_id FROM chat WHERE sender_id = ?';
  db.query(sql, [req.body.senderid], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ result });
  });
});
function encryptMessage(message) {
  const encrypted = CryptoJS.AES.encrypt(message, 'encryption-secret-key').toString();
  return encrypted;
}

function decryptMessage(encryptedMessage) {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, 'encryption-secret-key');
  const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

module.exports = router;

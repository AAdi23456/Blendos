
const express = require('express');
const router = express.Router();
const db = require('../Database/MySql');

const Authorization = require("../middleware/Authentication")
const crypto = require('crypto');
const recipientKeyPair = generateRSAKeys();
const senderKeyPair = generateRSAKeys();



router.post('/messages', Authorization, (req, res) => {
  const { sender, to_user, message, id } = req.body;
  console.log(sender);
  const encryptedMessage = encryptMessage(message, recipientKeyPair.publicKey);
  const sql = 'INSERT INTO chat (`sender`, `to_user`, `message`,`sender_id`) VALUES (?, ?, ?,?)';
  db.query(sql, [sender, to_user, encryptedMessage, id], (err, result) => {
    if (err) {
      console.error('Error creating message:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Message created successfully' });
  });
});
router.get('/messages', Authorization, (req, res) => {

  const sql = 'SELECT * FROM chat WHERE sender_id =?';
  db.query(sql, [req.body.id], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // for (let i = 0; i < result.length; i++) {
    //   result[i].message = decryptMessage(result[i].message, recipientKeyPair.privateKey);
    // }
    res.json({ messages: result });
  });
});


function encryptMessage(message, publicKey) {
  const buffer = Buffer.from(message, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}


function decryptMessage(encryptedMessage, privateKey) {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
}


function generateRSAKeys() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
}
module.exports = router;

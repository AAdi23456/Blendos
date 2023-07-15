const bcrypt=require("bcrypt")
const express = require('express');
const router = express.Router();
const db = require('../Database/MySql');
const jwt=require("jsonwebtoken")
const Authorization=require("../middleware/Authentication")
router.post('/messages',Authorization, (req, res) => {
  const { sender, to_user, message ,id} = req.body;
  console.log(sender);
  const sql = 'INSERT INTO chat (`sender`, `to_user`, `message`,`sender_id`) VALUES (?, ?, ?,?)';
  db.query(sql, [sender, to_user, message,id], (err, result) => {
    if (err) {
      console.error('Error creating message:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Message created successfully' });
  });
});
router.get('/messages', Authorization,(req, res) => {
  const sql = 'SELECT * FROM chat WHERE sender_id =?';
  db.query(sql,[req.body.id], (err, result) => {
    if (err) {
      console.error('Error retrieving messages:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ messages: result });
  });
});

router.post('/signup', async (req, res) => {
    const { Name, email, password, state, country } = req.body;
    const EmailCheckQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
    db.query(EmailCheckQuery, [email],async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
      }
      if (result[0].count > 0) {
        return res.status(401).json({ msg: "Email is already exists" });
      }
      const Hashedpassword = await bcrypt.hash(password, 8);
  
      const sql = 'INSERT INTO users (`Name`, `email`, `password`, `state`, `country`) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [Name, email, Hashedpassword, state, country], (err, result) => {
        if (err) {
          console.error('Error creating message:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        return res.status(200).json({ msg: 'Registration successfully' });
      });
    });
  });
  router.post('/login', async (req, res) => {
    const {  email, password } = req.body;
    const EmailCheckQuery = "SELECT email, id AS primaryKey,password AS password FROM users WHERE email = ?";
    
    db.query(EmailCheckQuery, [email],async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
      }
      console.log(result);
      if (!result[0].email) {
       return res.status(400).json({msg:"Register First"})
      }
    const CheckEmail=await bcrypt.compare(password,result[0].password)
    if(!CheckEmail){
     return res.status(401).json({msg:"wrong Credentials"})
    }
    return res.status(200).json({msg:"Login Successfull",token:jwt.sign({id:result[0].primaryKey},process.env.JWT_PRIVATEKEY)})
    });
  });
module.exports = router;

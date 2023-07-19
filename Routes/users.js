const bcrypt = require("bcrypt")
const express = require('express');
const router = express.Router();
const db = require('../Database/MySql');
const jwt = require("jsonwebtoken")

router.post('/signup', async (req, res) => {
    const { Name, email, password, state, country } = req.body;
    //console.log(req.body);
    const EmailCheckQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
    db.query(EmailCheckQuery, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Internal server error" });
        }
        if (result[0].count > 0) {
            return res.status(400).json({ msg: "Email is already exists" });
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
    const { email, password } = req.body;
    const EmailCheckQuery = "SELECT email, id AS id,password AS password ,Name as name FROM users WHERE email = ?";

    db.query(EmailCheckQuery, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "Internal server error" });
        }
        console.log(result);
        if (!result.length) {
            return res.status(400).json({ msg: "Register First" })
        }
        const CheckEmail = await bcrypt.compare(password, result[0].password)
        if (!CheckEmail) {
            return res.status(401).json({ msg: "wrong Credentials" })
        }
        console.log(CheckEmail);
        return res.status(200).json({ msg: "Login Successfull", token: jwt.sign({ id: result[0].id, sender: result[0].name }, process.env.JWT_PRIVATEKEY),name:result[0].name })
    });
});
module.exports = router

const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.MySql_HOST,
  user: process.env.MySql_USER,
  password: process.env.MySql_PASSWORD,
  database: process.env.MySql_DATABASE,
});


// const createUsersTableQuery = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     Name VARCHAR(20) NOT NULL,
//     email VARCHAR(30) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     country VARCHAR(20),
//     state VARCHAR(20)
//   )
// `;


// const createChatsTableQuery = `
// ALTER TABLE chat
// MODIFY COLUMN sender_id INT NOT NULL

// `

// connection.query(createUsersTableQuery, (err) => {
//   if (err) {
//     console.error('Error creating users table:', err);
//     return;
//   }
//   console.log('Users table created or already exists!');

  
  // connection.query(createChatsTableQuery, (err) => {
  //   if (err) {
  //     console.error('Error creating chats table:', err);
  //     return;
  //   }
  //   console.log('Chats table created or already exists!');
  // });
//});

module.exports = connection;

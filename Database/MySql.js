
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.MySql_HOST,
  user: process.env.MySql_USER,
  password: process.env.MySql_PASSWORD,
  database: process.env.MySql_DATABASE,
});




module.exports = connection;

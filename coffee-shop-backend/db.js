const mysql = require('mysql2');

// Replace these values with your actual database credentials
const pool = mysql.createPool({
  host: 'localhost',  // or use your MySQL host (can be an IP if using remote MySQL)
  user: 'root',       // Your phpMyAdmin username
  password: '',  // Your phpMyAdmin password
  database: 'coffee_shop',    // The database name you want to connect to
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();

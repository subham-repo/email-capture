const mysql = require('mysql');
require('dotenv').config();

// Create the connection
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.ECDB_USER,
    password: process.env.ECDB_PASS,
    database: process.env.ECDB_NAME,
    charset: 'utf8mb4'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = db;
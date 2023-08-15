const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    database: 'online_store',
    user: 'root',
    password: 'shodon2007',
})

module.exports = conn;
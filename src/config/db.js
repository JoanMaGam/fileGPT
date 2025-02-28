const mysql = require('mysql2');


const pool = mysql.createPool(
    {
        host: process.env.HOSTDB,
        user: process.env.USERDB,
        password: process.env.PASSDB,
        port: process.env.PORTDB,
        database: process.env.DBNAME
    }
).promise();

module.exports = { pool };
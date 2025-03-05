const mysql = require('mysql2');


const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    }
).promise();

// Prueba de conexión al inicio
pool.getConnection()
    .then(connection => {
        console.log("✅ Conectado a la base de datos!");
        connection.release(); // Liberar conexión
    })
    .catch(err => {
        console.error("❌ Error conectando a la BD:", err);
    });


module.exports = { pool };
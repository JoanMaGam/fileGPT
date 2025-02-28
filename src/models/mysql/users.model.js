const db = require('../../config/db');
const usersTableDB = 'filegpt.usuarios';


const getAllUsers = async () => {
    try {
        const allUsers = await db.pool.query(`SELECT * FROM ${usersTableDB}`);
        return allUsers;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const insertLog = async (values) => {
    let { timestamp, metodo, url, ip, mensaje } = values;
    try {
        return await db.pool.query(`INSERT INTO ${logsTableDB} (timestamp, metodo, url, ip, mensaje) VALUES (?, ?, ?, ?, ?)`, [timestamp, metodo, url, ip, mensaje]);
    } catch (error) {
        throw { status: 500, message: error?.message || error };
    };
};

module.exports = {
    getAllUsers,
    insertLog
}
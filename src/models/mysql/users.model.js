const db = require('../../config/db');
const usersTableDB = 'filegpt.roles';


const getAllUsers = async () => {
    try {
        const allUsers = await db.pool.query(`SELECT * FROM ${usersTableDB}`);
        return allUsers;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const createUser = async (newUser) => {
    const { nombre, apellidos, email, password, rol_id } = newUser;
    try {
        const encryptedPassword = bcrypt.hashSync(password, 8);
        const createdUser = await db.pool.query(`INSERT INTO ${usersTableDB} (nombre, apellidos, email, password, rol_id) VALUES (?, ?, ?, ?, ?)`, [nombre, apellidos, email, encryptedPassword, rol_id]);
        return createdUser;
    } catch (error) {
        throw { status: 500, message: error?.message || error };
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
    insertLog,
    createUser,
}
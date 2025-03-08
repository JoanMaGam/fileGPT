const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const usersTableDB = 'usuarios';
const logsTableDB = 'server_logs';


const getAllUsers = async () => {
    try {
        const [allUsers] = await db.pool.query(`SELECT * FROM ${usersTableDB}`);
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
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const createUser = async (newUser) => {
    const { nombre, apellidos, email, password, rol_id } = newUser;
    try {
        const encryptedPassword = bcrypt.hashSync(password, 8);
        return await db.pool.query(`INSERT INTO ${usersTableDB} (nombre, apellidos, email, password, rol_id) VALUES (?, ?, ?, ?, ?)`, [nombre, apellidos, email, encryptedPassword, rol_id]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const getUserByEmail = async (email) => {
    try {
        const [userByEmail] = await db.pool.query(`SELECT * FROM ${usersTableDB} WHERE email = ?`, [email]);
        if (!userByEmail[0]) {
            throw {
                status: 400,
                message: `No se pudo encontrar el usuario con el email: '${email}'`
            };
        };
        return userByEmail;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const updateUserByEmail = async (values) => {
    const { nombre, apellidos, rol_id, userEmail } = values;
    try {
        return await db.pool.query(`UPDATE ${usersTableDB} SET usuarios.nombre= ?, usuarios.apellidos= ?,  usuarios.rol_id= ? WHERE usuarios.email= ?;`, [nombre, apellidos, rol_id, userEmail]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const updatePassword = async (values) => {
    const { userEmail, newPassword } = values;
    const encryptedPassword = bcrypt.hashSync(newPassword, 8);
    try {
        return await db.pool.query(`UPDATE ${usersTableDB} SET usuarios.password= ? WHERE usuarios.email= ?;`, [encryptedPassword, userEmail]);
    } catch (error) {
        throw { status: 500, message: error?.message || error };
    };
};

const deleteUserByEmail = async (email) => {

    try {
        await db.pool.query(`DELETE FROM ${usersTableDB} WHERE email = ?`, [email]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};


module.exports = {
    getAllUsers,
    insertLog,
    createUser,
    getUserByEmail,
    updateUserByEmail,
    updatePassword,
    deleteUserByEmail
}
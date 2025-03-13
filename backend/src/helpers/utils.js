const jwt = require('jsonwebtoken');
const usersModel = require('../models/mysql/users.model');


// Función que crea un token de usuario
const createToken = (user) => {
    const object = {
        user_id: user.id,
        user_email: user.email,
        user_password: user.password,
        user_rol: user.rol_id
    }
    return jwt.sign(object, process.env.SECRET_KEY, { expiresIn: "1h" })
};


// Guarda logs de servidor en la BD. Para saber quien hace que y cuando al entrar en el server.
const serverLogs = async (pReq, mensaje = '--') => {

    const line = `[${pReq.timeStamp}]  Método:'${pReq.method}'   URL:'${pReq.url}'   IP:'${pReq.headers.host}'   Mensaje:'${mensaje}'\n`;
    console.log(line);

    let values = {
        timestamp: pReq.timeStamp,
        metodo: pReq.method,
        url: pReq.url,
        ip: pReq.headers.host,
        mensaje: mensaje
    };

    try {
        await usersModel.insertLog(values);

    } catch (error) {
        throw { status: 500, message: error?.message || error };
    };
};

module.exports = { createToken, serverLogs }
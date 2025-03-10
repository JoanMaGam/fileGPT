const { createToken, serverLogs } = require('../helpers/utils');
const usersModel = require('../models/mysql/users.model');
const bcrypt = require('bcryptjs');

/**
 * 
 * @brief Obtener todos los usuarios de la BD
 * @returns {Object} Todos los usuarios de la BD - {status, data:[usuarios]}
 */
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await usersModel.getAllUsers();

        await serverLogs(req, `Todos los usuarios obtenidos correctamente`);
        res.status(200).send({ status: "OK", data: allUsers });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

/**
 * 
 * @brief Crea/registra un usuario nuevo en la BD
 * @param {Object} req.body - Valores recibidos de un formulario en el frontend
 * @returns {Object}  Confirmación de la operación
 */
const createUser = async (req, res) => {
    const { body } = req;

    if (
        !body.nombre ||
        !body.apellidos ||
        !body.email ||
        !body.password ||
        !body.rol_id
    ) {
        res.status(400).send({
            status: "FAILED",
            data: {
                error:
                    "Alguna de las siguientes claves no existe o está vacía en el cuerpo de la petición: 'nombre', 'apellidos', 'email', 'password', 'rol_id'",
            },
        });
        return;
    };

    const newUser = {
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: body.password,
        rol_id: body.rol_id,
    };

    try {
        await serverLogs(req, `Usuario "${body.email}" creado correctamente`);

        await usersModel.createUser(newUser);
        res.status(200).send({ status: "OK", data: { msg: 'Usuario creado correctamente' } });
    } catch (error) {
        await serverLogs(req, error?.message || error);

        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

/**
 * 
 * @brief Obtener un usuario por email de la BD
 * @param {Object} email - Valores recibidos de un formulario en el frontend
 * @returns {Object}  Usuario correspondiente al email solicitado - {status, data:usuario}
 */
const getUserByEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'email' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    try {
        const [userByEmail] = await usersModel.getUserByEmail(email);
        await serverLogs(req, `Usuario con email "${email}" obtenido correctamente`);

        res.status(200).send({ status: "OK", data: userByEmail });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
}

/**
 * 
 * @brief Actualizar un usuario por email de la BD
 * @param {Object} req.body - 
 * @returns {Object} Confirmación de la operación
 */
const updateUserByEmail = async (req, res) => {
    const { userEmail, nombre } = req.body;

    if (!userEmail ||
        !nombre
    ) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "Alguna de las siguientes claves no existe o está vacía en el cuerpo de la petición: 'userEmail', 'nombre'" },
        });
        return;
    };

    try {
        await serverLogs(req, `Usuario con email "${userEmail}" actualizado correctamente`);

        await usersModel.updateUserByEmail(req.body);
        res.status(200).send({ status: "OK", data: { msg: `Usuario con email "${userEmail}" actualizado correctamente` } });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

/**
 * 
 * @brief Actualizar la contraseña de un usuario por email de la BD
 * @param {Object} req.body - 
 * @returns {}  
 */
const updatePassword = async (req, res) => {
    const { body } = req;

    if (
        !body.email ||
        !body.password ||
        !body.newPassword
    ) {
        res.status(400).send({
            status: "FAILED",
            data: {
                error:
                    "Alguna de las siguientes claves no existe o está vacía en el cuerpo de la petición: 'userEmail', 'password', 'newPassword'",
            },
        });
        return;
    };

    try {
        //Recuperamos el usuario de la BD si existe
        let [userByEmail] = await usersModel.getUserByEmail(body.email);

        //Comprobamos si las password son iguales. 
        const iguales = bcrypt.compareSync(body.password, userByEmail.password);

        //Si no son iguales devolvemos un error.
        if (!iguales) {
            await serverLogs(req, `Contraseña actual errónea al modificar la contraseña del usuario: ${body.email}`);
            res.status(400).send({
                status: "FAILED",
                data: {
                    error:
                        "Contraseña errónea, introduzca su contraseña actual."
                }
            });
            return;
        };

        //Si son iguales actualizamos la contraseña en la BD.
        await usersModel.updatePassword(body);

        await serverLogs(req, `Contraseña actualizada correctamente del usuario: ${body.email}`);
        res.status(200).send({ status: "OK", data: { msg: `Contraseña actualizada correctamente` } });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

/**
 * 
 * @brief Eliminar un usuario por email de la BD
 * @param {Object} req.body - 
 * @returns {Object} Confirmación de la operación
 */
const deleteUserByEmail = async (req, res) => {

    const { email } = req.body;
    if (!email) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'email' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    //Protejo el usuario Root para que no pueda ser eliminado
    if (email === 'root@filegpt.com') {
        res.status(400).send({ status: "FAILED", data: { error: 'No puedes eliminar este usuario.' } });
    } else {
        if (email)
            try {
                await serverLogs(req, `Usuario con email "${email}" eliminado correctamente`);

                await usersModel.deleteUserByEmail(email);
                res.status(200).send({ status: "OK", data: { msg: `Usuario con email "${email}" eliminado correctamente` } });
            } catch (error) {
                await serverLogs(req, error?.message || error);
                res
                    .status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            };
    }
};

/**
 * 
 * @brief Genera un token al verificar el login de un usuario
 * @param {Object} req.body - Valores recibidos de un formulario en el frontend
 * @returns {Object} Token - {status,data{success,token}}  
 */
const loginUser = async (req, res) => {
    const { body } = req;

    if (
        !body.email ||
        !body.password
    ) {
        res.status(400).send({
            status: "FAILED",
            data: {
                error:
                    "Campo email o password requerido",
            },
        });
        return;
    };

    try {
        //Recuperamos el usuario de la BD si existe
        let [userByEmail] = await usersModel.getUserByEmail(body.email);

        //Comprobamos si las password son iguales. 
        const iguales = bcrypt.compareSync(body.password, userByEmail.password);

        if (!iguales) {
            // Si las password no son iguales, devolvemos un error.
            await serverLogs(req, `Error email y/o contraseña del usuario "${body.email}"`);
            res.status(400).send({
                status: "FAILED",
                data: {
                    error:
                        "Error email y/o contraseña"
                }
            });
            return;
        };

        //Si las password son iguales, creamos el token
        await serverLogs(req, `Login correcto de usuario: ${body.email}`);
        res.status(200).json({
            success: 'Login correcto',
            token: createToken(userByEmail)
        });
    } catch (error) {
        await serverLogs(req, error?.message || error);

        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

/**
 * 
 * @brief Ruta protegida con Token de acceso. Accede al perfil privado del usuario.
 * @param {String} token - Token recibido a través de la cabecera de autorización
 * @returns {Object} Perfil del usuario - {msg,user}  
 */
const profile = async (req, res) => {
    try {
        res.status(200).json({ msg: 'PERFIL PRIVADO, (Acceso permitido con TOKEN)', user: req.user });
    } catch (error) {
        await serverLogs(req, error?.message || error);

        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

module.exports = {
    getAllUsers,
    createUser,
    getUserByEmail,
    updateUserByEmail,
    updatePassword,
    deleteUserByEmail,
    loginUser,
    profile
}
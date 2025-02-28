const usersModel = require('../models/mysql/users.model');


/**
 * 
 * @brief Obtener todos los usuarios de la BD
 * @returns {Object} Todos los usuarios de la BD - {status, data:[usuarios]}
 */
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await usersModel.getAllUsers();

        res.send({ status: "OK", data: allUsers });
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
 * @returns {Object}  Usuario creado - {status,data{datosInsercionBD}}  
 */
const createUser = async (req, res) => {
    const { body } = req;
    console.log("controlador: ", body);

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

        const createdUser = await usersModel.createUser(newUser);
        res.send({ status: "OK", data: { msg: 'Usuario creado correctamente', createdUser } });
    } catch (error) {
        await serverLogs(req, error?.message || error);

        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

module.exports = {
    getAllUsers,
    createUser
}
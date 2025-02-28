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


module.exports = {
    getAllUsers,
}
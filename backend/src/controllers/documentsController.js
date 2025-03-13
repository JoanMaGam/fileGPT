const { serverLogs } = require('../helpers/utils');
const documentsModel = require('../models/mysql/documents.model');

/**
 * 
 * @brief Obtener todos los registros de documentos de la BD
 * @returns {Object} Todos los registros de documentos de la BD - {status, data:[documentos]}
 */
const getAllDocuments = async (req, res) => {
    try {
        const allDocuments = await documentsModel.getAllDocuments();

        await serverLogs(req, `Todos los registros de documentos obtenidos correctamente`);
        res.status(200).send({ status: "OK", data: allDocuments });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

/**
 * 
 * @brief Inserta un nuevo registro de documento en la BD
 * @param {Object} req.body - usuario_id, nombre_archivo, size(tamaño). Valores recibidos de un formulario en el frontend
 * @returns {Object}  Mensaje de confirmación 
 */
const insertDocument = async (req, res) => {
    const { usuario_id, nombre_archivo, size } = req.body;

    if (
        !usuario_id ||
        !nombre_archivo ||
        !size
    ) {
        res.status(400).send({
            status: "FAILED",
            data: {
                error:
                    "Alguna de las siguientes claves no existe o está vacía en el cuerpo de la petición: 'usuario_id', 'nombre_archivo', 'size'",
            },
        });
        return;
    };

    try {
        await serverLogs(req, `Registro de documento con id ${usuario_id} guardado correctamente`);

        await documentsModel.insertDocument(req.body);
        res.status(200).send({ status: "OK", data: { msg: 'Documento guardado correctamente' } });
    } catch (error) {
        await serverLogs(req, error?.message || error);

        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

/**
 * 
 * @brief Obtener los registros de documentos de un usuario por id de usuario de la BD
 * @param {Object} usuario_id - Valores recibidos de un formulario en el frontend
 * @returns {Object}  Registros de documentos correspondientes al usuario_id solicitado - {status, data:documentos}
 */
const getDocumentsByUserId = async (req, res) => {

    const { usuario_id } = req.body;

    if (!usuario_id) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'usuario_id' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    try {
        const docRegisters = await documentsModel.getDocumentsByUserId(usuario_id);
        await serverLogs(req, `Registros de documentos correspondientes al usuario con id "${usuario_id}" obtenidos correctamente`);

        res.status(200).send({ status: "OK", data: docRegisters });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
}



/**
 * 
 * @brief Eliminar un registro de documento por id de la BD
 * @param {Object} req.body - id. Valores recibidos de un formulario en el frontend
 * @returns {Object} Confirmación de la operación
 */
const deleteDocumentById = async (req, res) => {

    const { id } = req.body;
    if (!id) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'id' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    try {
        await serverLogs(req, `Registro de documento con id "${id}" eliminado correctamente`);

        await documentsModel.deleteDocumentById(id);
        res.status(200).send({ status: "OK", data: { msg: `Documento eliminado correctamente` } });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};



module.exports = {
    getAllDocuments,
    insertDocument,
    getDocumentsByUserId,
    deleteDocumentById
}
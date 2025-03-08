const { serverLogs } = require('../helpers/utils');
const questionsModel = require('../models/mysql/questions.model');

/**
 * 
 * @brief Obtener todas las preguntas de la BD
 * @returns {Object} Todas las preguntas de la BD - {status, data:[preguntas]}
 */
const getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await questionsModel.getAllQuestions();

        await serverLogs(req, `Todas las preguntas obtenidas correctamente`);
        res.status(200).send({ status: "OK", data: allQuestions });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
};

/**
 * 
 * @brief Inserta una nueva pregunta en la BD
 * @param {Object} req.body - Valores recibidos de un formulario en el frontend
 * @returns {Object}  Mensaje de confirmación 
 */
const insertQuestion = async (req, res) => {
    const { body } = req;
    console.log("controlador questions: ", body);

    if (
        !body.usuario_id ||
        !body.documento_id ||
        !body.pregunta ||
        !body.respuesta
    ) {
        res.status(400).send({
            status: "FAILED",
            data: {
                error:
                    "Alguna de las siguientes claves no existe o está vacía en el cuerpo de la petición: 'usuario_id', 'documento_id', 'pregunta', 'respuesta'",
            },
        });
        return;
    };

    try {
        await serverLogs(req, `Pregunta guardada correctamente`);

        await questionsModel.insertQuestion(body);
        res.status(200).send({ status: "OK", data: { msg: 'Pregunta guardada correctamente' } });
    } catch (error) {
        await serverLogs(req, error?.message || error);

        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};

/**
 * 
 * @brief Obtener las preguntas de un documento por id de documento de la BD
 * @param {Object} documento_id - Valores recibidos de un formulario en el frontend
 * @returns {Object}  Preguntas correspondientes al documento_id solicitado - {status, data:preguntas}
 */
const getQuestionsByDocumentId = async (req, res) => {
    const { documento_id } = req.body;
    console.log(documento_id);

    if (!documento_id) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'documento_id' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    try {
        const [questions] = await questionsModel.getQuestionsByDocumentId(documento_id);
        await serverLogs(req, `Preguntas del documento con id "${documento_id}" obtenidas correctamente`);

        res.status(200).send({ status: "OK", data: questions });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
}



/**
 * 
 * @brief Eliminar una pregunta por id de la BD
 * @param {Object} req.body - 
 * @returns {Object} Confirmación de la operación
 */
const deleteQuestionById = async (req, res) => {

    const { id } = req.body;
    if (!id) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'id' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    try {
        await serverLogs(req, `Pregunta con id "${id}" eliminada correctamente`);

        await questionsModel.deleteQuestionById(email);
        res.status(200).send({ status: "OK", data: { msg: `Pregunta eliminada correctamente` } });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    };
};



module.exports = {
    getAllQuestions,
    insertQuestion,
    getQuestionsByDocumentId,
    deleteQuestionById
}
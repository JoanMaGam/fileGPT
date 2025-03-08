const db = require('../../config/db');
const questionsTableDB = 'preguntas';


const getAllQuestions = async () => {
    try {
        const [allQuestions] = await db.pool.query(`SELECT * FROM ${questionsTableDB}`);
        return allQuestions;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};


const getQuestionsByDocumentId = async (docId) => {
    try {
        const [questions] = await db.pool.query(`SELECT * FROM ${questionsTableDB} WHERE documento_id  = ?`, [docId]);
        console.log(questions);

        if (!questions[0]) {
            throw {
                status: 400,
                message: `No se pudo encontrar el documento con el id: '${docId}'`
            };
        };
        return questions;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const insertQuestion = async (newQuestion) => {
    const { usuario_id, documento_id, pregunta, respuesta } = newQuestion;
    try {
        return await db.pool.query(`INSERT INTO ${questionsTableDB} (usuario_id, documento_id, pregunta, respuesta) VALUES (?, ?, ?, ?)`, [usuario_id, documento_id, pregunta, respuesta]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const deleteQuestionById = async (questionId) => {

    try {
        await db.pool.query(`DELETE FROM ${questionsTableDB} WHERE id = ?`, [questionId]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};


module.exports = {
    getAllQuestions,
    getQuestionsByDocumentId,
    insertQuestion,
    deleteQuestionById
}
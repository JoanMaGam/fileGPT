const db = require('../../config/db');
const documentsTableDB = 'documentos';


const getAllDocuments = async () => {
    try {
        const [allDocRegisters] = await db.pool.query(`SELECT * FROM ${documentsTableDB}`);
        return allDocRegisters;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};


const getDocumentsByUserId = async (userId) => {
    try {
        const [docRegisters] = await db.pool.query(`SELECT * FROM ${documentsTableDB} WHERE usuario_id  = ?`, [userId]);
        return docRegisters;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const insertDocument = async (newDocument) => {
    const { usuario_id, nombre_archivo } = newDocument;
    try {
        return await db.pool.query(`INSERT INTO ${documentsTableDB} (usuario_id, nombre_archivo) VALUES (?, ?)`, [usuario_id, nombre_archivo]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};

const deleteDocumentById = async (docId) => {

    try {
        await db.pool.query(`DELETE FROM ${documentsTableDB} WHERE id = ?`, [docId]);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    };
};


module.exports = {
    getAllDocuments,
    getDocumentsByUserId,
    insertDocument,
    deleteDocumentById
}
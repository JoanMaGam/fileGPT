import axios from "axios";

const baseUrl = 'http://localhost:3000/api/v1/documents';

const getAllDocuments = async () => {
    try {
        const response = await axios.get(`${baseUrl}/documents`);
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}

const insertDocument = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/insertDocument`, values);
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}

const getDocumentsByUserId = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/getDocumentsByUserId`, values);
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}

const deleteDocumentById = async (values) => {
    try {
        //Añado el objeto {data} para poder pasar los parámetros por el body. Propio de Axios.
        const response = await axios.delete(`${baseUrl}/deleteDocumentById`, { data: values });
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}


export {
    getAllDocuments,
    insertDocument,
    getDocumentsByUserId,
    deleteDocumentById
}
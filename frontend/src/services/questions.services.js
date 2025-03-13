import axios from "axios";

// Obtengo la URL del backend desde el archivo .env
const API_URL = import.meta.env.VITE_RENDER_API_URL;
const baseUrl = `${API_URL}/api/v1/questions`;


const getAllQuestions = async () => {
    try {
        const response = await axios.get(`${baseUrl}/questions`);
        return response;
    } catch (error) {
        return error.response;
    }
}

const insertQuestion = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/insertQuestion`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const getQuestionsByUserId = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/getQuestionsByUserId`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const getQuestionsByDocumentId = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/getQuestionsByDocumentId`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteQuestionById = async (values) => {
    try {
        //Añado el objeto {data} para poder pasar los parámetros por el body. Propio de Axios.
        const response = await axios.delete(`${baseUrl}/deleteQuestionById`, { data: values });
        return response;
    } catch (error) {
        return error.response;
    }
}


export {
    getAllQuestions,
    insertQuestion,
    getQuestionsByUserId,
    getQuestionsByDocumentId,
    deleteQuestionById
}
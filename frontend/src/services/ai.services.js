import axios from "axios";

// Obtengo la URL del backend desde el archivo .env
const API_URL = import.meta.env.VITE_RENDER_API_URL;
const baseUrl = `${API_URL}/api/v1/ai`;


const uploadDoc = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/upload`, values, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}

const askAi = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/ask`, values);
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}

export {
    uploadDoc,
    askAi,
}



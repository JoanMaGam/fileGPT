import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Obtengo la URL del backend desde el archivo .env
const API_URL = import.meta.env.VITE_RENDER_API_URL;
const baseUrl = `${API_URL}/api/v1/users`;


//Función que verifica si el usuario está logado
const isLogged = () => {
    return localStorage.getItem('userLogged_token') ? true : false;
}

//Función que verifica si el usuario tiene rol 'admin'
const isAdmin = () => {
    if (localStorage.getItem('userLogged_token')) {
        const userLogged = jwtDecode(localStorage.getItem('userLogged_token'))
        if (userLogged.user_rol === 1) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

const getUsers = async () => {
    try {
        const response = await axios.get(`${baseUrl}/users`);
        return response;
    } catch (error) {
        return error.response;
    }
}

const registerUser = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/register`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const login = async (values) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const profile = async () => {
    try {
        const response = await axios.post(`${baseUrl}/profile`);
        return response;
    } catch (error) {
        return error.response;
    }
}

const getUserByEmail = async (userEmail) => {
    try {
        const response = await axios.post(`${baseUrl}/getUserByEmail`, userEmail);
        return response;
    } catch (error) {
        return error.response;
    }
}

const updateUserByEmail = async (values) => {
    try {
        const response = await axios.put(`${baseUrl}/updateUserByEmail`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const updatePassword = async (values) => {
    try {
        const response = await axios.put(`${baseUrl}/updatePassword`, values);
        return response;
    } catch (error) {
        return error.response;
    }
}

const deleteUserByEmail = async (userEmail) => {
    try {
        //Añado el objeto {data} para poder pasar los parámetros por el body. Propio de Axios.
        const response = await axios.delete(`${baseUrl}/deleteUserByEmail`, { data: userEmail });
        return response;
    } catch (error) {
        return error.response;
    }
}


export {
    isLogged,
    isAdmin,
    getUsers,
    registerUser,
    login,
    profile,
    getUserByEmail,
    updateUserByEmail,
    updatePassword,
    deleteUserByEmail
}
import axios from "axios";

const baseUrl = 'http://localhost:3000/api/v1/users';

const getUsers = async () => {
    try {
        const response = await axios.get(baseUrl);
        return response;
    } catch (error) {
        console.error(error.message);
        return error.response;
    }
}

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

export {
    getUsers,
    isLogged,
    isAdmin
}
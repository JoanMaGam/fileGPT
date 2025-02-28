const jwt = require('jsonwebtoken');

// Comprueba si existe el token en las cabeceras
const checkToken = (req, res, next) => {
    console.log('Pasa por el Middleware');

    //Comprovar si la cabecera de Authorization existe:
    if (!req.headers['authorization']) {
        return res.json({ fatal: 'Debes incluir la cabecera de Authorization' });
    }
    const token = req.headers['authorization'];

    //Comprovar si el token es correcto:
    let object;
    try {
        console.log('verificando token');
        object = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return res.json({ fatal: error.message });
    }

    //Recupero los datos del usuario activo:
    req.user = object

    next();
}

// Añade el timeStamp a req
const addTimeStamp = async (req, res, next) => {
    const timestampUNIX = Date.now();
    const date = new Date(timestampUNIX);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formatedDate = `${year}-${month}-${day}`;

    const editedTimeStamp = `${formatedDate} ${date.toLocaleTimeString()}`;

    req.timeStamp = editedTimeStamp;
    next();
};

//Comprueba si el usuario tiene un rol determinado por parámetro (admin o user)
const checkRol = (rol) => {
    return (req, res, next) => {
        const roles = { 1: "admin", 2: "user" };
        const userRol = roles[req.user.rol_id];

        if (userRol !== rol) {
            return res.status(403).json({ fatal: `Debes ser ${rol}` });
        }

        next();
    };
};

module.exports = { checkToken, addTimeStamp, checkRol };
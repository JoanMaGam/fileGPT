const router = require('express').Router();
const usersController = require('../../controllers/usersController');
const { checkToken, checkRol } = require('../../helpers/middlewares');

// Rutas públicas
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser);

// Rutas protegidas para usuario logado
router.post('/profile', checkToken, usersController.profile);
router.post('/getUserByEmail', checkToken, usersController.getUserByEmail);
router.put('/updateUserByEmail', checkToken, usersController.updateUserByEmail);
router.put('/updatePassword', checkToken, usersController.updatePassword);

// Rutas protegidas para usuario logado de rol 'admin'
router.get('/users', checkToken, checkRol('admin'), usersController.getAllUsers);
router.delete('/deleteUserByEmail', checkToken, checkRol('admin'), usersController.deleteUserByEmail);



module.exports = router;

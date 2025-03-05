const router = require('express').Router();
const usersController = require('../../controllers/usersController');
const { checkToken, checkRol } = require('../../helpers/middlewares');

router.get('/',/*  checkToken, checkRol('admin'), */ usersController.getAllUsers);
router.post('/addUser', checkToken, checkRol('admin'), usersController.createUser);
router.post('/getUserByEmail', checkToken, checkRol('admin'), usersController.getUserByEmail);
router.put('/updateUserByEmail', checkToken, checkRol('admin'), usersController.updateUserByEmail);
router.delete('/deleteUserByEmail', checkToken, checkRol('admin'), usersController.deleteUserByEmail);
router.post('/profile', checkToken, usersController.profile);

router.post('/login', usersController.loginUser);

module.exports = router;

const router = require('express').Router();
const usersController = require('../../controllers/usersController')

router.get('/', usersController.getAllUsers);


module.exports = router;

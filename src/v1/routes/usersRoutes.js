const router = require('express').Router();
const usersController = require('../../controllers/usersController')

router.get('/', usersController.getAllUsers);
router.post('/addUser', usersController.createUser);

module.exports = router;

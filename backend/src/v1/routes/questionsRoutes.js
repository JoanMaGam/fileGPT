const router = require('express').Router();
const questionsController = require('../../controllers/questionsController');
const { checkToken, checkRol } = require('../../helpers/middlewares');

// Rutas protegidas para usuario logado
router.post('/getQuestionsByUserId', checkToken, questionsController.getQuestionsByUserId);
router.post('/getQuestionsByDocumentId', checkToken, questionsController.getQuestionsByDocumentId);
router.post('/insertQuestion', checkToken, questionsController.insertQuestion);
router.delete('/deleteQuestionById', checkToken, questionsController.deleteQuestionById);

// Rutas protegidas para usuario logado de rol 'admin'
router.get('/questions', checkToken, checkRol('admin'), questionsController.getAllQuestions);

module.exports = router;


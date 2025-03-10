const router = require('express').Router();
const documentsController = require('../../controllers/documentsController');
const { checkToken, checkRol } = require('../../helpers/middlewares');

// Rutas protegidas para usuario logado
router.post('/getDocumentsByUserId', checkToken, documentsController.getDocumentsByUserId);
router.post('/insertDocument', checkToken, documentsController.insertDocument);
router.delete('/deleteDocumentById', checkToken, documentsController.deleteDocumentById);

// Rutas protegidas para usuario logado de rol 'admin'
router.get('/documents', checkToken, checkRol('admin'), documentsController.getAllDocuments);

module.exports = router;


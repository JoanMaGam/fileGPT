// src/v1/routes/aiRoutes.js
const router = require('express').Router();
const { processFile, askAI, upload } = require('../../controllers/aiController');
const { checkToken } = require('../../helpers/middlewares');

// Ruta para cargar un archivo
router.post('/upload', checkToken, upload.single('file'), processFile);

// Ruta para hacer preguntas a la IA
router.post('/ask', checkToken, askAI);

module.exports = router;

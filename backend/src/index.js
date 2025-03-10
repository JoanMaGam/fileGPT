const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { addTimeStamp } = require("./helpers/middlewares");

const v1UsersRouter = require('./v1/routes/usersRoutes');
const v1DocumentsRouter = require('./v1/routes/documentsRoutes');
const v1QuestionsRouter = require('./v1/routes/questionsRoutes');

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("<h1>FileGPT API</h1>");
});

app.use('/api/v1/users', addTimeStamp, v1UsersRouter);
app.use('/api/v1/documents', addTimeStamp, v1DocumentsRouter);
app.use('/api/v1/questions', addTimeStamp, v1QuestionsRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en el puerto: ${PORT}`);
});

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const v1UsersRouter = require('./v1/routes/usersRoutes');
const { addTimeStamp } = require("./helpers/middlewares");

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", addTimeStamp, (req, res) => {
    res.send("<h1>FileGPT API</h1>");
});

app.use('/api/v1/users', addTimeStamp, v1UsersRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en el puerto: ${PORT}`);
});

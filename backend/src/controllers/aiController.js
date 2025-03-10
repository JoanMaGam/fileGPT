// src/controllers/aiController.js
const pdfParse = require('pdf-parse');
const { index } = require('../config/aiConfig');
const multer = require('multer');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
// const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
// const langchain = require("langchain");
// const OpenAI = langchain.OpenAI;
const { loadQAStuffChain } = require("langchain/chains");
const fs = require("fs");

// Configurar almacenamiento temporal del archivo en memoria
const upload = multer({ storage: multer.memoryStorage() });


// Controlador para procesar el archivo
const processFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log('No se ha enviado ningún archivo');

            return res.status(400).json({ message: "No se ha enviado ningún archivo." });
        }

        // Guardar el archivo temporalmente
        const filePath = `./uploads/${req.file.originalname}`;
        fs.writeFileSync(filePath, req.file.buffer);

        // // Cargar el PDF y extraer texto
        // const loader = new PDFLoader(filePath);
        // const docs = await loader.load();

        // Cargar y procesar el PDF utilizando pdf-parse
        const pdfData = await pdfParse(req.file.buffer);
        const docs = pdfData.text;

        // Dividir en chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docChunks = await textSplitter.splitDocuments(docs);

        // Generar embeddings con OpenAI
        const embeddings = new OpenAIEmbeddings();
        const vectors = await embeddings.embedDocuments(docChunks.map((chunk) => chunk.pageContent));

        // Subir los embeddings a Pinecone
        const upsertRequest = vectors.map((vector, index) => ({
            id: `doc-${Date.now()}-${index}`,
            values: vector,
        }));
        await index.upsert(upsertRequest);

        console.log('Archivo procesado y almacenado en Pinecone con éxito');

        res.json({ message: "Archivo procesado y almacenado en Pinecone con éxito" });
    } catch (error) {
        console.error("Error procesando el archivo:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

const askAI = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Se requiere una pregunta." });
        }

        // Crear el modelo de lenguaje
        const llm = new OpenAI({ modelName: "text-embedding-3-small" });
        const chain = loadQAStuffChain(llm);

        // Buscar los documentos más similares en Pinecone
        const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
        const searchResults = await index.query({
            vector: queryEmbedding,
            topK: 3, // Número de documentos relevantes a recuperar
            includeMetadata: true,
        });

        if (!searchResults.matches.length) {
            return res.json({ result: "No se encontraron documentos relevantes." });
        }

        // Generar respuesta con la IA
        const response = await chain.call({
            input_documents: searchResults.matches.map((match) => match.metadata.text),
            question,
        });

        res.json({ result: response.text });
    } catch (error) {
        console.error("Error al procesar la pregunta:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
// // Ruta de carga de archivos
// const processFile = async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
//         const fileBuffer = req.file.buffer;
//         let text = '';

//         if (req.file.mimetype === 'application/pdf') {
//             const pdfData = await pdfParse(fileBuffer);
//             text = pdfData.text;
//         } else if (req.file.mimetype === 'text/plain') {
//             text = fileBuffer.toString();
//         }

//         // Indexar el texto en Pinecone
//         const response = await index.upsert({
//             vectors: [{
//                 id: 'document_id',
//                 values: text.split(' '), // Convierte el texto en vectores
//             }]
//         });

//         res.status(200).json({ message: 'Archivo procesado correctamente', data: response });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error procesando el archivo' });
//     }
// };

// // Ruta de consulta a IA
// const askAI = async (req, res) => {
//     const userQuestion = req.body.question;
//     try {
//         const queryResponse = await index.query({
//             vector: userQuestion.split(' '),
//             topK: 1,
//         });

//         if (!queryResponse.matches || queryResponse.matches.length === 0) {
//             const openAIResponse = await openai.createCompletion({
//                 model: 'text-davinci-003',
//                 prompt: `Respuesta a la pregunta: ${userQuestion}`,
//                 max_tokens: 150,
//             });
//             return res.status(200).json({ answer: openAIResponse.data.choices[0].text });
//         }

//         const matchedText = queryResponse.matches[0].metadata.text;
//         res.status(200).json({ answer: matchedText });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error procesando la solicitud' });
//     }
// };

module.exports = { processFile, askAI, upload };

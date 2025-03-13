const pdfParse = require('pdf-parse');
const { index, openai } = require('../config/aiConfig');
const multer = require('multer');
const { serverLogs } = require('../helpers/utils');


// Configurar almacenamiento temporal del archivo en memoria
const upload = multer({ storage: multer.memoryStorage() });


/**
 * 
 * @brief Procesar un archivo PDF subido, extraer su texto, dividirlo en "chunks",
 * generar embeddings utilizando la API de OpenAI, y luego subir esos embeddings a Pinecone
 * @param {Object} req.file - Archivo subido en el frontend
 * @returns  - Confirmación de la operación.
 */
const processFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No se ha enviado ningún archivo." });
        }

        // Cargar y procesar el PDF a texto utilizando pdf-parse 
        const pdfData = await pdfParse(req.file.buffer);
        const extractedText = pdfData.text;

        // Dividir el texto en chunks "trocitos"
        let docChunks = splitTextIntoChunksWithOverlap(extractedText);

        // Si los chunks no son un array o son un array de un elemento, los convierto a array de varios elementos
        if (Array.isArray(docChunks) && docChunks.length === 1 && typeof docChunks[0] === "string") {
            docChunks = docChunks[0].split("\n").filter(line => line.trim() !== "");
        }

        // Verifico que los chunks son un array y tienen contenido
        if (!docChunks || !Array.isArray(docChunks) || docChunks.length === 0) {
            res.status(500).json({ message: "Error al procesar el archivo" });
        }

        if (!Array.isArray(docChunks) || docChunks.some(chunk => typeof chunk !== "string")) {
            res.status(500).json({ message: "Error al procesar el archivo" });
        }

        const MAX_TOKENS = 200; // Ajusta el maximo de tokens según el modelo
        docChunks = docChunks.map(chunk => chunk.substring(0, MAX_TOKENS));

        // Generar embeddings con OpenAI 
        const vectors = await getEmbeddings(docChunks);

        // Subir los embeddings a Pinecone 
        const upsertRequest = vectors.map((vector, idx) => {
            // Asegurarnos de que el docChunk no esté vacío o undefined
            const text = docChunks[idx]?.trim() ? docChunks[idx] : 'Texto no disponible (vacío o no extraído)';

            return {
                id: `doc-${Date.now()}-${idx}`,
                values: vector,
                metadata: {
                    text: text,
                    filename: req.file.originalname
                }
            }
        });

        // Verificamos si el upsertRequest es un array válido
        if (!Array.isArray(upsertRequest) || upsertRequest.length === 0) {
            return res.status(500).json({ message: "Error al procesar el archivo" });
        }

        // Verifica si cada vector es un array de números
        vectors.forEach((vector) => {
            if (!Array.isArray(vector) || vector.some(isNaN)) {
                return res.status(500).json({ message: "Error al procesar el archivo" });
            }
        });

        if (docChunks.length !== vectors.length) {
            return res.status(500).json({ message: "Error al procesar el archivo" });
        }

        // Almacenamos los vectores en la base de datos vectorial de Pinecone
        await index.upsert(upsertRequest);

        await serverLogs(req, `Archivo procesado y almacenado en Pinecone con éxito`);
        res.status(200).json({ message: "Archivo procesado y almacenado en Pinecone con éxito" });

    } catch (error) {
        await serverLogs(req, error?.message || error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};



/**
 * 
 * @brief Divide un texto en fragmentos pequeños, asegurando que cada uno no exceda un tamaño máximo y con superposición de contexto.
 * @param {string} text - El texto que se va a dividir en fragmentos.
 * @param {number} maxChunkSize - El tamaño máximo permitido para cada fragmento (por defecto 200 caracteres).
 * @param {number} overlapSize - El tamaño de la superposición entre fragmentos (por defecto 20 caracteres).
 * 
 * @returns {Array<string>} Un array de fragmentos del texto, cada uno con un tamaño máximo de `maxChunkSize`.
 */
function splitTextIntoChunksWithOverlap(text, maxChunkSize = 200, overlapSize = 20) {
    // Divide el texto en oraciones utilizando expresiones regulares.
    const sentences = text.split(/(?<=\S[.!?])\s+/);

    const chunks = [];
    let currentChunk = "";

    sentences.forEach(sentence => {
        // Si agregar la oración excede el tamaño máximo, comienza un nuevo fragmento y agrega superposición
        if ((currentChunk + sentence).length > maxChunkSize) {
            // Agrega superposición si es posible (superpone los últimos 20 caracteres)
            let overlap = currentChunk.slice(-overlapSize);
            chunks.push(currentChunk); // Agrega el fragmento anterior
            currentChunk = overlap + sentence; // Comienza el nuevo fragmento con la superposición
        } else {
            // De lo contrario, simplemente agrega la oración al fragmento actual
            if (currentChunk) {
                currentChunk += " ";
            }
            currentChunk += sentence;
        }
    });

    // Agrega el último fragmento
    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

/**
 * 
 * Función para obtener los embeddings de un array de textos utilizando la API de OpenAI.
 * Si OpenAI no devuelve un embedding válido, se inserta un vector de ceros de tamaño 1536.
 * @param {Array<string>} texts - Array de textos a convertir en embeddings.
 * @returns {<Array<Array<number>>>} - Array de embeddings generados, 
 * cada uno representado como un vector de números.
 */
async function getEmbeddings(texts) {
    const embeddings = [];

    // Itera sobre cada texto en el array de textos
    for (const text of texts) {
        try {
            // Llama a la API de OpenAI para obtener el embedding del texto
            const response = await openai.embeddings.create({
                model: "text-embedding-3-small",  // Modelo utilizado para obtener los embeddings
                input: text
            });

            // Verifica si OpenAI ha devuelto una respuesta válida, sino inserta un vector de ceros
            if (!response.data || response.data.length === 0) {
                embeddings.push(Array(1536).fill(0));
                continue;
            }

            // Agrega el embedding válido al array de embeddings
            embeddings.push(response.data[0].embedding);

        } catch (error) {
            throw error;
        }
    }

    // Devuelve los embeddings
    return embeddings;
}



/**
 * 
 * @brief Procesa una consulta, busca documentos relevantes y genera una respuesta basada en ellos.
 * @param {string} req.body.query - Pregunta del usuario recibida del frontend
 * @returns - Respuesta generada.
 */
const ask = async (req, res) => {

    // Validamos datos
    const { query } = req.body;

    if (!query) {
        res.status(400).send({
            status: "FAILED",
            data: { error: "La clave 'query' no existe o está vacía en el cuerpo de la petición" },
        });
        return;
    };

    try {
        // Llamamos a la función que consulta la base de datos vectorial y nos devuelve una respuesta
        const answer = await queryDocuments(query.query);

        await serverLogs(req, `Respuesta obtenida correctamente`);
        res.status(200).send({ status: "OK", data: answer });
    } catch (error) {
        await serverLogs(req, error?.message || error);
        res
            .status(error?.status || 500)
            .send({ status: "FAILED", data: { error: error?.message || error } });
    }
}


/**
 * Consulta documentos en Pinecone utilizando un embedding generado a partir de una consulta
 * y genera una respuesta utilizando el modelo GPT-4o-mini basado en el contexto encontrado.
 * 
 * 1. Primero, genera un embedding para la consulta proporcionada utilizando el modelo 
 *    "text-embedding-3-small" de OpenAI.
 * 2. Luego, realiza una búsqueda en el índice de Pinecone para encontrar documentos 
 *    relevantes que coincidan con el embedding generado.
 * 3. Se extraen los textos más relevantes de los documentos encontrados en Pinecone.
 * 4. Se crea un prompt que incluye los textos más relevantes como contexto para la 
 *    pregunta del usuario.
 * 5. Se utiliza el modelo GPT-4o-mini para generar una respuesta basándose en el contexto 
 *    proporcionado.
 * 6. La respuesta generada es devuelta al usuario.
 *
 * @param {string} query -  La pregunta que se desea hacer.
 * @param {number} [topK=5] - El número de documentos similares que se desean recuperar de Pinecone. 5 por defecto.
 * 
 * @returns {string} La respuesta generada por GPT-4o-mini, basada únicamente en el contexto de los 
 *                  documentos relevantes encontrados en Pinecone.
 */
const queryDocuments = async (query, topK = 5) => {
    try {
        // Generamos el embedding para la consulta
        const queryEmbeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query,
            encoding_format: "float"
        });
        const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

        // Consultamos Pinecone para encontrar documentos similares
        const queryResponse = await index.query({
            vector: queryEmbedding, // Embedding generado para la pregunta
            topK, // Número de resultados a recuperar
            includeMetadata: true // Esto asegura que también se obtiene el metadata, que incluye el texto
        });

        // Extraemos el texto de los documentos más relevantes
        const contexts = queryResponse.matches.map(match => match.metadata.text);

        // Construimos el prompt para OpenAI
        const prompt = `
        Contexto: ${contexts.join('\n\n')}
         Pregunta: ${query} Por favor, responde a la pregunta basándote únicamente en el contexto proporcionado. Si la información no está disponible en el contexto, indica que no puedes responder con la información disponible.
         `;

        // Generamos la respuesta con ChatGPT
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
                role: "system",
                content: "Eres un asistente experto que responde preguntas basándose únicamente en el contexto proporcionado."
            },
            {
                role: "user",
                content: prompt
            }],
            max_tokens: 500
        });

        // Devlovemos la respuesta
        const answer = completion.choices[0].message.content;
        return answer;

    } catch (error) {
        throw error;
    }
}

module.exports = { processFile, ask, upload };
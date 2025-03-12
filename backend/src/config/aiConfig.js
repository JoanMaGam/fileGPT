const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// Configuramos Openai con el token de 'OPENAI_API_KEY'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configuramos Pinecone con los tokens de 'PINECONE_API_KEY' y 'PINECONE_INDEX'
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);


module.exports = { openai, pinecone, index };

// const { OpenAIApi } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// const openai = new OpenAIApi({
//     apiKey: process.env.OPENAI_API_KEY,
//     // modelName: 'text-embedding-3-small'
// });


const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

module.exports = { /* openai, */ index };

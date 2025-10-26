const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const bubbleAIIndex = pc.Index("bubble-ai");

async function createMemory({ messageId, vector, metadata }) {
  await bubbleAIIndex.upsert([{
    id: messageId,
    values: vector,
    metadata,
  }]);
}

async function queryMemory({ vector, limit, metadata }) {
  const data = await bubbleAIIndex.query({
    vector: vector,
    topK: limit,
    filter: metadata || undefined,
    includeMetadata: true,
  });
  return data.matches;
}

module.exports = {
  createMemory,
  queryMemory,
};

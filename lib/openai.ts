import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });
  return response.data[0].embedding;
}

export async function generateResponse(prompt, context) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a helpful AI assistant. Answer questions using ONLY the provided context. If you cannot answer from the context, say "I don't have that information." Context: ${context}`
      },
      { role: 'user', content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.3
  });
  return response.choices[0].message.content;
}
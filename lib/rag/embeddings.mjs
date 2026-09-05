import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function embedText(text) {
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  });
  return result.embeddings?.[0]?.values || result.embedding?.values || [];
}
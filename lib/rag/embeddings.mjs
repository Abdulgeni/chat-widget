import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function embedText(text) {
  const result = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  // Defensive: SDK response shape has varied slightly across versions.
  return result.embeddings?.[0]?.values || result.embedding?.values || [];
}
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateEmbedding(text: string): Promise<number[]> {
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  return Array(384).fill(0).map((_, i) => Math.sin(hash + i) * 0.1);
}

export async function generateResponse(prompt: string, context: string): Promise<string> {
  const fullPrompt = `You are a helpful, friendly AI customer support assistant. Be conversational and engaging. Answer all questions naturally and helpfully.

Business Context: ${context || 'General business inquiries'}

User: ${prompt}

Assistant:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
  });

  return response.text || 'Sorry, I could not generate a response. Please try again.';
}
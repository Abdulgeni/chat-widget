import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function* streamReply(userText, context) {
  const prompt = context
    ? `Use the following context from an uploaded document to help answer, if relevant. If the context doesn't help, answer normally.\n\nContext:\n${context}\n\nQuestion: ${userText}`
    : userText;

  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  for await (const chunk of stream) {
    const parts = chunk.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) yield part.text;
    }
  }
}
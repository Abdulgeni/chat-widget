import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Async generator: yields text deltas as they arrive from the model.
// NOTE: we read chunk.candidates[...].content.parts directly instead of
// the chunk.text convenience getter — that getter throws internally
// ("text is not defined") in some @google/genai versions.
export async function* streamReply(userText) {
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: userText,
  });

  for await (const chunk of stream) {
    const parts = chunk.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) yield part.text;
    }
  }
}
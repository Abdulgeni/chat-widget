import { ChromaClient } from 'chromadb';
import { generateEmbedding } from './openai';

let client: ChromaClient | null = null;
let collection: any = null;

export async function initVectorDB() {
  client = new ChromaClient({ path: 'http://localhost:8000' });
  try {
    collection = await client.getCollection({ name: 'chat_knowledge' });
  } catch {
    collection = await client.createCollection({ name: 'chat_knowledge' });
  }
  return collection;
}

export async function addToKnowledge(text: string, metadata: any = {}): Promise<number> {
  if (!collection) await initVectorDB();
  
  const chunks = text.split('\n\n').filter(c => c.trim().length > 50);
  
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    await collection.add({
      ids: [`chunk_${Date.now()}_${i}`],
      embeddings: [embedding],
      documents: [chunks[i]],
      metadatas: [{ ...metadata, chunkIndex: i }]
    });
  }
  return chunks.length;
}

export async function searchKnowledge(query: string, topK: number = 3): Promise<string[]> {
  if (!collection) await initVectorDB();
  
  const queryEmbedding = await generateEmbedding(query);
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  });
  
  return results.documents[0] || [];
}
export async function loadDefaultKnowledge() {
  if (!collection) await initVectorDB();
  
  const existingDocs = await collection.count();
  if (existingDocs > 0) return;
  
  try {
    const response = await fetch('/knowledge.txt');
    const text = await response.text();
    await addToKnowledge(text, { source: 'default_knowledge' });
    console.log('Default knowledge loaded');
  } catch (error) {
    console.log('Could not load default knowledge');
  }
}
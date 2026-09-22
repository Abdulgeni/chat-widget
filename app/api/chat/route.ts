import { NextResponse } from 'next/server';
import { searchKnowledge, loadDefaultKnowledge } from '@/lib/rag';
import { generateResponse } from '@/lib/openai';

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    await loadDefaultKnowledge();
    const relevantDocs = await searchKnowledge(message);
    const context = relevantDocs.length > 0 ? relevantDocs.join('\n\n') : 'No specific business information found.';
    const reply = await generateResponse(message, context);
    
    return NextResponse.json({ reply, sources: relevantDocs.length }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again.' },
      { 
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}
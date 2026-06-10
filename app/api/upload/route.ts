import { NextResponse } from 'next/server';
import { addToKnowledge } from '@/lib/rag';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }
    
    const text = await file.text();
    const chunkCount = await addToKnowledge(text, {
      filename: file.name,
      uploadedAt: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      filename: file.name,
      chunks: chunkCount
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
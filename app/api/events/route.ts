import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId') || 'unknown';

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      send({ type: 'connected', payload: { sessionId }, timestamp: Date.now(), sessionId });

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keep-alive\n\n'));
      }, 25000);

      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
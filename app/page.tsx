'use client';
import { useEffect, useState } from 'react';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Chatbot Demo</h1>
        <p className="text-gray-600">The chat widget is in the bottom-right corner.</p>
        <p className="text-gray-500 mt-2">
          {loaded ? '✅ Ready — ask a question!' : 'Loading...'}
        </p>
      </div>
      <ChatWidget />
    </main>
  );
}
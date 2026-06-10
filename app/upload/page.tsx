'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }
    setLoading(true);
    setStatus('Uploading...');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.error) {
        setStatus(`❌ ${data.error}`);
      } else {
        setStatus(`✅ Success! ${data.chunks} chunks added.`);
      }
    } catch (error) {
      setStatus('❌ Upload failed. Try again.');
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">📚 Knowledge Base Upload</h1>
        <p className="text-gray-500 mb-6">Upload documents to train your AI chatbot.</p>
        
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-3 border rounded-lg mb-4 text-gray-700"
        />
        
        {file && (
          <p className="text-sm text-gray-500 mb-4">Selected: {file.name}</p>
        )}
        
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-700"
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
        
        {status && (
          <p className="mt-4 text-center text-sm font-medium">{status}</p>
        )}
      </div>
    </main>
  );
}
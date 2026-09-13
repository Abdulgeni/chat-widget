'use client';
import { useState, useEffect } from 'react';

interface Config {
  appId: string;
  allowedDomains: string[];
  theme: { primaryColor?: string };
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [appId, setAppId] = useState('');
  const [domains, setDomains] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [error, setError] = useState('');

  async function loadConfigs(s: string) {
    const res = await fetch('/api/admin/configs', { headers: { 'x-admin-secret': s } });
    if (res.status === 401) {
      setError('Incorrect admin secret');
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setConfigs(data.configs);
    setAuthed(true);
    setError('');
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('adminSecret');
    if (saved) {
      setSecret(saved);
      loadConfigs(saved);
    }
  }, []);

  async function handleLogin() {
    sessionStorage.setItem('adminSecret', secret);
    await loadConfigs(secret);
  }

  async function handleCreate() {
    if (!appId.trim() || !domains.trim()) return;
    const allowedDomains = domains.split(',').map((d) => d.trim()).filter(Boolean);
    await fetch('/api/admin/configs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ appId, allowedDomains, primaryColor: color }),
    });
    setAppId('');
    setDomains('');
    setColor('#4f46e5');
    loadConfigs(secret);
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete config for "${id}"? Any site using this appId will stop working.`)) return;
    await fetch('/api/admin/configs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ appId: id }),
    });
    loadConfigs(secret);
  }

  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: 320 }}>
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>Admin Login</h1>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db', marginBottom: 10 }}
          />
          <button onClick={handleLogin} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Log in
          </button>
          {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>}
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', padding: 32, fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>Widget Client Configs</h1>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, marginBottom: 12 }}>Add new client</h2>
        <input
          placeholder="appId (e.g. acme-corp)"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
        />
        <input
          placeholder="Allowed domains, comma-separated (e.g. https://acme.com, https://www.acme.com)"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, borderRadius: 6, border: '1px solid #d1d5db' }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Theme color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <button onClick={handleCreate} style={{ padding: '8px 16px', borderRadius: 6, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Save client
        </button>
      </div>

      <h2 style={{ fontSize: 15, marginBottom: 12 }}>Existing clients ({configs.length})</h2>
      {configs.map((c) => (
        <div key={c.appId} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{c.appId}</strong>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{c.allowedDomains.join(', ')}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: c.theme.primaryColor }} />
            <button onClick={() => handleDelete(c.appId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 13 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
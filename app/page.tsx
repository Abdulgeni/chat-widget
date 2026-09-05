export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chat Widget Backend</h1>
        <p style={{ color: '#6b7280' }}>
          This server hosts the widget assets and API. See <code>/api/health</code> to confirm it's running,
          or open <code>test.html</code> to try the embedded widget.
        </p>
      </div>
    </main>
  );
}
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { API, APP_URL } from '../../lib/config';


export default function Statements() {
  const router = useRouter();
  const [statements, setStatements] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchStatements(token);
  }, []);

  const fetchStatements = async (token: string) => {
    try {
      const res = await fetch(`${API}/statements`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setStatements(json.statements || []);
    } catch (e) { console.error(e); }
  };

  const upload = async (file: File) => {
    console.log('Uploading:', file.name, file.type);
    if (file.type !== 'application/pdf') { setError('Please upload a PDF file'); return; }
    setUploading(true); setError(''); setSuccess(null);
    const token = localStorage.getItem('token')!;
    const fd = new FormData();
    fd.append('statement', file);
    try {
      const res = await fetch(`${API}/statements/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setSuccess(json);
      fetchStatements(token);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>M-Pesa Statements</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Upload your PDF statements</p>
          </div>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          style={{ border: '2px dashed rgba(0,232,122,0.4)', borderRadius: '16px', padding: '48px', textAlign: 'center', cursor: 'pointer', marginBottom: '24px', background: 'rgba(0,232,122,0.03)' }}>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          {uploading ? (
            <div>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
              <p style={{ fontWeight: 700, fontSize: '18px' }}>Processing your statement...</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Click to upload M-Pesa PDF</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>PDF only · Max 10MB</p>
            </div>
          )}
        </div>

        {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '10px', padding: '16px', color: '#ff5050', marginBottom: '16px' }}>{error}</div>}

        {success && (
          <div style={{ background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ fontWeight: 700, color: '#00E87A' }}>✅ Statement uploaded successfully!</p>
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Uploaded Statements ({statements.length})</h3>
          {statements.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>No statements yet</p>
          ) : (
            statements.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>{s.filename || s.original_name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{new Date(s.created_at).toLocaleDateString()}</p>
                </div>
                <span style={{ background: 'rgba(0,232,122,0.15)', color: '#00E87A', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, height: 'fit-content' }}>✓ Done</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

export default function FamilyCode() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [hint, setHint] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existing, setExisting] = useState<any>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyUserId, setVerifyUserId] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchExisting(token);
  }, []);

  const fetchExisting = async (token: string) => {
    try {
      const res = await fetch(`${API}/shield/family-code`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.code) { setExisting(json.code); setCode(json.code.code); setHint(json.code.hint || ''); }
    } catch (e) { console.error(e); }
  };

  const save = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    if (!code || code.length < 4) { alert('Code must be at least 4 characters'); return; }
    setSaving(true);
    try {
      await fetch(`${API}/shield/family-code`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, hint }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchExisting(token);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .family-pad{padding:20px 16px!important;} .family-grid{grid-template-columns:1fr!important;} }`}</style>

      <div style={{ background: 'rgba(0,232,122,0.05)', borderBottom: '1px solid rgba(0,232,122,0.15)', padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => router.push('/shield')} style={{ background: 'none', border: 'none', color: '#00E87A', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ fontWeight: 800, fontSize: '18px' }}>👨‍👩‍👧 Family Safety Code</h1>
      </div>

      <div className="family-pad" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'rgba(0,232,122,0.08)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '14px', padding: '16px', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            <strong style={{ color: '#00E87A' }}>How it works:</strong> Set a secret code and share it only with your real family members. If someone calls or texts claiming to be your family member and asks for money urgently, ask for the code. A scammer cannot provide it. Fraud stopped instantly.
          </p>
        </div>

        <div className="family-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Set Code */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '15px' }}>🔐 Set Your Family Code</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '20px' }}>Requires PesaMind account</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Secret Code (min 4 characters)</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. MANGO2024 or KIBOKO"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#00E87A', fontSize: '18px', outline: 'none', fontWeight: 800, letterSpacing: '2px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Memory Hint (optional, only you see this)</label>
                <input type="text" value={hint} onChange={e => setHint(e.target.value)} placeholder="e.g. Our family pet's name"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px', outline: 'none' }} />
              </div>
              <button onClick={save} disabled={saving}
                style={{ background: '#00E87A', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '14px' }}>
                {saving ? '⏳ Saving...' : saved ? '✅ Saved!' : existing ? '🔄 Update Code' : '🔐 Save Code'}
              </button>
            </div>

            {existing && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Current code:</p>
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#00E87A', letterSpacing: '3px' }}>{existing.code}</p>
                {existing.hint && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Hint: {existing.hint}</p>}
              </div>
            )}
          </div>

          {/* How to use */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>📖 How to Use It</h3>
            {[
              { step: '1', title: 'Set your code', desc: 'Choose a word or phrase only your family knows' },
              { step: '2', title: 'Share with family', desc: 'Tell your real family members the code privately' },
              { step: '3', title: 'Get suspicious call?', desc: '"Prove you\'re really [family name] — what\'s our family code?"' },
              { step: '4', title: 'They can\'t answer?', desc: 'It\'s a scammer. Hang up and block the number immediately.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: 'rgba(0,232,122,0.15)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#00E87A', fontSize: '12px', flexShrink: 0 }}>{s.step}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '3px' }}>{s.title}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}

            <div style={{ padding: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', marginTop: '8px' }}>
              <p style={{ fontSize: '12px', color: '#F59E0B', lineHeight: 1.5 }}>⚠️ Never share your family code with anyone outside your immediate family. Change it if you suspect it has been compromised.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
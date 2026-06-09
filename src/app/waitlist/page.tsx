'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://api.pesamind.online/api';

function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="20" fill="#00E87A"/>
      <rect x="13" y="48" width="10" height="20" rx="2" fill="#003D20"/>
      <rect x="27" y="38" width="10" height="30" rx="2" fill="#003D20"/>
      <rect x="41" y="28" width="10" height="40" rx="2" fill="#003D20"/>
      <rect x="55" y="35" width="10" height="33" rx="2" fill="#003D20"/>
      <polyline points="18,47 32,32 46,20 60,28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="60" cy="28" r="3.5" fill="white"/>
    </svg>
  );
}

export default function Waitlist() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', name: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/admin/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to join');
      setSuccess(true);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      
      {/* Nav */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
    <Logo size={32} />
    <span style={{ fontWeight: 800, fontSize: '18px' }}>PesaMind</span>
  </div>
  <div style={{ display: 'flex', gap: '10px' }}>
    <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
      ← Dashboard
    </button>
    <button onClick={() => router.push('/login')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
      Sign In
    </button>
  </div>
</div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>You're on the list!</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                Thanks for joining the PesaMind waitlist. We'll notify you at <strong style={{ color: '#00E87A' }}>{form.email}</strong> when your spot is ready.
              </p>
              <div style={{ background: 'rgba(0,232,122,0.08)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                  While you wait, share PesaMind with friends who manage M-Pesa finances. Every referral moves you up the list! 🇰🇪
                </p>
              </div>
              <button onClick={() => router.push('/')} style={{ background: '#00E87A', color: '#000', padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '16px' }}>
                Back to Home →
              </button>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'inline-block', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#00E87A', fontWeight: 600, marginBottom: '20px' }}>
                  🔒 Limited Beta Access
                </div>
                <h1 style={{ fontSize: '40px', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px' }}>
                  Join the<br /><span style={{ color: '#00E87A' }}>PesaMind Beta</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7 }}>
                  Be among the first Kenyans to get AI-powered M-Pesa insights. Limited spots available.
                </p>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '40px' }}>
                {[
                  { value: '1,953+', label: 'Transactions analyzed' },
                  { value: 'KSH 303K', label: 'Income tracked' },
                  { value: '🇰🇪', label: 'Built for Kenya' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, color: '#00E87A', fontSize: '18px' }}>{s.value}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px' }}>
                {error && (
                  <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '10px', padding: '12px', color: '#ff5050', marginBottom: '20px', fontSize: '14px' }}>{error}</div>
                )}
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Kamau"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Why do you want access?</label>
                    <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="I want to track my M-Pesa spending and save more..."
                      rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'system-ui' }} />
                  </div>
                  <button type="submit" disabled={loading} style={{ background: '#00E87A', color: '#000', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '16px', marginTop: '8px' }}>
                    {loading ? '⏳ Joining...' : '🚀 Join the Waitlist →'}
                  </button>
                </form>
              </div>

              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '20px' }}>
                No spam. We'll only email you when your access is ready.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

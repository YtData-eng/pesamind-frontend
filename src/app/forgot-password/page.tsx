'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://pesamind-backend.onrender.com/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.token) { setToken(json.token); setSent(true); }
      else setError(json.error || 'Failed');
    } catch (e) { setError('Failed to send reset request'); }
    finally { setLoading(false); }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetting(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword }),
      });
      const json = await res.json();
      if (res.ok) setDone(true);
      else setError(json.error || 'Failed');
    } catch (e) { setError('Failed to reset password'); }
    finally { setResetting(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Reset Password</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Enter your email to get a reset link</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px' }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Password reset!</p>
              <button onClick={() => router.push('/login')} style={{ background: '#00E87A', color: '#000', padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: '16px' }}>Sign In →</button>
            </div>
          ) : !sent ? (
            <form onSubmit={requestReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '12px', color: '#ff5050', fontSize: '13px' }}>{error}</div>}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={loading} style={{ background: '#00E87A', color: '#000', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '15px' }}>
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>
              <button type="button" onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>← Back to Login</button>
            </form>
          ) : (
            <form onSubmit={resetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(0,232,122,0.08)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#00E87A' }}>
                Reset token generated! In production this would be emailed.
              </div>
              {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '12px', color: '#ff5050', fontSize: '13px' }}>{error}</div>}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={resetting} style={{ background: '#00E87A', color: '#000', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '15px' }}>
                {resetting ? 'Resetting...' : 'Reset Password →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://pesamind-backend.onrender.com/api';

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

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (!data.token) throw new Error('No token received from server');

      // Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Confirm token saved
      console.log('Token saved:', localStorage.getItem('token'));
      console.log('User email:', data.user?.email);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Logo */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Logo size={36} />
        <span style={{ fontWeight: 800, fontSize: '20px', color: 'white' }}>PesaMind</span>
      </div>

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Sign in to your PesaMind account</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '36px 32px' }}>

          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#ff5050', marginBottom: '20px', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(0,232,122,0.5)' : 'linear-gradient(135deg,#00E87A,#00C4FF)', color: '#000', fontWeight: 800, fontSize: '15px' }}>
              {loading ? '⏳ Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#00E87A', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
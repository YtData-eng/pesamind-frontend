'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState('');

  // ─── Capture ref code from URL ───────────────────────────────
  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://pesamind-backend.onrender.com/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ─── Updated fetch body with ref code ───────────────
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone_number: form.phone_number,
          password: form.password,
          ref: new URLSearchParams(searchParams).get('ref') || ''
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#00E87A,#00C4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#050F09', fontSize: 18 }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>PesaMind</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>Create your free account</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FF6B6B', fontSize: 14 }}>
                {error}
              </div>
            )}
            {[
              { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com' },
              { label: 'Phone Number (optional)', name: 'phone_number', type: 'tel', placeholder: '0712 345 678' },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
              { label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: 'Repeat your password' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 500 }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.name !== 'phone_number'}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, fontSize: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(0,232,122,0.4)' : 'linear-gradient(135deg,#00E87A,#00C4FF)', color: '#050F09', fontWeight: 800, fontSize: 15, marginTop: 8 }}
            >
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#00E87A', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
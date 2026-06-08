'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { API, APP_URL } from '../../lib/config';


function Logo({ size = 32 }: { size?: number }) {
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

export default function Pricing() {
  const router = useRouter();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [checkoutId, setCheckoutId] = useState('');
  const [payStatus, setPayStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchPlan(token);
  }, []);

  const fetchPlan = async (token: string) => {
    try {
      const res = await fetch(`${API}/billing/plan`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setPlan(json);
    } catch (e) { console.error(e); }
  };

  const subscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/register'); return; }
    if (!phone) { setError('Enter your M-Pesa phone number'); return; }
    setPaying(true); setError('');
    try {
      const res = await fetch(`${API}/billing/subscribe`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Payment failed');
      setCheckoutId(json.checkout_request_id);
      setPayStatus('pending');
      // Poll for status
      pollStatus(json.checkout_request_id, token);
    } catch (e: any) { setError(e.message); }
    finally { setPaying(false); }
  };

  const pollStatus = async (id: string, token: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 12) { clearInterval(interval); setPayStatus('timeout'); return; }
      try {
        const res = await fetch(`${API}/billing/status/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.status === 'completed') {
          clearInterval(interval);
          setPayStatus('success');
          fetchPlan(token);
        } else if (json.status === 'failed') {
          clearInterval(interval);
          setPayStatus('failed');
        }
      } catch (e) { console.error(e); }
    }, 5000);
  };

  const features = {
    free: [
      { text: '1 statement upload', included: true },
      { text: '500 transactions analyzed', included: true },
      { text: 'Basic spending dashboard', included: true },
      { text: '1 AI summary per month', included: true },
      { text: '3 budget categories', included: true },
      { text: 'Basic fraud detection', included: true },
      { text: 'Unlimited uploads', included: false },
      { text: 'Unlimited AI summaries', included: false },
      { text: 'Advanced fraud detection', included: false },
      { text: 'Data export (CSV)', included: false },
      { text: 'Priority support', included: false },
    ],
    pro: [
      { text: 'Unlimited statement uploads', included: true },
      { text: 'Unlimited transactions', included: true },
      { text: 'Full spending dashboard', included: true },
      { text: 'Unlimited AI summaries', included: true },
      { text: 'Unlimited budget categories', included: true },
      { text: 'Advanced fraud detection', included: true },
      { text: 'Duplicate transaction alerts', included: true },
      { text: 'Spending spike alerts', included: true },
      { text: 'Data export (CSV)', included: true },
      { text: 'Priority support', included: true },
      { text: 'Monthly financial report', included: true },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <Logo size={32} />
          <span style={{ fontWeight: 800, fontSize: '18px' }}>PesaMind</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {plan?.is_pro && <span style={{ background: 'rgba(0,232,122,0.15)', color: '#00E87A', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>✓ Pro Active</span>}
          <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Dashboard</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#00E87A', fontWeight: 600, marginBottom: '20px' }}>
          Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px' }}>
          Choose your <span style={{ color: '#00E87A' }}>plan</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
          Start free. Upgrade when you're ready to unlock the full power of PesaMind.
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '20px 60px 60px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Free Plan */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Free</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900 }}>KSH 0</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Forever free</p>
          </div>

          <button onClick={() => router.push(localStorage.getItem('token') ? '/dashboard' : '/register')}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '28px' }}>
            {plan ? 'Current Plan' : 'Get Started Free'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {features.free.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px', color: f.included ? '#00E87A' : 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{f.included ? '✓' : '✕'}</span>
                <span style={{ fontSize: '14px', color: f.included ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(0,232,122,0.08), rgba(0,196,255,0.05))', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '20px', padding: '32px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#00E87A', color: '#000', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap' }}>
            MOST POPULAR
          </div>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#00E87A', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Pro</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, color: '#00E87A' }}>KSH 299</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>/month</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Billed monthly via M-Pesa</p>
          </div>

          {plan?.is_pro ? (
            <div style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', color: '#00E87A', fontWeight: 700, fontSize: '15px', textAlign: 'center', marginBottom: '28px' }}>
              ✓ You're on Pro — expires {new Date(plan.expires_at).toLocaleDateString()}
            </div>
          ) : (
            <div style={{ marginBottom: '28px' }}>
              {payStatus === 'success' ? (
                <div style={{ padding: '16px', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ color: '#00E87A', fontWeight: 700 }}>🎉 Payment successful! Pro activated!</p>
                  <button onClick={() => router.push('/dashboard')} style={{ marginTop: '12px', background: '#00E87A', color: '#000', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Go to Dashboard →</button>
                </div>
              ) : payStatus === 'pending' ? (
                <div style={{ padding: '16px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ color: '#F59E0B', fontWeight: 700 }}>⏳ Waiting for M-Pesa confirmation...</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>Check your phone and enter your M-Pesa PIN</p>
                </div>
              ) : (
                <>
                  {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '10px', color: '#ff5050', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XX XXX XXX"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }} />
                  <button onClick={subscribe} disabled={paying}
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#00E87A', color: '#000', fontWeight: 800, fontSize: '15px', cursor: paying ? 'not-allowed' : 'pointer' }}>
                    {paying ? '⏳ Sending STK Push...' : '🔒 Pay KSH 299 via M-Pesa'}
                  </button>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>Secure M-Pesa payment · Cancel anytime</p>
                </>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {features.pro.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px', color: '#00E87A', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 60px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>Common Questions</h2>
        {[
          { q: 'How does payment work?', a: 'You pay KSH 299 via M-Pesa STK Push — enter your number, we send a prompt, you enter your PIN. That\'s it.' },
          { q: 'Can I cancel anytime?', a: 'Yes. Your Pro plan runs for 30 days from payment date. Just don\'t renew to cancel.' },
          { q: 'Is my M-Pesa data secure?', a: 'Yes. We only read your statement PDF — we never access your M-Pesa account directly.' },
          { q: 'What happens when my Pro expires?', a: 'You\'ll drop to the Free plan. Your data stays safe — you just can\'t upload new statements until you renew.' },
        ].map((faq, i) => (
          <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontWeight: 700, marginBottom: '8px' }}>{faq.q}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={24} />
          <span style={{ fontWeight: 700 }}>PesaMind</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>© 2026 PesaMind · Built for Kenya 🇰🇪</p>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>Home</button>
      </div>
    </div>
  );
}
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#00E87A', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>₿</div>
          <span style={{ fontWeight: 800, fontSize: '20px' }}>PesaMind</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
          <button onClick={() => router.push('/register')} style={{ background: '#00E87A', border: 'none', color: '#000', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Get Started →</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '100px 60px 60px' }}>
        <div style={{ display: 'inline-block', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#00E87A', fontWeight: 600, marginBottom: '24px' }}>
          🇰🇪 Built for Kenya · Powered by AI
        </div>
        <h1 style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' }}>
          Know where your<br />
          <span style={{ color: '#00E87A' }}>M-Pesa goes</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Upload your M-Pesa statement and get instant AI-powered insights on your spending, budgets, and financial health.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/register')} style={{ background: '#00E87A', border: 'none', color: '#000', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '16px' }}>
            Start for Free →
          </button>
          <button onClick={() => router.push('/login')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '16px' }}>
            Sign In
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '60px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '48px' }}>Everything you need to <span style={{ color: '#00E87A' }}>take control</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '📊', title: 'Financial Dashboard', desc: 'See your income, expenses, savings rate and financial health score at a glance.' },
            { icon: '🤖', title: 'AI Insights', desc: 'Get personalized tips from AI that analyzes your M-Pesa spending patterns.' },
            { icon: '◎', title: 'Smart Budgets', desc: 'AI automatically creates budgets based on your spending history.' },
            { icon: '🛡️', title: 'Fraud Detection', desc: 'Detect suspicious transactions and protect yourself from M-Pesa scams.' },
            { icon: '📈', title: 'Spending Categories', desc: 'See exactly where your money goes — food, transport, utilities and more.' },
            { icon: '💯', title: 'Health Score', desc: 'Get a 0-100 financial health score updated every time you upload a statement.' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '80px 60px' }}>
        <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Ready to take control?</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '16px' }}>Join thousands of Kenyans managing their M-Pesa finances smarter.</p>
        <button onClick={() => router.push('/register')} style={{ background: '#00E87A', border: 'none', color: '#000', padding: '16px 48px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '18px' }}>
          Get Started Free →
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#00E87A', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>₿</div>
          <span style={{ fontWeight: 700 }}>PesaMind</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>© 2026 PesaMind. Built for Kenya 🇰🇪</p>
      </div>
    </div>
  );
}
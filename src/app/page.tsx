'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Logo({ size = 36 }: { size?: number }) {
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

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
  }, []);

  const handleFounderAccess = () => {
    const key = prompt('Enter founder key:');
    if (key === 'pesamind2026') router.push('/admin');
    else if (key !== null) alert('Invalid key');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <div className="landing-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <Logo size={36} />
          <span style={{ fontWeight: 800, fontSize: '20px' }}>PesaMind</span>
        </div>
        <div className="landing-nav-btns" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => router.push('/pricing')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Pricing</button>
          <button onClick={() => router.push('/waitlist')} style={{ background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', color: '#00E87A', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
            🚀 Join Waitlist
          </button>
          <button onClick={() => router.push('/shield')} style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
  🛡️ Fraud Shield
</button>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
          <button onClick={() => router.push('/register')} style={{ background: '#00E87A', border: 'none', color: '#000', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Get Started →</button>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero" style={{ textAlign: 'center', padding: '100px 60px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#00E87A', fontWeight: 600, marginBottom: '24px' }}>
          🇰🇪 Built for Kenya · Powered by AI
        </div>
        <h1 style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' }}>
          Know where your<br />
          <span style={{ color: '#00E87A' }}>Pesa goes</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Upload your M-Pesa statement and get instant AI-powered insights on your spending, budgets, and financial health score.
        </p>
        <div className="landing-hero-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/register')} style={{ background: '#00E87A', border: 'none', color: '#000', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '16px' }}>Start for Free →</button>
          <button onClick={() => router.push('/waitlist')} style={{ background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', color: '#00E87A', padding: '16px 40px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}>🚀 Join Waitlist</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="landing-stats" style={{ display: 'flex', justifyContent: 'center', gap: '60px', padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { value: '1,953+', label: 'Transactions Analyzed' },
          { value: 'KSH 303K', label: 'Income Tracked' },
          { value: '100%', label: 'Private & Secure' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#00E87A', marginBottom: '4px' }}>{s.value}</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="landing-features" style={{ padding: '80px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '48px' }}>
          Everything you need to <span style={{ color: '#00E87A' }}>take control</span>
        </h2>
        <div className="landing-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { icon: '📊', title: 'Financial Dashboard', desc: 'See your income, expenses, savings rate and financial health score at a glance.' },
            { icon: '🤖', title: 'AI Insights', desc: 'Get personalized tips from AI that analyzes your M-Pesa spending patterns.' },
            { icon: '◎', title: 'Smart Budgets', desc: 'AI automatically creates budgets based on your 3-month spending history.' },
            { icon: '🛡️', title: 'Fraud Detection', desc: 'Detect suspicious transactions and protect yourself from M-Pesa scams.' },
            { icon: '📈', title: 'Spending Categories', desc: 'See exactly where your money goes — food, transport, utilities and more.' },
            { icon: '💯', title: 'Health Score', desc: 'Get a 0-100 financial health score updated every time you upload a statement.' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,232,122,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="landing-how" style={{ padding: '60px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '48px' }}>
          How it <span style={{ color: '#00E87A' }}>works</span>
        </h2>
        <div className="landing-how-steps" style={{ display: 'flex', justifyContent: 'center', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { step: '01', title: 'Download Statement', desc: 'Get your M-Pesa PDF from MySafaricom app or *234#' },
            { step: '02', title: 'Upload to PesaMind', desc: 'Drag and drop your PDF — we unlock and parse it automatically' },
            { step: '03', title: 'Get AI Insights', desc: 'Instantly see your spending breakdown, health score and AI tips' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(0,232,122,0.1)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800, color: '#00E87A', fontSize: '14px' }}>{s.step}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>{s.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="landing-cta" style={{ textAlign: 'center', padding: '80px 60px' }}>
        <div style={{ display: 'inline-block', marginBottom: '24px' }}>
          <Logo size={56} />
        </div>
        <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Ready to take control?</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontSize: '16px' }}>Join Kenyans managing their M-Pesa finances smarter.</p>
        <div className="landing-hero-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/register')} style={{ background: '#00E87A', border: 'none', color: '#000', padding: '16px 48px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '18px' }}>
            Get Started Free →
          </button>
          <button onClick={() => router.push('/waitlist')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '16px 48px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '18px' }}>
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={24} />
          <span style={{ fontWeight: 700 }}>PesaMind</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>© 2026 PesaMind · Built for Kenya 🇰🇪</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => router.push('/waitlist')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>Waitlist</button>
          <button onClick={() => router.push('/pricing')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>Pricing</button>
          <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>Sign In</button>
          <button onClick={() => router.push('/register')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>Register</button>
          <button onClick={handleFounderAccess} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '11px' }}>·</button>
        </div>
      </div>

    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

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

export default function ShieldHub() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [topScams, setTopScams] = useState<any[]>([]);
  const [quickPhone, setQuickPhone] = useState('');
  const [checking, setChecking] = useState(false);
  const [quickResult, setQuickResult] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    fetchTopScams();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/shield/stats`);
      const json = await res.json();
      setStats(json.stats);
    } catch (e) { console.error(e); }
  };

  const fetchTopScams = async () => {
    try {
      const res = await fetch(`${API}/shield/top-scams`);
      const json = await res.json();
      setTopScams(json.scams || []);
    } catch (e) { console.error(e); }
  };

  const quickCheck = async () => {
    if (!quickPhone) return;
    setChecking(true);
    setQuickResult(null);
    try {
      const res = await fetch(`${API}/shield/check/${quickPhone.replace(/\s/g, '')}`);
      const json = await res.json();
      setQuickResult(json);
    } catch (e) { console.error(e); }
    finally { setChecking(false); }
  };

  const riskColor = (level: string) => {
    if (level === 'critical') return '#FF1744';
    if (level === 'high') return '#FF4D6D';
    if (level === 'medium') return '#F59E0B';
    if (level === 'low') return '#FF8C42';
    return '#00E87A';
  };

  const features = [
    { icon: '🔍', title: 'Check a Number', desc: 'Instantly check if a phone number has been reported for fraud before sending money', href: '/shield/check', color: '#FF4D6D' },
    { icon: '📱', title: 'Analyse Suspicious SMS', desc: 'Paste a suspicious message and our AI will tell you instantly if it is a scam', href: '/shield/sms', color: '#F59E0B' },
    { icon: '🚨', title: 'Report a Scammer', desc: 'Report a fraud number to protect all Kenyans. Every report matters', href: '/shield/report', color: '#7B5EA7' },
    { icon: '🏢', title: 'Verify a Supplier', desc: 'Before paying a business supplier, check their payment reputation', href: '/shield/supplier', color: '#00C4FF' },
    { icon: '👨‍👩‍👧', title: 'Family Safety Code', desc: 'Set a secret code so family members can verify identity before sending money', href: '/shield/family', color: '#00E87A' },
    { icon: '🤝', title: 'Chama Protection', desc: 'Register your chama for transparent financial tracking and fraud alerts', href: '/shield/chama', color: '#FF8C42' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .shield-hero{padding:40px 20px!important;} .shield-stats{grid-template-columns:repeat(2,1fr)!important;} .shield-features{grid-template-columns:1fr!important;} .shield-bottom{grid-template-columns:1fr!important;} .shield-nav{padding:16px 20px!important;} }`}</style>

      {/* Nav */}
      <div className="shield-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid rgba(255,77,109,0.2)', background: 'rgba(255,77,109,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => router.push('/')}>
          <Logo size={28} />
          <div>
            <span style={{ fontWeight: 800, fontSize: '16px' }}>PesaMind</span>
            <span style={{ marginLeft: '8px', background: 'rgba(255,77,109,0.2)', color: '#FF4D6D', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>FRAUD SHIELD</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/shield/check')} style={{ background: '#FF4D6D', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>🔍 Check Number</button>
          <button onClick={() => router.push('/shield/report')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>🚨 Report Scam</button>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', color: 'rgba(255,255,255,0.5)', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Dashboard</button>
        </div>
      </div>

      {/* Hero */}
      <div className="shield-hero" style={{ textAlign: 'center', padding: '60px 40px 40px', background: 'linear-gradient(180deg, rgba(255,77,109,0.08) 0%, transparent 100%)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
        <h1 style={{ fontSize: 'clamp(28px,6vw,52px)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px' }}>
          PesaMind <span style={{ color: '#FF4D6D' }}>Fraud Shield</span>
        </h1>
        <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'rgba(255,255,255,0.6)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          Africa's first AI-powered M-Pesa fraud prevention network. Check numbers, analyse suspicious messages, and protect yourself before you lose a single shilling.
        </p>

        {/* Quick Check */}
        <div style={{ maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: '16px', padding: '20px' }}>
          <p style={{ fontWeight: 700, marginBottom: '12px', color: '#FF4D6D', fontSize: '14px' }}>⚡ Quick Number Check — No Login Required</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="tel" value={quickPhone} onChange={e => setQuickPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && quickCheck()}
              placeholder="07XX XXX XXX"
              style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '15px', outline: 'none' }} />
            <button onClick={quickCheck} disabled={checking || !quickPhone}
              style={{ background: '#FF4D6D', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
              {checking ? '⏳' : '🔍 Check'}
            </button>
          </div>

          {quickResult && (
            <div style={{ marginTop: '16px', padding: '14px', borderRadius: '10px', background: quickResult.status === 'flagged' ? 'rgba(255,77,109,0.1)' : 'rgba(0,232,122,0.1)', border: `1px solid ${quickResult.status === 'flagged' ? 'rgba(255,77,109,0.3)' : 'rgba(0,232,122,0.3)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: quickResult.status === 'flagged' ? '#FF4D6D' : '#00E87A', fontSize: '14px' }}>
                  {quickResult.status === 'flagged' ? `🚨 FLAGGED — ${quickResult.risk_level?.toUpperCase()} RISK` : '✅ CLEAN — No Reports Found'}
                </span>
                {quickResult.risk_score > 0 && <span style={{ background: 'rgba(255,77,109,0.2)', color: '#FF4D6D', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Score: {quickResult.risk_score}/100</span>}
              </div>
              {quickResult.status === 'flagged' && (
                <>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>📊 {quickResult.report_count} reports · {quickResult.scam_label}</p>
                  <p style={{ fontSize: '12px', color: '#F59E0B', marginBottom: '10px' }}>💡 {quickResult.advice}</p>
                </>
              )}
              <button onClick={() => router.push(`/shield/check?phone=${quickPhone}`)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                View Full Report →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="shield-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '0 40px 40px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { value: Number(stats.total_flagged_numbers || 0).toLocaleString(), label: 'Numbers Flagged', icon: '🚩' },
            { value: Number(stats.total_reports || 0).toLocaleString(), label: 'Fraud Reports', icon: '📋' },
            { value: `KSH ${Number(stats.total_amount_reported || 0).toLocaleString()}`, label: 'Losses Reported', icon: '💸' },
            { value: Number(stats.sms_scams_caught || 0).toLocaleString(), label: 'SMS Scams Caught', icon: '📱' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,77,109,0.05)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
              <p style={{ fontSize: 'clamp(16px,2.5vw,22px)', fontWeight: 800, color: '#FF4D6D', marginBottom: '4px' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Features Grid */}
      <div style={{ padding: '0 40px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, marginBottom: '24px' }}>
          6 Ways to <span style={{ color: '#FF4D6D' }}>Stay Protected</span>
        </h2>
        <div className="shield-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {features.map((f, i) => (
            <div key={i} onClick={() => router.push(f.href)}
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${f.color}30`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.background = `${f.color}10`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${f.color}30`; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px', color: f.color }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '12px' }}>{f.desc}</p>
              <span style={{ fontSize: '12px', color: f.color, fontWeight: 600 }}>Open →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="shield-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0 40px 60px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* Top Scams */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>📊 Top Scam Types in Kenya</h3>
          {topScams.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No data yet — be the first to report!</p>
          ) : topScams.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{s.scam_type?.replace(/_/g, ' ')}</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>KSH {Number(s.total_lost).toLocaleString()}</span>
                <span style={{ background: 'rgba(255,77,109,0.15)', color: '#FF4D6D', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{s.count} reports</span>
              </div>
            </div>
          ))}
        </div>

        {/* Common Scam Tips */}
        <div style={{ background: 'rgba(255,77,109,0.05)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px', color: '#FF4D6D' }}>⚠️ Never Do These Things</h3>
          {[
            'Share your M-Pesa PIN with anyone — ever',
            'Send money back to someone who "sent by mistake"',
            'Pay a fee to claim a prize you never entered',
            'Pay a registration fee for a job offer',
            'Send money based on an urgent SMS from an unknown number',
            'Trust a "Safaricom agent" who calls you',
            'Pay a supplier before verifying them physically',
            'Send money to a "family member" on an unknown number without calling them first',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#FF4D6D', flexShrink: 0, fontSize: '12px', marginTop: '2px' }}>✕</span>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={22} />
          <span style={{ fontWeight: 700, fontSize: '14px' }}>PesaMind Fraud Shield</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Protecting Kenya 🇰🇪 · Free for everyone · pesamind.online</p>
        <button onClick={() => router.push('/shield/report')} style={{ background: '#FF4D6D', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>🚨 Report a Scam</button>
      </div>
    </div>
  );
}
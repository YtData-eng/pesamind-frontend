'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API = 'https://pesamind-backend.onrender.com/api';

function Nav() {
  const router = useRouter();
  const path = usePathname();
  const links = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/statements', label: '📄 Statements' },
    { href: '/budgets', label: '◎ Budgets' },
    { href: '/fraud', label: '🛡️ Fraud' },
    { href: '/analytics', label: '📈 Transactions' },
    { href: '/pricing', label: '⭐ Upgrade' },
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 40px', display: 'flex', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '24px', padding: '12px 0' }}>
        <svg width="28" height="28" viewBox="0 0 80 80" fill="none">
          <rect width="80" height="80" rx="20" fill="#00E87A"/>
          <rect x="13" y="48" width="10" height="20" rx="2" fill="#003D20"/>
          <rect x="27" y="38" width="10" height="30" rx="2" fill="#003D20"/>
          <rect x="41" y="28" width="10" height="40" rx="2" fill="#003D20"/>
          <rect x="55" y="35" width="10" height="33" rx="2" fill="#003D20"/>
          <polyline points="18,47 32,32 46,20 60,28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="28" r="3.5" fill="white"/>
        </svg>
        <span style={{ fontWeight: 800, fontSize: '16px' }}>PesaMind</span>
      </div>
      {links.map(l => (
        <button key={l.href} onClick={() => router.push(l.href)}
          style={{ padding: '14px 16px', background: 'none', border: 'none', color: path === l.href ? '#00E87A' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', fontWeight: path === l.href ? 700 : 400, borderBottom: path === l.href ? '2px solid #00E87A' : '2px solid transparent' }}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

export default function Referral() {
  const router = useRouter();
  const [info, setInfo] = useState<any>(null);
  const [shareStats, setShareStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchAll(token);
  }, []);

  const fetchAll = async (token: string) => {
    try {
      const [r, s] = await Promise.all([
        fetch(`${API}/referral/info`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/referral/share-stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setInfo(r);
      setShareStats(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(info?.referral_link || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Hey! I'm using PesaMind to track my M-Pesa spending with AI. Join me and get insights on your finances 🇰🇪\n\n${info?.referral_link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `Just discovered PesaMind — AI-powered M-Pesa financial insights for Kenyans 🇰🇪📊 Track spending, set budgets, detect fraud. Try it free!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(info?.referral_link || '')}`, '_blank');
  };

  const shareStats_whatsapp = () => {
    if (!shareStats) return;
    const text = `My M-Pesa insights this month via PesaMind 📊\n\n💰 Income: KSH ${Number(shareStats.income).toLocaleString()}\n💸 Expenses: KSH ${Number(shareStats.expenses).toLocaleString()}\n📈 Savings Rate: ${shareStats.savingsRate}%\n🏆 Top Category: ${shareStats.topCategory}\n\nGet your own insights → ${info?.referral_link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const progress = info ? (info.referral_count % 3) : 0;
  const progressPct = (progress / 3) * 100;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white' }}>
      <Nav />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>🎁 Refer & Earn</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Invite friends, earn free Pro months</p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Referrals', value: info?.referral_count || 0, color: '#00E87A', icon: '👥' },
            { label: 'Free Months Earned', value: info?.free_months || 0, color: '#7B5EA7', icon: '🎁' },
            { label: 'Until Next Reward', value: `${info?.next_reward_at || 3} more`, color: '#F59E0B', icon: '🏆' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                <span style={{ fontSize: '18px' }}>{s.icon}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

          {/* Referral Link */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🔗 Your Referral Link</h3>

            {/* Progress */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Progress to next reward</span>
                <span style={{ fontSize: '12px', color: '#00E87A', fontWeight: 700 }}>{progress}/3 referrals</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: '#00E87A', borderRadius: '4px', transition: 'width 0.8s ease' }} />
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
                {info?.next_reward_at === 0 ? '🎉 Reward ready!' : `${info?.next_reward_at} more referrals = 1 free Pro month`}
              </p>
            </div>

            {/* Referral Code */}
            <div style={{ background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Code</p>
              <p style={{ fontSize: '28px', fontWeight: 900, color: '#00E87A', letterSpacing: '6px' }}>{info?.referral_code?.toUpperCase()}</p>
            </div>

            {/* Link */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {info?.referral_link}
              </div>
              <button onClick={copyLink} style={{ background: copied ? '#00E87A' : 'rgba(255,255,255,0.1)', border: 'none', color: copied ? '#000' : 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', whiteSpace: 'nowrap' }}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            {/* Share Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={shareWhatsApp} style={{ flex: 1, background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                WhatsApp
              </button>
              <button onClick={shareTwitter} style={{ flex: 1, background: 'rgba(29,161,242,0.15)', border: '1px solid rgba(29,161,242,0.3)', color: '#1DA1F2', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                Twitter/X
              </button>
            </div>
          </div>

          {/* Share Your Stats */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>📊 Share Your Stats</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>Show friends your financial progress this month</p>

            {shareStats && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>This month's income</span>
                  <span style={{ color: '#00E87A', fontWeight: 700 }}>KSH {Number(shareStats.income).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Expenses</span>
                  <span style={{ color: '#FF4D6D', fontWeight: 700 }}>KSH {Number(shareStats.expenses).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Savings rate</span>
                  <span style={{ color: '#7B5EA7', fontWeight: 700 }}>{shareStats.savingsRate}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Top category</span>
                  <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{shareStats.topCategory}</span>
                </div>
              </div>
            )}

            <button onClick={shareStats_whatsapp} style={{ width: '100%', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
              Share on WhatsApp 📱
            </button>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Your referral link is included automatically</p>
          </div>
        </div>

        {/* Referral History */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>👥 People You've Referred ({info?.referrals?.length || 0})</h3>
          {!info?.referrals?.length ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>No referrals yet — share your link to start earning!</p>
              <button onClick={copyLink} style={{ background: '#00E87A', color: '#000', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                Copy Referral Link
              </button>
            </div>
          ) : (
            <div>
              {info.referrals.map((r: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'rgba(0,232,122,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#00E87A' }}>
                      {r.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{r.name || 'Unknown'}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span style={{ background: 'rgba(0,232,122,0.1)', color: '#00E87A', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>✓ Joined</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,232,122,0.08), rgba(123,94,167,0.05))', border: '1px solid rgba(0,232,122,0.15)', borderRadius: '16px', padding: '24px', marginTop: '20px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>How it works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { step: '1', title: 'Share your link', desc: 'Send your referral link to friends via WhatsApp or social media' },
              { step: '2', title: 'They sign up', desc: 'Your friend registers using your link and starts using PesaMind' },
              { step: '3', title: 'You earn', desc: 'Every 3 referrals = 1 free Pro month added to your account automatically' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(0,232,122,0.15)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 800, color: '#00E87A' }}>{s.step}</div>
                <p style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>{s.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';
const APP_URL = 'https://pesamind.online';

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
    { href: '/referral', label: '🎁 Refer' },
    { href: '/shield', label: '🛡️ Shield' },
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', flexShrink: 0 }}>
        <svg width="24" height="24" viewBox="0 0 80 80" fill="none">
          <rect width="80" height="80" rx="20" fill="#00E87A"/>
          <rect x="13" y="48" width="10" height="20" rx="2" fill="#003D20"/>
          <rect x="27" y="38" width="10" height="30" rx="2" fill="#003D20"/>
          <rect x="41" y="28" width="10" height="40" rx="2" fill="#003D20"/>
          <rect x="55" y="35" width="10" height="33" rx="2" fill="#003D20"/>
          <polyline points="18,47 32,32 46,20 60,28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="28" r="3.5" fill="white"/>
        </svg>
        <span style={{ fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>PesaMind</span>
      </div>
      {links.map(l => (
        <button key={l.href} onClick={() => router.push(l.href)}
          style={{ padding: '14px 12px', background: 'none', border: 'none', color: path === l.href ? '#00E87A' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px', fontWeight: path === l.href ? 700 : 400, borderBottom: path === l.href ? '2px solid #00E87A' : '2px solid transparent', whiteSpace: 'nowrap', flexShrink: 0 }}>
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

  const referralLink = `${APP_URL}/register?ref=${info?.referral_code || ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Hey! I'm using PesaMind to track my M-Pesa spending with AI 🇰🇪📊\n\nJoin me free: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `Tracking my M-Pesa spending with AI using PesaMind 🇰🇪📊 Get insights on your finances, free!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareStatsWhatsApp = () => {
    if (!shareStats) return;
    const text = `My M-Pesa insights this month via PesaMind 📊\n\n💰 Income: KSH ${Number(shareStats.income).toLocaleString()}\n💸 Expenses: KSH ${Number(shareStats.expenses).toLocaleString()}\n📈 Savings Rate: ${shareStats.savingsRate}%\n🏆 Top: ${shareStats.topCategory}\n\nGet yours free → ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const progress = info ? (info.referral_count % 3) : 0;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .ref-stats { grid-template-columns: repeat(2,1fr) !important; }
          .ref-grid { grid-template-columns: 1fr !important; }
          .ref-how { grid-template-columns: 1fr !important; }
          .ref-pad { padding: 20px 16px !important; }
        }
        @media (max-width: 480px) {
          .ref-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav />

      <div className="ref-pad" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 800, marginBottom: '4px' }}>🎁 Refer & Earn</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Invite friends · Earn free Pro months</p>
        </div>

        {/* Stats */}
        <div className="ref-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Referrals', value: info?.referral_count || 0, color: '#00E87A', icon: '👥' },
            { label: 'Free Months', value: info?.free_months || 0, color: '#7B5EA7', icon: '🎁' },
            { label: 'Until Reward', value: `${info?.next_reward_at || 3} more`, color: '#F59E0B', icon: '🏆' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                <span style={{ fontSize: '16px' }}>{s.icon}</span>
              </div>
              <p style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="ref-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

          {/* Referral Link */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>🔗 Your Referral Link</h3>

            {/* Progress bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Progress to reward</span>
                <span style={{ fontSize: '11px', color: '#00E87A', fontWeight: 700 }}>{progress}/3</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                <div style={{ height: '100%', width: `${(progress / 3) * 100}%`, background: '#00E87A', borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                {info?.next_reward_at === 0 ? '🎉 Reward ready!' : `${info?.next_reward_at} more = 1 free Pro month`}
              </p>
            </div>

            {/* Code badge */}
            <div style={{ background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>Your Code</p>
              <p style={{ fontSize: '22px', fontWeight: 900, color: '#00E87A', letterSpacing: '5px' }}>{info?.referral_code?.toUpperCase()}</p>
            </div>

            {/* Link display */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '10px' }}>
              pesamind.online/register?ref={info?.referral_code}
            </div>

            {/* Copy */}
            <button onClick={copyLink} style={{ width: '100%', background: copied ? '#00E87A' : 'rgba(255,255,255,0.08)', border: `1px solid ${copied ? '#00E87A' : 'rgba(255,255,255,0.15)'}`, color: copied ? '#000' : 'white', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', marginBottom: '10px', transition: 'all 0.2s' }}>
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </button>

            {/* Share buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={shareWhatsApp} style={{ width: '100%', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                📱 Share on WhatsApp
              </button>
              <button onClick={shareTwitter} style={{ width: '100%', background: 'rgba(29,161,242,0.12)', border: '1px solid rgba(29,161,242,0.25)', color: '#1DA1F2', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                🐦 Share on Twitter/X
              </button>
            </div>
          </div>

          {/* Share Stats */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>📊 Share Your Stats</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '16px' }}>Show friends your monthly progress</p>

            {shareStats ? (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                {[
                  { label: 'Income', value: `KSH ${Number(shareStats.income).toLocaleString()}`, color: '#00E87A' },
                  { label: 'Expenses', value: `KSH ${Number(shareStats.expenses).toLocaleString()}`, color: '#FF4D6D' },
                  { label: 'Savings Rate', value: `${shareStats.savingsRate}%`, color: '#7B5EA7' },
                  { label: 'Top Category', value: shareStats.topCategory?.replace(/_/g,' '), color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 3 ? '10px' : '0' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: s.color, textTransform: 'capitalize', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '24px', textAlign: 'center', marginBottom: '14px' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Upload a statement to see your stats</p>
              </div>
            )}

            <button onClick={shareStatsWhatsApp} style={{ width: '100%', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', padding: '11px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
              📱 Share Stats on WhatsApp
            </button>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Your referral link is included automatically</p>
          </div>
        </div>

        {/* Referral History */}
        {info?.referrals?.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>👥 People You've Referred ({info.referrals.length})</h3>
            {info.referrals.map((r: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < info.referrals.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'rgba(0,232,122,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#00E87A', fontSize: '13px', flexShrink: 0 }}>
                    {r.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600 }}>{r.name || 'Unknown'}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span style={{ background: 'rgba(0,232,122,0.1)', color: '#00E87A', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>✓ Joined</span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {(!info?.referrals || info.referrals.length === 0) && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px', marginBottom: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>👥</div>
            <p style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>No referrals yet</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '16px' }}>Share your link to start earning free Pro months!</p>
            <button onClick={copyLink} style={{ background: '#00E87A', color: '#000', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
              Copy Referral Link
            </button>
          </div>
        )}

        {/* How it works */}
        <div style={{ background: 'linear-gradient(135deg,rgba(0,232,122,0.08),rgba(123,94,167,0.05))', border: '1px solid rgba(0,232,122,0.15)', borderRadius: '16px', padding: '20px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>How it works</h3>
          <div className="ref-how" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {[
              { step: '1', title: 'Share your link', desc: 'Send via WhatsApp or Twitter' },
              { step: '2', title: 'They sign up', desc: 'Friend registers using your link' },
              { step: '3', title: 'You earn', desc: '3 referrals = 1 free Pro month' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(0,232,122,0.15)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 800, color: '#00E87A', fontSize: '13px' }}>{s.step}</div>
                <p style={{ fontWeight: 700, marginBottom: '4px', fontSize: '13px' }}>{s.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
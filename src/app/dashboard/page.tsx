'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

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
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
      <style>{`.nav-hide-scroll::-webkit-scrollbar{display:none}`}</style>
      <div className="nav-hide-scroll" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', flexShrink: 0 }}>
        <svg width="24" height="24" viewBox="0 0 80 80" fill="none">
          <rect width="80" height="80" rx="20" fill="#00E87A"/>
          <rect x="13" y="48" width="10" height="20" rx="2" fill="#003D20"/>
          <rect x="27" y="38" width="10" height="30" rx="2" fill="#003D20"/>
          <rect x="41" y="28" width="10" height="40" rx="2" fill="#003D20"/>
          <rect x="55" y="35" width="10" height="33" rx="2" fill="#003D20"/>
          <polyline points="18,47 32,32 46,20 60,28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="28" r="3.5" fill="white"/>
        </svg>
        <span style={{ fontWeight: 800, fontSize: '14px', color: 'white', flexShrink: 0 }}>PesaMind</span>
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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    Promise.all([fetchData(token), fetchHealth(token), fetchTrend(token)]);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const res = await fetch(`${API}/analytics/overview`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchHealth = async (token: string) => {
    try {
      const res = await fetch(`${API}/analytics/health-score`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setHealth(json);
    } catch (e) { console.error(e); }
  };

  const fetchTrend = async (token: string) => {
    try {
      const res = await fetch(`${API}/analytics/trend`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setTrend(json.trend || []);
    } catch (e) { console.error(e); }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    const token = localStorage.getItem('token')!;
    try {
      const res = await fetch(`${API}/analytics/summary`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setSummary(json.summary || '');
    } catch (e) { console.error(e); }
    finally { setSummaryLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fmt = (n: number) => `KSH ${(n || 0).toLocaleString('en-KE')}`;
  const totals = data?.totals || {};
  const income = Number(totals.total_income) || 0;
  const expenses = Number(totals.total_expenses) || 0;
  const savings = income - expenses;
  const txCount = totals.transaction_count || 0;
  const byCategory = data?.categories || [];
  const topTx = data?.recent || [];
  const scoreColor = !health ? '#666' : health.score >= 80 ? '#00E87A' : health.score >= 60 ? '#F59E0B' : health.score >= 40 ? '#FF8C42' : '#FF4D6D';
  const maxTrendVal = trend.length > 0 ? Math.max(...trend.map((t: any) => Math.max(Number(t.income), Number(t.expenses)))) : 1;

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .dash-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .dash-header-btns { width: 100% !important; }
          .dash-header-btns button { flex: 1 !important; font-size: 12px !important; padding: 8px 10px !important; }
          .health-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .trend-summary { flex-direction: column !important; }
          .upgrade-banner { flex-direction: column !important; gap: 12px !important; }
          .upgrade-banner button { width: 100% !important; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Nav />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Header */}
        <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 800, marginBottom: '4px' }}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Your M-Pesa financial overview</p>
          </div>
          <div className="dash-header-btns" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => router.push('/statements')} style={{ background: 'rgba(0,232,122,0.15)', border: '1px solid rgba(0,232,122,0.3)', color: '#00E87A', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>+ Upload</button>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>Sign Out</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            {/* Upgrade Banner */}
            <div className="upgrade-banner" style={{ background: 'linear-gradient(135deg, rgba(0,232,122,0.1), rgba(0,196,255,0.05))', border: '1px solid rgba(0,232,122,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <p style={{ fontWeight: 700, marginBottom: '2px', fontSize: '14px' }}>🚀 Upgrade to Pro</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Unlimited uploads & AI summaries — KSH 299/month</p>
              </div>
              <button onClick={() => router.push('/pricing')} style={{ background: '#00E87A', color: '#000', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '13px', flexShrink: 0 }}>
                Upgrade →
              </button>
            </div>

            {/* Health Score + Stats */}
            <div className="health-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', marginBottom: '16px' }}>

              {/* Health Score */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${scoreColor}40`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Financial Health</p>
                <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '12px' }}>
                  <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10" strokeDasharray={`${(health?.score || 0) * 3.14} 314`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: scoreColor }}>{health?.score || '--'}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>/100</span>
                  </div>
                </div>
                <p style={{ fontWeight: 700, color: scoreColor, marginBottom: '8px', fontSize: '14px' }}>{health?.grade || 'Loading...'}</p>
                <div style={{ width: '100%' }}>
                  {health?.insights?.map((insight: string, i: number) => (
                    <p key={i} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px', lineHeight: 1.4 }}>{insight}</p>
                  ))}
                </div>
              </div>

              {/* Stat Cards */}
              <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Total Income', value: fmt(income), color: '#00E87A', icon: '↑', sub: 'Last 12 months' },
                  { label: 'Total Expenses', value: fmt(expenses), color: '#FF4D6D', icon: '↓', sub: 'Last 12 months' },
                  { label: 'Net Savings', value: fmt(savings), color: '#7B5EA7', icon: '◎', sub: `${health?.savingsRate || 0}% rate` },
                  { label: 'Transactions', value: txCount, color: '#F59E0B', icon: '≡', sub: 'Total analyzed' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                      <span style={{ fontSize: '14px' }}>{s.icon}</span>
                    </div>
                    <p style={{ fontSize: 'clamp(14px, 3vw, 20px)', fontWeight: 800, color: s.color, marginBottom: '2px' }}>{s.value}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            {trend.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '14px' }}>📅 Monthly Trend</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {[{ color: '#00E87A', label: 'Income' }, { color: '#FF4D6D', label: 'Expenses' }].map((l, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', background: l.color, borderRadius: '2px' }} />
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px' }}>
                  {trend.map((t: any, i: number) => {
                    const incH = Math.round((Number(t.income) / maxTrendVal) * 80);
                    const expH = Math.round((Number(t.expenses) / maxTrendVal) * 80);
                    const prevExp = i > 0 ? Number(trend[i - 1].expenses) : Number(t.expenses);
                    const change = prevExp > 0 ? Math.round(((Number(t.expenses) - prevExp) / prevExp) * 100) : 0;
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                        <p style={{ fontSize: '9px', color: change > 10 ? '#FF4D6D' : change < -10 ? '#00E87A' : 'transparent', fontWeight: 600, height: '12px' }}>
                          {i > 0 && change !== 0 ? `${change > 0 ? '+' : ''}${change}%` : ''}
                        </p>
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', flex: 1 }}>
                          <div style={{ width: '14px', height: `${Math.max(incH, 3)}px`, background: '#00E87A', borderRadius: '2px 2px 0 0', opacity: 0.85 }} />
                          <div style={{ width: '14px', height: `${Math.max(expH, 3)}px`, background: '#FF4D6D', borderRadius: '2px 2px 0 0', opacity: 0.85 }} />
                        </div>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{t.label?.split(' ')[0]}</p>
                      </div>
                    );
                  })}
                </div>
                {trend.length >= 2 && (() => {
                  const last = trend[trend.length - 1];
                  const prev = trend[trend.length - 2];
                  const expChange = prev.expenses > 0 ? Math.round(((Number(last.expenses) - Number(prev.expenses)) / Number(prev.expenses)) * 100) : 0;
                  const incChange = prev.income > 0 ? Math.round(((Number(last.income) - Number(prev.income)) / Number(prev.income)) * 100) : 0;
                  return (
                    <div className="trend-summary" style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {[
                        { label: 'Income vs last month', value: `${incChange >= 0 ? '+' : ''}${incChange}%`, color: incChange >= 0 ? '#00E87A' : '#FF4D6D' },
                        { label: 'Expenses vs last month', value: `${expChange >= 0 ? '+' : ''}${expChange}%`, color: expChange <= 0 ? '#00E87A' : '#FF4D6D' },
                        { label: 'Best saving month', value: trend.reduce((best: any, t: any) => (Number(t.income) - Number(t.expenses)) > (Number(best.income) - Number(best.expenses)) ? t : best, trend[0])?.label?.split(' ')[0], color: '#7B5EA7' },
                      ].map((s, i) => (
                        <div key={i} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{s.label}</p>
                          <p style={{ fontWeight: 700, color: s.color, fontSize: '13px' }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* AI Summary */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '14px' }}>🤖 AI Financial Insights</h3>
                <span style={{ background: 'rgba(0,232,122,0.1)', color: '#00E87A', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>GROQ AI</span>
              </div>
              {!summary ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Get personalized AI insights on your spending habits</p>
                  <button onClick={fetchSummary} disabled={summaryLoading} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', fontSize: '13px' }}>
                    {summaryLoading ? '⏳ Analyzing...' : '✨ Generate Insights'}
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>{summary}</p>
                  <button onClick={fetchSummary} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}>↻ Refresh</button>
                </div>
              )}
            </div>

            {/* Category + Transactions */}
            <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Spending by Category */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '14px' }}>Spending by Category</h3>
                  <button onClick={() => router.push('/analytics')} style={{ background: 'none', border: 'none', color: '#00E87A', cursor: 'pointer', fontSize: '12px' }}>All →</button>
                </div>
                {byCategory.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>No data yet</p>
                ) : byCategory.slice(0, 6).map((c: any, i: number) => {
                  const max = byCategory[0]?.total || 1;
                  const pct = Math.round((c.total / max) * 100);
                  const colors = ['#00E87A', '#7B5EA7', '#F59E0B', '#FF4D6D', '#00C4FF', '#FF8C42'];
                  return (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{c.category?.replace(/_/g, ' ') || 'Unknown'}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>KSH {Number(c.total).toLocaleString()}</span>
                      </div>
                      <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Transactions */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '14px' }}>Recent Transactions</h3>
                  <button onClick={() => router.push('/analytics')} style={{ background: 'none', border: 'none', color: '#00E87A', cursor: 'pointer', fontSize: '12px' }}>All →</button>
                </div>
                {topTx.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px', fontSize: '13px' }}>No transactions yet</p>
                ) : topTx.slice(0, 6).map((tx: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: tx.type === 'receive' ? 'rgba(0,232,122,0.15)' : 'rgba(255,77,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                        {tx.type === 'receive' ? '↙' : '↗'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '11px', marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description?.slice(0, 22)}{tx.description?.length > 22 ? '...' : ''}</p>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{new Date(tx.transaction_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span style={{ color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', fontWeight: 700, fontSize: '12px', flexShrink: 0, marginLeft: '8px' }}>
                      {tx.type === 'receive' ? '+' : '-'}KSH {Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
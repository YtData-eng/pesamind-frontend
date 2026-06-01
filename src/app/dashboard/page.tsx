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
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 40px', display: 'flex', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '24px', padding: '12px 0' }}>
        <div style={{ width: '28px', height: '28px', background: '#00E87A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>₿</div>
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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [trend, setTrend] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    Promise.all([fetchData(token), fetchHealth(token),  fetchTrend(token) ]);
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

  const fmt = (n: number) => `KSH ${(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
  const totals = data?.totals || {};
  const income = Number(totals.total_income) || 0;
  const expenses = Number(totals.total_expenses) || 0;
  const savings = income - expenses;
  const txCount = totals.transaction_count || 0;
  const byCategory = data?.categories || [];
  const topTx = data?.recent || [];
  const scoreColor = !health ? '#666' : health.score >= 80 ? '#00E87A' : health.score >= 60 ? '#F59E0B' : health.score >= 40 ? '#FF8C42' : '#FF4D6D';

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white' }}>
      <Nav />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Welcome, {user?.name} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Your M-Pesa financial overview</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => router.push('/statements')} style={{ background: 'rgba(0,232,122,0.15)', border: '1px solid rgba(0,232,122,0.3)', color: '#00E87A', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>+ Upload Statement</button>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Sign Out</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            {/* Health Score + Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${scoreColor}40`, borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Financial Health</p>
                <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '16px' }}>
                  <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10" strokeDasharray={`${(health?.score || 0) * 3.14} 314`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: scoreColor }}>{health?.score || '--'}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>/100</span>
                  </div>
                </div>
                <p style={{ fontWeight: 700, color: scoreColor, marginBottom: '12px' }}>{health?.grade || 'Loading...'}</p>
                <div style={{ width: '100%' }}>
                  {health?.insights?.map((insight: string, i: number) => (
                    <p key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', lineHeight: 1.5 }}>{insight}</p>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Total Income', value: fmt(income), color: '#00E87A', icon: '↑', sub: 'Last 12 months' },
                  { label: 'Total Expenses', value: fmt(expenses), color: '#FF4D6D', icon: '↓', sub: 'Last 12 months' },
                  { label: 'Net Savings', value: fmt(savings), color: '#7B5EA7', icon: '◎', sub: `${health?.savingsRate || 0}% savings rate` },
                  { label: 'Transactions', value: txCount, color: '#F59E0B', icon: '≡', sub: 'Total analyzed' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                      <span style={{ fontSize: '16px' }}>{s.icon}</span>
                    </div>
                    <p style={{ fontSize: '22px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: 700 }}>🤖 AI Financial Insights</h3>
                <span style={{ background: 'rgba(0,232,122,0.1)', color: '#00E87A', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>GROQ AI</span>
              </div>
              {!summary ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Get personalized AI insights on your spending habits</p>
                  <button onClick={fetchSummary} disabled={summaryLoading} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginLeft: '16px' }}>
                    {summaryLoading ? '⏳ Analyzing...' : '✨ Generate Insights'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', flex: 1 }}>{summary}</p>
                  <button onClick={fetchSummary} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', whiteSpace: 'nowrap' }}>↻ Refresh</button>
                </div>
              )}
            </div>


{/* Monthly Trend */}
{trend.length > 0 && (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
    <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>📅 Monthly Trend</h3>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
      {trend.map((t: any, i: number) => {
        const maxVal = Math.max(...trend.map((x: any) => Math.max(Number(x.income), Number(x.expenses))));
        const incH = Math.round((Number(t.income) / maxVal) * 100);
        const expH = Math.round((Number(t.expenses) / maxVal) * 100);
        const prevExp = i > 0 ? Number(trend[i-1].expenses) : Number(t.expenses);
        const change = prevExp > 0 ? Math.round(((Number(t.expenses) - prevExp) / prevExp) * 100) : 0;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <p style={{ fontSize: '10px', color: change > 10 ? '#FF4D6D' : change < -10 ? '#00E87A' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
              {i > 0 && change !== 0 ? `${change > 0 ? '+' : ''}${change}%` : ''}
            </p>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '80px' }}>
              <div style={{ width: '14px', height: `${incH}%`, background: '#00E87A', borderRadius: '3px 3px 0 0', minHeight: '4px', opacity: 0.8 }} title={`Income: KSH ${Number(t.income).toLocaleString()}`} />
              <div style={{ width: '14px', height: `${expH}%`, background: '#FF4D6D', borderRadius: '3px 3px 0 0', minHeight: '4px', opacity: 0.8 }} title={`Expenses: KSH ${Number(t.expenses).toLocaleString()}`} />
            </div>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{t.label}</p>
          </div>
        );
      })}
    </div>
    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '10px', height: '10px', background: '#00E87A', borderRadius: '2px' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Income</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '10px', height: '10px', background: '#FF4D6D', borderRadius: '2px' }} />
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Expenses</span>
      </div>
    </div>
  </div>
)}
            {/* Category + Transactions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 700 }}>Spending by Category</h3>
                  <button onClick={() => router.push('/analytics')} style={{ background: 'none', border: 'none', color: '#00E87A', cursor: 'pointer', fontSize: '12px' }}>View all →</button>
                </div>
                {byCategory.slice(0, 6).map((c: any, i: number) => {
                  const max = byCategory[0]?.total || 1;
                  const pct = Math.round((c.total / max) * 100);
                  const colors = ['#00E87A', '#7B5EA7', '#F59E0B', '#FF4D6D', '#00C4FF', '#FF8C42'];
                  return (
                    <div key={i} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{c.category?.replace(/_/g, ' ') || 'Unknown'}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>KSH {Number(c.total).toLocaleString()}</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontWeight: 700 }}>Recent Transactions</h3>
                  <button onClick={() => router.push('/analytics')} style={{ background: 'none', border: 'none', color: '#00E87A', cursor: 'pointer', fontSize: '12px' }}>View all →</button>
                </div>
                {topTx.slice(0, 8).map((tx: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: tx.type === 'receive' ? 'rgba(0,232,122,0.15)' : 'rgba(255,77,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {tx.type === 'receive' ? '↙' : '↗'}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', marginBottom: '2px' }}>{tx.description?.slice(0, 30)}{tx.description?.length > 30 ? '...' : ''}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{new Date(tx.transaction_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span style={{ color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', fontWeight: 700, fontSize: '13px' }}>
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
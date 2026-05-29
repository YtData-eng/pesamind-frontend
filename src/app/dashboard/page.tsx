'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'http://localhost:4000/api';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const res = await fetch(`${API}/analytics/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      console.log('Analytics:', json);
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
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

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
              Welcome, {user?.name} 👋
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Your M-Pesa financial overview</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => router.push('/statements')} style={{ background: 'rgba(0,232,122,0.15)', border: '1px solid rgba(0,232,122,0.3)', color: '#00E87A', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
              + Upload Statement
            </button>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Loading your financial data...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Income', value: fmt(income), color: '#00E87A', icon: '↑' },
                { label: 'Total Expenses', value: fmt(expenses), color: '#FF4D6D', icon: '↓' },
                { label: 'Net Savings', value: fmt(savings), color: '#7B5EA7', icon: '◎' },
                { label: 'Transactions', value: txCount, color: '#F59E0B', icon: '≡' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                    <span style={{ fontSize: '18px' }}>{s.icon}</span>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Spending by Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Spending by Category</h3>
                {byCategory.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px' }}>No data yet</p>
                ) : (
                  byCategory.slice(0, 6).map((c: any, i: number) => {
                    const max = byCategory[0]?.total || 1;
                    const pct = Math.round((c.total / max) * 100);
                    return (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{c.category?.replace(/_/g, ' ') || 'Unknown'}</span>
                          <span style={{ fontSize: '13px', fontWeight: 700 }}>KSH {Number(c.total).toLocaleString()}</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? '#00E87A' : i === 1 ? '#7B5EA7' : '#F59E0B', borderRadius: '3px' }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Recent Transactions */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Recent Transactions</h3>
                {topTx.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px' }}>No transactions yet</p>
                ) : (
                  topTx.slice(0, 8).map((tx: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <p style={{ fontSize: '13px', marginBottom: '2px' }}>{tx.description?.slice(0, 35)}{tx.description?.length > 35 ? '...' : ''}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{new Date(tx.transaction_date).toLocaleDateString()}</p>
                      </div>
                      <span style={{ color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', fontWeight: 700, fontSize: '13px' }}>
                        {tx.type === 'receive' ? '+' : '-'}KSH {Number(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
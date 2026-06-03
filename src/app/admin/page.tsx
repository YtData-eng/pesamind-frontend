'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://pesamind-backend.onrender.com/api';

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
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

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'waitlist'>('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchStats(token);
    fetchWaitlist(token);
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 403) { setError('Admin access only'); setLoading(false); return; }
      const json = await res.json();
      setStats(json);
    } catch (e) { setError('Failed to load stats'); }
    finally { setLoading(false); }
  };

  const fetchWaitlist = async (token: string) => {
    try {
      const res = await fetch(`${API}/admin/waitlist`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setWaitlist(json.waitlist || []);
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
        <p>Loading founder dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '8px' }}>{error}</h2>
        <button onClick={() => router.push('/dashboard')} style={{ background: '#00E87A', color: '#000', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: '16px' }}>← Back to Dashboard</button>
      </div>
    </div>
  );

  const maxUpload = stats?.monthlyTrend ? Math.max(...stats.monthlyTrend.map((t: any) => Number(t.uploads))) : 1;
  const maxUsers = stats?.userGrowth ? Math.max(...stats.userGrowth.map((t: any) => Number(t.new_users))) : 1;

  const statCards = [
    { label: 'Total Users', value: stats?.users?.total || 0, sub: `+${stats?.users?.new_7d || 0} this week`, color: '#00E87A', icon: '👥' },
    { label: 'Active Users', value: stats?.users?.active || 0, sub: 'Last 30 days', color: '#00C4FF', icon: '⚡' },
    { label: 'Statements Uploaded', value: stats?.statements?.total || 0, sub: `${stats?.statements?.monthly || 0} this month`, color: '#7B5EA7', icon: '📄' },
    { label: 'Monthly Uploads', value: stats?.statements?.monthly || 0, sub: `${stats?.statements?.weekly || 0} this week`, color: '#F59E0B', icon: '📅' },
    { label: 'Avg Transactions Parsed', value: stats?.statements?.avg_transactions_parsed || 0, sub: 'Per statement', color: '#FF8C42', icon: '🔢' },
    { label: 'Retention Rate', value: `${stats?.users?.retention_rate || 0}%`, sub: 'Returning users', color: stats?.users?.retention_rate > 50 ? '#00E87A' : '#FF4D6D', icon: '🔄' },
    { label: 'Total Transactions', value: (stats?.transactions?.total_30d || 0).toLocaleString(), sub: 'Last 30 days', color: '#FF4D6D', icon: '💳' },
    { label: 'Avg Transaction', value: `KSH ${(stats?.transactions?.avg_amount || 0).toLocaleString()}`, sub: 'Last 30 days', color: '#00E87A', icon: '💰' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo />
          <div>
            <span style={{ fontWeight: 800, fontSize: '18px' }}>PesaMind</span>
            <span style={{ marginLeft: '8px', background: 'rgba(0,232,122,0.15)', color: '#00E87A', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>FOUNDER</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['overview', 'users', 'waitlist'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', background: activeTab === tab ? '#00E87A' : 'rgba(255,255,255,0.05)', color: activeTab === tab ? '#000' : 'rgba(255,255,255,0.6)' }}>
              {tab === 'waitlist' ? `Waitlist (${waitlist.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontSize: '13px', background: 'transparent', color: 'white', marginLeft: '8px', fontWeight: 600 }}>
  ← Dashboard
</button>          

        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px' }}>

        {activeTab === 'overview' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>📊 Founder Dashboard</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Real-time metrics for PesaMind</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {statCards.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                    <span style={{ fontSize: '18px' }}>{s.icon}</span>
                  </div>
                  <p style={{ fontSize: '26px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

              {/* Monthly Upload Trend */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>📅 Monthly Statement Uploads</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                  {(stats?.monthlyTrend || []).map((t: any, i: number) => {
                    const h = Math.round((Number(t.uploads) / maxUpload) * 100);
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <p style={{ fontSize: '10px', color: '#00E87A', fontWeight: 700 }}>{t.uploads}</p>
                        <div style={{ width: '100%', height: `${Math.max(h, 4)}px`, background: '#00E87A', borderRadius: '3px 3px 0 0', opacity: 0.8 }} />
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{t.month}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Growth */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>👥 User Growth</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                  {(stats?.userGrowth || []).map((t: any, i: number) => {
                    const h = Math.round((Number(t.new_users) / maxUsers) * 100);
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <p style={{ fontSize: '10px', color: '#7B5EA7', fontWeight: 700 }}>{t.new_users}</p>
                        <div style={{ width: '100%', height: `${Math.max(h, 4)}px`, background: '#7B5EA7', borderRadius: '3px 3px 0 0', opacity: 0.8 }} />
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>{t.month}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Most Used Features */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🏆 Most Used Categories</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {(stats?.topCategories || []).map((c: any, i: number) => {
                  const colors = ['#00E87A', '#7B5EA7', '#F59E0B', '#FF4D6D', '#00C4FF', '#FF8C42'];
                  const icons: Record<string,string> = { food_dining:'🍽', transport:'🚗', utilities:'💡', shopping:'🛍', airtime_data:'📱', entertainment:'🎬', healthcare:'💊', education:'📚', savings:'💰', other:'📦' };
                  const maxCount = stats.topCategories[0]?.count || 1;
                  const pct = Math.round((c.count / maxCount) * 100);
                  return (
                    <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{icons[c.category] || '📦'}</span>
                          {c.category?.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: colors[i] }}>{Number(c.count).toLocaleString()}</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: colors[i], borderRadius: '2px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>👥 User Activity</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Top users by transaction count</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 150px 120px 120px 140px', gap: '16px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['#', 'User', 'Email', 'Statements', 'Transactions', 'Joined'].map(h => (
                  <p key={h} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
                ))}
              </div>
              {(stats?.topUsers || []).map((u: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 150px 120px 120px 140px', gap: '16px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>{i + 1}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{u.name || 'Unknown'}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  <p style={{ fontSize: '13px', color: '#7B5EA7', fontWeight: 700 }}>{u.statements}</p>
                  <p style={{ fontSize: '13px', color: '#00E87A', fontWeight: 700 }}>{Number(u.transactions).toLocaleString()}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{new Date(u.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'waitlist' && (
          <>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>📋 Waitlist</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>{waitlist.length} people waiting for access</p>
              </div>
              <button onClick={() => {
                const csv = ['Email,Name,Reason,Date', ...waitlist.map(w => `${w.email},${w.name || ''},${w.reason || ''},${new Date(w.created_at).toLocaleDateString()}`)].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'pesamind-waitlist.csv'; a.click();
              }} style={{ background: '#00E87A', color: '#000', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                ↓ Export CSV
              </button>
            </div>

            {waitlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p>No waitlist signups yet</p>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Share your waitlist page to collect signups</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 1fr 120px', gap: '16px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['Email', 'Name', 'Reason', 'Date'].map(h => (
                    <p key={h} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
                  ))}
                </div>
                {waitlist.map((w, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 1fr 120px', gap: '16px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: '13px', color: '#00E87A' }}>{w.email}</p>
                    <p style={{ fontSize: '13px' }}>{w.name || '—'}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{w.reason || '—'}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{new Date(w.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
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
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
      <style>{`nav-s::-webkit-scrollbar{display:none}`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', flexShrink: 0 }}>
        <svg width="24" height="24" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="20" fill="#00E87A"/><rect x="13" y="48" width="10" height="20" rx="2" fill="#003D20"/><rect x="27" y="38" width="10" height="30" rx="2" fill="#003D20"/><rect x="41" y="28" width="10" height="40" rx="2" fill="#003D20"/><rect x="55" y="35" width="10" height="33" rx="2" fill="#003D20"/><polyline points="18,47 32,32 46,20 60,28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="60" cy="28" r="3.5" fill="white"/></svg>
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

export default function Fraud() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [suspicious, setSuspicious] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanResult, setScanResult] = useState<any>(null);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [spikes, setSpikes] = useState<any[]>([]);
  const [newMerchants, setNewMerchants] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchAll(token);
  }, []);

  const fetchAll = async (token: string) => {
    setLoading(true);
    try {
      const [a, s, sp, d, spk, nm] = await Promise.all([
        fetch(`${API}/fraud/alerts`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/fraud/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/analytics/overview`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/fraud/duplicates`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/fraud/spikes`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/fraud/new-merchants`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setAlerts(a.alerts || []);
      setStats(s.stats || {});
      setSuspicious((sp.recent || []).filter((t: any) => t.amount > 5000 && t.type !== 'receive').slice(0, 5));
      setDuplicates(d.duplicates || []);
      setSpikes(spk.spikes || []);
      setNewMerchants(nm.merchants || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const scan = async () => {
    setScanning(true);
    const token = localStorage.getItem('token')!;
    try {
      const res = await fetch(`${API}/fraud/scan`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setScanResult(json);
      fetchAll(token);
    } catch (e) { console.error(e); }
    finally { setScanning(false); }
  };

  const resolve = async (id: string) => {
    const token = localStorage.getItem('token')!;
    await fetch(`${API}/fraud/alerts/${id}/resolve`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    setAlerts(a => a.map(x => x.id === id ? { ...x, resolved: true } : x));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .fraud-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .fraud-header button { width: 100% !important; }
          .fraud-stats { grid-template-columns: repeat(2,1fr) !important; }
          .fraud-grid { grid-template-columns: 1fr !important; }
          .spikes-grid { grid-template-columns: 1fr !important; }
          .merchants-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px' }}>

        <div className="fraud-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 800, marginBottom: '4px' }}>🛡️ Fraud Detection</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>AI-powered scam & anomaly monitoring</p>
          </div>
          <button onClick={scan} disabled={scanning} style={{ background: scanning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#FF4D6D,#FF8C42)', color: 'white', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
            {scanning ? '⏳ Scanning...' : '🔍 Run Scan'}
          </button>
        </div>

        <div className="fraud-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Alerts', value: stats.total_alerts || 0, color: '#F59E0B', icon: '⚠️' },
            { label: 'High Risk', value: stats.high_severity || 0, color: '#FF4D6D', icon: '🚨' },
            { label: 'Unresolved', value: stats.unresolved || 0, color: '#7B5EA7', icon: '🔴' },
            { label: 'Resolved', value: stats.resolved || 0, color: '#00E87A', icon: '✅' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                <span style={{ fontSize: '16px' }}>{s.icon}</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {scanResult && (
          <div style={{ background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
            <p style={{ color: '#00E87A', fontWeight: 700, fontSize: '13px' }}>✅ {scanResult.message}</p>
            {scanResult.alertCount > 0 && <p style={{ color: '#FF4D6D', fontSize: '12px', marginTop: '4px' }}>⚠️ {scanResult.alertCount} suspicious transactions found!</p>}
          </div>
        )}

        <div className="fraud-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>🚨 Fraud Alerts ({alerts.length})</h3>
            {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px', fontSize: '13px' }}>Loading...</p> :
              alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛡️</div>
                  <p style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>No fraud alerts</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Run a scan to check transactions</p>
                </div>
              ) : alerts.map((a, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', background: a.resolved ? 'rgba(255,255,255,0.03)' : a.severity === 'high' ? 'rgba(255,77,109,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${a.resolved ? 'rgba(255,255,255,0.05)' : a.severity === 'high' ? 'rgba(255,77,109,0.25)' : 'rgba(245,158,11,0.25)'}`, marginBottom: '8px', opacity: a.resolved ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px' }}>{a.severity === 'high' ? '🚨' : '⚠️'}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: a.severity === 'high' ? '#FF4D6D' : '#F59E0B', textTransform: 'uppercase' }}>{a.severity} risk</span>
                      </div>
                      <p style={{ fontSize: '12px', marginBottom: '3px' }}>{a.description}</p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>KSH {Number(a.tx_amount).toLocaleString()} · {new Date(a.tx_date).toLocaleDateString()}</p>
                    </div>
                    {!a.resolved ? (
                      <button onClick={() => resolve(a.id)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', marginLeft: '8px', flexShrink: 0 }}>Dismiss</button>
                    ) : <span style={{ color: '#00E87A', fontSize: '10px', fontWeight: 600, marginLeft: '8px' }}>✓ Done</span>}
                  </div>
                </div>
              ))
            }
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>⚡ Large Transactions</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '14px' }}>Over KSH 5,000</p>
              {suspicious.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '16px', fontSize: '12px' }}>No large transactions</p>
              ) : suspicious.map((tx, i) => (
                <div key={i} style={{ padding: '10px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600 }}>{tx.description?.slice(0, 28)}</p>
                    <span style={{ color: '#FF4D6D', fontWeight: 700, fontSize: '12px', flexShrink: 0, marginLeft: '8px' }}>-KSH {Number(tx.amount).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{new Date(tx.transaction_date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,77,109,0.05)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px', color: '#FF4D6D' }}>⚠️ Common M-Pesa Scams</p>
              {['Fake Safaricom agents asking for PIN', 'Prize/lottery asking for fees', '"Wrong number" reversal scams', 'Fake job offers needing deposits', 'Impersonation of family'].map((tip, i) => (
                <p key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(255,77,109,0.3)' }}>⚠ {tip}</p>
              ))}
            </div>
          </div>
        </div>

        {spikes.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>📈 Spending Spikes</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '14px' }}>50%+ above normal this month</p>
            <div className="spikes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '10px' }}>
              {spikes.map((s, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{s.category?.replace(/_/g, ' ')}</span>
                    <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '12px' }}>+{s.pct_change}%</span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>KSH {Number(s.current_spend).toLocaleString()}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Avg: KSH {Number(s.avg_spend).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {duplicates.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(123,94,167,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>🔄 Duplicate Transactions</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '14px' }}>Same amount to same recipient multiple times</p>
            {duplicates.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(123,94,167,0.05)', border: '1px solid rgba(123,94,167,0.15)', borderRadius: '10px', marginBottom: '8px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.description?.slice(0, 40)}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>KSH {Number(d.amount).toLocaleString()} × {d.count} times</p>
                </div>
                <span style={{ background: 'rgba(123,94,167,0.2)', color: '#7B5EA7', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, marginLeft: '10px', flexShrink: 0 }}>{d.count}x</span>
              </div>
            ))}
          </div>
        )}

        {newMerchants.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,196,255,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>🆕 New Merchants</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginBottom: '14px' }}>First-time payments in last 30 days</p>
            <div className="merchants-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px' }}>
              {newMerchants.map((m, i) => (
                <div key={i} style={{ padding: '10px', background: 'rgba(0,196,255,0.03)', border: '1px solid rgba(0,196,255,0.1)', borderRadius: '8px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.description?.slice(0, 35)}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{new Date(m.transaction_date).toLocaleDateString()}</p>
                    <p style={{ fontSize: '10px', color: '#FF4D6D', fontWeight: 600 }}>KSH {Number(m.amount).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
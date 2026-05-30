'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = 'https://pesamind-backend.onrender.com/api';

export default function Fraud() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [suspicious, setSuspicious] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchAll(token);
  }, []);

  const fetchAll = async (token: string) => {
    setLoading(true);
    try {
      const [a, s, sp] = await Promise.all([
        fetch(`${API}/fraud/alerts`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/fraud/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/analytics/overview`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setAlerts(a.alerts || []);
      setStats(s.stats || {});
      // Find suspicious transactions (large amounts)
      const recent = sp.recent || [];
      setSuspicious(recent.filter((t: any) => t.amount > 5000 && t.type !== 'receive').slice(0, 5));
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
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>🛡️ Fraud Detection</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>AI-powered scam & anomaly monitoring</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={scan} disabled={scanning} style={{ background: scanning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FF4D6D, #FF8C42)', color: 'white', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
              {scanning ? '⏳ Scanning...' : '🔍 Run Fraud Scan'}
            </button>
            <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>← Dashboard</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Alerts', value: stats.total_alerts || 0, color: '#F59E0B', icon: '⚠️' },
            { label: 'High Severity', value: stats.high_severity || 0, color: '#FF4D6D', icon: '🚨' },
            { label: 'Unresolved', value: stats.unresolved || 0, color: '#7B5EA7', icon: '🔴' },
            { label: 'Resolved', value: stats.resolved || 0, color: '#00E87A', icon: '✅' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                <span>{s.icon}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {scanResult && (
          <div style={{ background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#00E87A', fontWeight: 700 }}>✅ Scan complete — {scanResult.message}</p>
            {scanResult.alertCount > 0 && <p style={{ color: '#FF4D6D', fontSize: '13px', marginTop: '4px' }}>⚠️ {scanResult.alertCount} suspicious transactions found!</p>}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Fraud Alerts */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>🚨 Fraud Alerts ({alerts.length})</h3>
            {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>Loading...</p> :
              alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
                  <p style={{ fontWeight: 700, marginBottom: '8px' }}>No fraud alerts</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Run a scan to check your transactions for suspicious activity</p>
                </div>
              ) : alerts.map((a, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: a.resolved ? 'rgba(255,255,255,0.03)' : a.severity === 'high' ? 'rgba(255,77,109,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${a.resolved ? 'rgba(255,255,255,0.05)' : a.severity === 'high' ? 'rgba(255,77,109,0.25)' : 'rgba(245,158,11,0.25)'}`, marginBottom: '8px', opacity: a.resolved ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span>{a.severity === 'high' ? '🚨' : '⚠️'}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: a.severity === 'high' ? '#FF4D6D' : '#F59E0B', textTransform: 'uppercase' }}>{a.severity} risk</span>
                      </div>
                      <p style={{ fontSize: '13px', marginBottom: '4px' }}>{a.description}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>KSH {Number(a.tx_amount).toLocaleString()} · {new Date(a.tx_date).toLocaleDateString()}</p>
                    </div>
                    {!a.resolved ? (
                      <button onClick={() => resolve(a.id)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', marginLeft: '8px' }}>Dismiss</button>
                    ) : <span style={{ color: '#00E87A', fontSize: '11px', fontWeight: 600, marginLeft: '8px' }}>✓ Resolved</span>}
                  </div>
                </div>
              ))
            }
          </div>

          {/* Large Transactions */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>⚡ Large Transactions</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '20px' }}>Transactions over KSH 5,000 worth reviewing</p>
            {suspicious.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>No large transactions found</p>
            ) : suspicious.map((tx, i) => (
              <div key={i} style={{ padding: '14px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{tx.description?.slice(0, 40)}</p>
                  <span style={{ color: '#FF4D6D', fontWeight: 700, fontSize: '13px' }}>-KSH {Number(tx.amount).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{new Date(tx.transaction_date).toLocaleDateString()} · {tx.category?.replace(/_/g, ' ')}</p>
              </div>
            ))}

            {/* M-Pesa Scam Tips */}
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,77,109,0.05)', border: '1px solid rgba(255,77,109,0.15)', borderRadius: '10px' }}>
              <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '10px', color: '#FF4D6D' }}>⚠️ Common M-Pesa Scams</p>
              {['Fake Safaricom agents asking for PIN', 'Prize/lottery messages asking for fees', '"Wrong number" reversal scams', 'Fake job offers requiring deposits'].map((tip, i) => (
                <p key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>• {tip}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function Fraud() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchAll(token);
  }, []);

  const fetchAll = async (token: string) => {
    try {
      const [a, s] = await Promise.all([
        fetch(`${API}/fraud/alerts`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API}/fraud/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setAlerts(a.alerts || []);
      setStats(s.stats || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const scan = async () => {
    setScanning(true);
    const token = localStorage.getItem('token')!;
    try {
      await fetch(`${API}/fraud/scan`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Fraud Detection</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>AI-powered scam monitoring</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={scan} disabled={scanning} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
              {scanning ? 'Scanning...' : '🔍 Run Scan'}
            </button>
            <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>← Dashboard</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Alerts', value: stats.total_alerts || 0, color: '#F59E0B' },
            { label: 'High Severity', value: stats.high_severity || 0, color: '#FF4D6D' },
            { label: 'Unresolved', value: stats.unresolved || 0, color: '#7B5EA7' },
            { label: 'Resolved', value: stats.resolved || 0, color: '#00E87A' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Fraud Alerts</h3>
          {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>Loading...</p> :
            alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
                <p style={{ fontWeight: 700, marginBottom: '8px' }}>No fraud alerts</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Run a scan to check your transactions</p>
              </div>
            ) : alerts.map((a, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '10px', background: a.resolved ? 'rgba(255,255,255,0.03)' : a.severity === 'high' ? 'rgba(255,77,109,0.05)' : 'rgba(245,158,11,0.05)', border: `1px solid ${a.resolved ? 'rgba(255,255,255,0.05)' : a.severity === 'high' ? 'rgba(255,77,109,0.2)' : 'rgba(245,158,11,0.2)'}`, marginBottom: '8px', opacity: a.resolved ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px' }}>{a.severity === 'high' ? '🚨' : '⚠️'}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: a.severity === 'high' ? '#FF4D6D' : '#F59E0B', textTransform: 'uppercase' }}>{a.severity}</span>
                    </div>
                    <p style={{ fontSize: '13px', marginBottom: '4px' }}>{a.description}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>KSH {Number(a.tx_amount).toLocaleString()} · {new Date(a.tx_date).toLocaleDateString()}</p>
                  </div>
                  {!a.resolved && (
                    <button onClick={() => resolve(a.id)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Dismiss</button>
                  )}
                  {a.resolved && <span style={{ color: '#00E87A', fontSize: '12px', fontWeight: 600 }}>✓ Resolved</span>}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
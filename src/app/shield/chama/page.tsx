'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

export default function ChamaProtection() {
  const router = useRouter();
  const [chamas, setChamas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', monthly_contribution: '', treasurer_phone: '', alert_threshold: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchChamas(token);
  }, []);

  const fetchChamas = async (token: string) => {
    try {
      const res = await fetch(`${API}/shield/chama`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setChamas(json.chamas || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const createChama = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const token = localStorage.getItem('token')!;
    try {
      await fetch(`${API}/shield/chama`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, monthly_contribution: parseFloat(form.monthly_contribution), alert_threshold: parseFloat(form.alert_threshold) || 0 }),
      });
      setShowForm(false);
      setForm({ name: '', monthly_contribution: '', treasurer_phone: '', alert_threshold: '' });
      fetchChamas(token);
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .chama-pad{padding:20px 16px!important;} }`}</style>

      <div style={{ background: 'rgba(255,140,66,0.05)', borderBottom: '1px solid rgba(255,140,66,0.15)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => router.push('/shield')} style={{ background: 'none', border: 'none', color: '#FF8C42', cursor: 'pointer', fontSize: '20px' }}>←</button>
          <h1 style={{ fontWeight: 800, fontSize: '18px' }}>🤝 Chama Protection</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#FF8C42', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
          + New Chama
        </button>
      </div>

      <div className="chama-pad" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'rgba(255,140,66,0.08)', border: '1px solid rgba(255,140,66,0.2)', borderRadius: '14px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            <strong style={{ color: '#FF8C42' }}>Chama Protection</strong> keeps your savings group transparent and safe. Register your chama to track contributions, get fraud alerts if the treasurer makes suspicious withdrawals, and share monthly reports with all members.
          </p>
        </div>

        {showForm && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,140,66,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '15px' }}>Register New Chama</h3>
            <form onSubmit={createChama} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Chama Name', key: 'name', placeholder: 'e.g. Maendeleo Women Group', type: 'text' },
                { label: 'Monthly Contribution (KSH)', key: 'monthly_contribution', placeholder: '2000', type: 'number' },
                { label: "Treasurer's M-Pesa Number", key: 'treasurer_phone', placeholder: '07XX XXX XXX', type: 'tel' },
                { label: 'Alert Threshold (KSH) — Alert me if withdrawal exceeds this', key: 'alert_threshold', placeholder: 'Leave blank for 2x monthly contribution', type: 'number' },
              ].map((f, i) => (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} required={i < 2}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px', outline: 'none' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={creating} style={{ flex: 1, background: '#FF8C42', color: '#000', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '14px' }}>
                  {creating ? '⏳ Creating...' : '🤝 Register Chama'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px' }}>Loading your chamas...</p>
        ) : chamas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🤝</div>
            <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No chamas registered yet</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Register your savings group to protect it from fraud and keep finances transparent</p>
            <button onClick={() => setShowForm(true)} style={{ background: '#FF8C42', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>+ Register Your Chama</button>
          </div>
        ) : (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Your Chamas ({chamas.length})</h3>
            {chamas.map((c, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,140,66,0.15)', borderRadius: '14px', padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{c.name}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{c.member_count} members · {c.role}</p>
                  </div>
                  <span style={{ background: 'rgba(255,140,66,0.15)', color: '#FF8C42', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>🛡️ Protected</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                  {[
                    { label: 'Monthly', value: `KSH ${Number(c.monthly_contribution).toLocaleString()}` },
                    { label: 'Total Collected', value: `KSH ${Number(c.total_collected).toLocaleString()}` },
                    { label: 'Alert At', value: `KSH ${Number(c.alert_threshold).toLocaleString()}` },
                  ].map((d, j) => (
                    <div key={j} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px 10px' }}>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>{d.label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600 }}>{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

const SCAM_TYPES = [
  { value: 'reversal_scam', label: '🔄 Reversal Scam', desc: 'Sent money "by mistake" then asked you to send it back' },
  { value: 'fake_safaricom', label: '📡 Fake Safaricom Agent', desc: 'Impersonated Safaricom to steal credentials' },
  { value: 'job_scam', label: '💼 Fake Job Offer', desc: 'Required registration or deposit fee for fake job' },
  { value: 'lottery_prize', label: '🎰 Lottery/Prize Scam', desc: 'Fake prize requiring processing fee to claim' },
  { value: 'betting_scam', label: '⚽ Betting/Prediction Scam', desc: 'Fake insider betting tips requiring payment' },
  { value: 'family_emergency', label: '👨‍👩‍👧 Family Emergency Scam', desc: 'Impersonated a family member in distress' },
  { value: 'investment_scam', label: '📈 Investment/Ponzi', desc: 'Fake investment promising unrealistic returns' },
  { value: 'supplier_scam', label: '🏢 Fake Supplier', desc: 'Took payment for goods/services never delivered' },
];

export default function ReportScam() {
  const router = useRouter();
  const [form, setForm] = useState({ phone_number: '', scam_type: '', description: '', amount_lost: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('phone');
    if (p) setForm(f => ({ ...f, phone_number: p }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone_number || !form.scam_type) { setError('Phone number and scam type are required'); return; }
    setLoading(true); setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/shield/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ ...form, amount_lost: parseFloat(form.amount_lost) || 0 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(true);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .report-pad{padding:20px 16px!important;} }`}</style>

      <div style={{ background: 'rgba(123,94,167,0.05)', borderBottom: '1px solid rgba(123,94,167,0.15)', padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => router.push('/shield')} style={{ background: 'none', border: 'none', color: '#7B5EA7', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ fontWeight: 800, fontSize: '18px' }}>🚨 Report a Scammer</h1>
      </div>

      <div className="report-pad" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        {success ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: '#00E87A' }}>Thank You, Hero!</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
              Your report has been saved. You have just helped protect thousands of Kenyans from this scammer. Every report matters.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setSuccess(false); setForm({ phone_number: '', scam_type: '', description: '', amount_lost: '' }); }} style={{ background: '#7B5EA7', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>Report Another</button>
              <button onClick={() => router.push('/shield')} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer' }}>Back to Shield</button>
            </div>
          </div>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.7 }}>
              Been scammed or almost scammed? Report the number here. Your report protects every Kenyan on PesaMind instantly. No login required.
            </p>

            {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '16px', color: '#ff5050', fontSize: '14px' }}>{error}</div>}

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Scammer's Phone Number *</label>
                <input type="tel" value={form.phone_number} onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))} placeholder="07XX XXX XXX" required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '15px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Type of Scam *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SCAM_TYPES.map(s => (
                    <label key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', border: `1px solid ${form.scam_type === s.value ? '#7B5EA7' : 'rgba(255,255,255,0.1)'}`, background: form.scam_type === s.value ? 'rgba(123,94,167,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer' }}>
                      <input type="radio" name="scam_type" value={s.value} checked={form.scam_type === s.value} onChange={e => setForm(f => ({ ...f, scam_type: e.target.value }))} style={{ accentColor: '#7B5EA7' }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600 }}>{s.label}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{s.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount Lost (KSH)</label>
                <input type="number" value={form.amount_lost} onChange={e => setForm(f => ({ ...f, amount_lost: e.target.value }))} placeholder="0 if you were not scammed"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '15px', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>What Happened (Optional)</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  placeholder="Briefly describe what happened..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'system-ui' }} />
              </div>

              <button type="submit" disabled={loading}
                style={{ background: '#7B5EA7', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '15px' }}>
                {loading ? '⏳ Submitting...' : '🚨 Submit Report — Protect Kenya'}
              </button>

              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                Your report is anonymous. It will be visible to all PesaMind users immediately to protect them.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

export default function CheckNumber() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('phone');
    if (p) { setPhone(p); checkNumber(p); }
  }, []);

  const checkNumber = async (p?: string) => {
    const num = (p || phone).replace(/\s/g, '');
    if (!num) return;
    setLoading(true); setResult(null); setError('');
    try {
      const res = await fetch(`${API}/shield/check/${num}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const riskColor = (level: string) => ({ critical: '#FF1744', high: '#FF4D6D', medium: '#F59E0B', low: '#FF8C42', safe: '#00E87A' }[level] || '#00E87A');
  const riskBg = (level: string) => ({ critical: 'rgba(255,23,68,0.1)', high: 'rgba(255,77,109,0.1)', medium: 'rgba(245,158,11,0.1)', low: 'rgba(255,140,66,0.1)', safe: 'rgba(0,232,122,0.1)' }[level] || 'rgba(0,232,122,0.1)');

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .check-pad{padding:20px 16px!important;} }`}</style>

      <div style={{ background: 'rgba(255,77,109,0.05)', borderBottom: '1px solid rgba(255,77,109,0.15)', padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => router.push('/shield')} style={{ background: 'none', border: 'none', color: '#FF4D6D', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ fontWeight: 800, fontSize: '18px' }}>🔍 Check a Number</h1>
      </div>

      <div className="check-pad" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.7 }}>
          Before sending money, check if a phone number has been reported for fraud by other Kenyans. Free, instant, no login required.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number to Check</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkNumber()}
              placeholder="07XX XXX XXX or 254XXXXXXXXX"
              style={{ flex: 1, padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '16px', outline: 'none' }} />
            <button onClick={() => checkNumber()} disabled={loading || !phone}
              style={{ background: '#FF4D6D', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
              {loading ? '⏳' : '🔍 Check'}
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '16px', color: '#ff5050', fontSize: '14px' }}>{error}</div>}

        {result && (
          <div style={{ background: riskBg(result.risk_level || 'safe'), border: `2px solid ${riskColor(result.risk_level || 'safe')}40`, borderRadius: '16px', padding: '24px' }}>

            {/* Status Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 900, color: riskColor(result.risk_level || 'safe'), marginBottom: '4px' }}>
                  {result.status === 'flagged' ? `🚨 ${result.risk_level?.toUpperCase()} RISK` : '✅ CLEAN'}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{result.phone}</p>
              </div>
              {result.risk_score > 0 && (
                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px 16px' }}>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: riskColor(result.risk_level), marginBottom: '2px' }}>{result.risk_score}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Risk Score /100</p>
                </div>
              )}
            </div>

            {result.status === 'clean' && (
              <div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>No fraud reports found for this number in our database.</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>⚠️ This does not guarantee the number is safe — always stay vigilant.</p>
              </div>
            )}

            {result.status === 'flagged' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: 'Reports', value: result.report_count },
                    { label: 'Scam Type', value: result.scam_label },
                    { label: 'First Reported', value: new Date(result.first_reported).toLocaleDateString() },
                    { label: 'Last Reported', value: new Date(result.last_reported).toLocaleDateString() },
                  ].map((d, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{d.label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600 }}>{d.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 700, marginBottom: '4px' }}>💡 What to do:</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{result.advice}</p>
                </div>

                {result.reports?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>Recent Reports:</p>
                    {result.reports.map((r: any, i: number) => (
                      <div key={i} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '6px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '3px', textTransform: 'capitalize' }}>{r.scam_type?.replace(/_/g, ' ')}</p>
                        {r.description && <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{r.description}</p>}
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>{new Date(r.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => router.push(`/shield/report?phone=${phone}`)} style={{ background: '#FF4D6D', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>🚨 Report This Number</button>
              <button onClick={() => { setResult(null); setPhone(''); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Check Another</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            🔒 This check is completely free and requires no login. Results are based on community reports from PesaMind users across Kenya. Always exercise caution when sending money to unknown numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
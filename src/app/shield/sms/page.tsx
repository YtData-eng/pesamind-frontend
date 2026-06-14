'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

export default function SmsAnalyser() {
  const router = useRouter();
  const [sms, setSms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyse = async () => {
    if (!sms.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API}/shield/analyse-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms_text: sms }),
      });
      const json = await res.json();
      setResult(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const severityColor = (s: string) => ({ critical: '#FF1744', high: '#FF4D6D', medium: '#F59E0B', low: '#FF8C42', none: '#00E87A' }[s] || '#00E87A');

  const examples = [
    { label: 'Fake Safaricom', text: 'Your Safaricom line will be deactivated. Send this code to our agent to verify your SIM registration.' },
    { label: 'Prize Scam', text: 'Congratulations! You have won KSH 50,000 in our promotion. Pay KSH 500 processing fee to claim your prize.' },
    { label: 'Job Scam', text: 'We are hiring. Salary KSH 80,000. Send KSH 1,500 registration fee to our HR department via M-Pesa.' },
    { label: 'Family Scam', text: 'Mum this is me. My phone broke. This is my friend number. I am in hospital please send 5000 urgently.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .sms-pad{padding:20px 16px!important;} .sms-examples{grid-template-columns:1fr!important;} }`}</style>

      <div style={{ background: 'rgba(245,158,11,0.05)', borderBottom: '1px solid rgba(245,158,11,0.15)', padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => router.push('/shield')} style={{ background: 'none', border: 'none', color: '#F59E0B', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ fontWeight: 800, fontSize: '18px' }}>📱 SMS Scam Analyser</h1>
        <span style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>GROQ AI</span>
      </div>

      <div className="sms-pad" style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.7 }}>
          Received a suspicious message? Paste it below and our AI will instantly tell you if it is a scam, what type it is, and what to do. Free, no login required.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Paste Suspicious Message Here</label>
          <textarea value={sms} onChange={e => setSms(e.target.value)} rows={5}
            placeholder="Paste the suspicious SMS, WhatsApp message, or call script here..."
            style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'system-ui', lineHeight: 1.6 }} />
          <button onClick={analyse} disabled={loading || !sms.trim()}
            style={{ width: '100%', background: '#F59E0B', color: '#000', border: 'none', padding: '14px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: '15px', marginTop: '12px' }}>
            {loading ? '⏳ Analysing with AI...' : '🤖 Analyse Message'}
          </button>
        </div>

        {/* Quick Examples */}
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Try an example:</p>
        <div className="sms-examples" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '24px' }}>
          {examples.map((e, i) => (
            <button key={i} onClick={() => { setSms(e.text); }}
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', color: '#F59E0B', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, textAlign: 'left' }}>
              {e.label} →
            </button>
          ))}
        </div>

        {result && (
          <div style={{ background: result.is_scam ? 'rgba(255,77,109,0.08)' : 'rgba(0,232,122,0.08)', border: `2px solid ${result.is_scam ? 'rgba(255,77,109,0.3)' : 'rgba(0,232,122,0.3)'}`, borderRadius: '16px', padding: '24px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 900, color: result.is_scam ? severityColor(result.severity) : '#00E87A', marginBottom: '4px' }}>
                  {result.is_scam ? `🚨 SCAM DETECTED` : '✅ LOOKS SAFE'}
                </p>
                {result.scam_label && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{result.scam_label}</p>}
              </div>
              {result.is_scam && (
                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '10px 16px' }}>
                  <p style={{ fontSize: '26px', fontWeight: 900, color: severityColor(result.severity), marginBottom: '2px' }}>{result.confidence}%</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Confidence</p>
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'rgba(255,255,255,0.7)' }}>AI Analysis:</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{result.explanation}</p>
            </div>

            {result.red_flags?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#FF4D6D' }}>🚩 Red Flags Detected:</p>
                {result.red_flags.map((flag: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: '#FF4D6D', flexShrink: 0 }}>•</span>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{flag}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '14px' }}>
              <p style={{ fontSize: '13px', color: '#F59E0B', fontWeight: 700, marginBottom: '4px' }}>💡 What you should do:</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{result.advice}</p>
            </div>

            {result.is_scam && (
              <button onClick={() => router.push('/shield/report')} style={{ width: '100%', background: '#FF4D6D', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', marginTop: '16px' }}>
                🚨 Report the Number Behind This Scam
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
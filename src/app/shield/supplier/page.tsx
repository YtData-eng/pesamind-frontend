'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';

export default function SupplierVerification() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const verify = async () => {
    if (!phone) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API}/shield/verify-supplier/${phone.replace(/\s/g, '')}`);
      const json = await res.json();
      setResult(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const riskColor = (level: string) => ({ trusted: '#00E87A', moderate: '#F59E0B', unknown: '#FF8C42', dangerous: '#FF4D6D' }[level] || '#888888');

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', fontFamily: 'system-ui', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; } @media(max-width:768px){ .sup-pad{padding:20px 16px!important;} }`}</style>

      <div style={{ background: 'rgba(0,196,255,0.05)', borderBottom: '1px solid rgba(0,196,255,0.15)', padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => router.push('/shield')} style={{ background: 'none', border: 'none', color: '#00C4FF', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <h1 style={{ fontWeight: 800, fontSize: '18px' }}>🏢 Supplier Verification</h1>
      </div>

      <div className="sup-pad" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.7 }}>
          Before paying a supplier, enter their M-Pesa number to check their payment reputation. See how many people have paid them and if they have any fraud reports.
        </p>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,196,255,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Supplier's M-Pesa Number</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verify()}
              placeholder="07XX XXX XXX"
              style={{ flex: 1, padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '16px', outline: 'none' }} />
            <button onClick={verify} disabled={loading || !phone}
              style={{ background: '#00C4FF', color: '#000', border: 'none', padding: '14px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
              {loading ? '⏳' : '✓ Verify'}
            </button>
          </div>
        </div>

        {result && (
          <div style={{ background: `${riskColor(result.risk_level)}15`, border: `2px solid ${riskColor(result.risk_level)}40`, borderRadius: '16px', padding: '24px' }}>
            <p style={{ fontSize: '20px', fontWeight: 900, color: riskColor(result.risk_level), marginBottom: '12px' }}>
              {result.risk_level === 'trusted' ? '✅ TRUSTED SUPPLIER' :
               result.risk_level === 'dangerous' ? '🚨 DANGEROUS — DO NOT PAY' :
               result.risk_level === 'moderate' ? '⚠️ MODERATE RISK' : '❓ UNKNOWN SUPPLIER'}
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px', lineHeight: 1.6 }}>{result.verdict}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { label: 'Payment History', value: `${result.transaction_count} payments` },
                { label: 'Total Paid', value: `KSH ${Number(result.total_paid).toLocaleString()}` },
                { label: 'Fraud Reports', value: result.fraud_reports > 0 ? `⚠️ ${result.fraud_reports} reports` : '✅ None' },
                { label: 'Risk Level', value: result.risk_level?.toUpperCase() },
              ].map((d, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{d.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{d.value}</p>
                </div>
              ))}
            </div>

            {result.fraud_reports > 0 && (
              <button onClick={() => router.push(`/shield/check?phone=${phone}`)} style={{ width: '100%', background: '#FF4D6D', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                🔍 View Full Fraud Report for This Number
              </button>
            )}
          </div>
        )}

        <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#00C4FF' }}>💡 Safe Supplier Tips</p>
          {['Always meet the supplier physically before large payments', 'Pay in instalments — deposit first, balance on delivery', 'Get a receipt or agreement in writing', 'Ask for references from other buyers', 'If something feels wrong, trust your instinct'].map((tip, i) => (
            <p key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>• {tip}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
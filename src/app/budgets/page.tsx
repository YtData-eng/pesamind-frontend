'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';
const ICONS: Record<string, string> = { food_dining:'🍽', transport:'🚗', utilities:'💡', shopping:'🛍', airtime_data:'📱', entertainment:'🎬', healthcare:'💊', education:'📚', savings:'💰', business:'🏢', other:'📦', family_support:'👨‍👩‍👧', rent:'🏠', salary:'💳' };
const CATEGORIES = ['food_dining','transport','utilities','shopping','airtime_data','entertainment','healthcare','education','savings','business','family_support','rent','other'];

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
    { href: '/shield', label: '🛡️ Shield' },
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
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

export default function Budgets() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: CATEGORIES[0], amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [saving, setSaving] = useState(false);
  const [genResult, setGenResult] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchBudgets(token);
  }, []);

  const fetchBudgets = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/analytics/budgets?month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setBudgets(json.budgets || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const generateBudgets = async () => {
    setGenerating(true);
    const token = localStorage.getItem('token')!;
    try {
      const res = await fetch(`${API}/analytics/generate-budgets`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setGenResult(json);
      fetchBudgets(token);
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const saveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token')!;
    try {
      await fetch(`${API}/analytics/budgets`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
      fetchBudgets(token);
      setForm(f => ({ ...f, amount: '' }));
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const totalBudget = budgets.reduce((s, b) => s + Number(b.amount), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent || 0), 0);
  const overBudget = budgets.filter(b => Number(b.spent) > Number(b.amount)).length;

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .budgets-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .budgets-header button { width: 100% !important; }
          .budgets-stats { grid-template-columns: 1fr !important; }
          .budgets-main { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px' }}>

        <div className="budgets-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 800, marginBottom: '4px' }}>◎ Budget Tracker</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>AI-powered spending limits</p>
          </div>
          <button onClick={generateBudgets} disabled={generating} style={{ background: 'linear-gradient(135deg,#00E87A,#00C4FF)', color: '#000', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
            {generating ? '⏳ Generating...' : '🤖 Generate with AI'}
          </button>
        </div>

        {/* Savings Target */}
        <div style={{ background: 'linear-gradient(135deg,rgba(123,94,167,0.15),rgba(0,232,122,0.08))', border: '1px solid rgba(123,94,167,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>🎯 Savings Target</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: totalBudget > 0 ? '10px' : '0' }}>
                {totalBudget > 0 ? `Budget: KSH ${totalBudget.toLocaleString()} · Spent: KSH ${totalSpent.toLocaleString()}` : 'Generate budgets with AI to see your savings target'}
              </p>
              {totalBudget > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Budget used</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: totalSpent > totalBudget ? '#FF4D6D' : '#00E87A' }}>{Math.round((totalSpent / totalBudget) * 100)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${Math.min(Math.round((totalSpent / totalBudget) * 100), 100)}%`, background: totalSpent > totalBudget ? '#FF4D6D' : '#00E87A', borderRadius: '3px' }} />
                  </div>
                </div>
              )}
            </div>
            {totalBudget > 0 && (
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 800, color: totalSpent > totalBudget ? '#FF4D6D' : '#00E87A' }}>KSH {Math.max(0, totalBudget - totalSpent).toLocaleString()}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>potential savings</p>
              </div>
            )}
          </div>
        </div>

        <div className="budgets-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Budget', value: `KSH ${totalBudget.toLocaleString()}`, color: '#00E87A' },
            { label: 'Total Spent', value: `KSH ${totalSpent.toLocaleString()}`, color: '#FF4D6D' },
            { label: 'Over Budget', value: `${overBudget} categories`, color: overBudget > 0 ? '#FF4D6D' : '#00E87A' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: 'clamp(14px,3vw,20px)', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {genResult && (
          <div style={{ background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
            <p style={{ color: '#00E87A', fontWeight: 700, fontSize: '13px' }}>✅ AI generated {genResult.budgets?.length} budgets!</p>
          </div>
        )}

        <div className="budgets-main" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>This Month ({budgets.length} budgets)</h3>
            {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '24px', fontSize: '13px' }}>Loading...</p> :
              budgets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>🤖</div>
                  <p style={{ fontWeight: 700, marginBottom: '6px', fontSize: '14px' }}>No budgets yet</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '16px' }}>Let AI generate budgets from your spending history</p>
                  <button onClick={generateBudgets} disabled={generating} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                    {generating ? '⏳ Generating...' : '🤖 Generate with AI'}
                  </button>
                </div>
              ) : budgets.map((b, i) => {
                const spent = Number(b.spent) || 0;
                const budget = Number(b.amount) || 1;
                const pct = Math.min(Math.round((spent / budget) * 100), 100);
                const over = spent > budget;
                const warning = pct >= 80 && !over;
                return (
                  <div key={i} style={{ padding: '14px', background: over ? 'rgba(255,77,109,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${over ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '18px', flexShrink: 0 }}>{ICONS[b.category] || '📦'}</span>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.category?.replace(/_/g, ' ')}</p>
                          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>KSH {spent.toLocaleString()} / KSH {budget.toLocaleString()}</p>
                        </div>
                      </div>
                      <span style={{ background: over ? 'rgba(255,77,109,0.2)' : warning ? 'rgba(245,158,11,0.2)' : 'rgba(0,232,122,0.2)', color: over ? '#FF4D6D' : warning ? '#F59E0B' : '#00E87A', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, flexShrink: 0, marginLeft: '8px' }}>
                        {over ? `+${Math.round(((spent - budget) / budget) * 100)}%` : `${pct}%`}
                      </span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#FF4D6D' : warning ? '#F59E0B' : '#00E87A', borderRadius: '3px' }} />
                    </div>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                      {over ? `Over by KSH ${(spent - budget).toLocaleString()}` : `KSH ${(budget - spent).toLocaleString()} remaining`}
                    </p>
                  </div>
                );
              })
            }
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', height: 'fit-content' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>Add Budget</h3>
            <form onSubmit={saveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px' }}>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{ICONS[c]} {c.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount (KSH)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="5000" required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={saving} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '11px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                {saving ? 'Saving...' : '+ Add Budget'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
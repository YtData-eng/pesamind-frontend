'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API, APP_URL } from '../../lib/config';

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
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 40px', display: 'flex', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '24px', padding: '12px 0' }}>
        <div style={{ width: '28px', height: '28px', background: '#00E87A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>₿</div>
        <span style={{ fontWeight: 800, fontSize: '16px' }}>PesaMind</span>
      </div>
      {links.map(l => (
        <button key={l.href} onClick={() => router.push(l.href)}
          style={{ padding: '14px 16px', background: 'none', border: 'none', color: path === l.href ? '#00E87A' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', fontWeight: path === l.href ? 700 : 400, borderBottom: path === l.href ? '2px solid #00E87A' : '2px solid transparent' }}>
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
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white' }}>
      <Nav />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>◎ Budget Tracker</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>AI-powered spending limits</p>
          </div>
          <button onClick={generateBudgets} disabled={generating} style={{ background: 'linear-gradient(135deg, #00E87A, #00C4FF)', color: '#000', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
            {generating ? '⏳ Generating...' : '🤖 Generate with AI'}
          </button>
        </div>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Budget', value: `KSH ${totalBudget.toLocaleString()}`, color: '#00E87A' },
            { label: 'Total Spent', value: `KSH ${totalSpent.toLocaleString()}`, color: '#FF4D6D' },
            { label: 'Over Budget', value: `${overBudget} categories`, color: overBudget > 0 ? '#FF4D6D' : '#00E87A' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
 

        {/* Savings Target */}
<div style={{ background: 'linear-gradient(135deg, rgba(123,94,167,0.15), rgba(0,232,122,0.08))', border: '1px solid rgba(123,94,167,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>🎯 Savings Target</h3>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
        {totalBudget > 0
          ? `Budget: KSH ${totalBudget.toLocaleString()} · Spent: KSH ${totalSpent.toLocaleString()} · Saved: KSH ${Math.max(0, totalBudget - totalSpent).toLocaleString()}`
          : 'Generate budgets with AI to see your savings target'}
      </p>
      {totalBudget > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Budget used</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: totalSpent > totalBudget ? '#FF4D6D' : '#00E87A' }}>
              {Math.round((totalSpent / totalBudget) * 100)}%
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
            <div style={{ height: '100%', width: `${Math.min(Math.round((totalSpent / totalBudget) * 100), 100)}%`, background: totalSpent > totalBudget ? '#FF4D6D' : '#00E87A', borderRadius: '4px', transition: 'width 0.8s ease' }} />
          </div>
        </div>
      )}
    </div>
    <div style={{ textAlign: 'right', marginLeft: '24px' }}>
      <p style={{ fontSize: '32px', fontWeight: 800, color: totalSpent > totalBudget ? '#FF4D6D' : '#00E87A' }}>
        KSH {Math.max(0, totalBudget - totalSpent).toLocaleString()}
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>potential savings</p>
    </div>
  </div>
</div>
        {genResult && (
          <div style={{ background: 'rgba(0,232,122,0.05)', border: '1px solid rgba(0,232,122,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#00E87A', fontWeight: 700 }}>✅ AI generated {genResult.budgets?.length} budgets based on your spending history!</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
          {/* Budget List */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>This Month ({budgets.length} budgets)</h3>
            {loading ? <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>Loading...</p> :
              budgets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
                  <p style={{ fontWeight: 700, marginBottom: '8px' }}>No budgets yet</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>Let AI analyze your spending and create budgets automatically</p>
                  <button onClick={generateBudgets} disabled={generating} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
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
                  <div key={i} style={{ padding: '16px', background: over ? 'rgba(255,77,109,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${over ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{ICONS[b.category] || '📦'}</span>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>{b.category?.replace(/_/g, ' ')}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>KSH {spent.toLocaleString()} / KSH {budget.toLocaleString()}</p>
                        </div>
                      </div>
                      <span style={{ background: over ? 'rgba(255,77,109,0.2)' : warning ? 'rgba(245,158,11,0.2)' : 'rgba(0,232,122,0.2)', color: over ? '#FF4D6D' : warning ? '#F59E0B' : '#00E87A', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                        {over ? `+${Math.round(((spent - budget) / budget) * 100)}% over` : `${pct}%`}
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: over ? '#FF4D6D' : warning ? '#F59E0B' : '#00E87A', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                      {over ? `Over by KSH ${(spent - budget).toLocaleString()}` : `KSH ${(budget - spent).toLocaleString()} remaining`}
                    </p>
                  </div>
                );
              })
            }
          </div>

          {/* Manual Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Add Budget</h3>
            <form onSubmit={saveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px' }}>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{ICONS[c]} {c.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount (KSH)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="5000" required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={saving} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                {saving ? 'Saving...' : '+ Add Budget'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const CATEGORIES = ['food_dining','transport','utilities','shopping','airtime_data','entertainment','healthcare','education','savings','business','other'];

export default function Budgets() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [form, setForm] = useState({ category: CATEGORIES[0], amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchBudgets(token);
  }, []);

  const fetchBudgets = async (token: string) => {
    try {
      const res = await fetch(`${API}/budgets?month=${new Date().getMonth()+1}&year=${new Date().getFullYear()}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setBudgets(json.budgets || []);
    } catch (e) { console.error(e); }
  };

  const saveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token')!;
    try {
      await fetch(`${API}/budgets`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }) });
      fetchBudgets(token);
      setForm(f => ({ ...f, amount: '' }));
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Budget Tracker</h1>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>← Dashboard</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Set Budget</h3>
            <form onSubmit={saveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Amount (KSH)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="5000" required style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
              </div>
              <button type="submit" disabled={saving} style={{ background: '#00E87A', color: '#000', fontWeight: 700, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                {saving ? 'Saving...' : '+ Set Budget'}
              </button>
            </form>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>This Month ({budgets.length} budgets)</h3>
            {budgets.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '32px' }}>No budgets set yet</p> : (
              budgets.map((b, i) => (
                <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ textTransform: 'capitalize' }}>{b.category?.replace(/_/g,' ')}</span>
                    <span style={{ color: b.status === 'over' ? '#FF4D6D' : '#00E87A', fontWeight: 700 }}>{b.usage_percent}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                    <div style={{ height: '100%', width: `${Math.min(b.usage_percent, 100)}%`, background: b.status === 'over' ? '#FF4D6D' : '#00E87A', borderRadius: '3px' }} />
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>KSH {Number(b.spent).toLocaleString()} / KSH {Number(b.budget_amount).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
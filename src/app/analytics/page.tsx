'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const CATEGORIES = ['','food_dining','transport','utilities','shopping','airtime_data','entertainment','healthcare','education','savings','business','other'];

export default function Analytics() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchTx(token);
  }, [page, category, type]);

  const fetchTx = async (token: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (category) params.set('category', category);
    if (type) params.set('type', type);
    try {
      const res = await fetch(`${API}/analytics/transactions?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setTransactions(json.transactions || []);
      setTotal(json.pagination?.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', padding: '40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Transactions</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{total} total transactions</p>
          </div>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>← Dashboard</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
          </select>
          <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            <option value="">All Types</option>
            <option value="receive">Income</option>
            <option value="send_money">Expense</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 120px', gap: '16px', padding: '12px 24px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {['Date','Description','Category','Amount'].map(h => <p key={h} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>)}
          </div>
          {loading ? <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>Loading...</p> :
            transactions.length === 0 ? <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>No transactions found</p> :
            transactions.map((tx, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 120px', gap: '16px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{new Date(tx.transaction_date).toLocaleDateString()}</p>
                <p style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{tx.category?.replace(/_/g,' ') || 'other'}</p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D' }}>
                  {tx.type === 'receive' ? '+' : '-'}KSH {Number(tx.amount).toLocaleString()}
                </p>
              </div>
            ))
          }
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px' }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>← Prev</button>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Page {page}</span>
            <button onClick={() => setPage(p => p+1)} disabled={transactions.length < 20} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
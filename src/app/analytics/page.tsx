'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API, APP_URL } from '../../lib/config';

const CATEGORIES = ['','food_dining','transport','utilities','shopping','airtime_data','entertainment','healthcare','education','savings','business','family_support','rent','other'];
const ICONS: Record<string,string> = { food_dining:'🍽', transport:'🚗', utilities:'💡', shopping:'🛍', airtime_data:'📱', entertainment:'🎬', healthcare:'💊', education:'📚', savings:'💰', business:'🏢', other:'📦', family_support:'👨‍👩‍👧', rent:'🏠' };

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

export default function Analytics() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchTx(token);
  }, [page, category, type]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchSummary(token);
  }, []);

  const fetchSummary = async (token: string) => {
    try {
      const res = await fetch(`${API}/analytics/overview`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      setSummary(json.totals || {});
    } catch (e) { console.error(e); }
  };

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

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white' }}>
      <Nav />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>📈 Transactions</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{total.toLocaleString()} total transactions</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Income', value: `KSH ${Number(summary.total_income || 0).toLocaleString()}`, color: '#00E87A' },
            { label: 'Total Expenses', value: `KSH ${Number(summary.total_expenses || 0).toLocaleString()}`, color: '#FF4D6D' },
            { label: 'Transactions', value: summary.transaction_count || 0, color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${category ? '#00E87A' : 'rgba(255,255,255,0.1)'}`, color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{ICONS[c]} {c.replace(/_/g,' ')}</option>)}
          </select>
          <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
            style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${type ? '#00E87A' : 'rgba(255,255,255,0.1)'}`, color: 'white', fontSize: '13px', cursor: 'pointer' }}>
            <option value="">All Types</option>
            <option value="receive" style={{ background: '#1a1a2e' }}>↙ Income</option>
            <option value="send_money" style={{ background: '#1a1a2e' }}>↗ Expense</option>
          </select>
          {(category || type) && (
            <button onClick={() => { setCategory(''); setType(''); setPage(1); }} style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D', fontSize: '13px', cursor: 'pointer' }}>
              ✕ Clear filters
            </button>
          )}
          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', fontSize: '13px', alignSelf: 'center' }}>
            Page {page} of {totalPages || 1}
          </span>
        </div>

        {/* Transaction Table */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 130px 1fr 120px 120px 100px', gap: '16px', padding: '12px 20px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['', 'Date', 'Description', 'Category', 'Amount', 'Type'].map((h, i) => (
              <p key={i} style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
              <p>No transactions found</p>
            </div>
          ) : transactions.map((tx, i) => (
            <div key={i}
              onClick={() => setSelected(selected?.id === tx.id ? null : tx)}
              style={{ cursor: 'pointer' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 130px 1fr 120px 120px 100px', gap: '16px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: selected?.id === tx.id ? 'rgba(0,232,122,0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (selected?.id !== tx.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (selected?.id !== tx.id) e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'; }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: tx.type === 'receive' ? 'rgba(0,232,122,0.15)' : 'rgba(255,77,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  {tx.type === 'receive' ? '↙' : '↗'}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', alignSelf: 'center' }}>{new Date(tx.transaction_date).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                <p style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', alignSelf: 'center' }}>{tx.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'center' }}>
                  <span style={{ fontSize: '14px' }}>{ICONS[tx.category] || '📦'}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{tx.category?.replace(/_/g,' ') || 'other'}</span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', alignSelf: 'center' }}>
                  {tx.type === 'receive' ? '+' : '-'}KSH {Number(tx.amount).toLocaleString()}
                </p>
                <span style={{ alignSelf: 'center', background: tx.type === 'receive' ? 'rgba(0,232,122,0.1)' : 'rgba(255,77,109,0.1)', color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                  {tx.type === 'receive' ? 'Income' : 'Expense'}
                </span>
              </div>

              {/* Expanded Details */}
              {selected?.id === tx.id && (
                <div style={{ padding: '16px 20px 20px', background: 'rgba(0,232,122,0.03)', borderBottom: '1px solid rgba(0,232,122,0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                      { label: 'Transaction ID', value: tx.transaction_id || 'N/A' },
                      { label: 'Balance After', value: tx.balance ? `KSH ${Number(tx.balance).toLocaleString()}` : 'N/A' },
                      { label: 'Category', value: tx.category?.replace(/_/g, ' ') || 'other' },
                      { label: 'Status', value: tx.is_flagged ? '⚠️ Flagged' : '✅ Clean' },
                    ].map((d, j) => (
                      <div key={j} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px' }}>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{d.label}</p>
                        <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '12px' }}>Full description: {tx.description}</p>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Showing {((page-1)*20)+1}–{Math.min(page*20, total)} of {total.toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setPage(1)} disabled={page <= 1} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: page <= 1 ? 'rgba(255,255,255,0.2)' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>«</button>
              <button onClick={() => setPage(p => p-1)} disabled={page <= 1} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: page <= 1 ? 'rgba(255,255,255,0.2)' : 'white', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>← Prev</button>
              <span style={{ padding: '8px 16px', background: 'rgba(0,232,122,0.1)', borderRadius: '8px', color: '#00E87A', fontWeight: 700, fontSize: '13px' }}>{page}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page >= totalPages} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Next →</button>
              <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: page >= totalPages ? 'rgba(255,255,255,0.2)' : 'white', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
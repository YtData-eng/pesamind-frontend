'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.pesamind.online/api';
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
    <div style={{ minHeight: '100vh', background: '#050F09', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .tx-stats { grid-template-columns: 1fr !important; }
          .tx-filters { flex-wrap: wrap !important; }
          .tx-col-balance, .tx-col-type { display: none !important; }
          .tx-grid { grid-template-columns: 32px 100px 1fr 100px !important; }
          .tx-detail-grid { grid-template-columns: repeat(2,1fr) !important; }
          .tx-pagination { flex-wrap: wrap !important; justify-content: center !important; }
        }
      `}</style>
      <Nav />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'clamp(20px,5vw,28px)', fontWeight: 800, marginBottom: '4px' }}>📈 Transactions</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{total.toLocaleString()} total transactions</p>
        </div>

        <div className="tx-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Income', value: `KSH ${Number(summary.total_income||0).toLocaleString()}`, color: '#00E87A' },
            { label: 'Total Expenses', value: `KSH ${Number(summary.total_expenses||0).toLocaleString()}`, color: '#FF4D6D' },
            { label: 'Transactions', value: summary.transaction_count||0, color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</p>
              <p style={{ fontSize: 'clamp(14px,3vw,18px)', fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="tx-filters" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${category ? '#00E87A' : 'rgba(255,255,255,0.1)'}`, color: 'white', fontSize: '12px', cursor: 'pointer', flex: 1 }}>
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{ICONS[c]} {c.replace(/_/g,' ')}</option>)}
          </select>
          <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
            style={{ padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${type ? '#00E87A' : 'rgba(255,255,255,0.1)'}`, color: 'white', fontSize: '12px', cursor: 'pointer', flex: 1 }}>
            <option value="">All Types</option>
            <option value="receive" style={{ background: '#1a1a2e' }}>↙ Income</option>
            <option value="send_money" style={{ background: '#1a1a2e' }}>↗ Expense</option>
          </select>
          {(category || type) && (
            <button onClick={() => { setCategory(''); setType(''); setPage(1); }} style={{ padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', color: '#FF4D6D', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>✕ Clear</button>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          <div className="tx-grid" style={{ display: 'grid', gridTemplateColumns: '32px 110px 1fr 110px 100px 90px', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['', 'Date', 'Description', 'Category', 'Amount', 'Type'].map((h, i) => (
              <p key={i} className={i === 3 ? 'tx-col-balance' : i === 5 ? 'tx-col-type' : ''} style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>⏳ Loading...</div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>📭 No transactions found</div>
          ) : transactions.map((tx, i) => (
            <div key={i} onClick={() => setSelected(selected?.id === tx.id ? null : tx)} style={{ cursor: 'pointer' }}>
              <div className="tx-grid" style={{ display: 'grid', gridTemplateColumns: '32px 110px 1fr 110px 100px 90px', gap: '10px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: selected?.id === tx.id ? 'rgba(0,232,122,0.05)' : 'transparent' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: tx.type === 'receive' ? 'rgba(0,232,122,0.15)' : 'rgba(255,77,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                  {tx.type === 'receive' ? '↙' : '↗'}
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', alignSelf: 'center' }}>{new Date(tx.transaction_date).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' })}</p>
                <p style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', alignSelf: 'center' }}>{tx.description}</p>
                <div className="tx-col-balance" style={{ display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'center' }}>
                  <span style={{ fontSize: '12px' }}>{ICONS[tx.category] || '📦'}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.category?.replace(/_/g,' ') || 'other'}</span>
                </div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', alignSelf: 'center' }}>
                  {tx.type === 'receive' ? '+' : '-'}KSH {Number(tx.amount).toLocaleString()}
                </p>
                <span className="tx-col-type" style={{ alignSelf: 'center', background: tx.type === 'receive' ? 'rgba(0,232,122,0.1)' : 'rgba(255,77,109,0.1)', color: tx.type === 'receive' ? '#00E87A' : '#FF4D6D', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 }}>
                  {tx.type === 'receive' ? 'Income' : 'Expense'}
                </span>
              </div>
              {selected?.id === tx.id && (
                <div style={{ padding: '14px 16px', background: 'rgba(0,232,122,0.03)', borderBottom: '1px solid rgba(0,232,122,0.1)' }}>
                  <div className="tx-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '8px' }}>
                    {[
                      { label: 'Transaction ID', value: tx.transaction_id || 'N/A' },
                      { label: 'Balance After', value: tx.balance ? `KSH ${Number(tx.balance).toLocaleString()}` : 'N/A' },
                      { label: 'Category', value: tx.category?.replace(/_/g,' ') || 'other' },
                      { label: 'Status', value: tx.is_flagged ? '⚠️ Flagged' : '✅ Clean' },
                    ].map((d, j) => (
                      <div key={j} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px' }}>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{d.label}</p>
                        <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{d.value}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Full: {tx.description}</p>
                </div>
              )}
            </div>
          ))}

          <div className="tx-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{((page-1)*20)+1}–{Math.min(page*20, total)} of {total.toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { label: '«', disabled: page <= 1, action: () => setPage(1) },
                { label: '←', disabled: page <= 1, action: () => setPage(p => p-1) },
                { label: String(page), disabled: false, action: () => {}, active: true },
                { label: '→', disabled: page >= totalPages, action: () => setPage(p => p+1) },
                { label: '»', disabled: page >= totalPages, action: () => setPage(totalPages) },
              ].map((btn, i) => (
                <button key={i} onClick={btn.action} disabled={btn.disabled}
                  style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', background: (btn as any).active ? 'rgba(0,232,122,0.15)' : 'rgba(255,255,255,0.05)', color: btn.disabled ? 'rgba(255,255,255,0.2)' : (btn as any).active ? '#00E87A' : 'white', cursor: btn.disabled ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: (btn as any).active ? 700 : 400 }}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
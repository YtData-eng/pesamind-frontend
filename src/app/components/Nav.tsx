'use client';
import { useRouter, usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: '📊 Dashboard' },
  { href: '/statements', label: '📄 Statements' },
  { href: '/budgets', label: '◎ Budgets' },
  { href: '/fraud', label: '🛡️ Fraud' },
  { href: '/analytics', label: '📈 Transactions' },
];

export default function Nav() {
  const router = useRouter();
  const path = usePathname();

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 40px', display: 'flex', gap: '4px', alignItems: 'center' }}>
      {links.map(l => (
        <button key={l.href} onClick={() => router.push(l.href)}
          style={{ padding: '14px 18px', background: 'none', border: 'none', color: path === l.href ? '#00E87A' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '13px', fontWeight: path === l.href ? 700 : 400, borderBottom: path === l.href ? '2px solid #00E87A' : '2px solid transparent', transition: 'all 0.2s' }}>
          {l.label}
        </button>
      ))}
    </div>
  );
}
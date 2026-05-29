'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const s = {
    page: { margin: 0, padding: 0, background: '#050F09', color: '#fff', fontFamily: 'system-ui,sans-serif', overflowX: 'hidden' as const },
    nav: { position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(5,15,9,0.95)' : 'transparent', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', backdropFilter: scrolled ? 'blur(12px)' : 'none', transition: 'all 0.3s' },
    logo: { display: 'flex', alignItems: 'center', gap: 10 },
    logoIcon: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#00E87A,#00C4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#050F09', fontSize: 16 },
    logoText: { fontWeight: 900, fontSize: 18, color: '#fff', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: 12, alignItems: 'center' },
    btnOutline: { color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: 14, padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' },
    btnGreen: { background: 'linear-gradient(135deg,#00E87A,#00C4FF)', color: '#050F09', textDecoration: 'none', fontSize: 14, fontWeight: 800, padding: '8px 20px', borderRadius: 8 },
    hero: { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const, padding: '140px 24px 80px', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,232,122,0.15) 0%, transparent 65%), #050F09' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,232,122,0.08)', border: '1px solid rgba(0,232,122,0.2)', borderRadius: 99, padding: '6px 18px', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 36 },
    dot: { width: 6, height: 6, borderRadius: '50%', background: '#00E87A' },
    h1: { fontSize: 'clamp(38px,7vw,78px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2.5px', margin: '0 0 24px', maxWidth: 820 },
    grad: { background: 'linear-gradient(135deg,#00E87A,#00C4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    sub: { fontSize: 18, color: 'rgba(255,255,255,0.45)', maxWidth: 500, lineHeight: 1.75, margin: '0 0 48px' },
    ctas: { display: 'flex', gap: 16, flexWrap: 'wrap' as const, justifyContent: 'center', marginBottom: 72 },
    ctaPrimary: { background: 'linear-gradient(135deg,#00E87A,#00C4FF)', color: '#050F09', textDecoration: 'none', fontWeight: 900, fontSize: 15, padding: '15px 36px', borderRadius: 12, boxShadow: '0 0 40px rgba(0,232,122,0.25)' },
    ctaSecondary: { color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 14, padding: '15px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' },
    card: { width: '100%', maxWidth: 660, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, textAlign: 'left' as const },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cardLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' as const },
    cardBadge: { fontSize: 11, background: 'rgba(0,232,122,0.1)', color: '#00E87A', padding: '3px 10px', borderRadius: 99 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 18 },
    statBox: { background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px 16px' },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 5px' },
    chips: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
    chip: { fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 99, padding: '4px 12px', color: 'rgba(255,255,255,0.45)' },
    statsBar: { borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '56px 24px' },
    statsInner: { maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 32, textAlign: 'center' as const },
    bigNum: { fontSize: 38, fontWeight: 900, background: 'linear-gradient(135deg,#00E87A,#00C4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 6px' },
    numLabel: { fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0 },
    section: { padding: '96px 24px' },
    sectionDark: { padding: '80px 24px', background: 'rgba(255,255,255,0.015)' },
    sectionInner: { maxWidth: 1000, margin: '0 auto' },
    sectionHead: { textAlign: 'center' as const, marginBottom: 60 },
    tag: { fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, marginBottom: 14 },
    h2: { fontSize: 'clamp(26px,4vw,46px)', fontWeight: 900, letterSpacing: '-1px', margin: 0 },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 18 },
    featureCard: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '26px 22px' },
    grid3b: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 22 },
    stepNum: { fontSize: 42, fontWeight: 900, background: 'linear-gradient(135deg,#00E87A,#00C4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 14px' },
    cta: { padding: '96px 24px', textAlign: 'center' as const, background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(0,232,122,0.1) 0%, transparent 65%)' },
    h2big: { fontSize: 'clamp(30px,5vw,58px)', fontWeight: 900, letterSpacing: '-1.5px', margin: '0 0 18px' },
    footer: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 40px', display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.28)' },
  };

  return (
    <div style={s.page}>
      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.logo}>
          <div style={s.logoIcon}>P</div>
          <span style={s.logoText}>PesaMind</span>
        </div>
        <div style={s.navLinks}>
          <Link href="/login" style={s.btnOutline}>Sign in</Link>
          <Link href="/register" style={s.btnGreen}>Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.badge}><span style={s.dot}></span>Built for Kenya · M-Pesa powered</div>
        <h1 style={s.h1}>Your M-Pesa money,{' '}<span style={s.grad}>finally clear.</span></h1>
        <p style={s.sub}>Upload your M-Pesa statement and get instant AI-powered spending insights, fraud detection, budgets, and monthly financial summaries.</p>
        <div style={s.ctas}>
          <Link href="/register" style={s.ctaPrimary}>Upload your statement →</Link>
          <Link href="/login" style={s.ctaSecondary}>I have an account</Link>
        </div>
        {/* Mock card */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardLabel}>November 2024 · AI Analysis</span>
            <span style={s.cardBadge}>✓ Complete</span>
          </div>
          <div style={s.statsGrid}>
            {([['Income','KES 82,400','#00E87A'],['Spent','KES 54,120','#FF6B6B'],['Saved','KES 28,280','#00C4FF']] as [string,string,string][]).map(([l,v,c])=>(
              <div key={l} style={s.statBox}>
                <p style={s.statLabel}>{l}</p>
                <p style={{fontSize:15,fontWeight:700,color:c,margin:0}}>{v}</p>
              </div>
            ))}
          </div>
          <div style={s.chips}>
            {['🛒 Shopping 32%','🚗 Transport 18%','🍔 Food 22%','💡 Utilities 14%'].map(t=>(
              <span key={t} style={s.chip}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={s.statsBar}>
        <div style={s.statsInner}>
          {([['2M+','Transactions analyzed'],['98%','Fraud accuracy'],['50K+','Kenyan users'],['4.9★','User rating']] as [string,string][]).map(([v,l])=>(
            <div key={l}><p style={s.bigNum}>{v}</p><p style={s.numLabel}>{l}</p></div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionHead}>
            <p style={{...s.tag, color:'#00E87A'}}>Features</p>
            <h2 style={s.h2}>Everything your finances need</h2>
          </div>
          <div style={s.grid3}>
            {[
              ['📊','M-Pesa Insights','Every shilling categorized, visualized, and summarized the moment you upload.'],
              ['🛡️','Fraud Detection','AI flags suspicious patterns, scam signatures, and unusual activity instantly.'],
              ['🎯','Budget Alerts','Set limits per category and get warned before you overspend — not after.'],
              ['🤖','AI Summaries','Monthly plain-English reports with tips tailored to your actual spending.'],
              ['🏪','SME Tools','Bookkeeping, invoicing, payroll and inventory for Kenyan businesses.'],
              ['📈','Trust Score','Build financial reputation that unlocks credit and supplier opportunities.'],
            ].map(([icon,title,desc])=>(
              <div key={title as string} style={s.featureCard}>
                <div style={{fontSize:30,marginBottom:14}}>{icon}</div>
                <h3 style={{fontSize:16,fontWeight:700,margin:'0 0 10px'}}>{title}</h3>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.42)',lineHeight:1.7,margin:0}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={s.sectionDark}>
        <div style={{maxWidth:840,margin:'0 auto'}}>
          <div style={s.sectionHead}>
            <p style={{...s.tag,color:'#00C4FF'}}>How it works</p>
            <h2 style={s.h2}>Three steps to clarity</h2>
          </div>
          <div style={s.grid3b}>
            {[
              ['01','Upload','Download your M-Pesa PDF from MySafaricom and upload it here. CSV also works.'],
              ['02','Analyze','AI categorizes every transaction, detects fraud, and builds your profile.'],
              ['03','Decide','Get a live dashboard with insights, budgets, alerts and monthly AI summaries.'],
            ].map(([n,t,d])=>(
              <div key={n as string} style={s.featureCard}>
                <p style={s.stepNum}>{n}</p>
                <h3 style={{fontSize:19,fontWeight:800,margin:'0 0 10px'}}>{t}</h3>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.42)',lineHeight:1.7,margin:0}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <h2 style={s.h2big}>Ready to understand <span style={s.grad}>your money?</span></h2>
        <p style={{color:'rgba(255,255,255,0.38)',fontSize:16,margin:'0 0 40px'}}>Free to start. No card required.</p>
        <Link href="/register" style={{...s.ctaPrimary, fontSize:16, padding:'16px 44px'}}>Get started for free →</Link>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{...s.logoIcon,width:26,height:26,fontSize:12}}>P</div>
          PesaMind · Africa&apos;s financial trust layer
        </div>
        <div style={{display:'flex',gap:24}}>
          {['Privacy','Terms','Contact'].map(l=><a key={l} href="#" style={{color:'rgba(255,255,255,0.28)',textDecoration:'none'}}>{l}</a>)}
        </div>
        <span>© {new Date().getFullYear()} PesaMind</span>
      </footer>
    </div>
  );
}

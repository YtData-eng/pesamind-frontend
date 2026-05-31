'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/dashboard');
    else router.push('/login');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#050F09', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
    </div>
  );
}
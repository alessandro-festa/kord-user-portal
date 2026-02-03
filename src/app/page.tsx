'use client';

import { useState, useEffect } from 'react';
import MinimalHeader from '@/components/MinimalHeader';
import EmailLoginForm from '@/components/EmailLoginForm';
import { isAuthenticated } from '@/lib/session';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthenticated(isAuth);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
    window.location.href = '/dashboard';
  };

  if (loading) {
    return (
      <>
        <MinimalHeader />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingTop: '80px'
        }}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (authenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return null;
  }

  return (
    <>
      <MinimalHeader />
      <main style={{ paddingTop: '80px' }}>
        <EmailLoginForm onLogin={handleLogin} />
      </main>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { clearSession } from '@/lib/session';
import { useRouter } from 'next/navigation';

export default function MinimalHeader() {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push('/');
  };

  return (
    <header style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#0C322C',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/assets/img/suse-white-logo-green.svg" 
            alt="SUSE" 
            style={{ height: '32px' }}
          />
        </a>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.9)',
              padding: '8px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

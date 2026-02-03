'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';
import { setSession } from '@/lib/session';

interface EmailLoginFormProps {
  onLogin: () => void;
}

export default function EmailLoginForm({ onLogin }: EmailLoginFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await apiClient.getUserByEmail(email);
      
      if (!user) {
        setError('User not found. Please check your email address.');
        return;
      }

      setSession(user);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container theme-white padding-top-xl padding-bottom-xl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="l-container">
        <div className="row">
          <div className="col-lg-6" style={{ margin: '0 auto' }}>
            <div className="simple-card" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h2 className="simple-card-title heading heading--h2" style={{ textAlign: 'center', marginBottom: '30px' }}>
                Sign In
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                Enter your email to access your adapter configurations
              </p>
              
              {error && (
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#fee2e2', 
                  border: '1px solid #ef4444',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  color: '#dc2626'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="button button--primary button--sm-height button--medium button--primary_persimmon button--primary_persimmon__dark"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

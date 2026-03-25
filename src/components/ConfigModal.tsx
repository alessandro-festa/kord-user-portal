'use client';

import React, { useState, useEffect } from 'react';
import { Adapter, ClientConfig } from '@/types';
import { apiClient } from '@/lib/api';
import { getCurrentUserId } from '@/lib/session';

interface ConfigModalProps {
  adapter: Adapter | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ adapter, isOpen, onClose }: ConfigModalProps) {
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'gemini' | 'vscode'>('gemini');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && adapter) {
      loadConfig();
    }
  }, [isOpen, adapter]);

  const loadConfig = async () => {
    setLoading(true);
    setError('');

    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const token = await apiClient.getAdapterToken(userId, adapter!.name);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8911';
      const clientConfig = apiClient.buildClientConfig(userId, adapter!, token, backendUrl);
      
      setConfig(clientConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayConfig = () => {
    if (!config) return {};
    
    if (activeTab === 'gemini') {
      return { mcpServers: config.gemini.mcpServers };
    } else {
      return { 
        inputs: config.vscode.inputs, 
        servers: config.vscode.servers 
      };
    }
  };

  const copyToClipboard = () => {
    if (!config) return;
    
    navigator.clipboard.writeText(JSON.stringify(getDisplayConfig(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !adapter) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 className="heading heading--h3" style={{ margin: 0 }}>
            {adapter.name} Configuration
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
          {loading ? (
            <p>Loading configuration...</p>
          ) : error ? (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#fee2e2', 
              border: '1px solid #ef4444',
              borderRadius: '4px',
              color: '#dc2626'
            }}>
              {error}
            </div>
          ) : config ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                {/* Tab Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <button
                    onClick={() => setActiveTab('gemini')}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: activeTab === 'gemini' ? '2px solid #30BA78' : '1px solid #ddd',
                      backgroundColor: activeTab === 'gemini' ? '#30BA7810' : 'white',
                      color: activeTab === 'gemini' ? '#0C322C' : '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: activeTab === 'gemini' ? 600 : 400,
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                    <span>Gemini / Claude</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('vscode')}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: activeTab === 'vscode' ? '2px solid #30BA78' : '1px solid #ddd',
                      backgroundColor: activeTab === 'vscode' ? '#30BA7810' : 'white',
                      color: activeTab === 'vscode' ? '#0C322C' : '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: activeTab === 'vscode' ? 600 : 400,
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>VSCode</span>
                  </button>
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  {activeTab === 'gemini' 
                    ? 'Configuration for Gemini/Claude Desktop with mcpServers structure.'
                    : 'Configuration for VSCode MCP extension with inputs and servers.'
                  }
                </p>

                {/* Copy button */}
                <button
                  onClick={copyToClipboard}
                  className="button button--secondary button--sm-height button--small"
                  style={{ marginBottom: '16px' }}
                >
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>

                {/* Config display */}
                <pre style={{
                  backgroundColor: '#f3f4f6',
                  padding: '16px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  {JSON.stringify(getDisplayConfig(), null, 2)}
                </pre>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

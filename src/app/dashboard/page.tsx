'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MinimalHeader from '@/components/MinimalHeader';
import AdapterGrid from '@/components/AdapterGrid';
import ConfigModal from '@/components/ConfigModal';
import { apiClient } from '@/lib/api';
import { getCurrentUserId, getCurrentUser, clearSession, isAuthenticated } from '@/lib/session';
import { Adapter } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const [adapters, setAdapters] = useState<Adapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdapter, setSelectedAdapter] = useState<Adapter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [registryData, setRegistryData] = useState<any[]>([]);
  const [loadingRegistryData, setLoadingRegistryData] = useState(false);
  const [fullConfig, setFullConfig] = useState<any>(null);
  const [isFullConfigModalOpen, setIsFullConfigModalOpen] = useState(false);
  const [loadingFullConfig, setLoadingFullConfig] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('Not authenticated');
      }

      // Load both adapters and registry data
      const [adapterData, registryResponse] = await Promise.all([
        apiClient.getAdapters(userId),
        apiClient.browseRegistry(userId)
      ]);
      
      setAdapters(adapterData);
      setRegistryData(registryResponse);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewConfig = (adapter: Adapter) => {
    setSelectedAdapter(adapter);
    setIsModalOpen(true);
  };

  const handleViewDetails = (adapter: Adapter) => {
    setSelectedAdapter(adapter);
    setIsDetailsModalOpen(true);
  };

  const handleGetFullConfig = async () => {
    try {
      setLoadingFullConfig(true);
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('Not authenticated');
      }
      const config = await apiClient.getUserConfig(userId);
      setFullConfig(config);
      setIsFullConfigModalOpen(true);
    } catch (error) {
      console.error('Failed to get full configuration:', error);
      alert('Failed to load full configuration. Please try again.');
    } finally {
      setLoadingFullConfig(false);
    }
  };

  return (
    <>
      <MinimalHeader />
      <main style={{ paddingTop: '80px' }}>
        <div style={{ 
          backgroundColor: '#f9fafb',
          padding: '24px 0',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div className="l-container">
            <div style={{ 
              marginBottom: '20px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '16px' 
            }}>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#0C322C', marginBottom: '4px' }}>
                  SUSE AI Universal Proxy - User Portal
                </h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  Welcome, {currentUser?.name || 'User'} • {adapters.length} Adapter{adapters.length !== 1 ? 's' : ''} Configured
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handleGetFullConfig}
                  disabled={loadingFullConfig}
                  className="button button--primary button--sm-height button--small"
                  style={{ 
                    backgroundColor: '#30BA78',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                  {loadingFullConfig ? 'Loading...' : 'Gemini / Claude'}
                </button>
                
                <button
                  onClick={handleGetFullConfig}
                  disabled={loadingFullConfig}
                  className="button button--primary button--sm-height button--small"
                  style={{ 
                    backgroundColor: '#2563EB',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {loadingFullConfig ? 'Loading...' : 'VSCode'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '40px 0',
          backgroundColor: 'white'
        }}>
          <div className="l-container">
            <div style={{ marginBottom: '24px' }}>
              <h2 className="heading heading--h2" style={{ marginBottom: '8px', fontSize: '24px' }}>
                Your MCP Configurations
              </h2>
            </div>

            <AdapterGrid 
              adapters={adapters} 
              onViewConfig={handleViewConfig}
              onViewDetails={handleViewDetails}
              loading={loading}
              registryData={registryData}
            />
          </div>
        </div>
      </main>

      <ConfigModal
        adapter={selectedAdapter}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdapter(null);
        }}
      />

      {/* Adapter Details Modal */}
      {isDetailsModalOpen && selectedAdapter && (
        <AdapterDetailsModal
          adapter={selectedAdapter}
          registryData={registryData}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedAdapter(null);
          }}
        />
      )}

      {/* Full Configuration Modal */}
      {isFullConfigModalOpen && (
        <FullConfigModal
          config={fullConfig}
          onClose={() => setIsFullConfigModalOpen(false)}
        />
      )}
    </>
  );
}

// Sub-components for better organization
function AdapterDetailsModal({ adapter, registryData, onClose }: { adapter: Adapter, registryData: any[], onClose: () => void }) {
  const findRegistryEntry = () => {
    if (!adapter || !registryData) return null;
    
    const adapterName = (adapter.name || '').toLowerCase();
    const mcpServerId = (adapter.mcpServerId || '').toLowerCase();
    
    return registryData.find((entry: any) => {
      const entryName = (entry.name || '').toLowerCase();
      return entryName === adapterName || 
             entryName === mcpServerId ||
             adapterName.includes(entryName) ||
             entryName.includes(adapterName.replace(/^opensuse-/, ''));
    });
  };

  const registryEntry = findRegistryEntry();
  const icon = registryEntry?._meta?.about?.icon;

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
        maxWidth: '800px',
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
          <div>
            <h3 className="heading heading--h3" style={{ margin: 0 }}>
              Adapter Details
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
              {adapter.name}
            </p>
          </div>
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

        <div style={{ padding: '24px', overflow: 'auto', flex: 1, position: 'relative' }}>
          {registryEntry ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Icon - Top Right */}
              <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {icon && typeof icon === 'string' && icon.startsWith('http') ? (
                    <img 
                      src={icon} 
                      alt={registryEntry.name}
                      style={{ width: '40px', height: '40px', borderRadius: '8px' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: '#30BA78',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      {(registryEntry.name || adapter.name || 'M').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="heading heading--h4" style={{ marginBottom: '12px' }}>
                  Description
                </h4>
                <p style={{ color: '#4B5563', lineHeight: '1.6' }}>
                  {registryEntry?._meta?.about?.description || registryEntry.description || 'No description available'}
                </p>
              </div>

              <div>
                <h4 className="heading heading--h4" style={{ marginBottom: '12px' }}>
                  Configuration
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Name:</span>
                    <span style={{ fontSize: '14px' }}>{adapter.name}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Type:</span>
                    <span style={{ fontSize: '14px' }}>{adapter.connectionType}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Status:</span>
                    <span style={{ 
                      fontSize: '14px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: '#30BA7820',
                      color: '#30BA78'
                    }}>
                      {adapter.status}
                    </span>
                  </div>
                </div>
              </div>

              {registryEntry?._meta?.config && (
                <div>
                  <h4 className="heading heading--h4" style={{ marginBottom: '12px' }}>
                    Environment Variables
                  </h4>
                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    {registryEntry._meta.config.secrets?.map((secret: any, idx: number) => (
                      <div key={idx} style={{ marginBottom: idx !== registryEntry._meta.config.secrets.length - 1 ? '12px' : 0 }}>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '2px' }}>{secret.name}</div>
                        <code style={{ fontSize: '13px', backgroundColor: '#eee', padding: '2px 4px', borderRadius: '3px' }}>{secret.env}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ color: '#6B7280', marginBottom: '12px' }}>
                Adapter details not found in registry
              </div>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                This adapter may not have detailed information available in the registry.
              </p>
            </div>
          )}
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="button button--secondary button--sm-height button--small"
            style={{ border: '1px solid #ddd' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function FullConfigModal({ config, onClose }: { config: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'gemini' | 'vscode'>('gemini');
  const [copied, setCopied] = useState(false);

  const getDisplayConfig = () => {
    if (!config) return {};
    const clientConfig = config.mcpClientConfig || config;
    
    if (activeTab === 'gemini') {
      return { mcpServers: clientConfig.gemini?.mcpServers || {} };
    } else {
      return {
        inputs: clientConfig.vscode?.inputs || [],
        servers: clientConfig.vscode?.servers || {}
      };
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(getDisplayConfig(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        maxWidth: '900px',
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
            Full User Configuration
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7280' }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('gemini')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: activeTab === 'gemini' ? '2px solid #30BA78' : '1px solid #ddd',
                backgroundColor: activeTab === 'gemini' ? '#30BA7810' : 'white',
                cursor: 'pointer'
              }}
            >
              Gemini / Claude Desktop
            </button>
            <button
              onClick={() => setActiveTab('vscode')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: activeTab === 'vscode' ? '2px solid #30BA78' : '1px solid #ddd',
                backgroundColor: activeTab === 'vscode' ? '#30BA7810' : 'white',
                cursor: 'pointer'
              }}
            >
              VSCode Extension
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <pre style={{
              backgroundColor: '#f3f4f6',
              padding: '16px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
              fontFamily: 'monospace',
              maxHeight: '400px',
              border: '1px solid #e5e7eb'
            }}>
              {JSON.stringify(getDisplayConfig(), null, 2)}
            </pre>
            <button
              onClick={handleCopy}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                padding: '6px 12px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="button button--secondary button--sm-height button--small">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

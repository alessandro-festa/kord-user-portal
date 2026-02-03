'use client';

import React from 'react';
import { Adapter } from '@/types';
import AdapterCard from './AdapterCard';

interface AdapterGridProps {
  adapters: Adapter[];
  onViewConfig: (adapter: Adapter) => void;
  onViewDetails: (adapter: Adapter) => void;
  loading: boolean;
  registryData?: any[];
}

export default function AdapterGrid({ adapters, onViewConfig, onViewDetails, loading, registryData }: AdapterGridProps) {
  const findRegistryEntry = (adapter: Adapter) => {
    if (!registryData) return null;
    
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

  if (loading) {
    return (
      <div className="card-container theme-white padding-top-xl padding-bottom-xl">
        <div className="l-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ fontSize: '18px', color: '#6B7280' }}>Loading adapters...</p>
          </div>
        </div>
      </div>
    );
  }

  if (adapters.length === 0) {
    return (
      <div className="card-container theme-white padding-top-xl padding-bottom-xl">
        <div className="l-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <h3 className="heading heading--h3" style={{ marginBottom: '16px' }}>
              No Adapters Available
            </h3>
            <p style={{ color: '#6B7280' }}>
              You don't have access to any adapters yet. Contact your administrator to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {adapters.map((adapter) => {
        const registryEntry = findRegistryEntry(adapter);
        const icon = registryEntry?._meta?.about?.icon || null;
        const description = registryEntry?._meta?.about?.description || null;
        
        return (
          <div key={adapter.id} className="col-lg-3 col-md-4 col-sm-6">
            <AdapterCard 
              adapter={adapter} 
              onViewConfig={onViewConfig}
              onViewDetails={onViewDetails}
              icon={icon}
              description={description}
            />
          </div>
        );
      })}
    </div>
  );
}

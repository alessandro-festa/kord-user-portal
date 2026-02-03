'use client';

import React from 'react';
import { Adapter } from '@/types';

interface AdapterCardProps {
  adapter: Adapter;
  onViewConfig: (adapter: Adapter) => void;
  onViewDetails: (adapter: Adapter) => void;
  icon?: string | null;
}

export default function AdapterCard({ adapter, onViewConfig, onViewDetails, icon }: AdapterCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return '#30BA78';
      case 'deploying':
        return '#FFC107';
      case 'error':
        return '#EF4444';
      case 'stopped':
        return '#9CA3AF';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="simple-card" style={{ 
      padding: '16px', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #e5e7eb',
      borderRadius: '6px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        {icon ? (
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #e5e7eb',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            <img 
              src={icon} 
              alt={adapter.name}
              style={{ width: '28px', height: '28px', borderRadius: '4px' }}
            />
          </div>
        ) : (
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px',
            backgroundColor: '#30BA78',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {(adapter.name || 'M').charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="simple-card-title heading heading--h3" style={{ marginBottom: '2px', fontSize: '14px', fontWeight: 600 }}>
            {adapter.name}
          </h3>
          <p style={{ 
            fontSize: '11px', 
            color: '#9CA3AF', 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {adapter.mcpServerId}
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: 600,
            backgroundColor: `${getStatusColor(adapter.status)}20`,
            color: getStatusColor(adapter.status)
          }}
        >
          <span style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            backgroundColor: getStatusColor(adapter.status),
            marginRight: '6px'
          }} />
          {getStatusText(adapter.status)}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => onViewConfig(adapter)}
          className="button button--secondary button--sm-height button--small"
          style={{ flex: 1, fontSize: '11px', padding: '6px 10px' }}
        >
          View Config
        </button>
        <button
          onClick={() => onViewDetails(adapter)}
          className="button button--secondary button--sm-height button--small"
          style={{ 
            flex: 1,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            fontSize: '11px',
            padding: '6px 10px'
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}

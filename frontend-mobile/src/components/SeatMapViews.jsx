import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

// Seat Plan map view, rendered from the library's official floor SVG
export function SeatPlanView({ library, area }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <Text strong style={{ fontSize: '12px', color: '#1677ff', display: 'block' }}>{library}</Text>
      <Text strong style={{ fontSize: '11px', color: '#1677ff', display: 'block', marginBottom: 12 }}>{area}</Text>

      <div style={{ overflowX: 'auto', borderRadius: 4, border: '1px solid #e2e8f0', paddingBottom: 20 }}>
        <img
          src="/images/PRZS-ARAS2.svg"
          alt="Seat Plan"
          style={{ height: 55, width: 'auto', display: 'block' }}
        />
      </div>
    </div>
  );
}

// Floor Plan map view, rendered from the library's official floor plan image
export function FloorPlanView({ library, area }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <Text strong style={{ fontSize: '12px', color: '#1677ff', display: 'block' }}>{library}</Text>
      <Text strong style={{ fontSize: '11px', color: '#1677ff', display: 'block', marginBottom: 12 }}>{area}</Text>

      <img
        src="/images/Pelan%20Lantai%20Aras%202%20PRZS.png"
        alt="Floor Plan"
        style={{ width: '100%', height: 'auto', borderRadius: 4, border: '1px solid #e2e8f0' }}
      />
    </div>
  );
}

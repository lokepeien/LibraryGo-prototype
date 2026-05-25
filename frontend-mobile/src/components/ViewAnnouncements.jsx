import React from 'react';
import { Card, List, Typography } from 'antd';

const { Text, Paragraph } = Typography;

export default function ViewAnnouncements() {
  const announcements = [
    { title: 'Grace check-in period revised', desc: 'The grace period to verify your seat check-in via NFC tags has been adjusted from 15 minutes down to 5 minutes to prevent seat squatting.', date: '2026-05-25' },
    { title: 'Level 2 Air Conditioning Repair', desc: 'F&M Department is servicing AC-400X unit above Seat L2-S04 on Wednesday morning.', date: '2026-05-24' },
    { title: 'New Penalty system update', desc: 'Accruing 5 strikes will lead to an automatic 14-day library suspension block. Strike counts reset every semester.', date: '2026-05-20' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
        <span style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: 4 }}>📢 Library Announcements</span>
        <Text type="secondary" style={{ fontSize: '11px' }}>Stay updated with the latest library operation guidelines and facility schedules.</Text>
      </Card>
      
      <List
        dataSource={announcements}
        renderItem={item => (
          <Card className="mobile-card" bodyStyle={{ padding: 12 }} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justify: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Text strong style={{ fontSize: '12.5px', color: '#1e293b' }}>{item.title}</Text>
              <Text type="secondary" style={{ fontSize: '10px' }}>{item.date}</Text>
            </div>
            <Paragraph style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.4 }}>
              {item.desc}
            </Paragraph>
          </Card>
        )}
      />
    </div>
  );
}

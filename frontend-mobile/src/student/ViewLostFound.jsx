import React, { useState } from 'react';
import { Card, Tag, Select, List, Typography, Divider } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, InboxOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function ViewLostFound() {
  const [filterStatus, setFilterStatus] = useState('All');

  const lostItems = [
    { id: 'LF-902', name: 'Apple iPad Air (5th Gen)', description: 'Space Gray color, dark green magnetic case. Lock screen has UTM background.', location: 'Level 2: Quiet Study Area (Desk 22)', date: '2026-05-23', status: 'Unclaimed' },
    { id: 'LF-903', name: 'Hydro Flask Water Bottle', description: '32oz Wide Mouth bottle, Cobalt Blue. Covered in UTM stickers.', location: 'Level 1: Collaborative Zone (Table B)', date: '2026-05-24', status: 'Unclaimed' },
    { id: 'LF-901', name: 'Casio fx-570EX Calculator', description: 'Scientific calculator with name "Mei Ling" carved on the back.', location: 'Level 2: Quiet Study Area (Desk 8)', date: '2026-05-22', status: 'Claimed', claimedBy: 'A21EC0052', claimDate: '2026-05-23' },
    { id: 'LF-905', name: 'UTM Student ID Card', description: 'ID Card for Muhammad Aliff (A21CS0221). Found near entrance scanner.', location: 'Ground Floor Scanner', date: '2026-05-25', status: 'Unclaimed' }
  ];

  const filteredItems = filterStatus === 'All' 
    ? lostItems 
    : lostItems.filter(item => item.status === filterStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: 2 }}>📦 Lost & Found Registry</span>
            <Text type="secondary" style={{ fontSize: '11px' }}>Misplaced your item? Check our secure custody storage lists.</Text>
          </div>
        </div>
        
        <Divider style={{ margin: '8px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: '11.5px', color: '#475569' }}>Filter Items:</Text>
          <Select
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            style={{ width: 140 }}
            options={[
              { value: 'All', label: 'All Items' },
              { value: 'Unclaimed', label: 'Unclaimed' },
              { value: 'Claimed', label: 'Claimed' }
            ]}
          />
        </div>
      </Card>

      <List
        dataSource={filteredItems}
        renderItem={item => {
          const isClaimed = item.status === 'Claimed';
          return (
            <Card className="mobile-card" bodyStyle={{ padding: 14 }} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <Tag color={isClaimed ? 'green' : 'purple'} style={{ marginBottom: 4, fontWeight: 600 }}>
                    {item.status}
                  </Tag>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Item ID: {item.id}</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <InboxOutlined style={{ color: '#1677ff', fontSize: '16px' }} />
                </div>
              </div>

              <Title level={5} style={{ margin: '0 0 6px 0', fontSize: '14.5px' }}>{item.name}</Title>
              <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ fontSize: '11.5px', color: '#475569', margin: 0 }}>
                {item.description}
              </Paragraph>

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ fontSize: '11px', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <EnvironmentOutlined style={{ marginRight: 6, fontSize: '12px' }} />
                  <span>Found: <b>{item.location}</b></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ marginRight: 6, fontSize: '12px' }} />
                  <span>Logged: <b>{item.date}</b></span>
                </div>
              </div>

              {isClaimed && (
                <div style={{ background: '#f0fdf4', padding: '6px 8px', borderRadius: '6px', border: '1px solid #dcfce7', fontSize: '10.5px', marginTop: 8 }}>
                  <div style={{ color: '#166534', fontWeight: 600 }}>Claimed by: {item.claimedBy}</div>
                  <div style={{ color: '#15803d', fontSize: '9.5px' }}>Claim Date: {item.claimDate}</div>
                </div>
              )}
            </Card>
          );
        }}
      />
    </div>
  );
}

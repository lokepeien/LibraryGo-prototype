import React from 'react';
import { Card, List, Tag, Typography } from 'antd';

const { Title, Text } = Typography;

export default function BookingHistory({ historyList }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      <Card className="mobile-card" bodyStyle={{ padding: 12 }} style={{ marginBottom: 4 }}>
        <Title level={5} style={{ margin: 0, fontSize: '13.5px' }}>📜 Library Attendance Log</Title>
        <Text type="secondary" style={{ fontSize: '11px' }}>Verify your historical seat check-ins, early vacancies, and expired sessions.</Text>
      </Card>

      <List
        dataSource={historyList}
        renderItem={(item) => {
          let tagColor = 'default';
          if (item.status === 'Completed') tagColor = 'success';
          if (item.status === 'Cancelled') tagColor = 'default';
          if (item.status === 'Expired') tagColor = 'error';

          return (
            <Card
              className="mobile-card"
              style={{ marginBottom: 8 }}
              bodyStyle={{ padding: 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text strong style={{ fontSize: '13px' }}>📅 {item.date}</Text>
                <Tag color={tagColor} style={{ fontWeight: 600 }}>{item.status}</Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div>
                  <Text type="secondary">Seat Desk:</Text> <Text strong>{item.seat}</Text>
                </div>
                <div>
                  <Text type="secondary">Timeslot:</Text> <Text>{item.time}</Text>
                </div>
              </div>

              {item.reason && (
                <div style={{ background: '#fff2e8', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ffd591', marginTop: 8, fontSize: '10.5px', color: '#d4380d' }}>
                  ⚠️ {item.reason}
                </div>
              )}
            </Card>
          );
        }}
      />
    </div>
  );
}

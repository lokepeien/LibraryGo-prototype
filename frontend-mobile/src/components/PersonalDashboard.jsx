import React from 'react';
import { Card, Space, Button, Tag, Alert, Divider } from 'antd';
import { PlayCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function PersonalDashboard({
  student,
  setStudent,
  activeBooking,
  setActiveTab,
  simulateNewReservation,
  formatTimer
}) {
  const isBanned = student.strikes >= 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      {/* Dynamic Strike warnings */}
      <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: '13px', color: '#1e293b' }}>⚠️ Active Strike Warnings</Text>
          <Tag color={student.strikes >= 4 ? 'red' : student.strikes >= 2 ? 'orange' : 'green'} style={{ fontWeight: 600 }}>
            {student.strikes} / 5 strikes
          </Tag>
        </div>
        
        {/* Visual Colored Segments */}
        <div className="strike-scale-bar">
          {[1, 2, 3, 4, 5].map((node) => (
            <div
              key={node}
              className={`strike-node ${node <= student.strikes ? (student.strikes >= 5 ? 'active-warning' : 'active-caution') : ''}`}
              style={{
                backgroundColor: node <= student.strikes 
                  ? (node >= 5 ? '#ff4d4f' : '#fa8c16') 
                  : '#e2e8f0'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
          <span>0 Strikes (Active)</span>
          <span>5 Strikes (Suspended)</span>
        </div>

        {/* Admin Tester controls */}
        <Divider style={{ margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: '10.5px' }}>Tester Adjust Tool:</Text>
          <Space size="small">
            <Button size="small" type="dashed" style={{ fontSize: '10px', height: 20 }} onClick={() => setStudent(p => ({ ...p, strikes: Math.max(p.strikes - 1, 0) }))}>- Strike</Button>
            <Button size="small" type="dashed" danger style={{ fontSize: '10px', height: 20 }} onClick={() => setStudent(p => ({ ...p, strikes: Math.min(p.strikes + 1, 5) }))}>+ Strike</Button>
          </Space>
        </div>
      </Card>

      {isBanned && (
        <Alert
          message={<span style={{ fontWeight: 700, fontSize: '12px' }}>⛔ Library Privileges Suspended!</span>}
          description={<span style={{ fontSize: '11px' }}>You have reached the maximum threshold of 5 strikes. NFC desk check-in scanners and seat bookings are locked.</span>}
          type="error"
          showIcon
          style={{ borderRadius: 12, marginBottom: 12 }}
        />
      )}

      {/* Current Reservation Status Card */}
      {activeBooking.status !== 'None' ? (
        <Card
          className="mobile-card"
          style={{ borderLeft: '4px solid #1677ff', cursor: 'pointer' }}
          bodyStyle={{ padding: 12 }}
          onClick={() => setActiveTab('booking')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Tag color={activeBooking.status === 'Reserved' ? 'warning' : 'success'} style={{ marginBottom: 4 }}>
                {activeBooking.status === 'Reserved' ? '🎟️ Reserved Seat' : '🟢 Session Running'}
              </Tag>
              <Title level={5} style={{ margin: 0, fontSize: '14.5px' }}>Seat: {activeBooking.seatId}</Title>
              <Text type="secondary" style={{ fontSize: '11px' }}>{activeBooking.areaName}</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: '10px', display: 'block' }}>REMAINING</Text>
              <Text strong style={{ fontSize: '14px', color: activeBooking.status === 'Reserved' ? '#fa8c16' : '#52c41a' }}>
                {formatTimer(activeBooking.timeRemaining)}
              </Text>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mobile-card" bodyStyle={{ padding: 16, textAlign: 'center' }}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: '12.5px' }}>
            You do not have any active seat reservation right now.
          </Text>
          <Button type="primary" size="middle" block icon={<PlayCircleOutlined />} onClick={simulateNewReservation} disabled={isBanned}>
            Simulate New Booking
          </Button>
        </Card>
      )}

      {/* Simple Info Alert */}
      <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px dashed #cbd5e1', marginTop: 4 }}>
        <Space align="start">
          <InfoCircleOutlined style={{ color: '#1677ff', fontSize: '12.5px', marginTop: 2 }} />
          <Text type="secondary" style={{ fontSize: '11px', lineHeight: 1.4 }}>
            <b>UTM Rule Check-In Policy:</b> Reservations expire in <b>5 minutes</b>. Absence or failure to scan the desk NFC Tag will issue a strike warning.
          </Text>
        </Space>
      </div>
    </div>
  );
}

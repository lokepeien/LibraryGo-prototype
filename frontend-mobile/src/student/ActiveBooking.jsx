import React from 'react';
import { Card, Button, Steps, Progress, Typography } from 'antd';
import { ClockCircleOutlined, ScanOutlined, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ActiveBooking({
  student,
  activeBooking,
  simulateNewReservation,
  setNfcModalVisible,
  handleEarlyCheckout,
  formatTimer,
  setActiveTab
}) {
  if (activeBooking.status === 'None') {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <ClockCircleOutlined style={{ fontSize: '32px', color: '#94a3b8' }} />
        </div>
        <Title level={5} style={{ margin: 0 }}>No Active Bookings</Title>
        <Text type="secondary" style={{ fontSize: '12.5px' }}>
          Book library seats in advance or scan physical desk NFC Tags directly.
        </Text>
        <Button type="primary" size="middle" onClick={simulateNewReservation} disabled={student.strikes >= 5} style={{ marginTop: 12 }}>
          Simulate Booking Reservation
        </Button>
      </div>
    );
  }

  let stepIndex = 0;
  if (activeBooking.status === 'CheckedIn') stepIndex = 1;
  if (activeBooking.status === 'Completed') stepIndex = 2;

  const isGracePeriod = activeBooking.status === 'Reserved';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      {/* steps Workflow */}
      <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
        <Steps
          current={stepIndex}
          size="small"
          items={[
            { title: <span style={{ fontSize: '11px' }}>Reserved</span>, description: <span style={{ fontSize: '9px' }}>Grace time active</span> },
            { title: <span style={{ fontSize: '11px' }}>Checked In</span>, description: <span style={{ fontSize: '9px' }}>NFC verified</span> },
            { title: <span style={{ fontSize: '11px' }}>Completed</span>, description: <span style={{ fontSize: '9px' }}>Vacated</span> }
          ]}
        />
      </Card>

      {/* Timer Card */}
      <Card className="mobile-card" bodyStyle={{ padding: 16, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>
          {isGracePeriod ? '⏱️ NFC GRACE TIMEOUT CHECK-IN' : '🕒 ACTIVE STUDY SESSION TIMEOUT'}
        </Text>
        
        <div style={{ margin: '16px 0' }}>
          <Title level={2} style={{ margin: 0, fontSize: '32px', fontFamily: 'monospace', color: isGracePeriod ? '#fa8c16' : '#1677ff', letterSpacing: '1px' }}>
            {formatTimer(activeBooking.timeRemaining)}
          </Title>
          <Text type="secondary" style={{ fontSize: '11px', marginTop: 4, display: 'block' }}>
            {isGracePeriod ? 'Scan NFC desk tag before timer expires' : 'Time left to check-out early without warnings'}
          </Text>
        </div>

        <Progress
          percent={isGracePeriod ? (activeBooking.timeRemaining / 300) * 100 : (activeBooking.timeRemaining / 7200) * 100}
          showInfo={false}
          status={isGracePeriod ? 'exception' : 'active'}
          strokeColor={isGracePeriod ? '#fa8c16' : '#1677ff'}
          style={{ marginBottom: 12 }}
        />

        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text strong style={{ fontSize: '12px' }}>Library Desk:</Text>
            <Text style={{ fontSize: '12px' }}>{activeBooking.seatId}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text strong style={{ fontSize: '12px' }}>Area Section:</Text>
            <Text style={{ fontSize: '12px' }}>{activeBooking.areaName}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: '12px' }}>Tag UID:</Text>
            <Text code style={{ fontSize: '11px', fontFamily: 'monospace' }}>{activeBooking.nfcUid}</Text>
          </div>
        </div>
      </Card>

      {/* Actions */}
      {isGracePeriod ? (
        <Button
          type="primary"
          size="large"
          block
          icon={<ScanOutlined />}
          onClick={() => setNfcModalVisible(true)}
          style={{ background: '#fa8c16', borderColor: '#fa8c16', marginTop: 12 }}
        >
          Simulate NFC Desk Scan
        </Button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <Button
            type="default"
            size="large"
            block
            icon={<ArrowLeftOutlined />}
            onClick={() => setActiveTab('home')}
          >
            Back
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            block
            icon={<CloseCircleOutlined />}
            onClick={handleEarlyCheckout}
          >
            Manual Early Check-Out
          </Button>
        </div>
      )}
    </div>
  );
}

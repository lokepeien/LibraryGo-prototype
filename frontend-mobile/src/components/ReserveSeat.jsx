import React from 'react';
import { Card, Button, Select, Modal, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ReserveSeat({
  student,
  selectedLibrary,
  setSelectedLibrary,
  selectedArea,
  setSelectedArea,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedDuration,
  setSelectedDuration,
  confirmationVisible,
  setConfirmationVisible,
  handleConfirmReservation
}) {
  const isBanned = student.strikes >= 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
        <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>
          🎟️ Seat Booking & Reservation
        </Title>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          Select library branches, area zones, and session slots to secure your study space.
        </Text>
      </Card>

      {/* Library selection Form */}
      <Card className="mobile-card" bodyStyle={{ padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Library Selector */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              🏦 Select Library Branch:
            </Text>
            <Select
              value={selectedLibrary}
              onChange={(val) => setSelectedLibrary(val)}
              style={{ width: '100%' }}
              options={[
                { value: 'Perpustakaan Sultanah Zanariah (PSZ)', label: 'Perpustakaan Sultanah Zanariah (PSZ)' },
                { value: 'Perpustakaan Raja Zarith Sofiah (PRZS)', label: 'Perpustakaan Raja Zarith Sofiah (PRZS)' }
              ]}
            />
          </div>

          {/* Area Zone Selector */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              📍 Select Library Area Zone:
            </Text>
            <Select
              value={selectedArea}
              onChange={(val) => setSelectedArea(val)}
              style={{ width: '100%' }}
              options={[
                { value: 'Level 1: Collaborative Zone', label: 'Level 1: Collaborative Zone' },
                { value: 'Level 2: Quiet Study Area', label: 'Level 2: Quiet Study Area' },
                { value: 'Level 3: Postgraduate Hub', label: 'Level 3: Postgraduate Hub' },
                { value: 'Ground Floor: Multimedia Room', label: 'Ground Floor: Multimedia Room' }
              ]}
            />
          </div>

          {/* Time Slot Selector */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              ⏰ Select Time Slot:
            </Text>
            <Select
              value={selectedTimeSlot}
              onChange={(val) => setSelectedTimeSlot(val)}
              style={{ width: '100%' }}
              options={[
                { value: '08:00 AM - 10:00 AM', label: '08:00 AM - 10:00 AM' },
                { value: '10:00 AM - 12:00 PM', label: '10:00 AM - 12:00 PM' },
                { value: '12:00 PM - 02:00 PM', label: '12:00 PM - 02:00 PM' },
                { value: '02:00 PM - 04:00 PM', label: '02:00 PM - 04:00 PM' },
                { value: '04:00 PM - 06:00 PM', label: '04:00 PM - 06:00 PM' },
                { value: '06:00 PM - 08:00 PM', label: '06:00 PM - 08:00 PM' }
              ]}
            />
          </div>

          {/* Session Duration Selector */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              ⏳ Session Duration:
            </Text>
            <Select
              value={selectedDuration}
              onChange={(val) => setSelectedDuration(val)}
              style={{ width: '100%' }}
              options={[
                { value: '30 Minutes', label: '30 Minutes' },
                { value: '1 Hour', label: '1 Hour' },
                { value: '2 Hours (Max)', label: '2 Hours (Max)' }
              ]}
            />
          </div>

          {/* Book Seat Trigger Button */}
          <Button
            type="primary"
            size="large"
            block
            style={{ marginTop: 8 }}
            disabled={isBanned}
            onClick={() => setConfirmationVisible(true)}
          >
            Book Seat
          </Button>
          
          {isBanned && (
            <span style={{ color: '#ff4d4f', fontSize: '10.5px', textAlign: 'center', display: 'block' }}>
              ⛔ Cannot book new seats while privileges are suspended!
            </span>
          )}
        </div>
      </Card>

      {/* Modal to display selected booking parameters */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>🎉 Booking Parameters Review</span>}
        visible={confirmationVisible}
        onCancel={() => setConfirmationVisible(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmationVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirmReservation}>
            Confirm & Start
          </Button>
        ]}
        width={310}
        centered
      >
        <div style={{ padding: '8px 0' }}>
          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 12 }}>
            Please review the seat reservation details below:
          </Text>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>SELECTED LIBRARY:</span>
              <Text strong style={{ fontSize: '12.5px', color: '#1e293b' }}>{selectedLibrary}</Text>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>AREA ZONE:</span>
              <Text strong style={{ fontSize: '12.5px', color: '#1e293b' }}>{selectedArea}</Text>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TIME SLOT:</span>
              <Text strong style={{ fontSize: '12.5px', color: '#1e293b' }}>{selectedTimeSlot}</Text>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>DURATION:</span>
              <Text strong style={{ fontSize: '12.5px', color: '#1677ff' }}>{selectedDuration}</Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

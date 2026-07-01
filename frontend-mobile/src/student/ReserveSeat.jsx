import React, { useState } from 'react';
import { Card, Button, Select, Modal, Tabs, Typography, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Only today and tomorrow are bookable, everything else is greyed out in the calendar
function disabledDate(current) {
  if (!current) return false;
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');
  return !(current.isSame(today, 'day') || current.isSame(tomorrow, 'day'));
}

// Seat strip mockup, styled after the library's official "Seat Plan" map view
function SeatPlanView({ library, area }) {
  const seats = Array.from({ length: 12 }, (_, i) => ({
    id: `S${i + 1}`,
    occupied: i % 4 === 2
  }));

  return (
    <div style={{ padding: '8px 0' }}>
      <Text strong style={{ fontSize: '12px', color: '#1677ff', display: 'block' }}>{library}</Text>
      <Text strong style={{ fontSize: '11px', color: '#1677ff', display: 'block', marginBottom: 12 }}>{area}</Text>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, background: '#dbeafe', padding: '10px 6px 4px', borderRadius: 4, overflowX: 'auto' }}>
        {seats.map(seat => (
          <div key={seat.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 22 }}>
            <div style={{ width: 14, height: 20, background: seat.occupied ? '#ef4444' : '#4ade80', borderRadius: 2, marginBottom: 2 }} />
            <span style={{ fontSize: '7px', color: '#1e3a8a', fontWeight: 600 }}>{seat.id}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 6, background: '#1e293b', borderRadius: 2, marginTop: 2 }} />
      <Text type="secondary" style={{ fontSize: '9px', display: 'block', textAlign: 'center', marginTop: 4 }}>Bookshelves</Text>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px' }}>
          <span style={{ width: 10, height: 10, background: '#4ade80', borderRadius: 2, display: 'inline-block' }} /> Available
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px' }}>
          <span style={{ width: 10, height: 10, background: '#ef4444', borderRadius: 2, display: 'inline-block' }} /> Occupied
        </span>
      </div>
    </div>
  );
}

// Schematic floor layout mockup, styled after the library's official "Floor Plan" map view
function FloorPlanView({ library, area }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <Text strong style={{ fontSize: '12px', color: '#1677ff', display: 'block' }}>{library}</Text>
      <Text strong style={{ fontSize: '11px', color: '#1677ff', display: 'block', marginBottom: 12 }}>Level 1 Floor Plan</Text>

      <div style={{ position: 'relative', border: '2px solid #1e293b', borderRadius: 4, padding: 8, minHeight: 220 }}>
        <div style={{ position: 'absolute', top: 8, left: 8, width: '35%', border: '1px solid #94a3b8', fontSize: '8px', textAlign: 'center', padding: '10px 2px', color: '#475569' }}>
          Activity Room
        </div>
        <div style={{ position: 'absolute', top: 8, right: 8, width: '25%', height: 60, border: '1px solid #93c5fd', background: '#bfdbfe', fontSize: '8px', textAlign: 'center', padding: '4px 2px', color: '#1e3a8a', fontWeight: 700 }}>
          ⭐ {area}
        </div>
        <div style={{ position: 'absolute', bottom: 30, left: 8, width: '30%', border: '1px solid #94a3b8', fontSize: '8px', textAlign: 'center', padding: '10px 2px', color: '#475569' }}>
          Staff Workroom
        </div>
        <div style={{ position: 'absolute', bottom: 30, right: '35%', width: '20%', border: '1px solid #94a3b8', fontSize: '8px', textAlign: 'center', padding: '10px 2px', color: '#475569' }}>
          Programme Zone
        </div>
        <div style={{ position: 'absolute', bottom: 30, right: 8, width: '15%', border: '1px solid #94a3b8', fontSize: '8px', textAlign: 'center', padding: '10px 2px', color: '#475569' }}>
          Café
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: '35%', fontSize: '8px', fontWeight: 700, color: '#1e293b' }}>
          ENTRANCE
        </div>
      </div>
      <Text type="secondary" style={{ fontSize: '9px', display: 'block', textAlign: 'center', marginTop: 8 }}>
        ⭐ Highlighted zone indicates your selected area
      </Text>
    </div>
  );
}

export default function ReserveSeat({
  student,
  selectedLibrary,
  setSelectedLibrary,
  selectedArea,
  setSelectedArea,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedDuration,
  setSelectedDuration,
  confirmationVisible,
  setConfirmationVisible,
  handleConfirmReservation
}) {
  const isBanned = student.strikes >= 5;
  const [viewSeatVisible, setViewSeatVisible] = useState(false);
  const [mapTab, setMapTab] = useState('seat');

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

          {/* Date Selector */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              📅 Select Date:
            </Text>
            <DatePicker
              value={selectedDate}
              onChange={(val) => setSelectedDate(val)}
              disabledDate={disabledDate}
              allowClear={false}
              format="DD MMM YYYY"
              style={{ width: '100%' }}
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

          {/* View Seat Trigger Button */}
          <Button
            type="default"
            size="large"
            block
            style={{ marginTop: 4 }}
            onClick={() => setViewSeatVisible(true)}
          >
            🗺️ View Seat
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
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>DATE:</span>
              <Text strong style={{ fontSize: '12.5px', color: '#1e293b' }}>{selectedDate ? selectedDate.format('DD MMM YYYY') : ''}</Text>
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

      {/* Maps: Seat Plan / Floor Plan Modal */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>🗺️ Maps</span>}
        visible={viewSeatVisible}
        onCancel={() => setViewSeatVisible(false)}
        footer={null}
        width={340}
        centered
        destroyOnClose
      >
        <Tabs
          activeKey={mapTab}
          onChange={setMapTab}
          centered
          items={[
            {
              key: 'seat',
              label: 'Seat Plan',
              children: <SeatPlanView library={selectedLibrary} area={selectedArea} />
            },
            {
              key: 'floor',
              label: 'Floor Plan',
              children: <FloorPlanView library={selectedLibrary} area={selectedArea} />
            }
          ]}
        />
      </Modal>
    </div>
  );
}

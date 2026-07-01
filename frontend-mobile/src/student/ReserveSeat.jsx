import React, { useState } from 'react';
import { Card, Button, Select, Modal, Tabs, Typography, DatePicker } from 'antd';
import { CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Only today and tomorrow are bookable, everything else is greyed out in the calendar
function disabledDate(current) {
  if (!current) return false;
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');
  return !(current.isSame(today, 'day') || current.isSame(tomorrow, 'day'));
}

// Check-in deadline is the time slot's start time plus a 5-minute grace period
function getCheckInDeadline(timeSlot) {
  const startTime = timeSlot.split(' - ')[0];
  return dayjs(startTime, 'hh:mm A').add(5, 'minute').format('hh:mm A');
}

// Seat Plan map view, rendered from the library's official floor SVG
function SeatPlanView({ library, area }) {
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
function FloorPlanView({ library, area }) {
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

export default function ReserveSeat({
  student,
  selectedLibrary,
  setSelectedLibrary,
  selectedLevel,
  setSelectedLevel,
  selectedArea,
  setSelectedArea,
  selectedSeatId,
  setSelectedSeatId,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  selectedDuration,
  setSelectedDuration,
  handleConfirmReservation
}) {
  const isBanned = student.strikes >= 5;
  const [viewSeatVisible, setViewSeatVisible] = useState(false);
  const [mapTab, setMapTab] = useState('seat');
  const [bookSuccessVisible, setBookSuccessVisible] = useState(false);
  const [checkInDeadline, setCheckInDeadline] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
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

          {/* Library Level & Area Selectors */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
                📍 Select Level:
              </Text>
              <Select
                value={selectedLevel}
                onChange={(val) => setSelectedLevel(val)}
                style={{ width: '100%' }}
                options={[
                  { value: 'Level 1', label: 'Level 1' },
                  { value: 'Level 2', label: 'Level 2' },
                  { value: 'Level 3', label: 'Level 3' },
                  { value: 'Level 4', label: 'Level 4' }
                ]}
              />
            </div>

            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
                🧭 Select Area:
              </Text>
              <Select
                value={selectedArea}
                onChange={(val) => setSelectedArea(val)}
                style={{ width: '100%' }}
                options={[
                  { value: 'Area 1', label: 'Area 1' },
                  { value: 'Area 2', label: 'Area 2' }
                ]}
              />
            </div>
          </div>

          {/* Select Seat Trigger Button */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              💺 Seat:
            </Text>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => setViewSeatVisible(true)}
            >
              Select Seat
            </Button>
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

          {/* Book Seat / Check-in Trigger Buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button
              type="primary"
              size="large"
              block
              disabled={isBanned}
              onClick={() => {
                setCheckInDeadline(getCheckInDeadline(selectedTimeSlot));
                setBookSuccessVisible(true);
              }}
            >
              Book Seat
            </Button>

            <Button
              type="primary"
              size="large"
              block
              disabled={isBanned}
              onClick={handleConfirmReservation}
            >
              Check-in
            </Button>
          </div>

          {isBanned && (
            <span style={{ color: '#ff4d4f', fontSize: '10.5px', textAlign: 'center', display: 'block' }}>
              ⛔ Cannot book new seats while privileges are suspended!
            </span>
          )}
        </div>
      </Card>

      {/* Book Seat Success Modal */}
      <Modal
        visible={bookSuccessVisible}
        footer={null}
        closable={false}
        width={300}
        centered
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: 12 }} />
          <Title level={5} style={{ margin: '0 0 8px 0' }}>Book Seat Success!</Title>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 16 }}>
            Please check-in before {checkInDeadline}.
          </Text>
          <Button type="primary" icon={<ArrowLeftOutlined />} block onClick={() => setBookSuccessVisible(false)}>
            Back
          </Button>
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
              children: <SeatPlanView library={selectedLibrary} area={`${selectedLevel} (${selectedArea})`} />
            },
            {
              key: 'floor',
              label: 'Floor Plan',
              children: <FloorPlanView library={selectedLibrary} area={`${selectedLevel} (${selectedArea})`} />
            }
          ]}
        />

        <div style={{ marginTop: 8 }}>
          <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
            💺 Select Seat ID:
          </Text>
          <Select
            value={selectedSeatId}
            onChange={(val) => setSelectedSeatId(val)}
            style={{ width: '100%' }}
            options={Array.from({ length: 10 }, (_, i) => {
              const id = `S${String(i + 1).padStart(2, '0')}`;
              return { value: id, label: id };
            })}
          />
        </div>
      </Modal>
    </div>
  );
}

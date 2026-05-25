import React, { useState } from 'react';
import { Card, Space, Button, Tag, Badge, Select, Modal, Alert, Divider, List, Input } from 'antd';
import {
  BellOutlined,
  ScanOutlined,
  NotificationOutlined,
  PlayCircleOutlined,
  InfoCircleOutlined,
  AlertOutlined,
  InboxOutlined,
  EnvironmentOutlined,
  SendOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function ReserveSeat({
  student,
  setStudent,
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
  handleConfirmReservation,
  setAnnouncementsVisible,
  
  // New unified action props
  complaintModalVisible,
  setComplaintModalVisible,
  lostFoundModalVisible,
  setLostFoundModalVisible,
  handleSubmitComplaint,
  lostFoundList
}) {
  const isBanned = student.strikes >= 5;

  // Local state for complaint submission
  const [complaintCategory, setComplaintCategory] = useState('AC Defect');
  const [complaintSeat, setComplaintSeat] = useState('L2-S04');
  const [complaintDetails, setComplaintDetails] = useState('');

  const submitComplaintTrigger = () => {
    handleSubmitComplaint({
      category: complaintCategory,
      seatId: complaintSeat,
      details: complaintDetails
    });
    setComplaintDetails('');
    setComplaintModalVisible(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      
      {/* 1. PERSONAL DASHBOARD BANNER */}
      <div className="mobile-header-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '10.5px', fontWeight: 600 }}>UTM SEAT COMPANION PORTAL</Text>
            <Title level={4} style={{ margin: 0, color: '#ffffff', fontWeight: 700, fontSize: '18px' }}>
              Hi, {student.name} 👋
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px', fontFamily: 'monospace' }}>
              {student.domain} | Matrix: {student.matrixId}
            </Text>
          </div>
          <Badge dot color="#ff4d4f" size="default">
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ color: '#fff', fontSize: '18px' }} />}
              onClick={() => setAnnouncementsVisible(true)}
            />
          </Badge>
        </div>
      </div>

      <div style={{ padding: '0 2px' }}>
        
        {/* 2. PERSONAL DASHBOARD STRIKE ALERTS CARD */}
        <Card className="mobile-card" style={{ marginBottom: 12 }} bodyStyle={{ padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '12.5px', color: '#1e293b' }}>⚠️ Disciplinary Warning Standing</Text>
            <Tag color={student.strikes >= 4 ? 'red' : student.strikes >= 2 ? 'orange' : 'green'} style={{ fontWeight: 600 }}>
              {student.strikes} / 5 Strikes
            </Tag>
          </div>
          
          {/* Visual Segment Warning Scale (0 to 5) */}
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

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b' }}>
            <span>Permitted (Active)</span>
            <span>Banned (Suspended)</span>
          </div>

          {/* Tester Adjust tool inside personal dashboard */}
          <Divider style={{ margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: '10px' }}>Tester Adjust Tool:</Text>
            <Space size="small">
              <Button size="small" type="dashed" style={{ fontSize: '10px', height: 20 }} onClick={() => setStudent(p => ({ ...p, strikes: Math.max(p.strikes - 1, 0) }))}>- Strike</Button>
              <Button size="small" type="dashed" danger style={{ fontSize: '10px', height: 20 }} onClick={() => setStudent(p => ({ ...p, strikes: Math.min(p.strikes + 1, 5) }))}>+ Strike</Button>
            </Space>
          </div>
        </Card>

        {isBanned && (
          <Alert
            message={
              <span style={{ fontWeight: 700, fontSize: '12px' }}>
                ⛔ Account Suspended
              </span>
            }
            description={
              <span style={{ fontSize: '11px' }}>
                You have reached 5 warnings. Seat reservations and NFC scanners are temporarily blocked.
              </span>
            }
            type="error"
            showIcon
            style={{ borderRadius: 12, marginBottom: 12 }}
          />
        )}

        {/* 3. RESERVE SEAT CARD */}
        <Card className="mobile-card" style={{ marginBottom: 12 }} bodyStyle={{ padding: 14 }}>
          <Title level={5} style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#1e293b', fontWeight: 700 }}>
            🎟️ Reserve Study Seat
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* Library Dropdown */}
            <div>
              <Text strong style={{ fontSize: '11.5px', color: '#475569', display: 'block', marginBottom: 4 }}>
                🏦 Selected Library Branch:
              </Text>
              <Select
                value={selectedLibrary}
                onChange={(val) => setSelectedLibrary(val)}
                style={{ width: '100%', fontSize: '12.5px' }}
                options={[
                  { value: 'Perpustakaan Sultanah Zanariah (PSZ)', label: 'Perpustakaan Sultanah Zanariah (PSZ)' },
                  { value: 'Perpustakaan Raja Zarith Sofiah (PRZS)', label: 'Perpustakaan Raja Zarith Sofiah (PRZS)' }
                ]}
              />
            </div>

            {/* Area Dropdown */}
            <div>
              <Text strong style={{ fontSize: '11.5px', color: '#475569', display: 'block', marginBottom: 4 }}>
                📍 Area Zone / Level:
              </Text>
              <Select
                value={selectedArea}
                onChange={(val) => setSelectedArea(val)}
                style={{ width: '100%', fontSize: '12.5px' }}
                options={[
                  { value: 'Level 1: Collaborative Zone', label: 'Level 1: Collaborative Zone' },
                  { value: 'Level 2: Quiet Study Area', label: 'Level 2: Quiet Study Area' },
                  { value: 'Level 3: Postgraduate Hub', label: 'Level 3: Postgraduate Hub' },
                  { value: 'Ground Floor: Multimedia Room', label: 'Ground Floor: Multimedia Room' }
                ]}
              />
            </div>

            {/* Time Slot & Duration in a single row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <Text strong style={{ fontSize: '11.5px', color: '#475569', display: 'block', marginBottom: 4 }}>
                  ⏰ Timeslot:
                </Text>
                <Select
                  value={selectedTimeSlot}
                  onChange={(val) => setSelectedTimeSlot(val)}
                  style={{ width: '100%' }}
                  options={[
                    { value: '08:00 AM - 10:00 AM', label: '08:00 AM' },
                    { value: '10:00 AM - 12:00 PM', label: '10:00 AM' },
                    { value: '12:00 PM - 02:00 PM', label: '12:00 PM' },
                    { value: '02:00 PM - 04:00 PM', label: '02:00 PM' },
                    { value: '04:00 PM - 06:00 PM', label: '04:00 PM' },
                    { value: '06:00 PM - 08:00 PM', label: '06:00 PM' }
                  ]}
                />
              </div>
              <div>
                <Text strong style={{ fontSize: '11.5px', color: '#475569', display: 'block', marginBottom: 4 }}>
                  ⏳ Duration:
                </Text>
                <Select
                  value={selectedDuration}
                  onChange={(val) => setSelectedDuration(val)}
                  style={{ width: '100%' }}
                  options={[
                    { value: '30 Minutes', label: '30 Min' },
                    { value: '1 Hour', label: '1 Hour' },
                    { value: '2 Hours (Max)', label: '2 Hours' }
                  ]}
                />
              </div>
            </div>

            <Button
              type="primary"
              size="middle"
              block
              disabled={isBanned}
              style={{ marginTop: 6 }}
              icon={<PlayCircleOutlined />}
              onClick={() => setConfirmationVisible(true)}
            >
              Book Seat
            </Button>
          </div>
        </Card>

        {/* 4. ANNOUNCEMENTS, SUBMIT COMPLAINT & LOST/FOUND GRID ACTIONS */}
        <Title level={5} style={{ margin: '12px 0 8px 0', fontSize: '13px', color: '#475569', fontWeight: 700 }}>
          🛠️ UNIFIED SERVICES HUB
        </Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          
          <div className="action-btn-card" onClick={() => setAnnouncementsVisible(true)} style={{ padding: '8px 4px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#f9f0ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <NotificationOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
            </div>
            <Text strong style={{ fontSize: '11px', color: '#334155', marginTop: 4 }}>Announcements</Text>
            <Text type="secondary" style={{ fontSize: '8px' }}>UTM Alerts</Text>
          </div>

          <div className="action-btn-card" onClick={() => setComplaintModalVisible(true)} style={{ padding: '8px 4px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff1f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AlertOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
            </div>
            <Text strong style={{ fontSize: '11px', color: '#334155', marginTop: 4 }}>Report Issue</Text>
            <Text type="secondary" style={{ fontSize: '8px' }}>Complain Defect</Text>
          </div>

          <div className="action-btn-card" onClick={() => setLostFoundModalVisible(true)} style={{ padding: '8px 4px' }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#f0f5ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <InboxOutlined style={{ color: '#1d39c4', fontSize: '16px' }} />
            </div>
            <Text strong style={{ fontSize: '11px', color: '#334155', marginTop: 4 }}>Lost & Found</Text>
            <Text type="secondary" style={{ fontSize: '8px' }}>Search Misplaced</Text>
          </div>

        </div>

      </div>

      {/* --- CONFIRMATION SUMMARY MODAL --- */}
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
        <div style={{ padding: '4px 0' }}>
          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 12 }}>
            Verify your study seat booking parameter settings:
          </Text>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>🏦 LIBRARY BRANCH:</span>
              <Text strong style={{ fontSize: '12px', color: '#1e293b' }}>{selectedLibrary}</Text>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>📍 STUDY ZONE AREA:</span>
              <Text strong style={{ fontSize: '12px', color: '#1e293b' }}>{selectedArea}</Text>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>⏰ SLOT TIMINGS:</span>
              <Text strong style={{ fontSize: '12px', color: '#1e293b' }}>{selectedTimeSlot}</Text>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>⏳ STUDY DURATION:</span>
              <Text strong style={{ fontSize: '12.5px', color: '#1677ff' }}>{selectedDuration}</Text>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- SUBMIT COMPLAINT MODAL --- */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>🛠️ Submit Facility Complaint</span>}
        visible={complaintModalVisible}
        onCancel={() => setComplaintModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setComplaintModalVisible(false)}>Cancel</Button>,
          <Button key="submit" type="primary" danger icon={<SendOutlined />} onClick={submitComplaintTrigger}>
            Submit Report
          </Button>
        ]}
        width={320}
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
          <div>
            <Text strong style={{ fontSize: '11.5px', display: 'block', marginBottom: 4 }}>Defect Category:</Text>
            <Select
              value={complaintCategory}
              onChange={(val) => setComplaintCategory(val)}
              style={{ width: '100%' }}
              options={[
                { value: 'AC Defect', label: 'Air Conditioning Leaking / rattle' },
                { value: 'Broken Socket', label: 'Power Socket Broken / sparks' },
                { value: 'Furniture broken', label: 'Chair hydraulics / desk wobbles' },
                { value: 'WiFi unstable', label: 'Signal dropping AP' }
              ]}
            />
          </div>

          <div>
            <Text strong style={{ fontSize: '11.5px', display: 'block', marginBottom: 4 }}>Affected Seat ID:</Text>
            <Input value={complaintSeat} onChange={(e) => setComplaintSeat(e.target.value)} placeholder="e.g. L2-S04" />
          </div>

          <div>
            <Text strong style={{ fontSize: '11.5px', display: 'block', marginBottom: 4 }}>Specific Defect Details:</Text>
            <Input.TextArea
              rows={3}
              value={complaintDetails}
              onChange={(e) => setComplaintDetails(e.target.value)}
              placeholder="e.g. Dual wall socket is loose and sparks whenever an adapter is inserted..."
            />
          </div>
        </div>
      </Modal>

      {/* --- VIEW LOST AND FOUND CUSTODY MODAL --- */}
      <Modal
        title={<span style={{ fontWeight: 700 }}>📦 Unclaimed Assets Custody</span>}
        visible={lostFoundModalVisible}
        onCancel={() => setLostFoundModalVisible(false)}
        footer={<Button type="primary" block onClick={() => setLostFoundModalVisible(false)}>Close Catalog</Button>}
        width={340}
        centered
      >
        <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 4 }}>
          <List
            dataSource={lostFoundList}
            renderItem={item => (
              <List.Item style={{ padding: '10px 0', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text strong style={{ fontSize: '12.5px', color: '#1677ff' }}>{item.name}</Text>
                  <Tag color="purple" style={{ fontSize: '9px', fontWeight: 600 }}>{item.id}</Tag>
                </div>
                <Paragraph style={{ fontSize: '11.5px', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                  {item.description}
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', color: '#94a3b8' }}>
                  <span>📍 Found: <b>{item.location}</b></span>
                  <span>Logged: {item.date}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>

    </div>
  );
}

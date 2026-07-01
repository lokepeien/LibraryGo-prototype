import React, { useState } from 'react';
import { Card, Button, Badge, Space } from 'antd';
import { BellOutlined, UserOutlined, BookOutlined, AlertOutlined, InboxOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

// Import all sub-functions
import PersonalDashboard from './PersonalDashboard';
import ReserveSeat from './ReserveSeat';
import SubmitComplaint from './SubmitComplaint';
import ViewLostFound from './ViewLostFound';

const { Title, Text } = Typography;

export default function HomeDashboard({
  student,
  setStudent,
  activeBooking,
  setActiveTab,
  simulateNewReservation,
  setNfcModalVisible,
  setAnnouncementsVisible,
  formatTimer,
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
  // Sub-navigation state inside the first page landing launchpad:
  // 'book' (Reserve) | 'dash' (Dashboard) | 'issue' (Complaint) | 'lost' (Lost & Found)
  // Default to 'book' (Reserve Seat) so it stays in front as previously requested!
  const [subTab, setSubTab] = useState('book');

  const renderSubComponent = () => {
    switch (subTab) {
      case 'book':
        return (
          <ReserveSeat
            student={student}
            selectedLibrary={selectedLibrary}
            setSelectedLibrary={setSelectedLibrary}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedTimeSlot={selectedTimeSlot}
            setSelectedTimeSlot={setSelectedTimeSlot}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            confirmationVisible={confirmationVisible}
            setConfirmationVisible={setConfirmationVisible}
            handleConfirmReservation={handleConfirmReservation}
          />
        );
      case 'dash':
        return (
          <PersonalDashboard
            student={student}
            setStudent={setStudent}
            activeBooking={activeBooking}
            setActiveTab={setActiveTab}
            simulateNewReservation={simulateNewReservation}
            formatTimer={formatTimer}
          />
        );
      case 'issue':
        return <SubmitComplaint student={student} />;
      case 'lost':
        return <ViewLostFound />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* UTM Student Greeting Banner */}
      <div className="mobile-header-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: 600 }}>UTM SEAT COMPANION</Text>
            <Title level={4} style={{ margin: 0, color: '#ffffff', fontWeight: 700, fontSize: '18px' }}>
              Hi, {student.name} 👋
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11.5px', fontFamily: 'monospace' }}>
              {student.domain}
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

      {/* High-Fidelity Centralised Function launchpad Grid Selector */}
      <div style={{ padding: '0 4px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          background: '#ffffff',
          padding: 8,
          borderRadius: 14,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          marginBottom: 6
        }}>
          {/* Reserve segment */}
          <div
            onClick={() => setSubTab('book')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 2px',
              borderRadius: 8,
              backgroundColor: subTab === 'book' ? '#e6f4ff' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOutlined style={{ color: subTab === 'book' ? '#1677ff' : '#64748b', fontSize: '16px', marginBottom: 4 }} />
            <Text strong={subTab === 'book'} style={{ fontSize: '9px', color: subTab === 'book' ? '#1677ff' : '#475569' }}>Reserve</Text>
          </div>

          {/* Dashboard segment */}
          <div
            onClick={() => setSubTab('dash')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 2px',
              borderRadius: 8,
              backgroundColor: subTab === 'dash' ? '#e6f4ff' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <UserOutlined style={{ color: subTab === 'dash' ? '#1677ff' : '#64748b', fontSize: '16px', marginBottom: 4 }} />
            <Text strong={subTab === 'dash'} style={{ fontSize: '9px', color: subTab === 'dash' ? '#1677ff' : '#475569' }}>Profile</Text>
          </div>

          {/* Submit Complaint segment */}
          <div
            onClick={() => setSubTab('issue')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 2px',
              borderRadius: 8,
              backgroundColor: subTab === 'issue' ? '#e6f4ff' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <AlertOutlined style={{ color: subTab === 'issue' ? '#1677ff' : '#64748b', fontSize: '16px', marginBottom: 4 }} />
            <Text strong={subTab === 'issue'} style={{ fontSize: '9px', color: subTab === 'issue' ? '#1677ff' : '#475569' }}>Complaint</Text>
          </div>

          {/* Lost & Found segment */}
          <div
            onClick={() => setSubTab('lost')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 2px',
              borderRadius: 8,
              backgroundColor: subTab === 'lost' ? '#e6f4ff' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <InboxOutlined style={{ color: subTab === 'lost' ? '#1677ff' : '#64748b', fontSize: '16px', marginBottom: 4 }} />
            <Text strong={subTab === 'lost'} style={{ fontSize: '9px', color: subTab === 'lost' ? '#1677ff' : '#475569' }}>Lost/Found</Text>
          </div>
        </div>

        {/* Dynamic sub-view viewport inside the landing control hub */}
        <div style={{ marginTop: 8 }}>
          {renderSubComponent()}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Space,
  Button,
  Badge,
  Modal,
  List,
  Typography,
  message,
  Spin
} from 'antd';
import {
  HomeOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  WifiOutlined,
  MobileOutlined,
  BellOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

// Student Screens
import HomeDashboard from './student/HomeDashboard';
import ActiveBooking from './student/ActiveBooking';
import BookingHistory from './student/BookingHistory';

// Admin Screens
import AdminDashboard from './admin/AdminDashboard';

const { Title, Text, Paragraph } = Typography;

export default function App() {
  // Centralised bottom tabs: 'home' (First Page Hub) | 'booking' (Live) | 'history' (Log)
  const [activeTab, setActiveTab] = useState('home');

  // UTM Student Mock Database State
  const [student, setStudent] = useState({
    name: 'Pei En',
    matrixId: 'A22CS0148',
    domain: 'lokeen@graduate.utm.my',
    strikes: 2, // starting with 2 strikes
    role: 'Student' // 'Student' | 'Admin'
  });

  // Seat booking simulation state
  const [activeBooking, setActiveBooking] = useState({
    seatId: 'L2-S04',
    areaName: 'Level 2: Quiet Study Area',
    nfcUid: '04:E3:4C:6A:B2:1A:80',
    status: 'Reserved', // 'None' | 'Reserved' | 'CheckedIn' | 'Completed'
    timeRemaining: 900, // 15 mins grace check-in in seconds
    timerRunning: true
  });

  // History state
  const [historyList, setHistoryList] = useState([
    { key: '1', date: '2026-05-24', seat: 'L1-S03', time: '10:00 AM - 12:00 PM', status: 'Completed' },
    { key: '2', date: '2026-05-23', seat: 'L2-S01', time: '02:00 PM - 04:00 PM', status: 'Expired', reason: 'Missed 5-minute NFC grace period' },
    { key: '3', date: '2026-05-20', seat: 'GF-S02', time: '09:00 AM - 11:00 AM', status: 'Cancelled' },
    { key: '4', date: '2026-05-18', seat: 'L3-S04', time: '03:00 PM - 05:00 PM', status: 'Completed' },
    { key: '5', date: '2026-05-15', seat: 'L1-S01', time: '11:00 AM - 01:00 PM', status: 'Expired', reason: 'Missed 5-minute NFC grace period' }
  ]);

  // New Reservation Form State (Managed centrally, routed by Home Page)
  const [selectedLibrary, setSelectedLibrary] = useState('Perpustakaan Sultanah Zanariah (PSZ)');
  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  const [selectedArea, setSelectedArea] = useState('Area 1');
  const [selectedSeatId, setSelectedSeatId] = useState('S01');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [selectedDuration, setSelectedDuration] = useState('2 Hours (Max)');

  // NFC Scanner Modal state
  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Announcement modal state
  const [announcementsVisible, setAnnouncementsVisible] = useState(false);

  // Checkout completed confirmation modal state
  const [checkoutCompleteVisible, setCheckoutCompleteVisible] = useState(false);

  // Auto-redirect to the Home tab once the checkout completed modal is shown
  useEffect(() => {
    if (!checkoutCompleteVisible) return;
    const timeout = setTimeout(() => {
      setCheckoutCompleteVisible(false);
      setActiveTab('home');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [checkoutCompleteVisible]);

  // Timer runner
  useEffect(() => {
    let interval = null;
    if (activeBooking.status !== 'None' && activeBooking.timerRunning && activeBooking.timeRemaining > 0) {
      interval = setInterval(() => {
        setActiveBooking((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (activeBooking.timeRemaining === 0 && activeBooking.status !== 'None') {
      handleTimerTimeout();
    }
    return () => clearInterval(interval);
  }, [activeBooking.status, activeBooking.timerRunning, activeBooking.timeRemaining]);

  const handleTimerTimeout = () => {
    const expiredBooking = { ...activeBooking };
    
    const newHistory = {
      key: String(historyList.length + 1),
      date: new Date().toISOString().split('T')[0],
      seat: expiredBooking.seatId,
      time: '04:00 PM - 06:00 PM',
      status: 'Expired',
      reason: expiredBooking.status === 'Reserved' ? 'Missed 5-minute NFC grace period' : 'Auto-checkout session timeout'
    };

    setHistoryList([newHistory, ...historyList]);

    setStudent(prev => {
      const nextStrikes = Math.min(prev.strikes + 1, 5);
      return { ...prev, strikes: nextStrikes };
    });

    setActiveBooking(prev => ({
      ...prev,
      status: 'None',
      timeRemaining: 0
    }));

    message.error('⚠️ Reservation grace timeout! Disciplinary strike count incremented.');
  };

  // Logout & switch mock identity between Student and Admin
  const handleToggleRole = () => {
    setStudent(prev => {
      const isAdmin = prev.role === 'Admin';
      message.success(isAdmin ? '🎓 Logged back in as Student.' : '🔑 Logged out. Signed in as Admin.');
      return isAdmin
        ? { ...prev, name: 'Pei En', matrixId: 'A22CS0148', domain: 'lokeen@graduate.utm.my', role: 'Student' }
        : { ...prev, name: 'Admin Staff', matrixId: 'STAFF-0001', domain: 'Staff Domain: @utm.my', role: 'Admin' };
    });
  };

  // Converts the selected session duration label into a countdown in seconds
  const getDurationSeconds = (duration) => {
    if (duration === '30 Minutes') return 1800;
    if (duration === '1 Hour') return 3600;
    return 7200; // '2 Hours (Max)'
  };

  // NFC Simulation Trigger
  const handleNfcScan = () => {
    if (student.strikes >= 5) {
      message.error('⛔ Scan Blocked: Student privileges are suspended due to 5 strikes!');
      setNfcModalVisible(false);
      return;
    }

    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setNfcModalVisible(false);

      if (activeBooking.status === 'Reserved') {
        const sessionSeconds = getDurationSeconds(selectedDuration);
        setActiveBooking(prev => ({
          ...prev,
          status: 'CheckedIn',
          timeRemaining: sessionSeconds,
        }));
        message.success(`✅ Seat Checked In! ${selectedDuration} Study Session Active.`);
      } else {
        setActiveBooking({
          seatId: 'L1-S02',
          areaName: 'Level 1: Collaborative Zone',
          nfcUid: '04:5C:8B:1A:F5:2C:81',
          status: 'CheckedIn',
          timeRemaining: 7200,
          timerRunning: true
        });
        message.success('✅ Direct Seat Check-In via NFC tag.');
      }
    }, 1500);
  };

  const handleEarlyCheckout = () => {
    const closedBooking = { ...activeBooking };
    
    const newHistory = {
      key: String(historyList.length + 1),
      date: new Date().toISOString().split('T')[0],
      seat: closedBooking.seatId,
      time: '12:00 PM - 02:00 PM',
      status: 'Completed'
    };

    setHistoryList([newHistory, ...historyList]);
    setActiveBooking(prev => ({ ...prev, status: 'None', timeRemaining: 0 }));
    setActiveTab('home');
    setCheckoutCompleteVisible(true);
  };

  const simulateNewReservation = () => {
    if (student.strikes >= 5) {
      message.error('⛔ Booking Suspended: You have reached the maximum limit of 5 strikes.');
      return;
    }
    
    setActiveBooking({
      seatId: 'L2-S04',
      areaName: 'Level 2: Quiet Study Area',
      nfcUid: '04:E3:4C:6A:B2:1A:80',
      status: 'Reserved',
      timeRemaining: 300, // 5-minute grace period
      timerRunning: true
    });
    setActiveTab('booking');
    message.info('🎟️ Seat L2-S04 reserved! Scan physical NFC Tag within 5 minutes.');
  };

  const handleConfirmReservation = () => {
    if (student.strikes >= 5) {
      message.error('⛔ Booking Suspended: You have reached the maximum limit of 5 strikes.');
      return;
    }

    const seat = selectedSeatId;
    let nfc = '04:E3:4C:6A:B2:1A:80';
    if (selectedLevel === 'Level 1') {
      nfc = '04:5C:8B:1A:F5:2C:81';
    } else if (selectedLevel === 'Level 3') {
      nfc = '04:AB:CD:EF:01:23:45';
    } else if (selectedLevel === 'Level 4') {
      nfc = '04:11:22:33:44:55:66';
    }

    setActiveBooking({
      seatId: seat,
      areaName: `${selectedLevel} (${selectedArea})`,
      nfcUid: nfc,
      status: 'Reserved',
      timeRemaining: 300, // 5-minute grace period
      timerRunning: true
    });

    setActiveTab('booking');
    setNfcModalVisible(true);
    message.success(`🎟️ Reserved Seat ${seat}! Please tap your phone with the NFC tag to check in.`);
  };

  const formatTimer = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="phone-shell">
      {/* Notch / Dynamic Island Detail */}
      <div className="phone-notch">
        <div className="camera-lens" />
        <div className="sensor-dot" />
      </div>

      {/* iOS Status Bar Simulated */}
      <div className="phone-status-bar">
        <span>12:00</span>
        <Space size="small">
          <WifiOutlined style={{ fontSize: '13px' }} />
          <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>5G</span>
          <div style={{ width: 18, height: 10, border: '1px solid #1e293b', borderRadius: '3px', position: 'relative', display: 'flex', alignItems: 'center', padding: '1px' }}>
            <div style={{ flex: 1, height: '100%', backgroundColor: '#1e293b', borderRadius: '1px' }} />
            <div style={{ width: 2, height: 4, backgroundColor: '#1e293b', position: 'absolute', right: -3, top: 2 }} />
          </div>
        </Space>
      </div>

      {/* Screen Frame */}
      <div className="phone-screen">
        {/* Scroll content */}
        <div className="screen-scroll-content">
          {student.role === 'Admin' ? (
            <AdminDashboard student={student} handleToggleRole={handleToggleRole} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeDashboard
                  student={student}
                  setStudent={setStudent}
                  activeBooking={activeBooking}
                  setActiveTab={setActiveTab}
                  simulateNewReservation={simulateNewReservation}
                  setNfcModalVisible={setNfcModalVisible}
                  setAnnouncementsVisible={setAnnouncementsVisible}
                  handleToggleRole={handleToggleRole}
                  handleEarlyCheckout={handleEarlyCheckout}
                  formatTimer={formatTimer}
                  selectedLibrary={selectedLibrary}
                  setSelectedLibrary={setSelectedLibrary}
                  selectedLevel={selectedLevel}
                  setSelectedLevel={setSelectedLevel}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                  selectedSeatId={selectedSeatId}
                  setSelectedSeatId={setSelectedSeatId}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  setSelectedTimeSlot={setSelectedTimeSlot}
                  selectedDuration={selectedDuration}
                  setSelectedDuration={setSelectedDuration}
                  handleConfirmReservation={handleConfirmReservation}
                />
              )}
              {activeTab === 'booking' && (
                <ActiveBooking
                  student={student}
                  activeBooking={activeBooking}
                  simulateNewReservation={simulateNewReservation}
                  setNfcModalVisible={setNfcModalVisible}
                  handleEarlyCheckout={handleEarlyCheckout}
                  formatTimer={formatTimer}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'history' && (
                <BookingHistory historyList={historyList} />
              )}
            </>
          )}
        </div>

        {/* Tabbar Navigation (Student only) */}
        {student.role !== 'Admin' && (
          <div className="phone-tabbar">
            <div className={`tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <HomeOutlined className="tab-item-icon" />
              <span>Home</span>
            </div>
            <div className={`tab-item ${activeTab === 'booking' ? 'active' : ''}`} onClick={() => setActiveTab('booking')}>
              <Badge dot={activeBooking.status !== 'None'} size="small">
                <ClockCircleOutlined className="tab-item-icon" />
              </Badge>
              <span>Live Session</span>
            </div>
            <div className={`tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <HistoryOutlined className="tab-item-icon" />
              <span>History</span>
            </div>
          </div>
        )}
      </div>

      {/* iOS Home Indicator simulated bezel spacer */}
      <div className="home-indicator-bar">
        <div className="home-indicator" />
      </div>

      {/* NFC Scan Simulation Modal */}
      <Modal
        visible={nfcModalVisible}
        onCancel={() => {
          setNfcModalVisible(false);
          setScanning(false);
        }}
        footer={null}
        closable={false}
        width={320}
        centered
        destroyOnClose
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <MobileOutlined style={{ fontSize: '48px', color: '#1677ff', marginBottom: 12 }} />
          <Title level={5} style={{ margin: '0 0 8px 0' }}>Simulated NFC Checker</Title>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 16 }}>
            {`Please tap your phone with the NFC tag on Seat ${activeBooking.seatId} to check in.`}
          </Text>

          <div
            className={`nfc-tap-scanner ${scanning ? 'scanning' : ''}`}
            onClick={handleNfcScan}
          >
            {scanning ? (
              <Spin size="large" />
            ) : (
              <>
                <ScanOutlined style={{ fontSize: '28px', color: '#1677ff', marginBottom: 6 }} />
                <Text strong style={{ fontSize: '11px', color: '#1677ff' }}>TAP TO SCAN TAG</Text>
              </>
            )}
          </div>
          
          <Text type="secondary" style={{ fontSize: '10px', marginTop: 12, display: 'block' }}>
            Simulates NFC Hardware UID match on your physical device.
          </Text>

          <Button
            type="default"
            block
            icon={<ArrowLeftOutlined />}
            style={{ marginTop: 16 }}
            onClick={() => {
              setNfcModalVisible(false);
              setScanning(false);
              setActiveTab('home');
            }}
          >
            Back
          </Button>
        </div>
      </Modal>

      {/* Announcements list Modal */}
      <Modal
        title="📢 UTM Library Announcements"
        visible={announcementsVisible}
        onCancel={() => setAnnouncementsVisible(false)}
        footer={null}
        width={340}
        centered
      >
        <List
          size="small"
          dataSource={[
            { title: 'Grace check-in period revised', desc: 'The grace period to verify your seat check-in via NFC tags has been adjusted from 15 minutes down to 5 minutes to prevent seat squatting.', date: '2026-05-25' },
            { title: 'Level 2 Air Conditioning Repair', desc: 'F&M Department is servicing AC-400X unit above Seat L2-S04 on Wednesday morning.', date: '2026-05-24' },
            { title: 'New Penalty system update', desc: 'Accruing 5 strikes will lead to an automatic 14-day library suspension block. Strike counts reset every semester.', date: '2026-05-20' }
          ]}
          renderItem={item => (
            <List.Item style={{ padding: '12px 0', display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text strong style={{ fontSize: '12.5px' }}>{item.title}</Text>
                <Text type="secondary" style={{ fontSize: '10px' }}>{item.date}</Text>
              </div>
              <Paragraph style={{ margin: 0, fontSize: '11.5px', color: '#475569', lineHeight: 1.4 }}>
                {item.desc}
              </Paragraph>
            </List.Item>
          )}
        />
        <Button type="primary" block style={{ marginTop: 16 }} onClick={() => setAnnouncementsVisible(false)}>
          Close
        </Button>
      </Modal>

      {/* Checkout Completed Modal */}
      <Modal
        visible={checkoutCompleteVisible}
        footer={null}
        closable={false}
        width={300}
        centered
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: 12 }} />
          <Title level={5} style={{ margin: '0 0 8px 0' }}>Check-Out Completed!</Title>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 16 }}>
            Seat successfully released for other students. Redirecting to Home...
          </Text>
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            block
            onClick={() => {
              setCheckoutCompleteVisible(false);
              setActiveTab('home');
            }}
          >
            Back
          </Button>
        </div>
      </Modal>
    </div>
  );
}

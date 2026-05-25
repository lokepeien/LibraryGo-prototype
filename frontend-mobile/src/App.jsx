import React, { useState, useEffect } from 'react';
import {
  Card,
  Space,
  Button,
  Tag,
  Steps,
  List,
  Typography,
  Alert,
  Badge,
  Modal,
  Divider,
  Progress,
  message
} from 'antd';
import {
  HomeOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  UserOutlined,
  WifiOutlined,
  AlertOutlined,
  MobileOutlined,
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  ScanOutlined,
  PlayCircleOutlined,
  NotificationOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  BookOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function App() {
  // Navigation states: 'home' | 'booking' | 'history'
  const [activeTab, setActiveTab] = useState('home');

  // UTM Student Mock Database State
  const [student, setStudent] = useState({
    name: 'Pei En',
    matrixId: 'A22CS0148',
    domain: 'Student Domain: @utm.my',
    strikes: 2, // starting with 2 strikes
  });

  // Seat booking simulation state
  const [activeBooking, setActiveBooking] = useState({
    seatId: 'L2-S04',
    areaName: 'Level 2: Quiet Study Area',
    nfcUid: '04:E3:4C:6A:B2:1A:80',
    status: 'Reserved', // 'None' | 'Reserved' | 'CheckedIn' | 'Completed'
    timeRemaining: 900, // 15 mins checkout countdown in seconds
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

  // NFC Scanner Modal state
  const [nfcModalVisible, setNfcModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Announcement modal state
  const [announcementsVisible, setAnnouncementsVisible] = useState(false);

  // New Reservation Form State
  const [selectedLibrary, setSelectedLibrary] = useState('Perpustakaan Sultanah Zanariah (PSZ)');
  const [selectedArea, setSelectedArea] = useState('Level 2: Quiet Study Area');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [selectedDuration, setSelectedDuration] = useState('2 Hours (Max)');
  
  // Confirmation Modal
  const [confirmationVisible, setConfirmationVisible] = useState(false);

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
    // Session expired
    const expiredBooking = { ...activeBooking };
    
    // Add to history as Expired
    const newHistory = {
      key: String(historyList.length + 1),
      date: new Date().toISOString().split('T')[0],
      seat: expiredBooking.seatId,
      time: '04:00 PM - 06:00 PM',
      status: 'Expired',
      reason: expiredBooking.status === 'Reserved' ? 'Missed 5-minute NFC grace period' : 'Auto-checkout session timeout'
    };

    setHistoryList([newHistory, ...historyList]);

    // Apply Strike
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
        // Checking in!
        setActiveBooking(prev => ({
          ...prev,
          status: 'CheckedIn',
          timeRemaining: 7200, // 2-hour study session timer started!
        }));
        message.success('✅ Seat Checked In! 2-Hour Study Session Active.');
      } else if (activeBooking.status === 'CheckedIn') {
        // Checking out early!
        handleEarlyCheckout();
      } else {
        // Dynamic new reservation setup
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
    
    // Add to history
    const newHistory = {
      key: String(historyList.length + 1),
      date: new Date().toISOString().split('T')[0],
      seat: closedBooking.seatId,
      time: '12:00 PM - 02:00 PM',
      status: 'Completed'
    };

    setHistoryList([newHistory, ...historyList]);
    setActiveBooking(prev => ({ ...prev, status: 'None', timeRemaining: 0 }));
    message.success('👋 Checked Out! Seat successfully released for other students.');
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
      timeRemaining: 300, // 5-minute grace period to check-in (300 seconds)
      timerRunning: true
    });
    setActiveTab('booking');
    message.info('🎟️ Seat L2-S04 reserved! Scan physical NFC Tag within 5 minutes.');
  };

  const handleConfirmReservation = () => {
    if (student.strikes >= 5) {
      message.error('⛔ Booking Suspended: You have reached the maximum limit of 5 strikes.');
      setConfirmationVisible(false);
      return;
    }

    // Determine seat based on area selection
    let seat = 'L2-S04';
    let nfc = '04:E3:4C:6A:B2:1A:80';
    if (selectedArea.includes('Level 1')) {
      seat = 'L1-S02';
      nfc = '04:5C:8B:1A:F5:2C:81';
    } else if (selectedArea.includes('Level 3')) {
      seat = 'L3-S02';
      nfc = '04:AB:CD:EF:01:23:45';
    } else if (selectedArea.includes('Ground')) {
      seat = 'GF-S03';
      nfc = '04:11:22:33:44:55:66';
    }

    setActiveBooking({
      seatId: seat,
      areaName: selectedArea,
      nfcUid: nfc,
      status: 'Reserved',
      timeRemaining: 300, // 5-minute grace period to check-in (300 seconds)
      timerRunning: true
    });

    setConfirmationVisible(false);
    setActiveTab('booking');
    message.success(`🎟️ Reserved Seat ${seat}! Review parameters and scan NFC tag.`);
  };

  const formatTimer = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // --- SUB SCREENS RENDERING ---

  // Screen 1: Home Dashboard
  const renderHomeDashboard = () => {
    const isBanned = student.strikes >= 5;
    
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
              <Button type="text" shape="circle" icon={<BellOutlined style={{ color: '#fff', fontSize: '18px' }} />} onClick={() => setAnnouncementsVisible(true)} />
            </Badge>
          </div>
        </div>

        {/* Dynamic Strike warnings */}
        <div style={{ padding: '0 4px' }}>
          <Card className="mobile-card" style={{ marginBottom: 4 }} bodyStyle={{ padding: 12 }}>
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

            {/* Admin Tester controls (so developer can easily demonstrate changes in real-time) */}
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
              message={
                <span style={{ fontWeight: 700, fontSize: '12px' }}>
                  ⛔ Library Privileges Suspended!
                </span>
              }
              description={
                <span style={{ fontSize: '11px' }}>
                  You have reached the maximum threshold of 5 strikes. NFC desk check-in scanners and seat bookings are locked.
                </span>
              }
              type="error"
              showIcon
              style={{ borderRadius: 12, marginBottom: 12 }}
            />
          )}

          {/* Quick Actions Panel */}
          <Title level={5} style={{ margin: '8px 0 8px 0', fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>QUICK ACTIONS</Title>
          <div className="mobile-grid-actions">
            <div className="action-btn-card" onClick={() => setNfcModalVisible(true)}>
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e6f4ff', display: 'flex', justifyContent: 'center', alignMode: 'center', alignItems: 'center' }}>
                <ScanOutlined style={{ color: '#1677ff', fontSize: '18px' }} />
              </div>
              <Text strong style={{ fontSize: '12px', color: '#334155' }}>NFC Check-In</Text>
              <Text type="secondary" style={{ fontSize: '9.5px' }}>Simulate NFC scan</Text>
            </div>

            <div className="action-btn-card" onClick={() => setAnnouncementsVisible(true)}>
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f9f0ff', display: 'flex', justifyContent: 'center', alignMode: 'center', alignItems: 'center' }}>
                <NotificationOutlined style={{ color: '#722ed1', fontSize: '18px' }} />
              </div>
              <Text strong style={{ fontSize: '12px', color: '#334155' }}>Announcements</Text>
              <Text type="secondary" style={{ fontSize: '9.5px' }}>UTM rules & updates</Text>
            </div>
          </div>

          {/* Current Reservation Status Card (if set) */}
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
      </div>
    );
  };

  // Screen 2: Active Booking & Timer Screen
  const renderActiveBooking = () => {
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

    // Map booking status to steps index
    // Journey: Reserved -> Checked In -> Completed
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
              type="primary"
              danger
              size="large"
              block
              icon={<CloseCircleOutlined />}
              onClick={handleEarlyCheckout}
            >
              Manual Early Check-Out
            </Button>
            <Button
              type="default"
              size="middle"
              block
              icon={<ScanOutlined />}
              onClick={() => setNfcModalVisible(true)}
            >
              Simulate Vacate / Checkout Tap
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Screen 3: Booking History Screen
  const renderBookingHistory = () => {
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
  };

  // Screen 4: Reserve a Seat View
  const renderReserveSeatView = () => {
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
  };

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'LibraryGo Home';
      case 'book':
        return 'Reserve Seat';
      case 'booking':
        return 'Live Session';
      case 'history':
        return 'Attendance Logs';
      default:
        return 'LibraryGo';
    }
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
          {activeTab === 'home' && renderHomeDashboard()}
          {activeTab === 'book' && renderReserveSeatView()}
          {activeTab === 'booking' && renderActiveBooking()}
          {activeTab === 'history' && renderBookingHistory()}
        </div>

        {/* Tabbar Navigation */}
        <div className="phone-tabbar">
          <div className={`tab-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <HomeOutlined className="tab-item-icon" />
            <span>Home</span>
          </div>
          <div className={`tab-item ${activeTab === 'book' ? 'active' : ''}`} onClick={() => setActiveTab('book')}>
            <BookOutlined className="tab-item-icon" />
            <span>Reserve</span>
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
        width={320}
        centered
        destroyOnClose
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <MobileOutlined style={{ fontSize: '48px', color: '#1677ff', marginBottom: 12 }} />
          <Title level={5} style={{ margin: '0 0 8px 0' }}>Simulated NFC Checker</Title>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 16 }}>
            {activeBooking.status === 'CheckedIn' 
              ? `vacating Seat: ${activeBooking.seatId}. Tap your phone screen to simulate checking out.`
              : `Checking in Seat: ${activeBooking.seatId}. Tap your phone screen to simulate checking in.`
            }
          </Text>

          <div
            className={`nfc-tap-scanner ${scanning ? 'scanning' : ''}`}
            onClick={handleNfcScan}
          >
            {scanning ? (
              <ActivityIndicator color="#52c41a" style={{ transform: 'scale(1.5)' }} />
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
    </div>
  );
}

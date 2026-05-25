import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Badge,
  Modal,
  Form,
  InputNumber,
  message,
  Avatar,
  Popover,
  Tooltip,
  List,
  Typography,
  Divider,
  Grid
} from 'antd';
import {
  DashboardOutlined,
  AreaChartOutlined,
  StopOutlined,
  AlertOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  BellOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FieldTimeOutlined,
  CoffeeOutlined,
  MobileOutlined,
  WifiOutlined,
  HistoryOutlined,
  ScanOutlined,
  HomeOutlined,
  BookOutlined,
  BulbOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {
  TabBar as MobileTabBar,
  Steps as MobileSteps,
  Button as MobileButton,
  Card as MobileCard,
  List as MobileList,
  Tag as MobileTag,
  NoticeBar as MobileNoticeBar,
  Toast as MobileToast,
  Dialog as MobileDialog
} from 'antd-mobile';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// --- INITIAL MOCK DATA ---

const initialBlacklist = [
  { key: '1', studentId: 'A22CS0148', name: 'Ahmad Faiz bin Azmi', strikes: 2, status: 'Active' },
  { key: '2', studentId: 'A21EC0052', name: 'Tan Mei Ling', strikes: 2, status: 'Active' },
  { key: '3', studentId: 'A22CS0089', name: 'Saraswathy a/p Mohan', strikes: 3, status: 'Blacklisted' },
  { key: '4', studentId: 'A20EC0110', name: 'Brandon Lim Wei Shen', strikes: 1, status: 'Active' },
  { key: '5', studentId: 'B22CS0302', name: 'Nurul Izzah binti Rosli', strikes: 3, status: 'Blacklisted' }
];

const initialSeats = [
  // Level 1: Collaborative Zone
  { id: 'L1-S01', area: 'Level 1: Collaborative Zone', nfcUid: '04:A2:3E:9B:10:E2:80', status: 'Available', occupant: null },
  { id: 'L1-S02', area: 'Level 1: Collaborative Zone', nfcUid: '04:5C:8B:1A:F5:2C:81', status: 'Available', occupant: null },
  { id: 'L1-S03', area: 'Level 1: Collaborative Zone', nfcUid: '04:FF:E2:33:6B:40:80', status: 'Booked', occupant: 'Siti Aminah (A22CS0032)' },
  { id: 'L1-S04', area: 'Level 1: Collaborative Zone', nfcUid: '04:2E:7A:B2:CC:5F:80', status: 'Available', occupant: null },
  
  // Level 2: Quiet Study Area
  { id: 'L2-S01', area: 'Level 2: Quiet Study Area', nfcUid: '04:E3:4C:6A:B2:1A:80', status: 'Available', occupant: null },
  { id: 'L2-S02', area: 'Level 2: Quiet Study Area', nfcUid: '04:77:88:99:AA:BB:CC', status: 'Available', occupant: null },
  { id: 'L2-S03', area: 'Level 2: Quiet Study Area', nfcUid: '04:11:22:33:44:55:66', status: 'Available', occupant: null },
  { id: 'L2-S04', area: 'Level 2: Quiet Study Area', nfcUid: '04:AA:BB:CC:DD:EE:FF', status: 'Available', occupant: null }, // Seat that student mobile checks into
  
  // Postgraduate Hub
  { id: 'L3-S01', area: 'Level 3: Postgraduate Hub', nfcUid: '04:55:66:77:88:99:00', status: 'Booked', occupant: 'Dr. Sarah (Staff)' }
];

const initialComplaints = [
  {
    key: '1',
    id: 'CMP-2026-081',
    category: 'Air Conditioning',
    seatId: 'L2-S04',
    area: 'Level 2: Quiet Study Area',
    status: 'Pending',
    date: '2026-05-24',
    facilityDetails: 'Model: York Industrial AC-400X. Located directly above Desk 14/Seat L2-S04. Leaking water condensation.',
    adminComments: 'Scheduled service tomorrow morning.'
  }
];

const initialLostFound = [
  {
    key: '1',
    id: 'LF-902',
    name: 'Apple iPad Air (5th Gen)',
    description: 'Space Gray color, dark green magnetic folio case.',
    location: 'Level 2: Quiet Study Area (Desk 22)',
    date: '2026-05-23',
    status: 'Unclaimed',
    claimedBy: '',
    claimDate: ''
  }
];

const systemLogs = [
  { time: '10 mins ago', message: 'Student Ahmad Faiz (A22CS0148) checked in at Seat L2-S04 via NFC mobile companion.' },
  { time: '1 hour ago', message: 'Staff resolved facility complaint CMP-2026-079 (Damaged Chair in Level 3).' },
  { time: '3 hours ago', message: 'New lost & found item LF-905 (Student ID Card) reported at Ground Floor.' }
];

export default function App() {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // Menu index: 1-5 Admin, 6 = Mobile App Preview
  
  // Core Databases (Synchronized State)
  const [blacklist, setBlacklist] = useState(initialBlacklist);
  const [seats, setSeats] = useState(initialSeats);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [lostFound, setLostFound] = useState(initialLostFound);
  
  // Search and Filter States
  const [blacklistSearch, setBlacklistSearch] = useState('');
  const [seatAreaFilter, setSeatAreaFilter] = useState('All');
  const [lostFoundFilter, setLostFoundFilter] = useState('All');

  // Modal States
  const [isBlacklistModalVisible, setIsBlacklistModalVisible] = useState(false);
  const [isLostFoundModalVisible, setIsLostFoundModalVisible] = useState(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState(null);

  // Form States
  const [blacklistForm] = Form.useForm();
  const [lostFoundForm] = Form.useForm();
  const [claimForm] = Form.useForm();

  // ==========================================
  // STUDENT MOBILE COMPANION APP STATES
  // ==========================================
  const [mobileActiveTab, setMobileActiveTab] = useState('home');
  const [mobileStrikes, setMobileStrikes] = useState(2); // Starts at 2 to demonstrate strike warnings
  const [mobileBookingState, setMobileBookingState] = useState('Reserved'); // 'Reserved', 'CheckedIn'
  const [mobileTimer, setMobileTimer] = useState(300); // 5-minute countdown (300s)
  const [mobileScanning, setMobileScanning] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  // Synchronize Mobile App Check-In with Dashboard Seats Database
  useEffect(() => {
    setSeats(prevSeats => 
      prevSeats.map(seat => {
        if (seat.id === 'L2-S04') {
          return {
            ...seat,
            status: mobileBookingState === 'CheckedIn' ? 'Booked' : 'Available',
            occupant: mobileBookingState === 'CheckedIn' ? 'Ahmad Faiz (A22CS0148)' : null
          };
        }
        return seat;
      })
    );
  }, [mobileBookingState]);

  // Handle countdown active timer tick (for CheckedIn view)
  useEffect(() => {
    let interval = null;
    if (mobileBookingState === 'CheckedIn' && mobileTimer > 0) {
      interval = setInterval(() => {
        setMobileTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mobileBookingState, mobileTimer]);

  const handleMobileNfcCheckin = () => {
    if (mobileStrikes >= 5) {
      MobileDialog.alert({
        header: <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>⛔ Check-In Blocked</Text>,
        content: 'Your library privileges are suspended due to 5 active strikes. Please see the help desk.',
        confirmText: 'Dismiss'
      });
      return;
    }

    setMobileScanning(true);
    setTimeout(() => {
      setMobileScanning(false);
      setMobileBookingState('CheckedIn');
      setMobileTimer(300); // Reset timer
      message.success('NFC Seat Verification Successful: Checked In at Seat L2-S04');
    }, 1500);
  };

  const handleMobileCheckOut = () => {
    setMobileBookingState('Reserved');
    message.info('Early check-out vacated. Seat L2-S04 is now vacant.');
  };

  const handleAddMobileStrike = () => {
    setMobileStrikes(prev => Math.min(prev + 1, 5));
    message.warning('Strike simulated on student mobile app.');
  };

  const handleResetMobileStrikes = () => {
    setMobileStrikes(0);
    message.success('Strikes reset to 0.');
  };

  // Synchronize dynamic stats
  const totalSeats = seats.length;
  const bookedSeats = seats.filter(s => s.status === 'Booked').length;
  const availableSeats = totalSeats - bookedSeats;
  const blacklistedCount = blacklist.filter(b => b.status === 'Blacklisted').length;
  const activeStrikes = blacklist.reduce((acc, curr) => acc + curr.strikes, 0) + mobileStrikes;
  const unresolvedComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  // --- ADMIN ACTIONS ---

  const handleAddBlacklist = (values) => {
    const newEntry = {
      key: String(blacklist.length + 1),
      studentId: values.studentId.toUpperCase(),
      name: values.name,
      strikes: values.strikes,
      status: values.strikes >= 3 ? 'Blacklisted' : 'Active'
    };
    setBlacklist([newEntry, ...blacklist]);
    setIsBlacklistModalVisible(false);
    blacklistForm.resetFields();
    message.success(`Student ${values.name} added.`);
  };

  const handleResetStrikes = (recordKey) => {
    setBlacklist(blacklist.map(item => {
      if (item.key === recordKey) {
        message.info(`Reset strike count for ${item.name}.`);
        return { ...item, strikes: 0, status: 'Active' };
      }
      return item;
    }));
  };

  const handleRemoveBlacklist = (recordKey) => {
    setBlacklist(blacklist.filter(item => item.key !== recordKey));
    message.success(`Removed student record.`);
  };

  const handleToggleSeatStatus = (seatId) => {
    setSeats(seats.map(seat => {
      if (seat.id === seatId) {
        const nextStatus = seat.status === 'Available' ? 'Booked' : 'Available';
        // Handle student mobile check in state out-of-sync release
        if (seatId === 'L2-S04' && nextStatus === 'Available') {
          setMobileBookingState('Reserved');
        }
        return {
          ...seat,
          status: nextStatus,
          occupant: nextStatus === 'Booked' ? 'Walk-in Student' : null
        };
      }
      return seat;
    }));
  };

  const handleUpdateComplaintStatus = (complaintKey, newStatus) => {
    setComplaints(complaints.map(comp => {
      if (comp.key === complaintKey) {
        message.success(`Complaint status updated to ${newStatus}.`);
        return { ...comp, status: newStatus };
      }
      return comp;
    }));
  };

  const handleUpdateAdminComments = (complaintKey, text) => {
    setComplaints(complaints.map(comp => {
      if (comp.key === complaintKey) {
        return { ...comp, adminComments: text };
      }
      return comp;
    }));
  };

  // Lost & found actions
  const handleAddLostFound = (values) => {
    const newEntry = {
      key: String(lostFound.length + 1),
      id: `LF-${900 + lostFound.length + 1}`,
      name: values.name,
      description: values.description,
      location: values.location,
      date: new Date().toISOString().split('T')[0],
      status: 'Unclaimed',
      claimedBy: '',
      claimDate: ''
    };
    setLostFound([newEntry, ...lostFound]);
    setIsLostFoundModalVisible(false);
    lostFoundForm.resetFields();
    message.success('Lost item logged.');
  };

  const showClaimModal = (item) => {
    setSelectedLostItem(item);
    setIsClaimModalVisible(true);
  };

  const handleClaimItem = (values) => {
    setLostFound(lostFound.map(item => {
      if (item.id === selectedLostItem.id) {
        return {
          ...item,
          status: 'Claimed',
          claimedBy: values.studentId.toUpperCase(),
          claimDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
    setIsClaimModalVisible(false);
    claimForm.resetFields();
    setSelectedLostItem(null);
    message.success('Item marked as claimed.');
  };

  // ==========================================
  // RENDER: STUDENT MOBILE SIMULATOR VIEW (375x812)
  // ==========================================
  const renderStudentMobileApp = () => {
    const getMobileTimerString = () => {
      const mins = Math.floor(mobileTimer / 60);
      const secs = mobileTimer % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="fade-in-view" style={{ padding: '10px 0' }}>
        <Row gutter={[24, 24]} align="middle" justify="center">
          
          {/* View explanation panel */}
          <Col xs={24} lg={8}>
            <Card className="premium-card" style={{ borderLeft: '5px solid #1677ff' }}>
              <Title level={4}>📱 Student Mobile Simulator</Title>
              <Paragraph style={{ fontSize: '13px', lineHeight: '1.6' }}>
                This is a high-fidelity preview of the **LibraryGo mobile student app** styled using **Ant Design Mobile** layout parameters.
              </Paragraph>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Interactive controls:</Text>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button size="small" icon={<PlusOutlined />} onClick={handleAddMobileStrike} block>
                  Simulate Strike (+1 Strike)
                </Button>
                <Button size="small" icon={<ReloadOutlined />} onClick={handleResetMobileStrikes} block>
                  Reset Strikes to 0
                </Button>
              </Space>
              <Divider style={{ margin: '12px 0' }} />
              <Paragraph style={{ fontSize: '12px', color: '#64748b' }}>
                💡 **Live Sync**: Checking in or vacating seats in this mobile simulator instantly updates the web seat database (Seat **L2-S04**).
              </Paragraph>
            </Card>
          </Col>

          {/* Interactive Smartphone Viewport Frame */}
          <Col xs={24} lg={16} className="smartphone-frame-container">
            <div className="smartphone-shell">
              {/* StatusBar Mock */}
              <div className="smartphone-statusbar">
                <span>00:46</span>
                <Space size="small" style={{ fontSize: '13px' }}>
                  <WifiOutlined />
                  <span>5G</span>
                </Space>
              </div>

              {/* Mobile Viewport Screen */}
              <div className="smartphone-screen">
                
                {/* Scrollable Core Mobile Dashboard */}
                <div className="smartphone-body">
                  
                  {/* Home Screen View */}
                  {mobileActiveTab === 'home' && (
                    <div className="fade-in-view">
                      {/* Greeting Banner */}
                      <div className="mobile-app-banner">
                        <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>UNIVERSITI TEKNOLOGI MALAYSIA</span>
                        <Title level={4} style={{ color: '#ffffff', margin: '4px 0 0 0', fontWeight: 700 }}>
                          Ahmad Faiz bin Azmi
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>
                          A22CS0148@utm.my
                        </Text>
                      </div>

                      {/* Warning alert if strikes reach 5 */}
                      {mobileStrikes === 5 && (
                        <div style={{
                          backgroundColor: '#fff1f0',
                          border: '1px solid #ffa39e',
                          borderRadius: '12px',
                          padding: '12px',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <WarningOutlined style={{ color: '#ff4d4f', fontSize: '18px', marginTop: 2 }} />
                          <div>
                            <Text strong style={{ color: '#ff4d4f', fontSize: '13px', display: 'block' }}>
                              CRITICAL STATUS: ACCOUNT SUSPENDED
                            </Text>
                            <Text style={{ color: '#ff4d4f', fontSize: '11px', lineHeight: 1.4 }}>
                              You have accumulated 5 strikes. Gate access has been disabled. Please see the help desk.
                            </Text>
                          </div>
                        </div>
                      )}

                      {/* Strike Count Card */}
                      <div className="mobile-app-card">
                        <div className="mobile-app-card-title">
                          <WarningOutlined style={{ color: '#fa8c16' }} />
                          <span>Disciplinary Strike Counter</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Text style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Warning Scale Status:</Text>
                          <Text strong style={{ color: mobileStrikes >= 4 ? '#ff4d4f' : '#fa8c16', fontSize: '14px' }}>
                            {mobileStrikes} / 5 strikes
                          </Text>
                        </div>

                        {/* Graphic Strike-O-Meter block scale */}
                        <div className="mobile-strike-scale">
                          <div className={`mobile-strike-step ${mobileStrikes >= 1 ? 'mobile-strike-step-active' : ''}`} />
                          <div className={`mobile-strike-step ${mobileStrikes >= 2 ? 'mobile-strike-step-active' : ''}`} />
                          <div className={`mobile-strike-step ${mobileStrikes >= 3 ? 'mobile-strike-step-active' : ''}`} />
                          <div className={`mobile-strike-step ${mobileStrikes >= 4 ? 'mobile-strike-step-active' : ''}`} />
                          <div className={`mobile-strike-step ${mobileStrikes >= 5 ? 'mobile-strike-step-active' : ''}`} />
                        </div>
                        
                        <Text style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: 12 }}>
                          🚨 Reaching 5 strikes suspends all seat booking check-ins immediately.
                        </Text>
                      </div>

                      {/* NFC Quick Action Simulator */}
                      <div className="mobile-app-card" style={{ padding: 20, textAlign: 'center' }}>
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: '#e6f4ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px auto'
                        }}>
                          <ScanOutlined style={{ fontSize: '28px', color: '#1677ff' }} />
                        </div>
                        <Text strong style={{ display: 'block', fontSize: '15px', color: '#1e293b', marginBottom: 4 }}>
                          Simulated Physical NFC Check-In
                        </Text>
                        <Text style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: 16 }}>
                          Simulate scanning the embedded RFID desk tag to claim your seat reservation.
                        </Text>
                        
                        {mobileScanning ? (
                          <div style={{ padding: '8px 0' }}>
                            <ActivityIndicator size="small" color="#1677ff" />
                            <Text style={{ fontSize: '12px', color: '#1677ff', display: 'block', marginTop: 4 }}>
                              Searching NFC reader... Hold close
                            </Text>
                          </div>
                        ) : (
                          <Button
                            type="primary"
                            block
                            onClick={handleMobileNfcCheckin}
                            disabled={mobileBookingState === 'CheckedIn' || mobileStrikes >= 5}
                            style={{ borderRadius: 8, height: 38, fontSize: '13px' }}
                          >
                            {mobileBookingState === 'CheckedIn' ? '✓ Verified Checked In' : '📱 Sim NFC Check-In Scan'}
                          </Button>
                        )}
                      </div>

                      {/* Announcements list */}
                      <div className="mobile-app-card" style={{ padding: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: '13px' }}>📢 UTM Library Announcements</span>
                          <Button size="small" type="text" onClick={() => setShowAnnouncements(true)} style={{ fontSize: '11px', padding: 0 }}>
                            View All
                          </Button>
                        </div>
                        <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, fontSize: '12px' }}>
                          <Text strong style={{ display: 'block', color: '#1e293b' }}>
                            Exam Study Period Extension
                          </Text>
                          <Text style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: 2 }}>
                            Level 2 is open 24/7 until June 15th. Refreshments allowed.
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Booking & Timer Screen */}
                  {mobileActiveTab === 'booking' && (
                    <div className="fade-in-view">
                      <div className="mobile-app-card">
                        <div className="mobile-app-card-title">
                          <BookOutlined style={{ color: '#1677ff' }} />
                          <span>Session Workflow Journey</span>
                        </div>

                        {/* Steps workflow progress */}
                        <div style={{ padding: '8px 0 16px 0' }}>
                          <MobileSteps
                            current={mobileBookingState === 'CheckedIn' ? 1 : 0}
                            style={{
                              '--title-font-size': '12.5px',
                              '--description-font-size': '11px'
                            }}
                          >
                            <MobileSteps.Step title="Seat Reserved" description="Assigned L2-S04" />
                            <MobileSteps.Step title="Checked In" description="NFC Verified" />
                            <MobileSteps.Step title="Vacated" description="Seat Vacated" />
                          </MobileSteps>
                        </div>
                      </div>

                      {/* Countdown Timer Block */}
                      <div className="mobile-app-card" style={{ textAlign: 'center' }}>
                        <Text strong style={{ fontSize: '14px', color: '#475569', display: 'block' }}>
                          Session Check-Out Countdown
                        </Text>
                        <Text style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: 2 }}>
                          {mobileBookingState === 'CheckedIn'
                            ? 'Ongoing check-out timer. Release early when leaving.'
                            : 'NFC verification pending. Tap NFC to initialize.'}
                        </Text>

                        {/* Visual Timer Circle */}
                        <div className="mobile-timer-circle" style={{ borderTopColor: mobileBookingState === 'CheckedIn' ? '#ff4d4f' : '#cbd5e1' }}>
                          <span className="mobile-timer-number">
                            {mobileBookingState === 'CheckedIn' ? getMobileTimerString() : '05:00'}
                          </span>
                          <span style={{ fontSize: '9px', color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {mobileBookingState === 'CheckedIn' ? 'Time Remaining' : 'Pending NFC'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, background: '#f8fafc', padding: 8, borderRadius: 8, marginBottom: 16, fontSize: '12px' }}>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Desk Seat</span>
                            <Text strong>L2-S04</Text>
                          </div>
                          <Divider type="vertical" style={{ height: 'auto' }} />
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Level Area</span>
                            <Text strong>Level 2</Text>
                          </div>
                        </div>

                        {/* Early Vacate Trigger */}
                        <Button
                          danger
                          block
                          onClick={handleMobileCheckOut}
                          disabled={mobileBookingState !== 'CheckedIn'}
                          style={{
                            borderRadius: 8,
                            height: 38,
                            fontSize: '13px',
                            fontWeight: 600
                          }}
                        >
                          Manual Early Check-Out
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Booking History Screen */}
                  {mobileActiveTab === 'history' && (
                    <div className="fade-in-view">
                      <Title level={5} style={{ fontSize: '14px', marginBottom: 12, fontWeight: 700 }}>
                        Past Booking Operations
                      </Title>
                      
                      {/* Past List details using AntD Mobile styled Card list */}
                      <div className="mobile-app-card" style={{ padding: 12, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <Text strong style={{ fontSize: '13.5px', color: '#1e293b' }}>Seat L2-S04</Text>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: 2 }}>
                              Level 2 Quiet Zone • 10:00 - 12:00
                            </span>
                          </div>
                          <Tag color="success" style={{ fontSize: '10px', borderRadius: 4 }}>CompletedTag</Tag>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 10, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                          <span>Date: May 25, 2026</span>
                          <span>NFC Verified</span>
                        </div>
                      </div>

                      <div className="mobile-app-card" style={{ padding: 12, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <Text strong style={{ fontSize: '13.5px', color: '#1e293b' }}>Seat L1-S03</Text>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: 2 }}>
                              Level 1 Collaborative • 14:00 - 15:00
                            </span>
                          </div>
                          <Tag color="danger" style={{ fontSize: '10px', borderRadius: 4 }}>ExpiredTag</Tag>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 10, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                          <span>Date: May 24, 2026</span>
                          <span style={{ color: '#ff4d4f' }}>+1 Strike Issued</span>
                        </div>
                      </div>

                      <div className="mobile-app-card" style={{ padding: 12, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <Text strong style={{ fontSize: '13.5px', color: '#1e293b' }}>Seat GF-S02</Text>
                            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: 2 }}>
                              Ground Floor VR Hub • 09:00 - 11:00
                            </span>
                          </div>
                          <Tag color="default" style={{ fontSize: '10px', borderRadius: 4 }}>CancelledTag</Tag>
                        </div>
                        <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 10, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                          <span>Date: May 22, 2026</span>
                          <span>Released Early</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom navigation mock wrapper */}
                <div className="smartphone-tabbar">
                  <div
                    className={`smartphone-tab-item ${mobileActiveTab === 'home' ? 'smartphone-tab-item-active' : ''}`}
                    onClick={() => setMobileActiveTab('home')}
                  >
                    <HomeOutlined style={{ fontSize: '20px' }} />
                    <span className="smartphone-tab-label">Home</span>
                  </div>
                  
                  <div
                    className={`smartphone-tab-item ${mobileActiveTab === 'booking' ? 'smartphone-tab-item-active' : ''}`}
                    onClick={() => setMobileActiveTab('booking')}
                  >
                    <BookOutlined style={{ fontSize: '20px' }} />
                    <span className="smartphone-tab-label">Session</span>
                  </div>

                  <div
                    className={`smartphone-tab-item ${mobileActiveTab === 'history' ? 'smartphone-tab-item-active' : ''}`}
                    onClick={() => setMobileActiveTab('history')}
                  >
                    <HistoryOutlined style={{ fontSize: '20px' }} />
                    <span className="smartphone-tab-label">History</span>
                  </div>
                </div>

                {/* iPhone visual home bottom bar mock */}
                <div className="smartphone-home-indicator" />
              </div>
            </div>
          </Col>
        </Row>

        {/* Modal announcement inside phone preview */}
        <Modal
          title="📢 UTM Library Announcements"
          visible={showAnnouncements}
          onCancel={() => setShowAnnouncements(false)}
          footer={<Button onClick={() => setShowAnnouncements(false)} type="primary" block>Close</Button>}
        >
          <List
            size="small"
            dataSource={[
              { title: 'Exam Season Extension', text: 'Level 2 is open 24/7 with active security.' },
              { title: 'Air Conditioning Maintenance', text: 'Postgraduate lounge AC service scheduled May 28th.' },
              { title: 'New VR Zone Rules', text: 'VR booths can now be booked for up to 3 consecutive hours.' }
            ]}
            renderItem={item => (
              <List.Item>
                <Text strong>{item.title}</Text>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{item.text}</p>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    );
  };

  // --- RENDERING ADMIN SUB-VIEWS ---

  // 1. Dashboard Overview View
  const renderDashboardOverview = () => {
    return (
      <div className="fade-in-view">
        {/* Welcome Message Card */}
        <Card className="premium-card" style={{ marginBottom: 24, borderLeft: '5px solid #1677ff' }}>
          <Row justify="space-between" align="middle">
            <Col xs={24} md={18}>
              <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                🏫 UTM LibraryGo Seat & Facilities Management
              </Title>
              <Text type="secondary">
                Logged in as Administrator. Monitor real-time seat assignments, student disciplinary strike counts, and library facilities complaints.
              </Text>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: screens.md ? 'right' : 'left', marginTop: screens.md ? 0 : 12 }}>
              <Tag color="blue" style={{ fontSize: '13px', padding: '4px 10px' }}>
                <span className="anticon"><CalendarOutlined /></span> Server Time: 23:03
              </Tag>
            </Col>
          </Row>
        </Card>

        {/* Statistics Widgets */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="premium-card" styles={{ body: { padding: 20 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="stats-label">SEAT OCCUPANCY</div>
                  <div className="stats-number">{bookedSeats} / {totalSeats}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {Math.round((bookedSeats / totalSeats) * 100)}% Booked via NFC
                  </Text>
                </div>
                <Avatar size={48} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} icon={<CoffeeOutlined />} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="premium-card" styles={{ body: { padding: 20 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="stats-label">ACTIVE BLACKLISTS</div>
                  <div className="stats-number">{blacklistedCount}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Total active strikes: {activeStrikes}
                  </Text>
                </div>
                <Avatar size={48} style={{ backgroundColor: '#fff1f0', color: '#ff4d4f' }} icon={<StopOutlined />} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="premium-card" styles={{ body: { padding: 20 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="stats-label">UNRESOLVED COMPLAINTS</div>
                  <div className="stats-number">{unresolvedComplaints}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {complaints.filter(c => c.status === 'Pending').length} Pending review
                  </Text>
                </div>
                <Avatar size={48} style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }} icon={<AlertOutlined />} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="premium-card" styles={{ body: { padding: 20 } }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="stats-label">LOST & FOUND</div>
                  <div className="stats-number">{lostFound.filter(lf => lf.status === 'Unclaimed').length}</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Unclaimed assets stored safely
                  </Text>
                </div>
                <Avatar size={48} style={{ backgroundColor: '#f9f0ff', color: '#722ed1' }} icon={<InboxOutlined />} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title={<Space><AreaChartOutlined style={{ color: '#1677ff' }} /><span>Seat Booking Trends (Hourly)</span></Space>} className="premium-card" style={{ height: '100%' }}>
              <div style={{ padding: '10px 0', height: 260, position: 'relative' }}>
                <svg viewBox="0 0 500 200" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1677ff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#1677ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                  <path d="M 0 160 Q 75 80, 150 95 T 300 45 T 450 60 L 500 70 L 500 180 L 0 180 Z" fill="url(#chartGrad)" />
                  <path d="M 0 160 Q 75 80, 150 95 T 300 45 T 450 60 L 500 70" fill="none" stroke="#1677ff" strokeWidth="3" />
                  <circle cx="75" cy="120" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="150" cy="95" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="225" cy="65" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="300" cy="45" r="6" fill="#52c41a" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="375" cy="55" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="450" cy="60" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px 0', fontSize: '11px', color: '#64748b' }}>
                  <span>08:00 AM</span>
                  <span>10:00 AM</span>
                  <span>12:00 PM</span>
                  <span>02:00 PM (Peak)</span>
                  <span>04:00 PM</span>
                  <span>06:00 PM</span>
                  <span>08:00 PM</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <Text type="secondary">🟢 Live Data Feed Connected</Text>
                <Text type="secondary">Occupancy Rate: <b>{Math.round((bookedSeats/totalSeats)*100)}%</b> (Peak: 78%)</Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title={<Space><FieldTimeOutlined style={{ color: '#1677ff' }} /><span>Recent Activity Logs</span></Space>} className="premium-card" style={{ height: '100%' }}>
              <List
                itemLayout="horizontal"
                dataSource={systemLogs}
                renderItem={(item) => (
                  <List.Item style={{ padding: '10px 0' }}>
                    <List.Item.Meta
                      avatar={<Badge status="processing" color="#1677ff" />}
                      title={<Text style={{ fontSize: '13px', fontWeight: 500 }}>{item.message}</Text>}
                      description={<Text type="secondary" style={{ fontSize: '11px' }}>{item.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 2. Seat & Area Management View
  const renderSeatAreaManagement = () => {
    const filteredSeats = seatAreaFilter === 'All'
      ? seats
      : seats.filter(s => s.area === seatAreaFilter);

    const areasList = ['All', 'Level 1: Collaborative Zone', 'Level 2: Quiet Study Area', 'Level 3: Postgraduate Hub'];

    return (
      <div className="fade-in-view">
        <Card className="premium-card" style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col>
              <Title level={4} style={{ margin: 0 }}>📍 Library Seats & NFC UIDs</Title>
              <Text type="secondary">Real-time status check for physical NFC Tag readers mapped to each desk seat.</Text>
            </Col>
            <Col>
              <Space wrap>
                <Text strong>Filter Area:</Text>
                <Select
                  value={seatAreaFilter}
                  onChange={(val) => setSeatAreaFilter(val)}
                  style={{ width: 260 }}
                  options={areasList.map(area => ({ label: area, value: area }))}
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {areasList.filter(a => a !== 'All' && (seatAreaFilter === 'All' || seatAreaFilter === a)).map(areaName => {
          const areaSeats = seats.filter(s => s.area === areaName);
          const occupiedCount = areaSeats.filter(s => s.status === 'Booked').length;
          
          return (
            <Card
              key={areaName}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <Space>
                    <EnvironmentOutlined style={{ color: '#1677ff' }} />
                    <span style={{ fontWeight: 600 }}>{areaName}</span>
                  </Space>
                  <Space>
                    <Tag color="blue">{areaSeats.length} Seats Total</Tag>
                    <Tag color="orange">{occupiedCount} Occupied</Tag>
                    <Tag color="green">{areaSeats.length - occupiedCount} Available</Tag>
                  </Space>
                </div>
              }
              className="premium-card"
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[16, 16]}>
                {areaSeats.map(seat => (
                  <Col xs={24} sm={12} md={8} lg={6} key={seat.id}>
                    <Card
                      size="small"
                      variant="outlined"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: seat.status === 'Booked' ? '#fffdf9' : '#fafcfc',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                      }}
                      styles={{ body: { padding: 12 } }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <Text strong style={{ fontSize: '15px' }}>{seat.id}</Text>
                        <Badge
                          status={seat.status === 'Available' ? 'success' : 'warning'}
                          text={
                            <span style={{ color: seat.status === 'Available' ? '#52c41a' : '#fa8c16', fontWeight: 600, fontSize: '12px' }}>
                              {seat.status}
                            </span>
                          }
                        />
                      </div>
                      
                      <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', marginBottom: 12, border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>NFC Tag UID:</div>
                        <Text code style={{ fontSize: '11.5px', fontFamily: 'monospace' }}>{seat.nfcUid}</Text>
                      </div>

                      {seat.occupant && (
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Occupant:</span>
                          <Text style={{ fontSize: '12.5px', fontWeight: 500 }} ellipsis={{ tooltip: seat.occupant }}>{seat.occupant}</Text>
                        </div>
                      )}

                      <Button
                        type={seat.status === 'Available' ? 'default' : 'dashed'}
                        size="small"
                        block
                        icon={seat.status === 'Available' ? <PlusOutlined /> : <ReloadOutlined />}
                        onClick={() => handleToggleSeatStatus(seat.id)}
                        style={{
                          fontSize: '12px',
                          borderColor: seat.status === 'Available' ? '#d9d9d9' : '#fa8c16',
                          color: seat.status === 'Available' ? 'inherit' : '#fa8c16'
                        }}
                      >
                        {seat.status === 'Available' ? 'Assign Walk-in' : 'Release Seat'}
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          );
        })}
      </div>
    );
  };

  // 3. Student Blacklist View
  const renderStudentBlacklist = () => {
    const blacklistColumns = [
      {
        title: 'Student ID',
        dataIndex: 'studentId',
        key: 'studentId',
        render: (text) => <Text strong style={{ color: '#0f172a' }}>{text}</Text>
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <Text style={{ fontWeight: 500 }}>{text}</Text>
      },
      {
        title: 'Strike Count',
        dataIndex: 'strikes',
        key: 'strikes',
        render: (strikes) => (
          <Space>
            <Badge count={strikes} style={{ backgroundColor: strikes >= 3 ? '#ff4d4f' : strikes === 2 ? '#fa8c16' : '#52c41a' }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>/ 3 Strikes</span>
          </Space>
        )
      },
      {
        title: 'Disciplinary Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const isBanned = status === 'Blacklisted';
          return (
            <Tag color={isBanned ? 'red' : 'green'} style={{ fontWeight: 600 }}>
              {isBanned ? '⛔ Blacklisted' : '✅ Active'}
            </Tag>
          );
        }
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button type="link" size="small" icon={<ReloadOutlined />} onClick={() => handleResetStrikes(record.key)} disabled={record.strikes === 0}>
              Reset Strikes
            </Button>
            <Divider type="vertical" />
            <Button type="link" size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleRemoveBlacklist(record.key)}>
              Remove
            </Button>
          </Space>
        )
      }
    ];

    const filteredBlacklist = blacklist.filter(student =>
      student.name.toLowerCase().includes(blacklistSearch.toLowerCase()) ||
      student.studentId.toLowerCase().includes(blacklistSearch.toLowerCase())
    );

    return (
      <div className="fade-in-view">
        <Card className="premium-card" style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ margin: 0 }}>🚨 Disciplinary List & Blacklist</Title>
              <Text type="secondary">Students with three strikes are automatically blacklisted.</Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: screens.md ? 'right' : 'left' }}>
              <Space wrap style={{ width: '100%', justifyContent: screens.md ? 'flex-end' : 'flex-start' }}>
                <Input
                  placeholder="Search Student..."
                  prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
                  value={blacklistSearch}
                  onChange={(e) => setBlacklistSearch(e.target.value)}
                  style={{ width: 220 }}
                  allowClear
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsBlacklistModalVisible(true)}>
                  Record Strike / Ban
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="premium-card" styles={{ body: { padding: 0 } }}>
          <Table columns={blacklistColumns} dataSource={filteredBlacklist} pagination={{ pageSize: 8 }} scroll={{ x: true }} />
        </Card>

        <Modal
          title="🚨 Record Disciplinary Strike"
          open={isBlacklistModalVisible}
          onCancel={() => {
            setIsBlacklistModalVisible(false);
            blacklistForm.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form form={blacklistForm} layout="vertical" onFinish={handleAddBlacklist} initialValues={{ strikes: 1 }}>
            <Form.Item name="studentId" label="UTM Student ID" rules={[{ required: true }]}>
              <Input placeholder="e.g. A22CS0148" />
            </Form.Item>
            <Form.Item name="name" label="Student Name" rules={[{ required: true }]}>
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item name="strikes" label="Strikes to Assign" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 1, label: '1 Strike' },
                  { value: 2, label: '2 Strikes' },
                  { value: 3, label: '3 Strikes (Blacklist)' }
                ]}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsBlacklistModalVisible(false)}>Cancel</Button>
                <Button type="primary" danger htmlType="submit">Apply Strike</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  // 4. Complaints View
  const renderComplaints = () => {
    const complaintsColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <Text strong style={{ fontFamily: 'monospace', color: '#1677ff' }}>{text}</Text>
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (cat) => <Tag color="blue">{cat}</Tag>
      },
      {
        title: 'Seat ID / Area',
        key: 'seatArea',
        render: (_, record) => (
          <div>
            <Text strong>{record.seatId}</Text>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{record.area}</div>
          </div>
        )
      },
      {
        title: 'Date Reported',
        dataIndex: 'date',
        key: 'date',
        render: (date) => <Text type="secondary">{date}</Text>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => (
          <Select
            value={status}
            onChange={(value) => handleUpdateComplaintStatus(record.key, value)}
            style={{ width: 140 }}
            variant="borderless"
            options={[
              { value: 'Pending', label: <Tag color="error">Pending</Tag> },
              { value: 'Under Review', label: <Tag color="warning">Under Review</Tag> },
              { value: 'Resolved', label: <Tag color="success">Resolved</Tag> }
            ]}
          />
        )
      }
    ];

    return (
      <div className="fade-in-view">
        <Card className="premium-card" style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>🛠️ Facility & Seat Complaints</Title>
          <Text type="secondary">Expand a row to read details of the issue and update comments.</Text>
        </Card>

        <Card className="premium-card" styles={{ body: { padding: 0 } }}>
          <Table
            columns={complaintsColumns}
            dataSource={complaints}
            pagination={{ pageSize: 6 }}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: '16px 24px', backgroundColor: '#fafbfc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <Text strong style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: 4 }}>
                        📋 Facility Issue Details:
                      </Text>
                      <Paragraph style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                        {record.facilityDetails}
                      </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                      <Text strong style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: 4 }}>
                        ✍️ Admin Comments:
                      </Text>
                      <Input.TextArea
                        rows={4}
                        placeholder="Admin tracking notes..."
                        value={record.adminComments}
                        onChange={(e) => handleUpdateAdminComments(record.key, e.target.value)}
                      />
                    </Col>
                  </Row>
                </div>
              ),
              rowExpandable: () => true,
            }}
          />
        </Card>
      </div>
    );
  };

  // 5. Lost & Found View
  const renderLostFound = () => {
    const filteredLost = lostFoundFilter === 'All'
      ? lostFound
      : lostFound.filter(item => item.status === lostFoundFilter);

    return (
      <div className="fade-in-view">
        <Card className="premium-card" style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ margin: 0 }}>📦 Lost & Found Custody</Title>
              <Text type="secondary">Manage mislaid student assets.</Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: screens.md ? 'right' : 'left' }}>
              <Space wrap style={{ width: '100%', justifyContent: screens.md ? 'flex-end' : 'flex-start' }}>
                <Select
                  value={lostFoundFilter}
                  onChange={(val) => setLostFoundFilter(val)}
                  style={{ width: 140 }}
                  options={[
                    { value: 'All', label: 'All Items' },
                    { value: 'Unclaimed', label: 'Unclaimed' },
                    { value: 'Claimed', label: 'Claimed' }
                  ]}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsLostFoundModalVisible(true)}>
                  Record Found Item
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[20, 20]}>
          {filteredLost.map(item => {
            const isClaimed = item.status === 'Claimed';
            return (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card className="premium-card" styles={{ body: { padding: 20 } }} style={{ height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <Tag color={isClaimed ? 'green' : 'purple'} style={{ marginBottom: 6 }}>{item.status}</Tag>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Registry ID: {item.id}</div>
                    </div>
                  </div>
                  <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.name}</Title>
                  <Paragraph style={{ fontSize: '13px', color: '#475569', marginBottom: 12 }}>{item.description}</Paragraph>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 16 }}>
                    <div>Found in: <b>{item.location}</b></div>
                    <div>Date: <b>{item.date}</b></div>
                  </div>
                  {isClaimed ? (
                    <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7', fontSize: '12px' }}>
                      <div style={{ color: '#166534', fontWeight: 600 }}>Claimed by: {item.claimedBy}</div>
                      <div style={{ color: '#15803d', fontSize: '11px' }}>Claim Date: {item.claimDate}</div>
                    </div>
                  ) : (
                    <Button type="primary" ghost block icon={<CheckCircleOutlined />} onClick={() => showClaimModal(item)}>
                      Handover Item
                    </Button>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>

        <Modal
          title="📦 Record Found Item"
          open={isLostFoundModalVisible}
          onCancel={() => {
            setIsLostFoundModalVisible(false);
            lostFoundForm.resetFields();
          }}
          footer={null}
        >
          <Form form={lostFoundForm} layout="vertical" onFinish={handleAddLostFound}>
            <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Sony WH-1000XM4 Headphones" />
            </Form.Item>
            <Form.Item name="description" label="Visual Description" rules={[{ required: true }]}>
              <Input.TextArea placeholder="Visual traits..." />
            </Form.Item>
            <Form.Item name="location" label="Location Found" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'Level 1: Collaborative Zone', label: 'Level 1' },
                  { value: 'Level 2: Quiet Study Area', label: 'Level 2' },
                  { value: 'Level 3: Postgraduate Hub', label: 'Level 3' }
                ]}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsLostFoundModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Register Item</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="✅ Verifying Ownership Handover"
          open={isClaimModalVisible}
          onCancel={() => {
            setIsClaimModalVisible(false);
            claimForm.resetFields();
          }}
          footer={null}
        >
          <Form form={claimForm} layout="vertical" onFinish={handleClaimItem}>
            <Form.Item name="studentId" label="Claimant Student ID" rules={[{ required: true }]}>
              <Input placeholder="e.g. A21EC0052" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsClaimModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Verify & Handover</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const renderActiveView = () => {
    switch (selectedKey) {
      case '1':
        return renderDashboardOverview();
      case '2':
        return renderSeatAreaManagement();
      case '3':
        return renderStudentBlacklist();
      case '4':
        return renderComplaints();
      case '5':
        return renderLostFound();
      case '6':
        return renderStudentMobileApp();
      default:
        return renderDashboardOverview();
    }
  };

  const getBreadcrumbTitle = () => {
    switch (selectedKey) {
      case '1': return 'Dashboard Overview';
      case '2': return 'Seat & Area Management';
      case '3': return 'Student Blacklist';
      case '4': return 'Complaints';
      case '5': return 'Lost & Found';
      case '6': return 'Student Mobile App Preview';
      default: return 'Dashboard';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        theme="light"
        width={250}
        style={{
          borderRight: '1px solid #e2e8f0',
          position: screens.xs ? 'absolute' : 'relative',
          height: '100%',
          zIndex: 1000
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '0 24px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '20px', marginRight: collapsed ? 0 : 8 }}>⚡</span>
          {!collapsed && (
            <Title level={4} style={{ margin: 0, color: '#1677ff', fontWeight: 700, letterSpacing: '-0.5px' }}>
              LibraryGo
            </Title>
          )}
        </div>
        
        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          onClick={handleMenuClick}
          style={{ borderRight: 0, paddingTop: 16 }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            Dashboard Overview
          </Menu.Item>
          <Menu.Item key="2" icon={<AreaChartOutlined />}>
            Seat & Area Management
          </Menu.Item>
          <Menu.Item key="3" icon={<StopOutlined />}>
            Student Blacklist
          </Menu.Item>
          <Menu.Item key="4" icon={<AlertOutlined />}>
            Complaints
          </Menu.Item>
          <Menu.Item key="5" icon={<InboxOutlined />}>
            Lost & Found
          </Menu.Item>
          <Menu.Item key="6" icon={<MobileOutlined style={{ color: '#1677ff' }} />}>
            Student Mobile App
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{
          background: '#ffffff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <Text type="secondary" style={{ fontSize: '13px' }}>UTM Campus System</Text>
            <div style={{ fontWeight: 600, fontSize: '16px', lineHeight: 1.2 }}>{getBreadcrumbTitle()}</div>
          </div>
          
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
              {screens.sm && (
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>Librarian Admin</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Staff Domain: @utm.my</div>
                </div>
              )}
            </div>

            <Tooltip title="Log Out">
              <Button type="text" shape="circle" size="large" icon={<PoweroffOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />} onClick={() => message.info('Logging out...')} />
            </Tooltip>
          </Space>
        </Header>

        <Content style={{ padding: '24px', overflowY: 'auto' }}>
          {renderActiveView()}
        </Content>
      </Layout>
    </Layout>
  );
}

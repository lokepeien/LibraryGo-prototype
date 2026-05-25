import React, { useState } from 'react';
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
  EyeOutlined,
  FieldTimeOutlined,
  CoffeeOutlined,
  TagOutlined
} from '@ant-design/icons';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// --- INITIAL MOCK DATA ---

const initialStats = {
  totalSeats: 160,
  occupiedSeats: 72,
  blacklistCount: 8,
  pendingComplaints: 4,
  unclaimedItems: 12
};

const initialBlacklist = [
  { key: '1', studentId: 'A22CS0148', name: 'Ahmad Faiz bin Azmi', strikes: 3, status: 'Blacklisted' },
  { key: '2', studentId: 'A21EC0052', name: 'Tan Mei Ling', strikes: 2, status: 'Active' },
  { key: '3', studentId: 'A22CS0089', name: 'Saraswathy a/p Mohan', strikes: 3, status: 'Blacklisted' },
  { key: '4', studentId: 'A20EC0110', name: 'Brandon Lim Wei Shen', strikes: 1, status: 'Active' },
  { key: '5', studentId: 'B22CS0302', name: 'Nurul Izzah binti Rosli', strikes: 3, status: 'Blacklisted' },
  { key: '6', studentId: 'A21CS0221', name: 'Muhammad Aliff bin Zulkifli', strikes: 0, status: 'Active' },
  { key: '7', studentId: 'A22EC0024', name: 'Chong Jia Yi', strikes: 3, status: 'Blacklisted' },
  { key: '8', studentId: 'A20CS0005', name: 'Haris Haroon', strikes: 2, status: 'Active' }
];

const initialSeats = [
  // Level 1: Collaborative Zone
  { id: 'L1-S01', area: 'Level 1: Collaborative Zone', nfcUid: '04:A2:3E:9B:10:E2:80', status: 'Booked', occupant: 'Ahmad Faiz (A22CS0148)' },
  { id: 'L1-S02', area: 'Level 1: Collaborative Zone', nfcUid: '04:5C:8B:1A:F5:2C:81', status: 'Available', occupant: null },
  { id: 'L1-S03', area: 'Level 1: Collaborative Zone', nfcUid: '04:FF:E2:33:6B:40:80', status: 'Booked', occupant: 'Siti Aminah (A22CS0032)' },
  { id: 'L1-S04', area: 'Level 1: Collaborative Zone', nfcUid: '04:2E:7A:B2:CC:5F:80', status: 'Available', occupant: null },
  { id: 'L1-S05', area: 'Level 1: Collaborative Zone', nfcUid: '04:D4:6C:5F:81:4A:80', status: 'Booked', occupant: 'Jason Lee (A21CS0912)' },
  { id: 'L1-S06', area: 'Level 1: Collaborative Zone', nfcUid: '04:3B:5A:F3:CC:89:81', status: 'Available', occupant: null },
  
  // Level 2: Quiet Study Area
  { id: 'L2-S01', area: 'Level 2: Quiet Study Area', nfcUid: '04:E3:4C:6A:B2:1A:80', status: 'Booked', occupant: 'Tan Mei Ling (A21EC0052)' },
  { id: 'L2-S02', area: 'Level 2: Quiet Study Area', nfcUid: '04:77:88:99:AA:BB:CC', status: 'Available', occupant: null },
  { id: 'L2-S03', area: 'Level 2: Quiet Study Area', nfcUid: '04:11:22:33:44:55:66', status: 'Available', occupant: null },
  { id: 'L2-S04', area: 'Level 2: Quiet Study Area', nfcUid: '04:AA:BB:CC:DD:EE:FF', status: 'Booked', occupant: 'Saraswathy Mohan (A22CS0089)' },
  { id: 'L2-S05', area: 'Level 2: Quiet Study Area', nfcUid: '04:12:34:56:78:90:AB', status: 'Available', occupant: null },
  { id: 'L2-S06', area: 'Level 2: Quiet Study Area', nfcUid: '04:FE:DC:BA:98:76:54', status: 'Available', occupant: null },

  // Level 3: Postgraduate Hub
  { id: 'L3-S01', area: 'Level 3: Postgraduate Hub', nfcUid: '04:55:66:77:88:99:00', status: 'Booked', occupant: 'Dr. Sarah (Staff)' },
  { id: 'L3-S02', area: 'Level 3: Postgraduate Hub', nfcUid: '04:AB:CD:EF:01:23:45', status: 'Available', occupant: null },
  { id: 'L3-S03', area: 'Level 3: Postgraduate Hub', nfcUid: '04:88:99:00:11:22:33', status: 'Booked', occupant: 'Ngooi Jun (A20EC0990)' },
  { id: 'L3-S04', area: 'Level 3: Postgraduate Hub', nfcUid: '04:44:55:66:77:88:99', status: 'Available', occupant: null },

  // Ground Floor: Multimedia Room
  { id: 'GF-S01', area: 'Ground Floor: Multimedia Room', nfcUid: '04:33:44:55:66:77:88', status: 'Booked', occupant: 'Devi Ratna (B21CS0922)' },
  { id: 'GF-S02', area: 'Ground Floor: Multimedia Room', nfcUid: '04:22:33:44:55:66:77', status: 'Booked', occupant: 'Amiruddin (A22CS0021)' },
  { id: 'GF-S03', area: 'Ground Floor: Multimedia Room', nfcUid: '04:11:22:33:44:55:66', status: 'Available', occupant: null },
  { id: 'GF-S04', area: 'Ground Floor: Multimedia Room', nfcUid: '04:00:11:22:33:44:55', status: 'Available', occupant: null }
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
    facilityDetails: 'Model: York Industrial AC-400X. Located directly above Desk 14/Seat L2-S04. Student reported that it has been leaking condensation water and making a continuous high-pitched rattling sound, disrupting studies in the quiet zone.',
    adminComments: 'Need to contact F&M department for service. Scheduled for tomorrow morning.'
  },
  {
    key: '2',
    id: 'CMP-2026-082',
    category: 'Power Socket Broken',
    seatId: 'L1-S01',
    area: 'Level 1: Collaborative Zone',
    status: 'Under Review',
    date: '2026-05-25',
    facilityDetails: 'Model: Dual 3-Pin Wall Socket (Type G). Left-side socket is completely loose inside the wall box and sparks when adapters are inserted. High safety risk.',
    adminComments: 'Technician inspected. Sockets ordered. Taped off and marked with safety warning sign.'
  },
  {
    key: '3',
    id: 'CMP-2026-079',
    category: 'Damaged Furniture',
    seatId: 'L3-S03',
    area: 'Level 3: Postgraduate Hub',
    status: 'Resolved',
    date: '2026-05-22',
    facilityDetails: 'Model: Steelcase Ergonomic Task Chair. Hydraulic mechanism is broken; the chair stays locked in the lowest position. Student complained of back pain.',
    adminComments: 'Replaced with a spare ergonomic chair from the storage room on 2026-05-23. Damaged chair sent to maintenance for scrap/repair.'
  },
  {
    key: '4',
    id: 'CMP-2026-085',
    category: 'Wi-Fi Unstable',
    seatId: 'GF-S02',
    area: 'Ground Floor: Multimedia Room',
    status: 'Pending',
    date: '2026-05-25',
    facilityDetails: 'Router ID: AP-GF-04. Signal drops frequently (every 5-10 minutes) with high packet loss, especially when students are streaming video on the library computers.',
    adminComments: ''
  }
];

const initialLostFound = [
  {
    key: '1',
    id: 'LF-902',
    name: 'Apple iPad Air (5th Gen)',
    description: 'Space Gray color, inside a dark green magnetic folio case. Lock screen shows UTM background with a notification for Ahmad.',
    location: 'Level 2: Quiet Study Area (Desk 22)',
    date: '2026-05-23',
    status: 'Unclaimed',
    claimedBy: '',
    claimDate: ''
  },
  {
    key: '2',
    id: 'LF-903',
    name: 'Hydro Flask Water Bottle',
    description: '32oz Wide Mouth bottle, Cobalt Blue. Covered in UTM and engineering club stickers.',
    location: 'Level 1: Collaborative Zone (Table B)',
    date: '2026-05-24',
    status: 'Unclaimed',
    claimedBy: '',
    claimDate: ''
  },
  {
    key: '3',
    id: 'LF-901',
    name: 'Casio fx-570EX Calculator',
    description: 'Scientific calculator with student name "Mei Ling" carved on the back slider cover.',
    location: 'Level 2: Quiet Study Area (Desk 8)',
    date: '2026-05-22',
    status: 'Claimed',
    claimedBy: 'A21EC0052',
    claimDate: '2026-05-23'
  },
  {
    key: '4',
    id: 'LF-905',
    name: 'UTM Student ID Card',
    description: 'ID Card for Muhammad Aliff bin Zulkifli (A21CS0221). Found on the floor near the entrance scanner.',
    location: 'Ground Floor Scanner',
    date: '2026-05-25',
    status: 'Unclaimed',
    claimedBy: '',
    claimDate: ''
  }
];

const systemLogs = [
  { time: '10 mins ago', message: 'Seat L1-S01 status updated to Booked by Ahmad Faiz via NFC Tag scan.' },
  { time: '25 mins ago', message: 'Staff resolved facility complaint CMP-2026-079 (Damaged Chair in Level 3).' },
  { time: '1 hour ago', message: 'Student Brandon Lim (A20EC0110) strike count updated to 1 for seat no-show.' },
  { time: '3 hours ago', message: 'New lost & found item LF-905 (Student ID Card) reported at Ground Floor.' },
  { time: '5 hours ago', message: 'System auto-released 4 seats due to 15-minute booking grace-period timeout.' }
];

export default function App() {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // Menu index: 1 = Dashboard, 2 = Seats, 3 = Blacklist, 4 = Complaints, 5 = Lost & Found
  
  // Core States
  const [blacklist, setBlacklist] = useState(initialBlacklist);
  const [seats, setSeats] = useState(initialSeats);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [lostFound, setLostFound] = useState(initialLostFound);
  
  // Search and Filter States
  const [blacklistSearch, setBlacklistSearch] = useState('');
  const [seatAreaFilter, setSeatAreaFilter] = useState('All');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('All');
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

  // Dynamic notifications counter
  const pendingNotifications = complaints.filter(c => c.status === 'Pending').length + lostFound.filter(lf => lf.status === 'Unclaimed').length;

  // Calculate statistics dynamically
  const totalSeats = seats.length;
  const bookedSeats = seats.filter(s => s.status === 'Booked').length;
  const availableSeats = totalSeats - bookedSeats;
  const blacklistedCount = blacklist.filter(b => b.status === 'Blacklisted').length;
  const activeStrikes = blacklist.reduce((acc, curr) => acc + curr.strikes, 0);
  const unresolvedComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  // --- ACTIONS ---

  // Blacklist actions
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
    message.success(`Student ${values.name} (${values.studentId.toUpperCase()}) added to monitoring list.`);
  };

  const handleResetStrikes = (recordKey) => {
    setBlacklist(blacklist.map(item => {
      if (item.key === recordKey) {
        message.info(`Reset strike count for ${item.name}. Status set to Active.`);
        return { ...item, strikes: 0, status: 'Active' };
      }
      return item;
    }));
  };

  const handleRemoveBlacklist = (recordKey) => {
    const student = blacklist.find(item => item.key === recordKey);
    setBlacklist(blacklist.filter(item => item.key !== recordKey));
    message.success(`Removed student ${student.name} from monitoring completely.`);
  };

  // Seat booking actions
  const handleToggleSeatStatus = (seatId) => {
    setSeats(seats.map(seat => {
      if (seat.id === seatId) {
        const nextStatus = seat.status === 'Available' ? 'Booked' : 'Available';
        message.success(`Seat ${seatId} is now ${nextStatus}.`);
        return {
          ...seat,
          status: nextStatus,
          occupant: nextStatus === 'Booked' ? 'Walk-in Student' : null
        };
      }
      return seat;
    }));
  };

  // Complaints actions
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

  // Lost & Found actions
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
    message.success(`New lost item "${values.name}" registered successfully.`);
  };

  const showClaimModal = (item) => {
    setSelectedLostItem(item);
    setIsClaimModalVisible(true);
  };

  const handleClaimItem = (values) => {
    setLostFound(lostFound.map(item => {
      if (item.id === selectedLostItem.id) {
        message.success(`Item "${item.name}" marked as claimed by ${values.studentId.toUpperCase()}.`);
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
  };

  // --- SUB-VIEWS RENDERING ---

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
            <Card className="premium-card" bodyStyle={{ padding: 20 }}>
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
            <Card className="premium-card" bodyStyle={{ padding: 20 }}>
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
            <Card className="premium-card" bodyStyle={{ padding: 20 }}>
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
            <Card className="premium-card" bodyStyle={{ padding: 20 }}>
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
          {/* SVG Hourly Traffic Line Chart */}
          <Col xs={24} lg={16}>
            <Card title={<Space><AreaChartOutlined style={{ color: '#1677ff' }} /><span>Seat Booking Trends (Hourly)</span></Space>} className="premium-card" style={{ height: '100%' }}>
              <div style={{ padding: '10px 0', height: 260, position: 'relative' }}>
                {/* SVG Curve Chart */}
                <svg viewBox="0 0 500 200" width="100%" height="100%" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1677ff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#1677ff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="160" x2="500" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Highlight area under curve */}
                  <path d="M 0 160 Q 75 80, 150 95 T 300 45 T 450 60 L 500 70 L 500 180 L 0 180 Z" fill="url(#chartGrad)" />
                  
                  {/* Main Line curve */}
                  <path d="M 0 160 Q 75 80, 150 95 T 300 45 T 450 60 L 500 70" fill="none" stroke="#1677ff" strokeWidth="3" />
                  
                  {/* Data Points */}
                  <circle cx="75" cy="120" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="150" cy="95" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="225" cy="65" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="300" cy="45" r="6" fill="#52c41a" stroke="#ffffff" strokeWidth="3" />
                  <circle cx="375" cy="55" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="450" cy="60" r="5" fill="#1677ff" stroke="#ffffff" strokeWidth="2" />
                </svg>
                
                {/* Labels */}
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

          {/* Recent Operations Log */}
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
    // Filter seats based on selected area
    const filteredSeats = seatAreaFilter === 'All'
      ? seats
      : seats.filter(s => s.area === seatAreaFilter);

    // List of distinct areas
    const areasList = ['All', 'Level 1: Collaborative Zone', 'Level 2: Quiet Study Area', 'Level 3: Postgraduate Hub', 'Ground Floor: Multimedia Room'];

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

        {/* Display areas with their corresponding seats */}
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
                      bordered
                      style={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: seat.status === 'Booked' ? '#fffdf9' : '#fafcfc',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
                      }}
                      bodyStyle={{ padding: 12 }}
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
    // Columns for Blacklist Table
    const blacklistColumns = [
      {
        title: 'Student ID',
        dataIndex: 'studentId',
        key: 'studentId',
        sorter: (a, b) => a.studentId.localeCompare(b.studentId),
        render: (text) => <Text strong style={{ color: '#0f172a' }}>{text}</Text>
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text) => <Text style={{ fontWeight: 500 }}>{text}</Text>
      },
      {
        title: 'Strike Count',
        dataIndex: 'strikes',
        key: 'strikes',
        sorter: (a, b) => a.strikes - b.strikes,
        render: (strikes) => {
          let color = 'green';
          if (strikes === 1) color = 'blue';
          if (strikes === 2) color = 'orange';
          if (strikes >= 3) color = 'red';
          
          return (
            <Space>
              <Badge count={strikes} style={{ backgroundColor: strikes >= 3 ? '#ff4d4f' : strikes === 2 ? '#fa8c16' : strikes === 1 ? '#1677ff' : '#52c41a' }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>/ 3 Strikes</span>
            </Space>
          );
        }
      },
      {
        title: 'Disciplinary Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
          { text: 'Active (Permitted)', value: 'Active' },
          { text: 'Blacklisted (Banned)', value: 'Blacklisted' }
        ],
        onFilter: (value, record) => record.status === value,
        render: (status) => {
          const isBanned = status === 'Blacklisted';
          return (
            <Tag color={isBanned ? 'red' : 'green'} style={{ fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
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
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleResetStrikes(record.key)}
              disabled={record.strikes === 0}
              style={{ padding: 0 }}
            >
              Reset Strikes
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleRemoveBlacklist(record.key)}
              style={{ padding: 0 }}
            >
              Remove
            </Button>
          </Space>
        )
      }
    ];

    // Filter blacklist records based on search query
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
              <Text type="secondary">Students with three strikes are automatically blacklisted and blocked from NFC seat check-ins.</Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: screens.md ? 'right' : 'left' }}>
              <Space wrap style={{ width: '100%', justifyContent: screens.md ? 'flex-end' : 'flex-start' }}>
                <Input
                  placeholder="Search Student Name / ID..."
                  prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
                  value={blacklistSearch}
                  onChange={(e) => setBlacklistSearch(e.target.value)}
                  style={{ width: 220 }}
                  allowClear
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsBlacklistModalVisible(true)}
                >
                  Record Strike / Ban
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card className="premium-card" bodyStyle={{ padding: 0 }}>
          <Table
            columns={blacklistColumns}
            dataSource={filteredBlacklist}
            pagination={{ pageSize: 8 }}
            scroll={{ x: true }}
          />
        </Card>

        {/* Modal to Add Student Strike */}
        <Modal
          title="🚨 Record Disciplinary Strike / Ban Student"
          visible={isBlacklistModalVisible}
          onCancel={() => {
            setIsBlacklistModalVisible(false);
            blacklistForm.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={blacklistForm}
            layout="vertical"
            onFinish={handleAddBlacklist}
            initialValues={{ strikes: 1 }}
          >
            <Form.Item
              name="studentId"
              label="UTM Student ID"
              rules={[
                { required: true, message: 'Please input UTM Student ID!' },
                { pattern: /^[AB]\d{2}[A-Z]{2}\d{4}$/i, message: 'Invalid ID Format. Example: A22CS0148' }
              ]}
            >
              <Input placeholder="e.g. A22CS0148" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Student Name"
              rules={[{ required: true, message: 'Please input student name!' }]}
            >
              <Input placeholder="Full Name as in Matrix Card" />
            </Form.Item>

            <Form.Item
              name="strikes"
              label="Disciplinary Strikes to Assign"
              rules={[{ required: true, message: 'Please assign strike count!' }]}
            >
              <Select
                options={[
                  { value: 1, label: '1 Strike (First Warning)' },
                  { value: 2, label: '2 Strikes (Final Warning)' },
                  { value: 3, label: '3 Strikes (Immediate Suspension & Blacklist)' }
                ]}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsBlacklistModalVisible(false)}>Cancel</Button>
                <Button type="primary" danger htmlType="submit">
                  Apply Strike
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  // 4. Complaints View
  const renderComplaints = () => {
    // Columns for Complaints Table
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
        filters: [
          { text: 'Pending', value: 'Pending' },
          { text: 'Under Review', value: 'Under Review' },
          { text: 'Resolved', value: 'Resolved' }
        ],
        onFilter: (value, record) => record.status === value,
        render: (status, record) => {
          let color = 'default';
          if (status === 'Pending') color = 'error';
          if (status === 'Under Review') color = 'warning';
          if (status === 'Resolved') color = 'success';
          
          return (
            <Select
              value={status}
              onChange={(value) => handleUpdateComplaintStatus(record.key, value)}
              style={{ width: 140 }}
              bordered={false}
              className={`complaint-status-select-${status}`}
              options={[
                { value: 'Pending', label: <Tag color="error">Pending</Tag> },
                { value: 'Under Review', label: <Tag color="warning">Under Review</Tag> },
                { value: 'Resolved', label: <Tag color="success">Resolved</Tag> }
              ]}
            />
          );
        }
      }
    ];

    // Filter complaints based on search/status
    const filteredComplaints = complaints;

    return (
      <div className="fade-in-view">
        <Card className="premium-card" style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>🛠️ Facility & Seat Complaints</Title>
          <Text type="secondary">Expand a row to read details of the issue, update progress notes, and resolve the complaint.</Text>
        </Card>

        <Card className="premium-card" bodyStyle={{ padding: 0 }}>
          <Table
            columns={complaintsColumns}
            dataSource={filteredComplaints}
            pagination={{ pageSize: 6 }}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: '16px 24px', backgroundColor: '#fafbfc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ fontSize: '13px', color: '#475569', display: 'block', marginBottom: 4 }}>
                          📋 Facility Issue Details:
                        </Text>
                        <Paragraph style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
                          {record.facilityDetails}
                        </Paragraph>
                      </div>
                    </Col>
                    
                    <Col xs={24} md={12}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <Text strong style={{ fontSize: '13px', color: '#475569' }}>
                            ✍️ Admin Resolution Comments:
                          </Text>
                          <span style={{ fontSize: '11px', color: '#52c41a' }}>💾 Auto-saves in real-time</span>
                        </div>
                        <Input.TextArea
                          rows={4}
                          placeholder="Type internal tracking notes, estimated resolution date, or technician details..."
                          value={record.adminComments}
                          onChange={(e) => handleUpdateAdminComments(record.key, e.target.value)}
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px'
                          }}
                        />
                      </div>
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
    // Catalog item cards
    const filteredLost = lostFoundFilter === 'All'
      ? lostFound
      : lostFound.filter(item => item.status === lostFoundFilter);

    return (
      <div className="fade-in-view">
        <Card className="premium-card" style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ margin: 0 }}>📦 Lost & Found Custody</Title>
              <Text type="secondary">Manage items misplaced in library study areas. Mark as claimed once students verify ownership.</Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: screens.md ? 'right' : 'left' }}>
              <Space wrap style={{ width: '100%', justifyContent: screens.md ? 'flex-end' : 'flex-start' }}>
                <Text strong>Filter Status:</Text>
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsLostFoundModalVisible(true)}
                >
                  Record Found Item
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Catalog grid */}
        <Row gutter={[20, 20]}>
          {filteredLost.map(item => {
            const isClaimed = item.status === 'Claimed';
            return (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card
                  className="premium-card"
                  bodyStyle={{ padding: 20 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <Tag color={isClaimed ? 'green' : 'purple'} style={{ marginBottom: 6, fontWeight: 600 }}>
                        {item.status}
                      </Tag>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Item Registry ID: {item.id}</div>
                    </div>
                    <Avatar shape="square" size={48} style={{ backgroundColor: '#f1f5f9', color: '#1677ff' }} icon={<InboxOutlined />} />
                  </div>

                  <div style={{ flex: '1 0 auto' }}>
                    <Title level={5} style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{item.name}</Title>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} style={{ fontSize: '13px', color: '#475569', marginBottom: 12 }}>
                      {item.description}
                    </Paragraph>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <EnvironmentOutlined style={{ marginRight: 6, fontSize: '13px' }} />
                      <span>Found in: <b>{item.location}</b></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarOutlined style={{ marginRight: 6, fontSize: '13px' }} />
                      <span>Date logged: <b>{item.date}</b></span>
                    </div>
                  </div>

                  {isClaimed ? (
                    <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7', fontSize: '12.5px' }}>
                      <div style={{ color: '#166534', fontWeight: 600 }}>Claimed by: {item.claimedBy}</div>
                      <div style={{ color: '#15803d', fontSize: '11px' }}>Claim Date: {item.claimDate}</div>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      ghost
                      block
                      icon={<CheckCircleOutlined />}
                      onClick={() => showClaimModal(item)}
                    >
                      Handover / Mark Claimed
                    </Button>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Modal to Register Found Item */}
        <Modal
          title="📦 Record Found Item inside Library"
          visible={isLostFoundModalVisible}
          onCancel={() => {
            setIsLostFoundModalVisible(false);
            lostFoundForm.resetFields();
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={lostFoundForm}
            layout="vertical"
            onFinish={handleAddLostFound}
          >
            <Form.Item
              name="name"
              label="Item Name"
              rules={[{ required: true, message: 'Please input item name!' }]}
            >
              <Input placeholder="e.g. Sony WH-1000XM4 Headphones" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Visual Description"
              rules={[{ required: true, message: 'Please write a brief description!' }]}
            >
              <Input.TextArea placeholder="e.g. Silver color, inside a black case, has a small scratch near power button." rows={3} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Specific Library Location Found"
              rules={[{ required: true, message: 'Please specify where it was found!' }]}
            >
              <Select
                options={[
                  { value: 'Level 1: Collaborative Zone', label: 'Level 1: Collaborative Zone' },
                  { value: 'Level 2: Quiet Study Area', label: 'Level 2: Quiet Study Area' },
                  { value: 'Level 3: Postgraduate Hub', label: 'Level 3: Postgraduate Hub' },
                  { value: 'Ground Floor Scanner', label: 'Ground Floor Scanner / Café' }
                ]}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setIsLostFoundModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Register Item
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Handover Claim verification */}
        <Modal
          title="✅ Verifying Ownership Handover"
          visible={isClaimModalVisible}
          onCancel={() => {
            setIsClaimModalVisible(false);
            claimForm.resetFields();
            setSelectedLostItem(null);
          }}
          footer={null}
          destroyOnClose
        >
          {selectedLostItem && (
            <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Item to Handover:</div>
              <Text strong style={{ fontSize: '14.5px' }}>{selectedLostItem.name}</Text>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#475569' }}>{selectedLostItem.description}</p>
            </div>
          )}
          
          <Form
            form={claimForm}
            layout="vertical"
            onFinish={handleClaimItem}
          >
            <Form.Item
              name="studentId"
              label="UTM Student ID of Claimant"
              rules={[
                { required: true, message: 'Please input claimant student matrix ID!' },
                { pattern: /^[AB]\d{2}[A-Z]{2}\d{4}$/i, message: 'Invalid ID Format. Example: A21EC0052' }
              ]}
            >
              <Input placeholder="e.g. A21EC0052" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setIsClaimModalVisible(false);
                  setSelectedLostItem(null);
                }}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Verify & Handover Item
                </Button>
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
      default:
        return renderDashboardOverview();
    }
  };

  const getBreadcrumbTitle = () => {
    switch (selectedKey) {
      case '1':
        return 'Dashboard Overview';
      case '2':
        return 'Seat & Area Management';
      case '3':
        return 'Student Blacklist';
      case '4':
        return 'Facility & Seat Complaints';
      case '5':
        return 'Lost & Found Custody';
      default:
        return 'Dashboard';
    }
  };

  const mockNotifications = [
    { key: '1', title: 'New AC Issue reported at Level 2 Quiet Area', time: '10m ago', type: 'complaint' },
    { key: '2', title: 'NFC Seat auto-released L1-S04 due to absence', time: '30m ago', type: 'seat' },
    { key: '3', title: 'Found Item: Blue Hydro Flask reported at Collaborative zone', time: '1h ago', type: 'lost' }
  ];

  const notificationContent = (
    <div style={{ width: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0 8px 0', borderBottom: '1px solid #f1f5f9', marginBottom: 8 }}>
        <Text strong>Notifications</Text>
        <Text type="secondary" style={{ fontSize: '11px', cursor: 'pointer' }}>Mark all read</Text>
      </div>
      <List
        size="small"
        dataSource={mockNotifications}
        renderItem={item => (
          <List.Item style={{ padding: '8px 0', cursor: 'pointer' }}>
            <List.Item.Meta
              avatar={<Badge status={item.type === 'complaint' ? 'error' : item.type === 'seat' ? 'warning' : 'processing'} />}
              title={<span style={{ fontSize: '12px', fontWeight: 500 }}>{item.title}</span>}
              description={<span style={{ fontSize: '10px', color: '#94a3b8' }}>{item.time}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
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
        </Menu>
      </Sider>

      {/* Main Container */}
      <Layout>
        {/* Main Header */}
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
            {/* Staff Domain Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
              {screens.sm && (
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>Librarian Admin</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Staff Domain: @utm.my</div>
                </div>
              )}
            </div>

            {/* Notification Badge with Popover */}
            <Popover content={notificationContent} trigger="click" placement="bottomRight">
              <Badge count={pendingNotifications} overflowCount={9} style={{ cursor: 'pointer' }}>
                <Button type="text" shape="circle" size="large" icon={<BellOutlined style={{ fontSize: '18px', color: '#475569' }} />} />
              </Badge>
            </Popover>

            <Tooltip title="Log Out">
              <Button type="text" shape="circle" size="large" icon={<PoweroffOutlined style={{ fontSize: '16px', color: '#ff4d4f' }} />} onClick={() => message.info('Logging out system...')} />
            </Tooltip>
          </Space>
        </Header>

        {/* Main Content Area */}
        <Content style={{ padding: '24px', overflowY: 'auto' }}>
          {renderActiveView()}
        </Content>
      </Layout>
    </Layout>
  );
}

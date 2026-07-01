import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Layout,
  Menu,
  Space,
  Button,
  Badge,
  Form,
  message,
  Avatar,
  Popover,
  Tooltip,
  List,
  Typography,
  Grid
} from 'antd';
import {
  DashboardOutlined,
  AreaChartOutlined,
  StopOutlined,
  AlertOutlined,
  UserOutlined,
  BellOutlined,
  PoweroffOutlined,
  InboxOutlined,
  PictureOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import './App.css';

// Import Separated View Components
import DashboardOverview from './components/DashboardOverview';
import SeatManagement from './components/SeatManagement';
import FloorPlan from './components/FloorPlan';
import StudentBlacklist from './components/StudentBlacklist';
import Announcements from './components/Announcements';
import Complaints from './components/Complaints';
import LostFound from './components/LostFound';
import { AREA_NAMES } from './constants/areas';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
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
  { key: '1', name: 'Ahmad Faiz bin Azmi', email: 'ahmadfaiz.azmi@gmail.com', strikes: 5, status: 'Blacklisted' },
  { key: '2', name: 'Tan Mei Ling', email: 'tanmeiling@gmail.com', strikes: 2, status: 'Active' },
  { key: '3', name: 'Saraswathy a/p Mohan', email: 'saraswathy.mohan@gmail.com', strikes: 5, status: 'Blacklisted' },
  { key: '4', name: 'Brandon Lim Wei Shen', email: 'brandonlimws@gmail.com', strikes: 1, status: 'Active' },
  { key: '5', name: 'Nurul Izzah binti Rosli', email: 'nurulizzah.rosli@gmail.com', strikes: 5, status: 'Blacklisted' },
  { key: '6', name: 'Muhammad Aliff bin Zulkifli', email: 'aliffzulkifli@gmail.com', strikes: 0, status: 'Active' },
  { key: '7', name: 'Chong Jia Yi', email: 'chongjiayi@gmail.com', strikes: 5, status: 'Blacklisted' },
  { key: '8', name: 'Haris Haroon', email: 'harisharoon@gmail.com', strikes: 3, status: 'Active' }
];

const initialSeats = [
  // Level 1: Collaborative Zone
  { id: 'L1-S01', area: 'Level 1: Collaborative Zone', nfcUid: '04:A2:3E:9B:10:E2:80', status: 'Reserved', studentName: 'Ahmad Faiz (A22CS0148)', date: '2026-07-01', timeSlot: '08:00 AM - 10:00 AM' },
  { id: 'L1-S02', area: 'Level 1: Collaborative Zone', nfcUid: '04:5C:8B:1A:F5:2C:81', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'L1-S03', area: 'Level 1: Collaborative Zone', nfcUid: '04:FF:E2:33:6B:40:80', status: 'Reserved', studentName: 'Siti Aminah (A22CS0032)', date: '2026-07-01', timeSlot: '10:00 AM - 12:00 PM' },
  { id: 'L1-S04', area: 'Level 1: Collaborative Zone', nfcUid: '04:2E:7A:B2:CC:5F:80', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'L1-S05', area: 'Level 1: Collaborative Zone', nfcUid: '04:D4:6C:5F:81:4A:80', status: 'Reserved', studentName: 'Jason Lee (A21CS0912)', date: '2026-07-01', timeSlot: '12:00 PM - 02:00 PM' },
  { id: 'L1-S06', area: 'Level 1: Collaborative Zone', nfcUid: '04:3B:5A:F3:CC:89:81', status: 'Unavailable', studentName: null, date: null, timeSlot: null, maintenanceReason: 'Broken chair — awaiting replacement' },

  // Level 2: Quiet Study Area
  { id: 'L2-S01', area: 'Level 2: Quiet Study Area', nfcUid: '04:E3:4C:6A:B2:1A:80', status: 'Reserved', studentName: 'Tan Mei Ling (A21EC0052)', date: '2026-07-01', timeSlot: '10:00 AM - 12:00 PM' },
  { id: 'L2-S02', area: 'Level 2: Quiet Study Area', nfcUid: '04:77:88:99:AA:BB:CC', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'L2-S03', area: 'Level 2: Quiet Study Area', nfcUid: '04:11:22:33:44:55:66', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'L2-S04', area: 'Level 2: Quiet Study Area', nfcUid: '04:AA:BB:CC:DD:EE:FF', status: 'Reserved', studentName: 'Saraswathy Mohan (A22CS0089)', date: '2026-07-01', timeSlot: '02:00 PM - 04:00 PM' },
  { id: 'L2-S05', area: 'Level 2: Quiet Study Area', nfcUid: '04:12:34:56:78:90:AB', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'L2-S06', area: 'Level 2: Quiet Study Area', nfcUid: '04:FE:DC:BA:98:76:54', status: 'Unavailable', studentName: null, date: null, timeSlot: null, maintenanceReason: 'AC unit leaking condensation water above desk' },

  // Level 3: Postgraduate Hub
  { id: 'L3-S01', area: 'Level 3: Postgraduate Hub', nfcUid: '04:55:66:77:88:99:00', status: 'Reserved', studentName: 'Dr. Sarah (Staff)', date: '2026-07-01', timeSlot: '08:00 AM - 10:00 AM' },
  { id: 'L3-S02', area: 'Level 3: Postgraduate Hub', nfcUid: '04:AB:CD:EF:01:23:45', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'L3-S03', area: 'Level 3: Postgraduate Hub', nfcUid: '04:88:99:00:11:22:33', status: 'Reserved', studentName: 'Ngooi Jun (A20EC0990)', date: '2026-07-01', timeSlot: '04:00 PM - 06:00 PM' },
  { id: 'L3-S04', area: 'Level 3: Postgraduate Hub', nfcUid: '04:44:55:66:77:88:99', status: 'Available', studentName: null, date: null, timeSlot: null },

  // Ground Floor: Multimedia Room
  { id: 'GF-S01', area: 'Ground Floor: Multimedia Room', nfcUid: '04:33:44:55:66:77:88', status: 'Reserved', studentName: 'Devi Ratna (B21CS0922)', date: '2026-07-01', timeSlot: '10:00 AM - 12:00 PM' },
  { id: 'GF-S02', area: 'Ground Floor: Multimedia Room', nfcUid: '04:22:33:44:55:66:77', status: 'Reserved', studentName: 'Amiruddin (A22CS0021)', date: '2026-07-01', timeSlot: '12:00 PM - 02:00 PM' },
  { id: 'GF-S03', area: 'Ground Floor: Multimedia Room', nfcUid: '04:11:22:33:44:55:66', status: 'Available', studentName: null, date: null, timeSlot: null },
  { id: 'GF-S04', area: 'Ground Floor: Multimedia Room', nfcUid: '04:00:11:22:33:44:55', status: 'Available', studentName: null, date: null, timeSlot: null }
];

const initialFloorPlans = AREA_NAMES.map((area, index) => ({
  id: String(index + 1),
  area,
  active: true,
  floorPlanImage: null,
  floorPlanFileName: null,
  seatPlanImage: null,
  seatPlanFileName: null,
  operatingHours: ['08:00', '22:00'],
  allowedDurations: ['30 Minutes', '1 Hour', '2 Hours (Max)']
}));

const initialAnnouncements = [
  {
    key: '1',
    title: 'Grace check-in period revised',
    body: 'The grace period to verify seat check-in via NFC tags has been adjusted from 15 minutes down to 5 minutes to prevent seat squatting.',
    startDate: null,
    endDate: null,
    createdAt: '2026-05-25'
  },
  {
    key: '2',
    title: 'Level 2 Air Conditioning Repair',
    body: 'F&M Department is servicing AC-400X unit above Seat L2-S04 on Wednesday morning. Expect noise disruption in the Quiet Study Area.',
    startDate: '2026-06-28',
    endDate: '2026-07-03',
    createdAt: '2026-06-27'
  },
  {
    key: '3',
    title: 'Mid-Semester Break Closure',
    body: 'The library will be closed for the mid-semester break. Seat bookings will resume once the break ends.',
    startDate: '2026-08-10',
    endDate: '2026-08-17',
    createdAt: '2026-06-20'
  },
  {
    key: '4',
    title: 'New Penalty System Update',
    body: 'Accruing 5 strikes will lead to an automatic 14-day library suspension block. Strike counts reset every semester.',
    startDate: '2026-05-01',
    endDate: '2026-05-20',
    createdAt: '2026-05-01'
  }
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
    claimDate: '',
    photo: null
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
    claimDate: '',
    photo: null
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
    claimDate: '2026-05-23',
    photo: null
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
    claimDate: '',
    photo: null
  }
];

export default function App() {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // Menu index: 1 = Dashboard, 2 = Seats, 3 = Floor Plan, 4 = Blacklist, 5 = Announcements, 6 = Complaints, 7 = Lost & Found

  // Core States
  const [blacklist, setBlacklist] = useState(initialBlacklist);
  const [seats, setSeats] = useState(initialSeats);
  const [floorPlans, setFloorPlans] = useState(initialFloorPlans);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
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
  const [isAnnouncementModalVisible, setIsAnnouncementModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // Form States
  const [blacklistForm] = Form.useForm();
  const [lostFoundForm] = Form.useForm();
  const [claimForm] = Form.useForm();
  const [announcementForm] = Form.useForm();

  // Dynamic notifications counter
  const pendingNotifications = complaints.filter(c => c.status === 'Pending').length + lostFound.filter(lf => lf.status === 'Unclaimed').length;

  // Calculate statistics dynamically
  const totalSeats = seats.length;
  const bookedSeats = seats.filter(s => s.status === 'Reserved').length;
  const blacklistedCount = blacklist.filter(b => b.status === 'Blacklisted').length;
  const activeStrikes = blacklist.reduce((acc, curr) => acc + curr.strikes, 0);
  const unresolvedComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  // --- ACTIONS ---

  // Blacklist actions
  const handleAddBlacklist = (values) => {
    const newEntry = {
      key: String(blacklist.length + 1),
      name: values.name,
      email: values.email.toLowerCase(),
      strikes: values.strikes,
      status: values.strikes >= 5 ? 'Blacklisted' : 'Active'
    };
    setBlacklist([newEntry, ...blacklist]);
    setIsBlacklistModalVisible(false);
    blacklistForm.resetFields();
    message.success(`Student ${values.name} (${values.email.toLowerCase()}) added to monitoring list.`);
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
    const seat = seats.find(s => s.id === seatId);
    if (seat && seat.status === 'Unavailable') {
      message.error(`Seat ${seatId} is unavailable and cannot be assigned.`);
      return;
    }

    setSeats(seats.map(s => {
      if (s.id === seatId) {
        const nextStatus = s.status === 'Available' ? 'Reserved' : 'Available';
        message.success(`Seat ${seatId} is now ${nextStatus}.`);
        return {
          ...s,
          status: nextStatus,
          studentName: nextStatus === 'Reserved' ? 'Walk-in Student' : null,
          date: nextStatus === 'Reserved' ? new Date().toISOString().split('T')[0] : null,
          timeSlot: nextStatus === 'Reserved' ? 'Walk-in Session' : null
        };
      }
      return s;
    }));
  };

  // Floor Plan actions
  const handleUploadFloorPlanImage = (id, dataUrl, fileName) => {
    setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, floorPlanImage: dataUrl, floorPlanFileName: fileName } : fp));
    message.success('Floor plan image updated.');
  };

  const handleDeleteFloorPlanImage = (id) => {
    setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, floorPlanImage: null, floorPlanFileName: null } : fp));
    message.info('Floor plan image removed.');
  };

  const handleUploadSeatPlanImage = (id, dataUrl, fileName) => {
    setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, seatPlanImage: dataUrl, seatPlanFileName: fileName } : fp));
    message.success('Seat plan image updated.');
  };

  const handleDeleteSeatPlanImage = (id) => {
    setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, seatPlanImage: null, seatPlanFileName: null } : fp));
    message.info('Seat plan image removed.');
  };

  const handleToggleAreaActive = (id) => {
    setFloorPlans(floorPlans.map(fp => {
      if (fp.id === id) {
        const nextActive = !fp.active;
        message.success(`${fp.area} is now ${nextActive ? 'active' : 'closed'}.`);
        return { ...fp, active: nextActive };
      }
      return fp;
    }));
  };

  // Library Settings actions (area name, operating hours, allowed booking durations)
  const handleAddArea = (name) => {
    const newEntry = {
      id: String(Date.now()),
      area: name,
      active: true,
      floorPlanImage: null,
      floorPlanFileName: null,
      seatPlanImage: null,
      seatPlanFileName: null,
      operatingHours: ['08:00', '22:00'],
      allowedDurations: ['30 Minutes', '1 Hour', '2 Hours (Max)']
    };
    setFloorPlans([...floorPlans, newEntry]);
    message.success(`Area "${name}" created.`);
  };

  const handleDeleteArea = (id) => {
    const removed = floorPlans.find(fp => fp.id === id);
    setFloorPlans(floorPlans.filter(fp => fp.id !== id));
    message.success(`Area "${removed.area}" deleted.`);
  };

  const handleUpdateLibrarySettings = (id, { area, operatingHours, allowedDurations }) => {
    setFloorPlans(floorPlans.map(fp => fp.id === id ? { ...fp, area, operatingHours, allowedDurations } : fp));
    message.success(`Library settings updated for ${area}.`);
  };

  // Announcements actions
  const showAddAnnouncementModal = () => {
    setEditingAnnouncement(null);
    announcementForm.resetFields();
    setIsAnnouncementModalVisible(true);
  };

  const showEditAnnouncementModal = (announcement) => {
    setEditingAnnouncement(announcement);
    announcementForm.setFieldsValue({
      title: announcement.title,
      body: announcement.body,
      dateRange: announcement.startDate && announcement.endDate
        ? [dayjs(announcement.startDate), dayjs(announcement.endDate)]
        : undefined
    });
    setIsAnnouncementModalVisible(true);
  };

  const handleSaveAnnouncement = (values) => {
    const [startDate, endDate] = values.dateRange || [null, null];
    const payload = {
      title: values.title,
      body: values.body,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null
    };

    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => a.key === editingAnnouncement.key ? { ...a, ...payload } : a));
      message.success(`Announcement "${values.title}" updated.`);
    } else {
      const newEntry = {
        key: String(Date.now()),
        ...payload,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAnnouncements([newEntry, ...announcements]);
      message.success(`Announcement "${values.title}" published.`);
    }

    setIsAnnouncementModalVisible(false);
    setEditingAnnouncement(null);
    announcementForm.resetFields();
  };

  const handleDeleteAnnouncement = (key) => {
    const announcement = announcements.find(a => a.key === key);
    setAnnouncements(announcements.filter(a => a.key !== key));
    message.success(`Announcement "${announcement.title}" deleted.`);
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
  const handleAddLostFound = (values, photo) => {
    const nextNumber = Math.max(0, ...lostFound.map(item => parseInt(item.id.replace('LF-', ''), 10) || 0)) + 1;
    const newEntry = {
      key: `LF-${nextNumber}`,
      id: `LF-${nextNumber}`,
      name: values.name,
      description: values.description,
      location: values.location,
      date: new Date().toISOString().split('T')[0],
      status: 'Unclaimed',
      claimedBy: '',
      claimDate: '',
      photo: photo || null
    };
    setLostFound([newEntry, ...lostFound]);
    setIsLostFoundModalVisible(false);
    lostFoundForm.resetFields();
    message.success(`New lost item "${values.name}" registered successfully.`);
  };

  const handleMarkUnclaimed = (itemId) => {
    setLostFound(lostFound.map(item => {
      if (item.id === itemId) {
        message.info(`Item "${item.name}" reverted to Unclaimed.`);
        return { ...item, status: 'Unclaimed', claimedBy: '', claimDate: '' };
      }
      return item;
    }));
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

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const renderActiveView = () => {
    switch (selectedKey) {
      case '1':
        return (
          <DashboardOverview
            screens={screens}
            bookedSeats={bookedSeats}
            totalSeats={totalSeats}
            blacklistedCount={blacklistedCount}
            activeStrikes={activeStrikes}
            unresolvedComplaints={unresolvedComplaints}
            complaints={complaints}
            lostFound={lostFound}
          />
        );
      case '2':
        return (
          <SeatManagement
            seats={seats}
            seatAreaFilter={seatAreaFilter}
            setSeatAreaFilter={setSeatAreaFilter}
            handleToggleSeatStatus={handleToggleSeatStatus}
          />
        );
      case '3':
        return (
          <FloorPlan
            floorPlans={floorPlans}
            handleUploadFloorPlanImage={handleUploadFloorPlanImage}
            handleDeleteFloorPlanImage={handleDeleteFloorPlanImage}
            handleUploadSeatPlanImage={handleUploadSeatPlanImage}
            handleDeleteSeatPlanImage={handleDeleteSeatPlanImage}
            handleToggleAreaActive={handleToggleAreaActive}
            handleAddArea={handleAddArea}
            handleDeleteArea={handleDeleteArea}
            handleUpdateLibrarySettings={handleUpdateLibrarySettings}
          />
        );
      case '4':
        return (
          <StudentBlacklist
            screens={screens}
            blacklist={blacklist}
            blacklistSearch={blacklistSearch}
            setBlacklistSearch={setBlacklistSearch}
            isBlacklistModalVisible={isBlacklistModalVisible}
            setIsBlacklistModalVisible={setIsBlacklistModalVisible}
            blacklistForm={blacklistForm}
            handleAddBlacklist={handleAddBlacklist}
            handleResetStrikes={handleResetStrikes}
            handleRemoveBlacklist={handleRemoveBlacklist}
          />
        );
      case '5':
        return (
          <Announcements
            announcements={announcements}
            isAnnouncementModalVisible={isAnnouncementModalVisible}
            setIsAnnouncementModalVisible={setIsAnnouncementModalVisible}
            editingAnnouncement={editingAnnouncement}
            announcementForm={announcementForm}
            showAddAnnouncementModal={showAddAnnouncementModal}
            showEditAnnouncementModal={showEditAnnouncementModal}
            handleSaveAnnouncement={handleSaveAnnouncement}
            handleDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );
      case '6':
        return (
          <Complaints
            complaints={complaints}
            handleUpdateComplaintStatus={handleUpdateComplaintStatus}
            handleUpdateAdminComments={handleUpdateAdminComments}
          />
        );
      case '7':
        return (
          <LostFound
            screens={screens}
            lostFound={lostFound}
            lostFoundFilter={lostFoundFilter}
            setLostFoundFilter={setLostFoundFilter}
            isLostFoundModalVisible={isLostFoundModalVisible}
            setIsLostFoundModalVisible={setIsLostFoundModalVisible}
            lostFoundForm={lostFoundForm}
            handleAddLostFound={handleAddLostFound}
            isClaimModalVisible={isClaimModalVisible}
            setIsClaimModalVisible={setIsClaimModalVisible}
            selectedLostItem={selectedLostItem}
            setSelectedLostItem={setSelectedLostItem}
            claimForm={claimForm}
            showClaimModal={showClaimModal}
            handleClaimItem={handleClaimItem}
            handleMarkUnclaimed={handleMarkUnclaimed}
          />
        );
      default:
        return (
          <DashboardOverview
            screens={screens}
            bookedSeats={bookedSeats}
            totalSeats={totalSeats}
            blacklistedCount={blacklistedCount}
            activeStrikes={activeStrikes}
            unresolvedComplaints={unresolvedComplaints}
            complaints={complaints}
            lostFound={lostFound}
          />
        );
    }
  };

  const getBreadcrumbTitle = () => {
    switch (selectedKey) {
      case '1':
        return 'Dashboard Overview';
      case '2':
        return 'Seat Management';
      case '3':
        return 'Floor Plan';
      case '4':
        return 'Blacklist';
      case '5':
        return 'Announcements';
      case '6':
        return 'Facility & Seat Complaints';
      case '7':
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
          height: screens.xs ? '100%' : 'auto',
          alignSelf: 'stretch',
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
            Seat Management
          </Menu.Item>
          <Menu.Item key="3" icon={<PictureOutlined />}>
            Floor Plan
          </Menu.Item>
          <Menu.Item key="4" icon={<StopOutlined />}>
            Blacklist
          </Menu.Item>
          <Menu.Item key="5" icon={<NotificationOutlined />}>
            Announcements
          </Menu.Item>
          <Menu.Item key="6" icon={<AlertOutlined />}>
            Complaints
          </Menu.Item>
          <Menu.Item key="7" icon={<InboxOutlined />}>
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

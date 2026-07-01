import React from 'react';
import { Card, Row, Col, Tag, Avatar, Space, List, Badge, Typography } from 'antd';
import {
  AreaChartOutlined,
  StopOutlined,
  AlertOutlined,
  InboxOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  CoffeeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const systemLogs = [
  { time: '10 mins ago', message: 'Seat L1-S01 status updated to Booked by Ahmad Faiz via NFC Tag scan.' },
  { time: '25 mins ago', message: 'Staff resolved facility complaint CMP-2026-079 (Damaged Chair in Level 3).' },
  { time: '1 hour ago', message: 'Student Brandon Lim (A20EC0110) strike count updated to 1 for seat no-show.' },
  { time: '3 hours ago', message: 'New lost & found item LF-905 (Student ID Card) reported at Ground Floor.' },
  { time: '5 hours ago', message: 'System auto-released 4 seats due to 15-minute booking grace-period timeout.' }
];

export default function DashboardOverview({
  screens,
  bookedSeats,
  totalSeats,
  blacklistedCount,
  activeStrikes,
  unresolvedComplaints,
  complaints,
  lostFound
}) {
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
              <Text type="secondary">Occupancy Rate: <b>{Math.round((bookedSeats / totalSeats) * 100)}%</b> (Peak: 78%)</Text>
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
}

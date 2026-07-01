import React, { useState } from 'react';
import { Card, Row, Col, Space, Select, Tag, Badge, Button, Typography, Tabs, Table, Modal, Empty } from 'antd';
import { EnvironmentOutlined, PlusOutlined, ReloadOutlined, ToolOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { AREAS_LIST } from '../constants/areas';

const { Title, Text } = Typography;

// Colour coding shared by the Floor View seat cards and the status tags
const STATUS_COLORS = {
  Available: { border: '#b7eb8f', bg: '#f6ffed', dot: 'success', text: '#52c41a' },
  Reserved: { border: '#ffe58f', bg: '#fffbe6', dot: 'warning', text: '#d48806' },
  Unavailable: { border: '#ffa39e', bg: '#fff1f0', dot: 'error', text: '#f5222d' }
};

export default function SeatManagement({ seats, seatAreaFilter, setSeatAreaFilter, handleToggleSeatStatus }) {
  const [activeTab, setActiveTab] = useState('floor');
  const [selectedSeat, setSelectedSeat] = useState(null);

  const openSeatDetail = (seat) => setSelectedSeat(seat);
  const closeSeatDetail = () => setSelectedSeat(null);

  const handleUpdateFromModal = () => {
    handleToggleSeatStatus(selectedSeat.id);
    closeSeatDetail();
  };

  // Every currently active booking, derived from reserved seats
  const bookings = seats
    .filter(s => s.status === 'Reserved')
    .map(s => ({
      key: s.id,
      seatId: s.id,
      studentName: s.studentName,
      area: s.area,
      date: s.date,
      timeSlot: s.timeSlot,
      status: s.status
    }));

  const bookingColumns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName)
    },
    {
      title: 'Seat ID',
      dataIndex: 'seatId',
      sorter: (a, b) => a.seatId.localeCompare(b.seatId)
    },
    {
      title: 'Area',
      dataIndex: 'area',
      filters: AREAS_LIST.filter(a => a !== 'All').map(a => ({ text: a, value: a })),
      onFilter: (value, record) => record.area === value,
      sorter: (a, b) => a.area.localeCompare(b.area)
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date)
    },
    {
      title: 'Time Slot',
      dataIndex: 'timeSlot',
      sorter: (a, b) => a.timeSlot.localeCompare(b.timeSlot)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [{ text: 'Reserved', value: 'Reserved' }],
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color="warning">{status}</Tag>
    }
  ];

  return (
    <div className="fade-in-view">
      <Card className="premium-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>📍 Seat Management</Title>
            <Text type="secondary">Real-time seat status monitoring across all floors — view and update booking records as needed.</Text>
          </Col>
          <Col>
            <Space wrap>
              <Text strong>Filter Area:</Text>
              <Select
                value={seatAreaFilter}
                onChange={(val) => setSeatAreaFilter(val)}
                style={{ width: 260 }}
                options={AREAS_LIST.map(area => ({ label: area, value: area }))}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="tabs-align-right"
        items={[
          {
            key: 'floor',
            label: <AppstoreOutlined />,
            children: (
              <>
                {AREAS_LIST.filter(a => a !== 'All' && (seatAreaFilter === 'All' || seatAreaFilter === a)).map(areaName => {
                  const areaSeats = seats.filter(s => s.area === areaName);
                  const availableCount = areaSeats.filter(s => s.status === 'Available').length;
                  const reservedCount = areaSeats.filter(s => s.status === 'Reserved').length;
                  const unavailableCount = areaSeats.filter(s => s.status === 'Unavailable').length;

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
                            <Tag color="green">{availableCount} Available</Tag>
                            <Tag color="orange">{reservedCount} Reserved</Tag>
                            <Tag color="red">{unavailableCount} Unavailable</Tag>
                          </Space>
                        </div>
                      }
                      className="premium-card"
                      style={{ marginBottom: 24 }}
                    >
                      <Row gutter={[16, 16]}>
                        {areaSeats.map(seat => {
                          const palette = STATUS_COLORS[seat.status];
                          return (
                            <Col xs={24} sm={12} md={8} lg={6} key={seat.id}>
                              <Card
                                size="small"
                                bordered
                                hoverable
                                onClick={() => openSeatDetail(seat)}
                                style={{
                                  borderRadius: '8px',
                                  border: `1px solid ${palette.border}`,
                                  backgroundColor: palette.bg,
                                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                                  cursor: 'pointer'
                                }}
                                bodyStyle={{ padding: 12 }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                  <Text strong style={{ fontSize: '15px' }}>{seat.id}</Text>
                                  <Badge
                                    status={palette.dot}
                                    text={
                                      <span style={{ color: palette.text, fontWeight: 600, fontSize: '12px' }}>
                                        {seat.status}
                                      </span>
                                    }
                                  />
                                </div>

                                <div style={{ background: '#ffffff', padding: '6px 8px', borderRadius: '6px', marginBottom: 8, border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>NFC Tag UID:</div>
                                  <Text code style={{ fontSize: '11.5px', fontFamily: 'monospace' }}>{seat.nfcUid}</Text>
                                </div>

                                {seat.status === 'Reserved' && (
                                  <div>
                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Occupant:</span>
                                    <Text style={{ fontSize: '12.5px', fontWeight: 500 }} ellipsis={{ tooltip: seat.studentName }}>{seat.studentName}</Text>
                                  </div>
                                )}

                                {seat.status === 'Unavailable' && (
                                  <div>
                                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Reason:</span>
                                    <Text style={{ fontSize: '12.5px', fontWeight: 500 }} ellipsis={{ tooltip: seat.maintenanceReason }}>{seat.maintenanceReason}</Text>
                                  </div>
                                )}
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Card>
                  );
                })}
              </>
            )
          },
          {
            key: 'list',
            label: <UnorderedListOutlined />,
            children: (
              <Card className="premium-card">
                <Table
                  columns={bookingColumns}
                  dataSource={bookings}
                  pagination={{ pageSize: 8 }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* Seat Booking Detail Modal */}
      <Modal
        title={selectedSeat ? `Seat ${selectedSeat.id}` : ''}
        open={!!selectedSeat}
        onCancel={closeSeatDetail}
        footer={selectedSeat && selectedSeat.status !== 'Unavailable' ? [
          <Button
            key="update"
            type={selectedSeat.status === 'Available' ? 'primary' : 'default'}
            danger={selectedSeat.status === 'Reserved'}
            icon={selectedSeat.status === 'Available' ? <PlusOutlined /> : <ReloadOutlined />}
            onClick={handleUpdateFromModal}
          >
            {selectedSeat.status === 'Available' ? 'Assign Walk-in' : 'Release Seat'}
          </Button>
        ] : [
          <Button key="close" onClick={closeSeatDetail}>Close</Button>
        ]}
      >
        {selectedSeat && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>AREA:</span>
              <Text strong>{selectedSeat.area}</Text>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>STATUS:</span>
              <Tag color={STATUS_COLORS[selectedSeat.status].dot}>{selectedSeat.status}</Tag>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>NFC TAG UID:</span>
              <Text code>{selectedSeat.nfcUid}</Text>
            </div>

            {selectedSeat.status === 'Reserved' && (
              <>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>STUDENT:</span>
                  <Text strong>{selectedSeat.studentName}</Text>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>DATE:</span>
                  <Text>{selectedSeat.date}</Text>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TIME SLOT:</span>
                  <Text>{selectedSeat.timeSlot}</Text>
                </div>
              </>
            )}

            {selectedSeat.status === 'Available' && (
              <Empty description="No active booking for this seat." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}

            {selectedSeat.status === 'Unavailable' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8, padding: 10 }}>
                <ToolOutlined style={{ color: '#f5222d', marginTop: 2 }} />
                <Text style={{ fontSize: '12.5px' }}>{selectedSeat.maintenanceReason}</Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

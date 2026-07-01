import React from 'react';
import { Card, Row, Col, Space, Select, Tag, Badge, Button, Typography } from 'antd';
import { EnvironmentOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SeatAreaManagement({ seats, seatAreaFilter, setSeatAreaFilter, handleToggleSeatStatus }) {
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
}

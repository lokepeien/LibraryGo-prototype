import React from 'react';
import { Card, Row, Col, Table, Tag, Select, Input, Typography } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function Complaints({ complaints, handleUpdateComplaintStatus, handleUpdateAdminComments }) {
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

  return (
    <div className="fade-in-view">
      <Card className="premium-card" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>🛠️ Facility & Seat Complaints</Title>
        <Text type="secondary">Expand a row to read details of the issue, update progress notes, and resolve the complaint.</Text>
      </Card>

      <Card className="premium-card" bodyStyle={{ padding: 0 }}>
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
}

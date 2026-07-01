import React from 'react';
import { Card, Row, Col, Space, Input, Button, Table, Tag, Badge, Divider, Modal, Form, Select, Typography, message } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined, CloseCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title, Text } = Typography;

export default function StudentBlacklist({
  screens,
  blacklist,
  blacklistSearch,
  setBlacklistSearch,
  isBlacklistModalVisible,
  setIsBlacklistModalVisible,
  blacklistForm,
  handleAddBlacklist,
  handleResetStrikes,
  handleRemoveBlacklist
}) {
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

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('UTM Library — Student Disciplinary Blacklist Report', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['Student ID', 'Name', 'Strike Count', 'Disciplinary Status']],
      body: blacklist.map(s => [s.studentId, s.name, `${s.strikes} / 3`, s.status])
    });

    doc.save(`blacklist-report-${new Date().toISOString().split('T')[0]}.pdf`);
    message.success('Blacklist report exported as PDF.');
  };

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
                icon={<FilePdfOutlined />}
                onClick={handleExportPdf}
              >
                Export PDF
              </Button>
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
        open={isBlacklistModalVisible}
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
}

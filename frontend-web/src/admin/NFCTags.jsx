import React from 'react';
import { Card, Row, Col, Space, Input, Select, Button, Table, Tag, Typography, Modal, Form, message } from 'antd';
import { SearchOutlined, FilePdfOutlined, SwapOutlined, TagsOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AREAS_LIST } from '../constants/areas';

const { Title, Text } = Typography;

const STATUS_COLORS = { Active: 'green', Inactive: 'default', Faulty: 'red' };

export default function NFCTags({
  nfcTags,
  nfcSearch,
  setNfcSearch,
  nfcAreaFilter,
  setNfcAreaFilter,
  nfcStatusFilter,
  setNfcStatusFilter,
  reassignModalTag,
  showReassignModal,
  setReassignModalTag,
  handleReassignSeat
}) {
  const [reassignForm] = Form.useForm();

  const filteredTags = nfcTags.filter(tag => {
    const matchesSearch =
      tag.uid.toLowerCase().includes(nfcSearch.toLowerCase()) ||
      tag.seatId.toLowerCase().includes(nfcSearch.toLowerCase());
    const matchesArea = nfcAreaFilter === 'All' || tag.area === nfcAreaFilter;
    const matchesStatus = nfcStatusFilter === 'All' || tag.status === nfcStatusFilter;
    return matchesSearch && matchesArea && matchesStatus;
  });

  const openReassignModal = (tag) => {
    showReassignModal(tag);
    reassignForm.setFieldsValue({ seatId: tag.seatId });
  };

  const submitReassign = (values) => {
    handleReassignSeat(values.seatId.trim());
    reassignForm.resetFields();
  };

  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      sorter: (a, b) => a.uid.localeCompare(b.uid),
      render: (text) => <Text code style={{ fontSize: '11.5px' }}>{text}</Text>
    },
    {
      title: 'Seat ID',
      dataIndex: 'seatId',
      key: 'seatId',
      sorter: (a, b) => a.seatId.localeCompare(b.seatId),
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Area / Level',
      dataIndex: 'area',
      key: 'area'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
        { text: 'Faulty', value: 'Faulty' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>
    },
    {
      title: 'Date Registered',
      dataIndex: 'dateRegistered',
      key: 'dateRegistered',
      sorter: (a, b) => a.dateRegistered.localeCompare(b.dateRegistered)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" size="small" icon={<SwapOutlined />} onClick={() => openReassignModal(record)} style={{ padding: 0 }}>
          Reassign Seat
        </Button>
      )
    }
  ];

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('UTM Library — NFC Tag Registration Log', 14, 16);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [['UID', 'Seat ID', 'Status', 'Date Registered']],
      body: nfcTags.map(t => [t.uid, t.seatId, t.status, t.dateRegistered])
    });

    doc.save(`nfc-tag-log-${new Date().toISOString().split('T')[0]}.pdf`);
    message.success('NFC tag log exported as PDF.');
  };

  return (
    <div className="fade-in-view">
      <Card className="premium-card" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Title level={4} style={{ margin: 0 }}><TagsOutlined /> NFC Tags</Title>
            <Text type="secondary">Registered tag inventory (view only — new tags are provisioned from the mobile app). Reassign a tag if it's moved to a different chair or a seat is renumbered.</Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space wrap style={{ justifyContent: 'flex-end' }}>
              <Input
                placeholder="Search UID / Seat ID..."
                prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
                value={nfcSearch}
                onChange={(e) => setNfcSearch(e.target.value)}
                style={{ width: 200 }}
                allowClear
              />
              <Select
                value={nfcAreaFilter}
                onChange={setNfcAreaFilter}
                style={{ width: 220 }}
                options={AREAS_LIST.map(a => ({ value: a, label: a }))}
              />
              <Select
                value={nfcStatusFilter}
                onChange={setNfcStatusFilter}
                style={{ width: 140 }}
                options={[
                  { value: 'All', label: 'All Status' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Faulty', label: 'Faulty' }
                ]}
              />
              <Button icon={<FilePdfOutlined />} onClick={handleExportPdf}>
                Export Tag Log
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="premium-card" bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredTags}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Reassign Seat Modal */}
      <Modal
        title={reassignModalTag ? `🔄 Reassign Tag ${reassignModalTag.uid}` : ''}
        open={!!reassignModalTag}
        onCancel={() => setReassignModalTag(null)}
        footer={null}
        destroyOnClose
      >
        {reassignModalTag && (
          <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Currently mapped to:</div>
            <Text strong style={{ fontSize: '14.5px' }}>{reassignModalTag.seatId}</Text>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: 4 }}>{reassignModalTag.area}</div>
          </div>
        )}

        <Form form={reassignForm} layout="vertical" onFinish={submitReassign}>
          <Form.Item
            name="seatId"
            label="New Seat ID"
            rules={[{ required: true, message: 'Please input the new seat ID!' }]}
          >
            <Input placeholder="e.g. L1-S02" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setReassignModalTag(null)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save Reassignment</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

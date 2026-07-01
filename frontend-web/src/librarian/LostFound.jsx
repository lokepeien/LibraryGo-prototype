import React, { useState } from 'react';
import { Card, Row, Col, Space, Select, Button, Tag, Avatar, Typography, Divider, Modal, Form, Input, Upload, message } from 'antd';
import { InboxOutlined, PlusOutlined, EnvironmentOutlined, CalendarOutlined, CheckCircleOutlined, UploadOutlined, UndoOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function LostFound({
  screens,
  lostFound,
  lostFoundFilter,
  setLostFoundFilter,
  isLostFoundModalVisible,
  setIsLostFoundModalVisible,
  lostFoundForm,
  handleAddLostFound,
  isClaimModalVisible,
  setIsClaimModalVisible,
  selectedLostItem,
  setSelectedLostItem,
  claimForm,
  showClaimModal,
  handleClaimItem,
  handleMarkUnclaimed
}) {
  const [photoDataUrl, setPhotoDataUrl] = useState(null);

  // Catalog item cards
  const filteredLost = lostFoundFilter === 'All'
    ? lostFound
    : lostFound.filter(item => item.status === lostFoundFilter);

  const beforePhotoUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Only image files can be uploaded.');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result);
    reader.readAsDataURL(file);
    return false;
  };

  const submitFoundItem = (values) => {
    handleAddLostFound(values, photoDataUrl);
    setPhotoDataUrl(null);
  };

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
                  {item.photo ? (
                    <Avatar shape="square" size={48} src={item.photo} />
                  ) : (
                    <Avatar shape="square" size={48} style={{ backgroundColor: '#f1f5f9', color: '#1677ff' }} icon={<InboxOutlined />} />
                  )}
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
                  <>
                    <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #dcfce7', fontSize: '12.5px', marginBottom: 10 }}>
                      <div style={{ color: '#166534', fontWeight: 600 }}>Claimed by: {item.claimedBy}</div>
                      <div style={{ color: '#15803d', fontSize: '11px' }}>Claim Date: {item.claimDate}</div>
                    </div>
                    <Button
                      block
                      icon={<UndoOutlined />}
                      onClick={() => handleMarkUnclaimed(item.id)}
                    >
                      Revert to Unclaimed
                    </Button>
                  </>
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
        open={isLostFoundModalVisible}
        onCancel={() => {
          setIsLostFoundModalVisible(false);
          lostFoundForm.resetFields();
          setPhotoDataUrl(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={lostFoundForm}
          layout="vertical"
          onFinish={submitFoundItem}
        >
          <Form.Item label="Item Photo (optional)">
            {photoDataUrl ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
                <img src={photoDataUrl} alt="Found item" style={{ width: '100%', height: 140, objectFit: 'contain', display: 'block', marginBottom: 8 }} />
                <Button size="small" danger onClick={() => setPhotoDataUrl(null)}>Remove Photo</Button>
              </div>
            ) : (
              <Upload.Dragger showUploadList={false} beforeUpload={beforePhotoUpload} accept="image/*" style={{ padding: '12px 8px' }}>
                <UploadOutlined style={{ fontSize: '20px', color: '#94a3b8' }} />
                <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: 4 }}>Click or drag an image to upload</div>
              </Upload.Dragger>
            )}
          </Form.Item>

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
        open={isClaimModalVisible}
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
}

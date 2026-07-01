import React, { useState } from 'react';
import { Card, Row, Col, Space, Tag, Switch, Button, Upload, Typography, Modal, Input, Form, TimePicker, Checkbox, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import {
  EnvironmentOutlined,
  UploadOutlined,
  DeleteOutlined,
  SettingOutlined,
  PlusOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = TimePicker;

const DURATION_OPTIONS = ['30 Minutes', '1 Hour', '2 Hours (Max)'];

// Reads a locally selected image file and hands the caller a data URL for preview (no backend upload)
function readImageAsDataUrl(file, onLoaded) {
  const reader = new FileReader();
  reader.onload = () => onLoaded(reader.result);
  reader.readAsDataURL(file);
}

function ImageSlot({ title, image, fileName, onUpload, onDelete }) {
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Only image files can be uploaded.');
      return Upload.LIST_IGNORE;
    }
    readImageAsDataUrl(file, (dataUrl) => onUpload(dataUrl, file.name));
    return false;
  };

  return (
    <div>
      <Text strong style={{ fontSize: '12.5px', color: '#475569', display: 'block', marginBottom: 8 }}>{title}</Text>
      {image ? (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
          <img src={image} alt={title} style={{ width: '100%', height: 140, objectFit: 'contain', display: 'block', marginBottom: 8 }} />
          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: 8 }} ellipsis={{ tooltip: fileName }}>{fileName}</Text>
          <Space>
            <Upload showUploadList={false} beforeUpload={beforeUpload} accept="image/*">
              <Button size="small" icon={<UploadOutlined />}>Replace</Button>
            </Upload>
            <Button size="small" danger icon={<DeleteOutlined />} onClick={onDelete}>Delete</Button>
          </Space>
        </div>
      ) : (
        <Upload.Dragger showUploadList={false} beforeUpload={beforeUpload} accept="image/*" style={{ padding: '12px 8px' }}>
          <UploadOutlined style={{ fontSize: '20px', color: '#94a3b8' }} />
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: 4 }}>Click or drag an image to upload</div>
        </Upload.Dragger>
      )}
    </div>
  );
}

export default function FloorPlan({
  floorPlans,
  handleUploadFloorPlanImage,
  handleDeleteFloorPlanImage,
  handleUploadSeatPlanImage,
  handleDeleteSeatPlanImage,
  handleToggleAreaActive,
  handleAddArea,
  handleDeleteArea,
  handleUpdateLibrarySettings
}) {
  const [settingsForId, setSettingsForId] = useState(null);
  const [settingsForm] = Form.useForm();
  const [isAddAreaModalVisible, setIsAddAreaModalVisible] = useState(false);
  const [addAreaForm] = Form.useForm();

  const settingsPlan = floorPlans.find(fp => fp.id === settingsForId);

  const openSettings = (fp) => {
    setSettingsForId(fp.id);
    settingsForm.setFieldsValue({
      area: fp.area,
      operatingHours: [dayjs(fp.operatingHours[0], 'HH:mm'), dayjs(fp.operatingHours[1], 'HH:mm')],
      allowedDurations: fp.allowedDurations
    });
  };

  const closeSettings = () => {
    setSettingsForId(null);
    settingsForm.resetFields();
  };

  const saveSettings = (values) => {
    handleUpdateLibrarySettings(settingsForId, {
      area: values.area,
      operatingHours: [values.operatingHours[0].format('HH:mm'), values.operatingHours[1].format('HH:mm')],
      allowedDurations: values.allowedDurations
    });
    closeSettings();
  };

  const saveNewArea = (values) => {
    handleAddArea(values.name);
    setIsAddAreaModalVisible(false);
    addAreaForm.resetFields();
  };

  return (
    <div className="fade-in-view">
      <Card className="premium-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>🗺️ Floor Plan</Title>
            <Text type="secondary">Upload floor plan / seat plan images, manage library settings, and toggle area availability for holidays or closures.</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddAreaModalVisible(true)}>
            Add Area
          </Button>
        </div>
      </Card>

      {floorPlans.map(fp => (
        <Card
          key={fp.id}
          title={
            <Space>
              <EnvironmentOutlined style={{ color: '#1677ff' }} />
              <span style={{ fontWeight: 600 }}>{fp.area}</span>
            </Space>
          }
          extra={
            <Space>
              <Tag color={fp.active ? 'green' : 'red'}>{fp.active ? 'Active' : 'Closed'}</Tag>
              <Switch
                checked={fp.active}
                checkedChildren="Open"
                unCheckedChildren="Closed"
                onChange={() => handleToggleAreaActive(fp.id)}
              />
              <Popconfirm
                title={`Delete "${fp.area}"?`}
                description="This removes the area and its uploaded plans."
                onConfirm={() => handleDeleteArea(fp.id)}
                okText="Delete"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          }
          className="premium-card"
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <ImageSlot
                title="🏢 Floor Plan Image"
                image={fp.floorPlanImage}
                fileName={fp.floorPlanFileName}
                onUpload={(dataUrl, name) => handleUploadFloorPlanImage(fp.id, dataUrl, name)}
                onDelete={() => handleDeleteFloorPlanImage(fp.id)}
              />
            </Col>
            <Col xs={24} md={12}>
              <ImageSlot
                title="💺 Seat Plan Image"
                image={fp.seatPlanImage}
                fileName={fp.seatPlanFileName}
                onUpload={(dataUrl, name) => handleUploadSeatPlanImage(fp.id, dataUrl, name)}
                onDelete={() => handleDeleteSeatPlanImage(fp.id)}
              />
            </Col>
          </Row>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <Button type="primary" icon={<SettingOutlined />} onClick={() => openSettings(fp)}>
              Library Settings
            </Button>

            <Space wrap>
              <Tag icon={<ClockCircleOutlined />}>{fp.operatingHours[0]} – {fp.operatingHours[1]}</Tag>
              {fp.allowedDurations.map(d => <Tag key={d} color="blue">{d}</Tag>)}
            </Space>
          </div>
        </Card>
      ))}

      {/* Library Settings Modal */}
      <Modal
        title={settingsPlan ? `⚙️ Library Settings — ${settingsPlan.area}` : ''}
        open={!!settingsForId}
        onCancel={closeSettings}
        footer={null}
        destroyOnClose
      >
        <Form form={settingsForm} layout="vertical" onFinish={saveSettings}>
          <Form.Item
            name="area"
            label="Area Name"
            rules={[{ required: true, message: 'Please enter the area name!' }]}
          >
            <Input placeholder="e.g. Level 1: Collaborative Zone" />
          </Form.Item>

          <Form.Item
            name="operatingHours"
            label="Operating Hours"
            rules={[{ required: true, message: 'Please select the operating hours!' }]}
          >
            <RangePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="allowedDurations"
            label="Allowed Booking Durations"
            rules={[{ required: true, message: 'Please select at least one duration!' }]}
          >
            <Checkbox.Group options={DURATION_OPTIONS} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeSettings}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save Settings</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Area Modal */}
      <Modal
        title="➕ Add New Area"
        open={isAddAreaModalVisible}
        onCancel={() => setIsAddAreaModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={addAreaForm} layout="vertical" onFinish={saveNewArea}>
          <Form.Item
            name="name"
            label="Area Name"
            rules={[{ required: true, message: 'Please enter the new area name!' }]}
          >
            <Input placeholder="e.g. Level 4: Rare Books Collection" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsAddAreaModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create Area</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Card, Row, Col, Space, Tag, Switch, Button, Upload, Typography, Modal, Input, Empty, Tooltip, message } from 'antd';
import {
  EnvironmentOutlined,
  UploadOutlined,
  DeleteOutlined,
  AimOutlined,
  CloseCircleFilled
} from '@ant-design/icons';

const { Title, Text } = Typography;

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
  handleAddSeatMarker,
  handleRemoveSeatMarker
}) {
  const [markingArea, setMarkingArea] = useState(null);
  const [pendingClick, setPendingClick] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const imageContainerRef = useRef(null);

  const markingPlan = floorPlans.find(fp => fp.area === markingArea);

  const closeMarkModal = () => {
    setMarkingArea(null);
    setPendingClick(null);
    setLabelInput('');
  };

  const handleImageClick = (e) => {
    const rect = imageContainerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingClick({ xPct, yPct });
    setLabelInput('');
  };

  const confirmMarker = () => {
    if (!labelInput.trim()) {
      message.error('Please enter a seat ID for this marker.');
      return;
    }
    handleAddSeatMarker(markingArea, {
      id: `${Date.now()}`,
      label: labelInput.trim(),
      xPct: pendingClick.xPct,
      yPct: pendingClick.yPct
    });
    setPendingClick(null);
    setLabelInput('');
  };

  return (
    <div className="fade-in-view">
      <Card className="premium-card" style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>🗺️ Floor Plan</Title>
        <Text type="secondary">Upload and manage floor plan / seat plan images per area and level, mark seat positions, and toggle area availability for holidays or closures.</Text>
      </Card>

      {floorPlans.map(fp => (
        <Card
          key={fp.area}
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
                onChange={() => handleToggleAreaActive(fp.area)}
              />
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
                onUpload={(dataUrl, name) => handleUploadFloorPlanImage(fp.area, dataUrl, name)}
                onDelete={() => handleDeleteFloorPlanImage(fp.area)}
              />
            </Col>
            <Col xs={24} md={12}>
              <ImageSlot
                title="💺 Seat Plan Image"
                image={fp.seatPlanImage}
                fileName={fp.seatPlanFileName}
                onUpload={(dataUrl, name) => handleUploadSeatPlanImage(fp.area, dataUrl, name)}
                onDelete={() => handleDeleteSeatPlanImage(fp.area)}
              />
            </Col>
          </Row>

          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <Button
              type="primary"
              icon={<AimOutlined />}
              disabled={!fp.seatPlanImage}
              onClick={() => setMarkingArea(fp.area)}
            >
              Mark Seat Positions
            </Button>

            <Space wrap>
              {fp.seatMarkers.map(marker => (
                <Tag key={marker.id} closable onClose={() => handleRemoveSeatMarker(fp.area, marker.id)}>
                  {marker.label}
                </Tag>
              ))}
              {fp.seatMarkers.length === 0 && (
                <Text type="secondary" style={{ fontSize: '11.5px' }}>No seats marked yet.</Text>
              )}
            </Space>
          </div>
        </Card>
      ))}

      {/* Mark Seat Positions Modal */}
      <Modal
        title={markingArea ? `📍 Mark Seat Positions — ${markingArea}` : ''}
        open={!!markingArea}
        onCancel={closeMarkModal}
        footer={[<Button key="done" type="primary" onClick={closeMarkModal}>Done</Button>]}
        width={640}
        destroyOnClose
      >
        {markingPlan && markingPlan.seatPlanImage ? (
          <>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 10 }}>
              Click anywhere on the plan to drop a seat marker, then enter its seat ID.
            </Text>
            <div
              ref={imageContainerRef}
              onClick={pendingClick ? undefined : handleImageClick}
              style={{ position: 'relative', cursor: pendingClick ? 'default' : 'crosshair', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}
            >
              <img src={markingPlan.seatPlanImage} alt="Seat Plan" style={{ width: '100%', display: 'block' }} draggable={false} />

              {markingPlan.seatMarkers.map(marker => (
                <Tooltip key={marker.id} title={marker.label}>
                  <div
                    style={{
                      position: 'absolute',
                      left: `${marker.xPct}%`,
                      top: `${marker.yPct}%`,
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#1677ff', border: '2px solid #ffffff', boxShadow: '0 0 0 1px #1677ff' }} />
                    <CloseCircleFilled
                      style={{ color: '#ff4d4f', fontSize: '12px', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveSeatMarker(markingArea, marker.id); }}
                    />
                  </div>
                </Tooltip>
              ))}

              {pendingClick && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${pendingClick.xPct}%`,
                    top: `${pendingClick.yPct}%`,
                    transform: 'translate(-50%, -50%)',
                    background: '#ffffff',
                    border: '1px solid #1677ff',
                    borderRadius: 8,
                    padding: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    gap: 4
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    size="small"
                    placeholder="Seat ID"
                    autoFocus
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onPressEnter={confirmMarker}
                    style={{ width: 100 }}
                  />
                  <Button size="small" type="primary" onClick={confirmMarker}>Add</Button>
                  <Button size="small" onClick={() => setPendingClick(null)}>✕</Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Empty description="Upload a seat plan image first." />
        )}
      </Modal>
    </div>
  );
}

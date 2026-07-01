import React, { useState } from 'react';
import { Card, Button, Select, Tag, Typography, Modal, Spin, Space, Tooltip, message } from 'antd';
import { ScanOutlined, MobileOutlined, DeleteOutlined, PoweroffOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SEAT_OPTIONS = [
  'L1-S01', 'L1-S02', 'L1-S03', 'L1-S04', 'L1-S05', 'L1-S06',
  'L2-S01', 'L2-S02', 'L2-S03', 'L2-S04', 'L2-S05', 'L2-S06',
  'L3-S01', 'L3-S02', 'L3-S03', 'L3-S04',
  'GF-S01', 'GF-S02', 'GF-S03', 'GF-S04'
];

const generateMockUid = () => {
  const bytes = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase());
  return `04:${bytes.join(':')}`;
};

export default function AdminDashboard({ student, handleToggleRole }) {
  // Registry of NFC Tag UID <-> Seat ID mappings (mock provisioning database)
  const [mappings, setMappings] = useState([
    { key: '1', seatId: 'L2-S04', nfcUid: '04:E3:4C:6A:B2:1A:80' },
    { key: '2', seatId: 'L1-S02', nfcUid: '04:5C:8B:1A:F5:2C:81' },
    { key: '3', seatId: 'L3-S02', nfcUid: '04:AB:CD:EF:01:23:45' },
    { key: '4', seatId: 'GF-S03', nfcUid: '04:11:22:33:44:55:66' }
  ]);

  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedUid, setScannedUid] = useState(null);
  const [seatToMap, setSeatToMap] = useState(undefined);

  const openScanModal = () => {
    setScannedUid(null);
    setSeatToMap(undefined);
    setScanModalVisible(true);
  };

  const handleScanTag = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedUid(generateMockUid());
      message.success('📡 NFC Tag detected!');
    }, 1200);
  };

  const handleSaveMapping = () => {
    if (!scannedUid || !seatToMap) {
      message.error('Please scan a tag and select a seat before saving.');
      return;
    }

    const replacingExisting = mappings.some(m => m.seatId === seatToMap);
    setMappings(prev => [
      { key: String(Date.now()), seatId: seatToMap, nfcUid: scannedUid },
      ...prev.filter(m => m.seatId !== seatToMap)
    ]);

    message.success(`✅ Mapped NFC Tag to Seat ${seatToMap}${replacingExisting ? ' (replaced previous mapping)' : ''}.`);
    setScanModalVisible(false);
  };

  const handleRemoveMapping = (key) => {
    setMappings(prev => prev.filter(m => m.key !== key));
    message.info('Mapping removed.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Admin Greeting Banner */}
      <div className="mobile-header-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Space align="center" size={6}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: 600 }}>UTM SEAT COMPANION</Text>
              <Tag color="gold" style={{ fontSize: '9px', lineHeight: '14px', padding: '0 5px', margin: 0 }}>🛠️ Admin</Tag>
            </Space>
            <Title level={4} style={{ margin: 0, color: '#ffffff', fontWeight: 700, fontSize: '18px' }}>
              Hi, {student.name} 👋
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11.5px', fontFamily: 'monospace' }}>
              {student.domain}
            </Text>
          </div>
          <Tooltip title="Logout & switch to Student">
            <Button
              type="text"
              shape="circle"
              icon={<PoweroffOutlined style={{ color: '#fff', fontSize: '16px' }} />}
              onClick={handleToggleRole}
            />
          </Tooltip>
        </div>
      </div>

      <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
        {/* Intro Card */}
        <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
          <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>
            📡 NFC Tag ↔ Seat Provisioning
          </Title>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            Scan a desk's physical NFC tag and bind its hardware UID to a library seat ID.
          </Text>
        </Card>

        {/* Scan Trigger */}
        <Card className="mobile-card" bodyStyle={{ padding: 16 }}>
          <Button type="primary" size="large" block icon={<ScanOutlined />} onClick={openScanModal}>
            Scan New NFC Tag
          </Button>
        </Card>

        {/* Registered Mappings List */}
        <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
          <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 10 }}>
            🗂️ Registered Tag Mappings ({mappings.length})
          </Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mappings.map(m => (
              <div
                key={m.key}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px' }}
              >
                <div>
                  <Text strong style={{ fontSize: '13px' }}>{m.seatId}</Text>
                  <div style={{ fontSize: '10.5px', color: '#64748b', fontFamily: 'monospace' }}>{m.nfcUid}</div>
                </div>
                <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemoveMapping(m.key)} />
              </div>
            ))}
            {mappings.length === 0 && (
              <Text type="secondary" style={{ fontSize: '11.5px', textAlign: 'center', padding: '12px 0' }}>
                No tags registered yet.
              </Text>
            )}
          </div>
        </Card>
      </div>

      {/* Scan & Map Modal */}
      <Modal
        title="📡 Scan & Map NFC Tag"
        visible={scanModalVisible}
        onCancel={() => setScanModalVisible(false)}
        footer={null}
        width={320}
        centered
        destroyOnClose
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <MobileOutlined style={{ fontSize: '40px', color: '#1677ff', marginBottom: 10 }} />
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 16 }}>
            Tap the desk's physical NFC tag against the device to read its hardware UID.
          </Text>

          <div
            className={`nfc-tap-scanner ${scanning ? 'scanning' : ''}`}
            onClick={!scannedUid ? handleScanTag : undefined}
            style={{ cursor: scannedUid ? 'default' : 'pointer' }}
          >
            {scanning ? (
              <Spin size="large" />
            ) : scannedUid ? (
              <>
                <ScanOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: 4 }} />
                <Text strong style={{ fontSize: '10px', color: '#52c41a', fontFamily: 'monospace' }}>{scannedUid}</Text>
              </>
            ) : (
              <>
                <ScanOutlined style={{ fontSize: '28px', color: '#1677ff', marginBottom: 6 }} />
                <Text strong style={{ fontSize: '11px', color: '#1677ff' }}>TAP TO SCAN TAG</Text>
              </>
            )}
          </div>

          {scannedUid && (
            <div style={{ marginTop: 18, textAlign: 'left' }}>
              <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
                🪑 Map to Seat ID:
              </Text>
              <Select
                value={seatToMap}
                onChange={(val) => setSeatToMap(val)}
                placeholder="Select a seat..."
                style={{ width: '100%' }}
                options={SEAT_OPTIONS.map(s => ({ value: s, label: s }))}
              />
              <Button type="primary" block style={{ marginTop: 14 }} onClick={handleSaveMapping}>
                Save Mapping
              </Button>
              <Button type="link" block size="small" style={{ marginTop: 4 }} onClick={handleScanTag}>
                Re-scan Tag
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

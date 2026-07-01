import React, { useState } from 'react';
import { Card, Input, Button, Select, message, Typography } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SubmitComplaint({ student }) {
  const [seatId, setSeatId] = useState('');
  const [category, setCategory] = useState('Air Conditioning');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (student.strikes >= 5) {
      message.error('⛔ Action Denied: Account suspended.');
      return;
    }
    if (!seatId) {
      message.error('Please specify the Seat or Desk ID!');
      return;
    }
    if (!details) {
      message.error('Please describe the facility issue!');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      message.success(`🛠️ Facility complaint logged under CMP-2026-${Math.floor(100 + Math.random() * 900)}! Maintenance notified.`);
      setSeatId('');
      setDetails('');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in-view">
      <Card className="mobile-card" bodyStyle={{ padding: 12 }}>
        <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>
          🛠️ Report Facility Issue
        </Title>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          Notice something broken or malfunctioning? Lodge a report instantly for immediate action.
        </Text>
      </Card>

      <Card className="mobile-card" bodyStyle={{ padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Seat ID input */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              🪑 Desk / Seat ID:
            </Text>
            <Input
              value={seatId}
              onChange={(e) => setSeatId(e.target.value)}
              placeholder="e.g. L2-S04"
              style={{ width: '100%' }}
            />
          </div>

          {/* Issue Category selector */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              📁 Issue Category:
            </Text>
            <Select
              value={category}
              onChange={(val) => setCategory(val)}
              style={{ width: '100%' }}
              options={[
                { value: 'Air Conditioning', label: 'Air Conditioning Leak / Temperature' },
                { value: 'Power Socket Broken', label: 'Power Socket Broken' },
                { value: 'Damaged Furniture', label: 'Broken Chair / Desk Wobble' },
                { value: 'Wi-Fi Unstable', label: 'UTM Wifi Connectivity Drop' }
              ]}
            />
          </div>

          {/* Details input */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              📝 Describe the Problem:
            </Text>
            <Input.TextArea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain what is wrong (e.g. socket has sparks / AC is leaking condensation water)"
              rows={4}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>

          {/* Submit Trigger button */}
          <Button
            type="primary"
            danger
            size="large"
            block
            loading={submitting}
            icon={<AlertOutlined />}
            onClick={handleSubmit}
            style={{ marginTop: 8 }}
          >
            Submit Issue Report
          </Button>
        </div>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, Input, Button, Select, message, Typography } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Persists across component remounts (tab switches) within the session so IDs keep incrementing
let complaintIdCounter = 1;
const formatComplaintId = (n) => `CMP-2026-${String(n).padStart(3, '0')}`;

export default function SubmitComplaint({ student }) {
  const [complaintId, setComplaintId] = useState(() => formatComplaintId(complaintIdCounter));
  const [category, setCategory] = useState('Air Conditioning');
  const [otherCategory, setOtherCategory] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (student.strikes >= 5) {
      message.error('⛔ Action Denied: Account suspended.');
      return;
    }
    if (category === 'Other' && !otherCategory) {
      message.error('Please specify the issue category!');
      return;
    }
    if (!details) {
      message.error('Please describe the facility issue!');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      message.success(`🛠️ Facility complaint logged under ${complaintId}! Maintenance notified.`);
      setDetails('');
      setCategory('Air Conditioning');
      setOtherCategory('');
      complaintIdCounter += 1;
      setComplaintId(formatComplaintId(complaintIdCounter));
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
          {/* Complaint ID display */}
          <div>
            <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
              🔢 Complaint ID:
            </Text>
            <Input value={complaintId} disabled style={{ width: '100%' }} />
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
                { value: 'Wi-Fi Unstable', label: 'UTM Wifi Connectivity Drop' },
                { value: 'Other', label: 'Other' }
              ]}
            />
          </div>

          {/* Other category input, only shown when "Other" is selected */}
          {category === 'Other' && (
            <div>
              <Text strong style={{ fontSize: '12px', color: '#475569', display: 'block', marginBottom: 6 }}>
                ✏️ Specify Category:
              </Text>
              <Input
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                placeholder="e.g. Lighting flickering"
                style={{ width: '100%' }}
              />
            </div>
          )}

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

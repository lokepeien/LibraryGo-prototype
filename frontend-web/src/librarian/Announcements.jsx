import React from 'react';
import { Card, List, Tag, Button, Space, Modal, Form, Input, DatePicker, Typography, Popconfirm, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, NotificationOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

function getAnnouncementStatus(announcement) {
  const today = dayjs().startOf('day');
  if (!announcement.startDate && !announcement.endDate) return 'Active';
  if (announcement.startDate && today.isBefore(dayjs(announcement.startDate), 'day')) return 'Scheduled';
  if (announcement.endDate && today.isAfter(dayjs(announcement.endDate), 'day')) return 'Expired';
  return 'Active';
}

const STATUS_TAG_COLOR = { Active: 'green', Scheduled: 'blue', Expired: 'default' };

function AnnouncementList({ items, emptyText, showEditAnnouncementModal, handleDeleteAnnouncement }) {
  if (items.length === 0) {
    return <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '24px 0' }} />;
  }

  return (
    <List
      itemLayout="vertical"
      dataSource={items}
      renderItem={(item) => {
        const status = getAnnouncementStatus(item);
        return (
          <List.Item
            key={item.key}
            actions={[
              <Button key="edit" type="link" size="small" icon={<EditOutlined />} onClick={() => showEditAnnouncementModal(item)}>
                Edit
              </Button>,
              <Popconfirm
                key="delete"
                title="Delete this announcement?"
                onConfirm={() => handleDeleteAnnouncement(item.key)}
                okText="Delete"
                okButtonProps={{ danger: true }}
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>Delete</Button>
              </Popconfirm>
            ]}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <Text strong style={{ fontSize: '14.5px' }}>{item.title}</Text>
              <Space size={6}>
                <Tag color={STATUS_TAG_COLOR[status]}>{status}</Tag>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {item.startDate && item.endDate ? `${item.startDate} → ${item.endDate}` : 'Always displayed'}
                </Text>
              </Space>
            </div>
            <Paragraph style={{ margin: '6px 0 0 0', fontSize: '12.5px', color: '#475569' }}>
              {item.body}
            </Paragraph>
            <Text type="secondary" style={{ fontSize: '10.5px' }}>Created {item.createdAt}</Text>
          </List.Item>
        );
      }}
    />
  );
}

export default function Announcements({
  announcements,
  isAnnouncementModalVisible,
  setIsAnnouncementModalVisible,
  editingAnnouncement,
  announcementForm,
  showAddAnnouncementModal,
  showEditAnnouncementModal,
  handleSaveAnnouncement,
  handleDeleteAnnouncement
}) {
  const activeAndScheduled = announcements.filter(a => getAnnouncementStatus(a) !== 'Expired');
  const past = announcements.filter(a => getAnnouncementStatus(a) === 'Expired');

  return (
    <div className="fade-in-view">
      <Card className="premium-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}><NotificationOutlined /> Announcements</Title>
            <Text type="secondary">Create and manage system notices shown to students, with an optional date range for display.</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddAnnouncementModal}>
            New Announcement
          </Button>
        </div>
      </Card>

      <Card className="premium-card" title="📌 Active & Scheduled" style={{ marginBottom: 24 }}>
        <AnnouncementList
          items={activeAndScheduled}
          emptyText="No active or scheduled announcements."
          showEditAnnouncementModal={showEditAnnouncementModal}
          handleDeleteAnnouncement={handleDeleteAnnouncement}
        />
      </Card>

      <Card className="premium-card" title="🗄️ Past Announcements">
        <AnnouncementList
          items={past}
          emptyText="No past announcements."
          showEditAnnouncementModal={showEditAnnouncementModal}
          handleDeleteAnnouncement={handleDeleteAnnouncement}
        />
      </Card>

      {/* Modal to Create/Edit Announcement */}
      <Modal
        title={editingAnnouncement ? '✏️ Edit Announcement' : '📢 New Announcement'}
        open={isAnnouncementModalVisible}
        onCancel={() => setIsAnnouncementModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={announcementForm} layout="vertical" onFinish={handleSaveAnnouncement}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title!' }]}
          >
            <Input placeholder="e.g. Level 2 Air Conditioning Repair" />
          </Form.Item>

          <Form.Item
            name="body"
            label="Body"
            rules={[{ required: true, message: 'Please enter the announcement body!' }]}
          >
            <Input.TextArea rows={4} placeholder="Full announcement details shown to students" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Display Date Range (optional)"
            extra="Leave empty to keep this announcement always displayed."
          >
            <RangePicker style={{ width: '100%' }} allowClear />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsAnnouncementModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingAnnouncement ? 'Save Changes' : 'Publish'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

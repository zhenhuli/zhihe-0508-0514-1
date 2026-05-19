import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, DatePicker, InputNumber, Select, Card, Row, Col, Statistic, Alert, Tag, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BellOutlined, DashboardOutlined, CarOutlined, ToolOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const defaultMaintenanceItems = [
  { id: 1, name: '轮胎充气', cycleDays: 30, cycleKm: 500, lastDate: dayjs().subtract(25, 'day').format('YYYY-MM-DD'), lastKm: 450, notes: '检查胎压' },
  { id: 2, name: '链条润滑', cycleDays: 15, cycleKm: 200, lastDate: dayjs().subtract(10, 'day').format('YYYY-MM-DD'), lastKm: 180, notes: '使用专用润滑油' },
  { id: 3, name: '刹车检查', cycleDays: 30, cycleKm: 300, lastDate: dayjs().subtract(35, 'day').format('YYYY-MM-DD'), lastKm: 320, notes: '检查刹车片磨损' },
  { id: 4, name: '电池检查', cycleDays: 60, cycleKm: 1000, lastDate: dayjs().subtract(50, 'day').format('YYYY-MM-DD'), lastKm: 900, notes: '检查电池健康度' },
];

const defaultParts = [
  { id: 1, name: '前轮轮胎', replaceCycleDays: 180, replaceCycleKm: 5000, lastReplaceDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'), lastReplaceKm: 4800 },
  { id: 2, name: '后轮轮胎', replaceCycleDays: 180, replaceCycleKm: 5000, lastReplaceDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'), lastReplaceKm: 4800 },
  { id: 3, name: '刹车片', replaceCycleDays: 90, replaceCycleKm: 3000, lastReplaceDate: dayjs().subtract(4, 'month').format('YYYY-MM-DD'), lastReplaceKm: 3200 },
  { id: 4, name: '链条', replaceCycleDays: 365, replaceCycleKm: 8000, lastReplaceDate: dayjs().subtract(12, 'month').format('YYYY-MM-DD'), lastReplaceKm: 7500 },
];

const defaultRides = [
  { id: 1, date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), distance: 15.5, duration: 45, notes: '通勤' },
  { id: 2, date: dayjs().subtract(2, 'day').format('YYYY-MM-DD'), distance: 20.3, duration: 60, notes: '周末骑行' },
  { id: 3, date: dayjs().subtract(3, 'day').format('YYYY-MM-DD'), distance: 12.0, duration: 35, notes: '通勤' },
];

const App = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [maintenanceItems, setMaintenanceItems] = useState(defaultMaintenanceItems);
  const [parts, setParts] = useState(defaultParts);
  const [rides, setRides] = useState(defaultRides);
  const [totalKm, setTotalKm] = useState(8200);

  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [partsModalVisible, setPartsModalVisible] = useState(false);
  const [rideModalVisible, setRideModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [partsForm] = Form.useForm();
  const [rideForm] = Form.useForm();

  const getMaintenanceStatus = (item) => {
    const daysSinceLast = dayjs().diff(dayjs(item.lastDate), 'day');
    const kmSinceLast = totalKm - item.lastKm;
    const daysOverdue = daysSinceLast - item.cycleDays;
    const kmOverdue = kmSinceLast - item.cycleKm;

    let status, text, color, days;

    if (daysOverdue > 0 || kmOverdue > 0) {
      status = 'overdue';
      text = '已过期';
      color = 'red';
      days = Math.max(daysOverdue, Math.ceil(kmOverdue / 10));
    } else {
      const daysRemaining = item.cycleDays - daysSinceLast;
      const kmRemaining = item.cycleKm - kmSinceLast;
      const kmDaysRemaining = Math.ceil(kmRemaining / 10);
      days = Math.min(daysRemaining, kmDaysRemaining);
      
      if (days <= 7) {
        status = 'soon';
        text = '即将到期';
        color = 'orange';
      } else {
        status = 'normal';
        text = '正常';
        color = 'green';
      }
    }

    return { status, text, color, days, daysSinceLast, kmSinceLast };
  };

  const getPartStatus = (part) => {
    const daysSinceLast = dayjs().diff(dayjs(part.lastReplaceDate), 'day');
    const kmUsed = totalKm - part.lastReplaceKm;
    const daysOverdue = daysSinceLast - part.replaceCycleDays;
    const kmOverdue = kmUsed - part.replaceCycleKm;

    let status, text, color, remaining;

    if (daysOverdue > 0 || kmOverdue > 0) {
      status = 'overdue';
      text = '需更换';
      color = 'red';
      remaining = Math.min(daysOverdue, kmOverdue);
    } else {
      const daysRemaining = part.replaceCycleDays - daysSinceLast;
      const kmRemaining = part.replaceCycleKm - kmUsed;
      remaining = Math.min(daysRemaining, Math.ceil(kmRemaining / 10));
      
      if (daysRemaining <= 15 || kmRemaining <= 500) {
        status = 'soon';
        text = '即将更换';
        color = 'orange';
      } else {
        status = 'normal';
        text = '正常';
        color = 'green';
      }
    }

    const percentage = Math.min((kmUsed / part.replaceCycleKm) * 100, 100);
    return { status, text, color, remaining, percentage, daysSinceLast, kmUsed };
  };

  const getAlerts = () => {
    const alerts = [];
    maintenanceItems.forEach(item => {
      const status = getMaintenanceStatus(item);
      if (status.status === 'overdue') {
        alerts.push({ type: 'error', message: `${item.name} 已过期，请及时保养！（已使用 ${status.daysSinceLast}天 / ${status.kmSinceLast}km）` });
      } else if (status.status === 'soon') {
        alerts.push({ type: 'warning', message: `${item.name} 即将需要保养（已使用 ${status.daysSinceLast}天 / ${status.kmSinceLast}km）` });
      }
    });
    parts.forEach(part => {
      const status = getPartStatus(part);
      if (status.status === 'overdue') {
        alerts.push({ type: 'error', message: `${part.name} 已过期，请及时更换！（已使用 ${status.daysSinceLast}天 / ${status.kmUsed}km）` });
      } else if (status.status === 'soon') {
        alerts.push({ type: 'warning', message: `${part.name} 即将需要更换（已使用 ${status.daysSinceLast}天 / ${status.kmUsed}km）` });
      }
    });
    return alerts;
  };

  const alerts = getAlerts();

  const handleAddMaintenance = () => {
    setEditingItem(null);
    form.resetFields();
    setMaintenanceModalVisible(true);
  };

  const handleEditMaintenance = (item) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      lastDate: dayjs(item.lastDate)
    });
    setMaintenanceModalVisible(true);
  };

  const handleDeleteMaintenance = (id) => {
    setMaintenanceItems(maintenanceItems.filter(item => item.id !== id));
    message.success('删除成功');
  };

  const handleMaintenanceSubmit = (values) => {
    if (editingItem) {
      setMaintenanceItems(maintenanceItems.map(item => 
        item.id === editingItem.id ? { ...item, ...values, lastDate: values.lastDate.format('YYYY-MM-DD') } : item
      ));
      message.success('更新成功');
    } else {
      const newItem = {
        id: Date.now(),
        ...values,
        lastDate: values.lastDate.format('YYYY-MM-DD'),
        lastKm: totalKm
      };
      setMaintenanceItems([...maintenanceItems, newItem]);
      message.success('添加成功');
    }
    setMaintenanceModalVisible(false);
  };

  const handleAddPart = () => {
    setEditingItem(null);
    partsForm.resetFields();
    setPartsModalVisible(true);
  };

  const handleEditPart = (part) => {
    setEditingItem(part);
    partsForm.setFieldsValue({
      ...part,
      lastReplaceDate: dayjs(part.lastReplaceDate)
    });
    setPartsModalVisible(true);
  };

  const handleDeletePart = (id) => {
    setParts(parts.filter(part => part.id !== id));
    message.success('删除成功');
  };

  const handlePartSubmit = (values) => {
    if (editingItem) {
      setParts(parts.map(part => 
        part.id === editingItem.id ? { ...part, ...values, lastReplaceDate: values.lastReplaceDate.format('YYYY-MM-DD'), currentKm: totalKm } : part
      ));
      message.success('更新成功');
    } else {
      const newPart = {
        id: Date.now(),
        ...values,
        lastReplaceDate: values.lastReplaceDate.format('YYYY-MM-DD'),
        lastReplaceKm: totalKm,
        currentKm: totalKm
      };
      setParts([...parts, newPart]);
      message.success('添加成功');
    }
    setPartsModalVisible(false);
  };

  const handleAddRide = () => {
    rideForm.resetFields();
    setRideModalVisible(true);
  };

  const handleRideSubmit = (values) => {
    const newRide = {
      id: Date.now(),
      ...values,
      date: values.date.format('YYYY-MM-DD')
    };
    setRides([newRide, ...rides]);
    setTotalKm(totalKm + values.distance);
    message.success('添加成功');
    setRideModalVisible(false);
  };

  const maintenanceColumns = [
    { title: '保养项目', dataIndex: 'name', key: 'name' },
    { title: '周期(天)', dataIndex: 'cycleDays', key: 'cycleDays', width: 100 },
    { title: '周期(公里)', dataIndex: 'cycleKm', key: 'cycleKm', width: 100 },
    { title: '上次保养日期', dataIndex: 'lastDate', key: 'lastDate', width: 130 },
    { title: '上次保养里程', dataIndex: 'lastKm', key: 'lastKm', width: 120, render: (text) => `${text} km` },
    { 
      title: '状态', 
      key: 'status', 
      width: 180,
      render: (_, record) => {
        const status = getMaintenanceStatus(record);
        return (
          <div>
            <Tag color={status.color}>{status.text}</Tag>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              已用: {status.daysSinceLast}天 / {status.kmSinceLast}km
            </div>
          </div>
        );
      }
    },
    { title: '备注', dataIndex: 'notes', key: 'notes', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditMaintenance(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteMaintenance(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  const partsColumns = [
    { title: '零件名称', dataIndex: 'name', key: 'name' },
    { title: '更换周期(天)', dataIndex: 'replaceCycleDays', key: 'replaceCycleDays', width: 110 },
    { title: '更换周期(公里)', dataIndex: 'replaceCycleKm', key: 'replaceCycleKm', width: 130 },
    { title: '上次更换日期', dataIndex: 'lastReplaceDate', key: 'lastReplaceDate', width: 120 },
    { title: '上次更换里程', dataIndex: 'lastReplaceKm', key: 'lastReplaceKm', width: 120, render: (text) => `${text} km` },
    { 
      title: '状态', 
      key: 'remaining',
      width: 200, 
      render: (_, record) => {
        const status = getPartStatus(record);
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Tag color={status.color}>{status.text}</Tag>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              已用: {status.daysSinceLast}天 / {status.kmUsed}km
            </div>
            <div style={{ width: '100%', height: 8, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(status.percentage, 100)}%`,
                  background: status.color === 'red' ? '#ff4d4f' : status.color === 'orange' ? '#faad14' : '#52c41a'
                }} 
              />
            </div>
          </div>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPart(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeletePart(record.id)}>删除</Button>
        </Space>
      )
    }
  ];

  const ridesColumns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '骑行距离(公里)', dataIndex: 'distance', key: 'distance', width: 150, render: (text) => `${text} km` },
    { title: '骑行时长(分钟)', dataIndex: 'duration', key: 'duration', width: 150 },
    { title: '备注', dataIndex: 'notes', key: 'notes' }
  ];

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: '总览' },
    { key: 'maintenance', icon: <ToolOutlined />, label: '保养项目' },
    { key: 'parts', icon: <CarOutlined />, label: '零件管理' },
    { key: 'rides', icon: <CalendarOutlined />, label: '骑行记录' }
  ];

  const renderDashboard = () => (
    <div>
      {alerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              message={<Space><BellOutlined />{alert.message}</Space>}
              type={alert.type}
              showIcon
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>
      )}
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总骑行里程" value={totalKm} suffix="km" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待保养项目" value={maintenanceItems.filter(item => getMaintenanceStatus(item).status !== 'normal').length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待更换零件" value={parts.filter(part => getPartStatus(part).status !== 'normal').length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总骑行记录" value={rides.length} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="即将到期的保养" extra={<Button type="primary" size="small" onClick={() => setSelectedKey('maintenance')}>查看全部</Button>}>
            {maintenanceItems.filter(item => getMaintenanceStatus(item).status !== 'normal').length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>所有项目都在正常周期内</p>
            ) : (
              <Table
                dataSource={maintenanceItems.filter(item => getMaintenanceStatus(item).status !== 'normal')}
                columns={[
                  { title: '项目', dataIndex: 'name', key: 'name' },
                  { 
                    title: '状态', 
                    key: 'status', 
                    render: (_, record) => {
                      const status = getMaintenanceStatus(record);
                      return <Tag color={status.color}>{status.text}</Tag>;
                    }
                  }
                ]}
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="即将更换的零件" extra={<Button type="primary" size="small" onClick={() => setSelectedKey('parts')}>查看全部</Button>}>
            {parts.filter(part => getPartStatus(part).status !== 'normal').length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>所有零件都在正常寿命内</p>
            ) : (
              <Table
                dataSource={parts.filter(part => getPartStatus(part).status !== 'normal')}
                columns={[
                  { title: '零件', dataIndex: 'name', key: 'name' },
                  { 
                    title: '状态', 
                    key: 'status', 
                    render: (_, record) => {
                      const status = getPartStatus(record);
                      return <Tag color={status.color}>{status.text}</Tag>;
                    }
                  }
                ]}
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return renderDashboard();
      case 'maintenance':
        return (
          <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMaintenance}>添加保养项目</Button>
            </div>
            <Table columns={maintenanceColumns} dataSource={maintenanceItems} rowKey="id" />
          </div>
        );
      case 'parts':
        return (
          <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPart}>添加零件</Button>
            </div>
            <Table columns={partsColumns} dataSource={parts} rowKey="id" />
          </div>
        );
      case 'rides':
        return (
          <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRide}>添加骑行记录</Button>
            </div>
            <Table columns={ridesColumns} dataSource={rides} rowKey="id" />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={220}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16, borderBottom: '1px solid #f0f0f0' }}>
          <CarOutlined style={{ marginRight: 8 }} />
          非机动车养护系统
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>
            {menuItems.find(item => item.key === selectedKey)?.label}
          </h2>
        </Header>
        <Content style={{ margin: '24px' }}>
          {renderContent()}
        </Content>
      </Layout>

      <Modal
        title={editingItem ? "编辑保养项目" : "添加保养项目"}
        open={maintenanceModalVisible}
        onCancel={() => setMaintenanceModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleMaintenanceSubmit}>
          <Form.Item name="name" label="保养项目名称" rules={[{ required: true, message: '请输入保养项目名称' }]}>
            <Input placeholder="请输入保养项目名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cycleDays" label="周期(天)" rules={[{ required: true, message: '请输入周期天数' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="天数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cycleKm" label="周期(公里)" rules={[{ required: true, message: '请输入周期公里数' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="公里" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lastDate" label="上次保养日期" rules={[{ required: true, message: '请选择上次保养日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastKm" label="上次保养里程(km)" rules={[{ required: true, message: '请输入上次保养里程' }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="公里数" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setMaintenanceModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingItem ? "编辑零件" : "添加零件"}
        open={partsModalVisible}
        onCancel={() => setPartsModalVisible(false)}
        footer={null}
      >
        <Form form={partsForm} layout="vertical" onFinish={handlePartSubmit}>
          <Form.Item name="name" label="零件名称" rules={[{ required: true, message: '请输入零件名称' }]}>
            <Input placeholder="请输入零件名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="replaceCycleDays" label="更换周期(天)" rules={[{ required: true, message: '请输入更换周期天数' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="天数" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="replaceCycleKm" label="更换周期(公里)" rules={[{ required: true, message: '请输入更换周期公里数' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="公里" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lastReplaceDate" label="上次更换日期" rules={[{ required: true, message: '请选择上次更换日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastReplaceKm" label="上次更换里程(km)" rules={[{ required: true, message: '请输入上次更换里程' }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="公里数" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setPartsModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加骑行记录"
        open={rideModalVisible}
        onCancel={() => setRideModalVisible(false)}
        footer={null}
      >
        <Form form={rideForm} layout="vertical" onFinish={handleRideSubmit}>
          <Form.Item name="date" label="日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="distance" label="骑行距离(公里)" rules={[{ required: true, message: '请输入骑行距离' }]}>
                <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="公里" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="duration" label="骑行时长(分钟)" rules={[{ required: true, message: '请输入骑行时长' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="分钟" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setRideModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">确定</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;

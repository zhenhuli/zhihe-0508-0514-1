import React, { useState, useMemo } from 'react';
import { Container, Header, Tab, Form, Button, Message, Table, Statistic } from 'semantic-ui-react';
import { ShiftType, Staff, ScheduleItem } from './types';
import ShiftTypeManager from './components/ShiftTypeManager';
import StaffManager from './components/StaffManager';
import CalendarView from './components/CalendarView';
import { generateSchedule, getStaffStats } from './utils/scheduler';
import './App.css';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function getDefaultDateRange() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const format = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  
  return { startDate: format(start), endDate: format(end) };
}

const defaultShiftTypes: ShiftType[] = [
  { id: generateId(), name: '早班', startTime: '08:00', endTime: '16:00', color: '#2185d0' },
  { id: generateId(), name: '中班', startTime: '16:00', endTime: '24:00', color: '#21ba45' },
  { id: generateId(), name: '晚班', startTime: '00:00', endTime: '08:00', color: '#a333c8' },
];

const defaultStaff: Staff[] = [
  { id: generateId(), name: '张三', department: '运营部' },
  { id: generateId(), name: '李四', department: '运营部' },
  { id: generateId(), name: '王五', department: '运营部' },
  { id: generateId(), name: '赵六', department: '运营部' },
  { id: generateId(), name: '钱七', department: '运营部' },
  { id: generateId(), name: '孙八', department: '运营部' },
];

function App() {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>(defaultShiftTypes);
  const [staff, setStaff] = useState<Staff[]>(defaultStaff);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const { startDate: defaultStart, endDate: defaultEnd } = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [error, setError] = useState<string | null>(null);

  const handleAddShiftType = (st: Omit<ShiftType, 'id'>) => {
    setShiftTypes([...shiftTypes, { ...st, id: generateId() }]);
  };

  const handleRemoveShiftType = (id: string) => {
    setShiftTypes(shiftTypes.filter((st) => st.id !== id));
  };

  const handleAddStaff = (s: Omit<Staff, 'id'>) => {
    setStaff([...staff, { ...s, id: generateId() }]);
  };

  const handleRemoveStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const handleGenerate = () => {
    setError(null);
    
    if (shiftTypes.length === 0) {
      setError('请至少添加一种班次类型');
      return;
    }
    
    if (staff.length === 0) {
      setError('请至少添加一名人员');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('请选择排班日期范围');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError('开始日期不能晚于结束日期');
      return;
    }
    
    const result = generateSchedule({
      startDate,
      endDate,
      shiftTypes,
      staff,
    });
    
    setSchedule(result);
  };

  const stats = useMemo(() => {
    return staff.map((s) => {
      const shiftCounts: Record<string, number> = {};
      shiftTypes.forEach((st) => {
        shiftCounts[st.id] = schedule.filter(
          (item) => item.staffId === s.id && item.shiftTypeId === st.id
        ).length;
      });
      return {
        staff: s,
        count: getStaffStats(schedule, s.id),
        shiftCounts,
      };
    });
  }, [schedule, staff, shiftTypes]);

  const panes = [
    {
      menuItem: '班次设置',
      render: () => (
        <Tab.Pane>
          <ShiftTypeManager
            shiftTypes={shiftTypes}
            onAdd={handleAddShiftType}
            onRemove={handleRemoveShiftType}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: '人员管理',
      render: () => (
        <Tab.Pane>
          <StaffManager staff={staff} onAdd={handleAddStaff} onRemove={handleRemoveStaff} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: '排班结果',
      render: () => (
        <Tab.Pane>
          <Form style={{ marginBottom: '1.5rem' }}>
            <Form.Group widths="equal">
              <Form.Field>
                <label>开始日期</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Form.Field>
              <Form.Field>
                <label>结束日期</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Form.Field>
            </Form.Group>
            <Button primary icon="calendar" content="生成排班表" onClick={handleGenerate} />
            <Button
              icon="download"
              content="导出CSV"
              onClick={() => {
                if (schedule.length === 0) return;
                const header = ['日期', '班次', '人员', '开始时间', '结束时间'];
                const rows = schedule.map((item) => {
                  const st = shiftTypes.find((t) => t.id === item.shiftTypeId);
                  const s = staff.find((p) => p.id === item.staffId);
                  return [item.date, st?.name || '', s?.name || '', st?.startTime || '', st?.endTime || ''];
                });
                const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
                const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `schedule-${startDate}-${endDate}.csv`;
                a.click();
              }}
              disabled={schedule.length === 0}
            />
          </Form>

          {error && (
            <Message negative>
              <Message.Header>错误</Message.Header>
              <p>{error}</p>
            </Message>
          )}

          {schedule.length > 0 && (
            <>
              <Header as="h3">排班统计</Header>
              <Table celled striped style={{ marginBottom: '1.5rem' }}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>姓名</Table.HeaderCell>
                    <Table.HeaderCell>部门</Table.HeaderCell>
                    {shiftTypes.map((st) => (
                      <Table.HeaderCell key={st.id}>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '3px',
                            backgroundColor: st.color,
                            marginRight: '6px',
                            verticalAlign: 'middle',
                          }}
                        />
                        {st.name}
                      </Table.HeaderCell>
                    ))}
                    <Table.HeaderCell>总计</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {stats.map(({ staff: s, count, shiftCounts }) => (
                    <Table.Row key={s.id}>
                      <Table.Cell>{s.name}</Table.Cell>
                      <Table.Cell>{s.department || '-'}</Table.Cell>
                      {shiftTypes.map((st) => (
                        <Table.Cell key={st.id} textAlign="center">
                          <Statistic size="mini" value={shiftCounts[st.id] || 0} />
                        </Table.Cell>
                      ))}
                      <Table.Cell textAlign="center">
                        <Statistic size="mini" value={count} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <Header as="h3">日历视图</Header>
              <CalendarView
                schedule={schedule}
                shiftTypes={shiftTypes}
                staff={staff}
                startDate={startDate}
                endDate={endDate}
              />
            </>
          )}

          {schedule.length === 0 && !error && (
            <Message info>
              <Message.Header>提示</Message.Header>
              <p>设置好转班类型和人员后，点击"生成排班表"按钮生成排班。</p>
            </Message>
          )}
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Header as="h1" textAlign="center" style={{ marginBottom: '2rem' }}>
        排班表自动编排工具
      </Header>
      <Tab panes={panes} />
    </Container>
  );
}

export default App;

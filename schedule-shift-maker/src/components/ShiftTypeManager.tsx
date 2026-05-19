import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form } from 'semantic-ui-react';
import { ShiftType } from '../types';

interface Props {
  shiftTypes: ShiftType[];
  onAdd: (shiftType: Omit<ShiftType, 'id'>) => void;
  onRemove: (id: string) => void;
}

const colorOptions = [
  { value: '#2185d0', label: '蓝色' },
  { value: '#21ba45', label: '绿色' },
  { value: '#f2711c', label: '橙色' },
  { value: '#db2828', label: '红色' },
  { value: '#a333c8', label: '紫色' },
  { value: '#00b5ad', label: '青色' },
  { value: '#b5cc18', label: '橄榄色' },
  { value: '#e03997', label: '粉色' },
];

const ShiftTypeManager: React.FC<Props> = ({ shiftTypes, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [color, setColor] = useState('#2185d0');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({ name: name.trim(), startTime, endTime, color });
      setName('');
      setStartTime('09:00');
      setEndTime('18:00');
      setColor('#2185d0');
      setOpen(false);
    }
  };

  return (
    <div>
      <Button primary icon="plus" content="添加班次" onClick={() => setOpen(true)} />
      <Table celled striped style={{ marginTop: '1rem' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>班次名称</Table.HeaderCell>
            <Table.HeaderCell>开始时间</Table.HeaderCell>
            <Table.HeaderCell>结束时间</Table.HeaderCell>
            <Table.HeaderCell>颜色标识</Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {shiftTypes.map((st) => (
            <Table.Row key={st.id}>
              <Table.Cell>{st.name}</Table.Cell>
              <Table.Cell>{st.startTime}</Table.Cell>
              <Table.Cell>{st.endTime}</Table.Cell>
              <Table.Cell>
                <div
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: st.color,
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <Button negative icon="trash" size="small" onClick={() => onRemove(st.id)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>添加班次类型</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>班次名称</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="如：早班、晚班" />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Field>
                <label>开始时间</label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </Form.Field>
              <Form.Field>
                <label>结束时间</label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>标识颜色</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {colorOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setColor(opt.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: opt.value,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: color === opt.value ? '3px solid #333' : '2px solid transparent',
                    }}
                    title={opt.label}
                  />
                ))}
              </div>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button primary onClick={handleSubmit}>确定</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default ShiftTypeManager;

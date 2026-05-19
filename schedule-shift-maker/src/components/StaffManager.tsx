import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form } from 'semantic-ui-react';
import { Staff } from '../types';

interface Props {
  staff: Staff[];
  onAdd: (staff: Omit<Staff, 'id'>) => void;
  onRemove: (id: string) => void;
}

const StaffManager: React.FC<Props> = ({ staff, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd({ name: name.trim(), department: department.trim() || undefined });
      setName('');
      setDepartment('');
      setOpen(false);
    }
  };

  return (
    <div>
      <Button primary icon="plus" content="添加人员" onClick={() => setOpen(true)} />
      <Table celled striped style={{ marginTop: '1rem' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>姓名</Table.HeaderCell>
            <Table.HeaderCell>部门</Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {staff.map((s) => (
            <Table.Row key={s.id}>
              <Table.Cell>{s.name}</Table.Cell>
              <Table.Cell>{s.department || '-'}</Table.Cell>
              <Table.Cell>
                <Button negative icon="trash" size="small" onClick={() => onRemove(s.id)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>添加人员</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>姓名</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入姓名" />
            </Form.Field>
            <Form.Field>
              <label>部门（可选）</label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="如：研发部、运营部" />
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

export default StaffManager;

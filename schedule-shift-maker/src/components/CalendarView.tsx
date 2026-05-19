import React, { useMemo } from 'react';
import { Table, Label, Icon } from 'semantic-ui-react';
import { ScheduleItem, ShiftType, Staff } from '../types';

interface Props {
  schedule: ScheduleItem[];
  shiftTypes: ShiftType[];
  staff: Staff[];
  startDate: string;
  endDate: string;
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const CalendarView: React.FC<Props> = ({ schedule, shiftTypes, staff, startDate, endDate }) => {
  const calendarWeeks = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    const firstDay = new Date(start);
    firstDay.setDate(start.getDate() - start.getDay());
    
    const lastDay = new Date(end);
    lastDay.setDate(end.getDate() + (6 - end.getDay()));
    
    const weeks: Array<Array<{ date: string; inRange: boolean }>> = [];
    let current = new Date(firstDay);
    
    while (current <= lastDay) {
      const week: Array<{ date: string; inRange: boolean }> = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = formatDate(current);
        const inRange = current >= start && current <= end;
        week.push({ date: dateStr, inRange });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  }, [startDate, endDate]);

  const shiftTypeMap = useMemo(() => {
    const map: Record<string, ShiftType> = {};
    shiftTypes.forEach((st) => {
      map[st.id] = st;
    });
    return map;
  }, [shiftTypes]);

  const staffMap = useMemo(() => {
    const map: Record<string, Staff> = {};
    staff.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [staff]);

  const getScheduleForDate = (date: string) => {
    return schedule.filter((s) => s.date === date);
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const todayStr = formatDate(today);
    return dateStr === todayStr;
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {shiftTypes.map((st) => (
          <Label key={st.id} style={{ backgroundColor: st.color, color: '#fff' }}>
            {st.name} ({st.startTime} - {st.endTime})
          </Label>
        ))}
      </div>
      
      <Table celled fixed>
        <Table.Header>
          <Table.Row>
            {weekDays.map((day) => (
              <Table.HeaderCell key={day} textAlign="center" style={{ width: '14.28%' }}>
                {day}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {calendarWeeks.map((week, weekIdx) => (
            <Table.Row key={weekIdx}>
              {week.map(({ date, inRange }, dayIdx) => {
                const daySchedule = getScheduleForDate(date);
                const dateObj = parseDate(date);
                const isTodayDate = isToday(date);
                
                return (
                  <Table.Cell
                    key={dayIdx}
                    style={{
                      minHeight: '100px',
                      verticalAlign: 'top',
                      backgroundColor: !inRange ? '#f9fafb' : isTodayDate ? '#fffbeb' : undefined,
                      opacity: !inRange ? 0.5 : 1,
                    }}
                  >
                    <div style={{ fontWeight: isTodayDate ? 'bold' : 'normal', marginBottom: '4px' }}>
                      {isTodayDate && <Icon name="circle" color="red" size="mini" />}
                      {dateObj.getDate()}
                    </div>
                    {daySchedule.map((item) => {
                      const st = shiftTypeMap[item.shiftTypeId];
                      const s = staffMap[item.staffId];
                      if (!st || !s) return null;
                      
                      return (
                        <div
                          key={`${item.shiftTypeId}-${item.staffId}`}
                          style={{
                            backgroundColor: st.color,
                            color: '#fff',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '12px',
                          }}
                        >
                          <div style={{ fontWeight: 'bold' }}>{st.name}</div>
                          <div>{s.name}</div>
                        </div>
                      );
                    })}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default CalendarView;

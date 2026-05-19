import { ScheduleItem, SchedulerConfig } from '../types';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getDatesInRange(startDate: string, endDate: string, daysPerWeek?: number[]): string[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const dates: string[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (!daysPerWeek || daysPerWeek.includes(dayOfWeek)) {
      dates.push(formatDate(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

export function generateSchedule(config: SchedulerConfig): ScheduleItem[] {
  const { startDate, endDate, shiftTypes, staff, daysPerWeek } = config;
  
  if (shiftTypes.length === 0 || staff.length === 0) {
    return [];
  }

  const dates = getDatesInRange(startDate, endDate, daysPerWeek);
  const schedule: ScheduleItem[] = [];
  
  const staffWorkCount: Record<string, number> = {};
  const staffShiftTypeCount: Record<string, Record<string, number>> = {};
  const staffLastShiftType: Record<string, string> = {};
  
  staff.forEach((s) => {
    staffWorkCount[s.id] = 0;
    staffShiftTypeCount[s.id] = {};
    shiftTypes.forEach((st) => {
      staffShiftTypeCount[s.id][st.id] = 0;
    });
  });

  const staffLastWorkDay: Record<string, string> = {};

  dates.forEach((date) => {
    shiftTypes.forEach((shiftType) => {
      const availableStaff = staff.filter((s) => staffLastWorkDay[s.id] !== date);
      
      if (availableStaff.length === 0) {
        return;
      }
      
      availableStaff.sort((a, b) => {
        const aShiftCount = staffShiftTypeCount[a.id][shiftType.id] || 0;
        const bShiftCount = staffShiftTypeCount[b.id][shiftType.id] || 0;
        const shiftCountDiff = aShiftCount - bShiftCount;
        if (shiftCountDiff !== 0) return shiftCountDiff;
        
        const totalCountDiff = staffWorkCount[a.id] - staffWorkCount[b.id];
        if (totalCountDiff !== 0) return totalCountDiff;
        
        const aLastShift = staffLastShiftType[a.id];
        const bLastShift = staffLastShiftType[b.id];
        if (aLastShift === shiftType.id && bLastShift !== shiftType.id) return 1;
        if (bLastShift === shiftType.id && aLastShift !== shiftType.id) return -1;
        
        return a.id.localeCompare(b.id);
      });
      
      const selectedStaff = availableStaff[0];
      
      schedule.push({
        date,
        shiftTypeId: shiftType.id,
        staffId: selectedStaff.id,
      });
      
      staffWorkCount[selectedStaff.id]++;
      staffShiftTypeCount[selectedStaff.id][shiftType.id]++;
      staffLastWorkDay[selectedStaff.id] = date;
      staffLastShiftType[selectedStaff.id] = shiftType.id;
    });
  });

  return schedule;
}

export function getStaffStats(schedule: ScheduleItem[], staffId: string): number {
  return schedule.filter((s) => s.staffId === staffId).length;
}

export function getScheduleByDate(schedule: ScheduleItem[], date: string): ScheduleItem[] {
  return schedule.filter((s) => s.date === date);
}

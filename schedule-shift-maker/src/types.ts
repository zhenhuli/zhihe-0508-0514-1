export interface ShiftType {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface Staff {
  id: string;
  name: string;
  department?: string;
}

export interface ScheduleItem {
  date: string;
  shiftTypeId: string;
  staffId: string;
}

export interface SchedulerConfig {
  startDate: string;
  endDate: string;
  shiftTypes: ShiftType[];
  staff: Staff[];
  daysPerWeek?: number[];
}

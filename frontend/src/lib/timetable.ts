import { MeetingSession, Offering, ConflictInfo } from '../types/planner';

export const DAY_NAMES: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

export const SHORT_DAY_NAMES: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

export const TIME_INTERVAL_OPTIONS: { value: string; label: string }[] = [];
// Generate strictly 30-minute intervals from 07:00 to 22:00 (7 AM to 10 PM)
for (let hour = 7; hour <= 22; hour++) {
  for (let min of [0, 30]) {
    if (hour === 22 && min === 30) break;
    const hStr = hour < 10 ? `0${hour}` : `${hour}`;
    const mStr = min < 10 ? `0${min}` : `${min}`;
    const val = `${hStr}:${mStr}`;
    
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayH = hour % 12 === 0 ? 12 : hour % 12;
    const label = `${displayH}:${mStr} ${period}`;
    TIME_INTERVAL_OPTIONS.push({ value: val, label });
  }
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

export function formatMinutesToTime(minutes: number, format12h: boolean = true): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const mStr = m < 10 ? `0${m}` : `${m}`;

  if (!format12h) {
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}:${mStr}`;
  }

  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${mStr} ${period}`;
}

export interface GridBounds {
  startHour: number; // e.g. 7 or 8
  endHour: number;   // e.g. 17 or 20
  totalMinutes: number;
}

export function calculateGridBounds(
  offerings: Offering[],
  defaultStartHour: number = 8,
  defaultEndHour: number = 17
): GridBounds {
  let earliestMin = defaultStartHour * 60;
  let latestMin = defaultEndHour * 60;

  for (const off of offerings) {
    for (const s of off.meeting_sessions) {
      const sMin = parseTimeToMinutes(s.start_time);
      const eMin = parseTimeToMinutes(s.end_time);
      if (sMin < earliestMin) {
        earliestMin = Math.floor(sMin / 60) * 60; // snap down to full hour
      }
      if (eMin > latestMin) {
        latestMin = Math.ceil(eMin / 60) * 60;   // snap up to full hour
      }
    }
  }

  const startHour = Math.max(0, Math.floor(earliestMin / 60));
  const endHour = Math.min(24, Math.ceil(latestMin / 60));

  return {
    startHour,
    endHour,
    totalMinutes: (endHour - startHour) * 60,
  };
}

export interface SessionPosition {
  offering: Offering;
  session: MeetingSession;
  topPct: number;
  heightPct: number;
  hasConflict: boolean;
  conflictDetails?: ConflictInfo[];
}

export function computeSessionPositions(
  offerings: Offering[],
  bounds: GridBounds,
  conflicts: ConflictInfo[] = []
): Record<number, SessionPosition[]> {
  const gridStartMinutes = bounds.startHour * 60;
  const totalMinutes = bounds.totalMinutes;

  const positionsByDay: Record<number, SessionPosition[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [],
  };

  const conflictingOfferingIds = new Set<number>();
  for (const c of conflicts) {
    conflictingOfferingIds.add(c.offering_a_id);
    conflictingOfferingIds.add(c.offering_b_id);
  }

  for (const off of offerings) {
    for (const s of off.meeting_sessions) {
      const startMin = parseTimeToMinutes(s.start_time);
      const endMin = parseTimeToMinutes(s.end_time);

      const topPct = Math.max(0, ((startMin - gridStartMinutes) / totalMinutes) * 100);
      const heightPct = Math.max(2, ((endMin - startMin) / totalMinutes) * 100);

      const matchingConflicts = conflicts.filter(
        c => c.day_of_week === s.day_of_week && (c.offering_a_id === off.id || c.offering_b_id === off.id)
      );

      const item: SessionPosition = {
        offering: off,
        session: s,
        topPct,
        heightPct,
        hasConflict: matchingConflicts.length > 0,
        conflictDetails: matchingConflicts,
      };

      if (positionsByDay[s.day_of_week]) {
        positionsByDay[s.day_of_week].push(item);
      }
    }
  }

  return positionsByDay;
}

import { Offering } from '../types/planner';

const ICS_DAY_CODES: Record<number, string> = {
  1: 'MO',
  2: 'TU',
  3: 'WE',
  4: 'TH',
  5: 'FR',
  6: 'SA',
  7: 'SU',
};

/**
 * Generates RFC 5545 compliant iCalendar (.ics) format from scheduled offerings
 */
export function generateICalendar(offerings: Offering[], scheduleName: string = 'ORAS Class Schedule'): string {
  // Use current year semester start reference (e.g. Next Monday)
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // 1 = Mon ... 7 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() + ((1 - dayOfWeek + 7) % 7 || 7)); // Next Monday
  monday.setHours(0, 0, 0, 0);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatDate = (d: Date, timeStr: string) => {
    const [h, m] = timeStr.split(':').map(v => parseInt(v, 10));
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${year}${month}${day}T${pad(h)}${pad(m)}00`;
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ORAS//Student Timetable Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${scheduleName}`,
    'X-WR-TIMEZONE:Asia/Manila',
  ];

  for (const off of offerings) {
    for (const session of off.meeting_sessions) {
      const dayOffset = session.day_of_week - 1;
      const sessionDate = new Date(monday);
      sessionDate.setDate(monday.getDate() + dayOffset);

      const dtStart = formatDate(sessionDate, session.start_time);
      const dtEnd = formatDate(sessionDate, session.end_time);
      const byDay = ICS_DAY_CODES[session.day_of_week] || 'MO';

      lines.push(
        'BEGIN:VEVENT',
        `UID:${off.id}-${session.day_of_week}-${session.start_time.replace(':', '')}@oras.timetable`,
        `DTSTAMP:${formatDate(now, '12:00')}`,
        `SUMMARY:${off.course_code} - ${off.course_title} (${off.section_code || 'A'})`,
        `LOCATION:${session.room || off.default_room || 'Campus'}`,
        `DESCRIPTION:${off.course_title} | Section: ${off.section_code || 'A'}${off.instructor ? ` | Instructor: ${off.instructor}` : ''}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${byDay}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    }
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICalendarFile(offerings: Offering[], scheduleName: string = 'ORAS_Timetable') {
  const icsData = generateICalendar(offerings, scheduleName);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${scheduleName.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import React from 'react';
import { Offering } from '../../types/planner';
import { DAY_NAMES, SHORT_DAY_NAMES } from '../../lib/timetable';
import { useTheme } from '../../features/settings/ThemeContext';
import { Edit2, Trash2, MapPin, User, Calendar } from 'lucide-react';

interface EnrolledCoursesTableProps {
  offerings: Offering[];
  onEditOffering: (offering: Offering) => void;
  onDeleteOffering: (offeringId: number) => void;
}

export const EnrolledCoursesTable: React.FC<EnrolledCoursesTableProps> = ({
  offerings,
  onEditOffering,
  onDeleteOffering,
}) => {
  const { getSubjectColor } = useTheme();

  if (offerings.length === 0) return null;

  // Compute total units
  const totalUnits = offerings.reduce((sum, off) => {
    const u = parseFloat(String(off.course_units || 0));
    return sum + (isNaN(u) ? 0 : u);
  }, 0);

  const formatSchedule = (offering: Offering) => {
    if (!offering.meeting_sessions || offering.meeting_sessions.length === 0) {
      return 'No meeting sessions';
    }

    // Group sessions with same start and end time
    const timeGroups: Record<string, number[]> = {};
    for (const s of offering.meeting_sessions) {
      const timeKey = `${s.start_time.slice(0, 5)} – ${s.end_time.slice(0, 5)}`;
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = [];
      }
      timeGroups[timeKey].push(s.day_of_week);
    }

    return Object.entries(timeGroups)
      .map(([timeStr, days]) => {
        const dayLabels = days
          .sort((a, b) => a - b)
          .map((d) => SHORT_DAY_NAMES[d] || `Day ${d}`)
          .join(', ');
        return `${dayLabels} ${timeStr}`;
      })
      .join(' | ');
  };

  return (
    <div className="w-full bg-surface rounded-xl border border-border-default shadow-soft overflow-hidden mt-6">
      <div className="px-4 py-3 bg-surface-secondary border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-accent" />
          <h3 className="text-xs font-bold text-fg uppercase tracking-wider">
            Enrolled Classes Summary Table
          </h3>
        </div>
        <span className="text-[11px] font-mono text-fg-muted font-medium">
          {offerings.length} subjects · {totalUnits} total units
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/50 text-[11px] font-semibold text-fg-muted">
              <th className="py-2.5 px-3">Subject</th>
              <th className="py-2.5 px-3">Section</th>
              <th className="py-2.5 px-2 text-center">Units</th>
              <th className="py-2.5 px-3">Schedule</th>
              <th className="py-2.5 px-3">Room</th>
              <th className="py-2.5 px-3">Instructor</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {offerings.map((offering, idx) => {
              const color = getSubjectColor(offering.course_color, idx);
              const room =
                offering.default_room ||
                offering.meeting_sessions.find((s) => s.room)?.room ||
                '—';

              return (
                <tr
                  key={offering.id}
                  className="hover:bg-surface-secondary/60 transition-colors group"
                >
                  {/* Course Code & Title */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border shadow-xs"
                        style={{ backgroundColor: color.bg, borderColor: color.border }}
                      />
                      <div>
                        <span className="font-bold text-fg block tracking-tight">
                          {offering.course_code}
                        </span>
                        <span className="text-[11px] text-fg-muted block truncate max-w-[200px] sm:max-w-[280px]">
                          {offering.course_title}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Section */}
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-secondary border border-border-subtle font-medium text-fg">
                      {offering.section_code || '—'}
                    </span>
                  </td>

                  {/* Units */}
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-fg">
                    {offering.course_units || '—'}
                  </td>

                  {/* Schedule */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-fg-secondary">
                    {formatSchedule(offering)}
                  </td>

                  {/* Room */}
                  <td className="py-2.5 px-3 text-fg-secondary">
                    {room !== '—' ? (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <MapPin size={11} className="text-fg-muted shrink-0" />
                        {room}
                      </span>
                    ) : (
                      <span className="text-fg-muted">—</span>
                    )}
                  </td>

                  {/* Instructor */}
                  <td className="py-2.5 px-3 text-fg-secondary">
                    {offering.instructor ? (
                      <span className="flex items-center gap-1 text-[11px]">
                        <User size={11} className="text-fg-muted shrink-0" />
                        {offering.instructor}
                      </span>
                    ) : (
                      <span className="text-fg-muted">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEditOffering(offering)}
                        className="p-1.5 rounded hover:bg-surface text-fg-muted hover:text-fg transition-colors"
                        title="Edit Class"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteOffering(offering.id)}
                        className="p-1.5 rounded hover:bg-status-danger-surface text-fg-muted hover:text-status-danger transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-secondary/70 font-semibold text-fg border-t border-border-default">
              <td className="py-2.5 px-3">Total Classes: {offerings.length}</td>
              <td className="py-2.5 px-3"></td>
              <td className="py-2.5 px-2 text-center font-mono">{totalUnits}</td>
              <td colSpan={4} className="py-2.5 px-3 text-right text-fg-muted text-[11px]">
                Calculated for current timetable
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
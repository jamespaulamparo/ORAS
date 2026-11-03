import React, { useState } from 'react';
import { Offering, ConflictInfo } from '../../types/planner';
import { 
  DAY_NAMES, 
  SHORT_DAY_NAMES, 
  calculateGridBounds, 
  computeSessionPositions, 
  formatMinutesToTime,
  SessionPosition
} from '../../lib/timetable';
import { useTheme } from '../../features/settings/ThemeContext';
import { AlertCircle, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimetableGridProps {
  offerings: Offering[];
  conflicts?: ConflictInfo[];
  onSelectOffering?: (offering: Offering) => void;
  showWeekends?: boolean;
  timeFormat12h?: boolean;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  offerings,
  conflicts = [],
  onSelectOffering,
  showWeekends = false,
  timeFormat12h = true,
}) => {
  const { getSubjectColor, currentTheme } = useTheme();
  const [activeDay, setActiveDay] = useState<number>(1); // 1 = Mon for mobile Day view

  // Calculate dynamic hour range so classes outside 8-17 expand the grid
  const bounds = calculateGridBounds(offerings, 8, 17);
  const sessionPositions = computeSessionPositions(offerings, bounds, conflicts);

  // Generate hour markers
  const hours: number[] = [];
  for (let h = bounds.startHour; h <= bounds.endHour; h++) {
    hours.push(h);
  }

  // Days to show
  const days = showWeekends ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];

  const renderClassBlock = (pos: SessionPosition, index: number) => {
    const { offering, session, topPct, heightPct, hasConflict, conflictDetails } = pos;
    // Theme-derived course color style
    const color = getSubjectColor(offering.course_color, index);

    return (
      <div
        key={`${offering.id}-${session.id || session.day_of_week}-${session.start_time}`}
        onClick={() => onSelectOffering && onSelectOffering(offering)}
        style={{
          top: `${topPct}%`,
          height: `${heightPct}%`,
          backgroundColor: color.bg,
          borderColor: hasConflict ? 'var(--danger)' : color.border,
          color: color.text,
        }}
        className={`absolute inset-x-1 rounded-md border p-2 text-xs overflow-hidden transition-all shadow-sm cursor-pointer hover:shadow-card hover:brightness-105 group ${
          hasConflict ? 'ring-2 ring-status-danger ring-offset-1 z-20' : 'z-10'
        }`}
      >
        {/* Conflict Flag */}
        {hasConflict && (
          <div
            className="absolute top-1 right-1 bg-status-danger text-white p-0.5 rounded shadow-sm z-30"
            title={conflictDetails?.[0]?.message}
          >
            <AlertCircle size={12} />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col h-full justify-between leading-tight">
          <div>
            <div className="flex items-center justify-between gap-1 font-semibold tracking-tight">
              <span className="truncate">{offering.course_code}</span>
              {offering.section_code && (
                <span
                  className="text-[10px] font-mono px-1 rounded shrink-0 font-medium"
                  style={{
                    backgroundColor: color.tagBg,
                    color: color.tagText,
                  }}
                >
                  {offering.section_code}
                </span>
              )}
            </div>

            <div className="text-[11px] font-medium opacity-90 truncate mt-0.5">
              {offering.course_title}
            </div>
          </div>

          {/* Room, Time, Instructor, Meeting Type */}
          <div className="space-y-0.5 text-[10px] opacity-90 mt-1">
            <div className="flex items-center gap-1 truncate font-mono">
              <Clock size={10} className="shrink-0" />
              <span>
                {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1">
              {(session.room || offering.default_room) && (
                <div className="flex items-center gap-1 truncate">
                  <MapPin size={10} className="shrink-0" />
                  <span className="truncate">{session.room || offering.default_room}</span>
                </div>
              )}

              {session.meeting_type && (
                <span
                  className="text-[9px] px-1 rounded font-medium ml-auto"
                  style={{
                    backgroundColor: color.tagBg,
                    color: color.tagText,
                  }}
                >
                  {session.meeting_type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-surface rounded-lg border border-border-default shadow-soft overflow-hidden">
      {/* Mobile Day Switcher */}
      <div className="md:hidden flex items-center justify-between p-2.5 bg-surface-secondary border-b border-border-subtle">
        <button
          onClick={() => setActiveDay((prev) => (prev > 1 ? prev - 1 : days.length))}
          className="p-1 rounded hover:bg-surface text-fg"
          aria-label="Previous Day"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-xs font-semibold text-fg">
          {DAY_NAMES[activeDay]}
        </span>

        <button
          onClick={() => setActiveDay((prev) => (prev < days.length ? prev + 1 : 1))}
          className="p-1 rounded hover:bg-surface text-fg"
          aria-label="Next Day"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week Timetable Workspace */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[650px] w-full flex flex-col">
          {/* Header row: Days */}
          <div className="flex border-b border-border-default bg-surface-secondary text-xs font-semibold text-fg divide-x divide-border-subtle">
            {/* Time gutter header */}
            <div className="w-16 shrink-0 py-2.5 text-center text-fg-muted font-mono text-[11px]">
              Time
            </div>

            {/* Day columns */}
            {days.map((dayNum) => (
              <div
                key={dayNum}
                className="flex-1 py-2.5 px-3 text-center tracking-tight"
              >
                <span className="hidden sm:inline">{DAY_NAMES[dayNum]}</span>
                <span className="sm:hidden">{SHORT_DAY_NAMES[dayNum]}</span>
                <span className="ml-1.5 text-[10px] font-mono text-fg-muted">
                  ({sessionPositions[dayNum]?.length || 0})
                </span>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="flex relative divide-x divide-border-subtle" style={{ height: `${(bounds.endHour - bounds.startHour) * 60}px` }}>
            {/* Time labels column */}
            <div className="w-16 shrink-0 relative select-none">
              {hours.map((hour, idx) => {
                const topPx = idx * 60;
                return (
                  <div
                    key={hour}
                    style={{ top: `${topPx}px` }}
                    className="absolute inset-x-0 -translate-y-1/2 text-right pr-2 text-[10px] font-mono text-fg-muted"
                  >
                    {formatMinutesToTime(hour * 60, timeFormat12h)}
                  </div>
                );
              })}
            </div>

            {/* Day Columns */}
            {days.map((dayNum) => (
              <div
                key={dayNum}
                className="flex-1 relative border-r border-border-subtle last:border-r-0"
              >
                {/* Horizontal hour grid lines */}
                {hours.map((hour, idx) => {
                  const topPx = idx * 60;
                  return (
                    <div
                      key={hour}
                      style={{ top: `${topPx}px` }}
                      className="absolute inset-x-0 border-t border-border-subtle pointer-events-none"
                    />
                  );
                })}

                {/* Half-hour subtle dashed lines */}
                {hours.slice(0, -1).map((hour, idx) => {
                  const topPx = idx * 60 + 30;
                  return (
                    <div
                      key={`half-${hour}`}
                      style={{ top: `${topPx}px` }}
                      className="absolute inset-x-0 border-t border-border-subtle/40 border-dashed pointer-events-none"
                    />
                  );
                })}

                {/* Event class blocks */}
                {sessionPositions[dayNum]?.map((pos, idx) => renderClassBlock(pos, idx))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
import { AlertCircle, Clock, MapPin, Calendar, LayoutGrid } from 'lucide-react';

interface TimetableGridProps {
  offerings: Offering[];
  conflicts?: ConflictInfo[];
  onSelectOffering?: (offering: Offering) => void;
  onSelectEmptySlot?: (slot: { day_of_week: number; start_time: string; end_time: string }) => void;
  showWeekends?: boolean;
  timeFormat12h?: boolean;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  offerings,
  conflicts = [],
  onSelectOffering,
  onSelectEmptySlot,
  showWeekends = false,
  timeFormat12h = true,
}) => {
  const { getSubjectColor } = useTheme();
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [activeDay, setActiveDay] = useState<number>(1); // 1 = Mon

  // Calculate dynamic hour range so classes outside 8-17 expand the grid
  const bounds = calculateGridBounds(offerings, 8, 17);
  const sessionPositions = computeSessionPositions(offerings, bounds, conflicts);

  // Generate hour markers
  const hours: number[] = [];
  for (let h = bounds.startHour; h <= bounds.endHour; h++) {
    hours.push(h);
  }

  // Days to show in week view
  const allWeekDays = showWeekends ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
  const displayedDays = viewMode === 'day' ? [activeDay] : allWeekDays;

  const totalGridHeight = (bounds.endHour - bounds.startHour) * 60;

  const handleColumnClick = (e: React.MouseEvent<HTMLDivElement>, dayNum: number) => {
    if (!onSelectEmptySlot) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, clickY / totalGridHeight));
    const clickedMinutesFromStart = Math.floor(ratio * bounds.totalMinutes);
    const rawMinutesOfDay = bounds.startHour * 60 + clickedMinutesFromStart;

    // Snap down to nearest 30-minute increment (:00 or :30)
    const snappedStartMin = Math.floor(rawMinutesOfDay / 30) * 30;
    // Default duration is 1 hour (60 minutes)
    const snappedEndMin = Math.min(22 * 60, snappedStartMin + 60);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const startStr = `${pad(Math.floor(snappedStartMin / 60))}:${pad(snappedStartMin % 60)}`;
    const endStr = `${pad(Math.floor(snappedEndMin / 60))}:${pad(snappedEndMin % 60)}`;

    onSelectEmptySlot({
      day_of_week: dayNum,
      start_time: startStr,
      end_time: endStr,
    });
  };

  const renderClassBlock = (pos: SessionPosition, index: number, isSingleDay: boolean) => {
    const { offering, session, topPct, heightPct, hasConflict, conflictDetails } = pos;
    // Theme-derived course color style (solid opaque background)
    const color = getSubjectColor(offering.course_color, index);
    const room = session.room || offering.default_room;

    return (
      <div
        key={`${offering.id}-${session.id || session.day_of_week}-${session.start_time}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectOffering) onSelectOffering(offering);
        }}
        style={{
          top: `${topPct}%`,
          height: `${heightPct}%`,
          backgroundColor: color.bg,
          borderColor: hasConflict ? 'var(--danger)' : color.border,
          color: color.text,
        }}
        className={`absolute inset-x-0.5 sm:inset-x-1 rounded-md border p-1 sm:p-2 text-xs overflow-hidden transition-all shadow-sm cursor-pointer hover:shadow-card hover:brightness-105 group select-none ${
          hasConflict ? 'ring-2 ring-status-danger ring-offset-1 z-20' : 'z-10'
        }`}
      >
        {/* Conflict Flag */}
        {hasConflict && (
          <div
            className="absolute top-1 right-1 bg-status-danger text-white p-0.5 rounded shadow-sm z-30"
            title={conflictDetails?.[0]?.message}
          >
            <AlertCircle size={11} />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col h-full justify-between leading-tight overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-1 font-bold tracking-tight">
              <span className="truncate text-[10px] sm:text-xs">{offering.course_code}</span>
              {offering.section_code && (
                <span
                  className="hidden sm:inline-block text-[9px] font-mono px-1 rounded shrink-0 font-semibold"
                  style={{
                    backgroundColor: color.tagBg,
                    color: color.tagText,
                  }}
                >
                  {offering.section_code}
                </span>
              )}
            </div>

            {/* Course title: visible on tablet/desktop, or in single day mode */}
            {(isSingleDay || heightPct > 8) && (
              <div className="text-[10px] sm:text-[11px] font-medium opacity-95 truncate mt-0.5 leading-snug">
                {offering.course_title}
              </div>
            )}
          </div>

          {/* Time & Optional Room */}
          <div className="space-y-0.5 text-[9px] sm:text-[10px] font-medium opacity-95 mt-0.5">
            <div className="flex items-center gap-1 truncate font-mono">
              <Clock size={9} className="shrink-0 hidden sm:inline" />
              <span className="truncate">
                {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
              </span>
            </div>

            {room && (isSingleDay || heightPct > 12) && (
              <div className="flex items-center gap-1 truncate opacity-90">
                <MapPin size={9} className="shrink-0" />
                <span className="truncate">{room}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-surface rounded-xl border border-border-default shadow-soft overflow-hidden">
      {/* Sub-Header: Responsive Day/Week Selector (Compact and clean, no horizontal overflow) */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-secondary border-b border-border-subtle text-xs">
        {/* Week / Day View Mode Toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-border-subtle">
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
              viewMode === 'week'
                ? 'bg-accent text-accent-contrast shadow-sm'
                : 'text-fg-secondary hover:text-fg'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Week</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
              viewMode === 'day'
                ? 'bg-accent text-accent-contrast shadow-sm'
                : 'text-fg-secondary hover:text-fg'
            }`}
          >
            <Calendar size={13} />
            <span>Day</span>
          </button>
        </div>

        {/* Day Pills (Only visible when in Day Mode) */}
        {viewMode === 'day' && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {allWeekDays.map((d) => {
              const isSelected = activeDay === d;
              const count = sessionPositions[d]?.length || 0;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveDay(d)}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'bg-accent text-accent-contrast font-bold'
                      : 'bg-surface text-fg-secondary hover:text-fg border border-border-subtle'
                  }`}
                >
                  <span>{SHORT_DAY_NAMES[d]}</span>
                  {count > 0 && (
                    <span className="text-[10px] opacity-80">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Week Timetable Container: 100% width, zero sidescrolling */}
      <div className="w-full">
        {/* Header row: Days */}
        <div className="flex border-b border-border-default bg-surface-secondary text-xs font-semibold text-fg divide-x divide-border-subtle">
          {/* Time gutter header */}
          <div className="w-10 sm:w-16 shrink-0 py-2.5 text-center text-fg-muted font-mono text-[10px] sm:text-[11px]">
            Time
          </div>

          {/* Day columns */}
          {displayedDays.map((dayNum) => (
            <div
              key={dayNum}
              className="flex-1 py-2 px-1 sm:px-3 text-center tracking-tight truncate cursor-pointer hover:bg-surface/60 transition-colors"
              onClick={() => {
                setActiveDay(dayNum);
                setViewMode('day');
              }}
              title="Click to view single day"
            >
              <span className="hidden sm:inline">{DAY_NAMES[dayNum]}</span>
              <span className="sm:hidden text-[11px] font-bold">{SHORT_DAY_NAMES[dayNum]}</span>
              <span className="ml-1 text-[10px] font-mono text-fg-muted hidden xs:inline">
                ({sessionPositions[dayNum]?.length || 0})
              </span>
            </div>
          ))}
        </div>

        {/* Grid Body with intentional py-3 buffer so top (8:00 AM) and bottom (5:00 PM) never clip! */}
        <div className="pt-3 pb-5 px-0">
          <div
            className="flex relative divide-x divide-border-subtle"
            style={{ height: `${totalGridHeight}px` }}
          >
            {/* Time labels column */}
            <div className="w-10 sm:w-16 shrink-0 relative select-none">
              {hours.map((hour, idx) => {
                const topPx = idx * 60;
                return (
                  <div
                    key={hour}
                    style={{ top: `${topPx}px` }}
                    className="absolute inset-x-0 -translate-y-1/2 text-right pr-1 sm:pr-2 text-[9px] sm:text-[10px] font-mono text-fg-muted"
                  >
                    {formatMinutesToTime(hour * 60, timeFormat12h)}
                  </div>
                );
              })}
            </div>

            {/* Day Columns */}
            {displayedDays.map((dayNum) => (
              <div
                key={dayNum}
                onClick={(e) => handleColumnClick(e, dayNum)}
                className="flex-1 relative border-r border-border-subtle last:border-r-0 cursor-pointer hover:bg-surface-secondary/20 transition-colors"
                title="Click blank time slot to add a 1-hour class"
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
                {sessionPositions[dayNum]?.map((pos, idx) =>
                  renderClassBlock(pos, idx, viewMode === 'day')
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
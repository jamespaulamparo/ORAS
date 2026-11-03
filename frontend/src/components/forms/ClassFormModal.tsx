import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, Copy, Clock, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../../features/settings/ThemeContext';
import { Course, Offering } from '../../types/planner';
import { TIME_INTERVAL_OPTIONS } from '../../lib/timetable';

interface SessionRow {
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  meeting_type: 'Lecture' | 'Laboratory' | 'Other';
}

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  onDelete?: (offeringId: number) => Promise<void>;
  initialData?: {
    course?: Course;
    offering?: Offering;
  } | null;
}

const WEEKDAYS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

export const ClassFormModal: React.FC<ClassFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}) => {
  const { currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [units, setUnits] = useState('3.0');
  const [sectionCode, setSectionCode] = useState('A');
  const [instructor, setInstructor] = useState('');
  const [defaultRoom, setDefaultRoom] = useState('');
  const [colorKey, setColorKey] = useState('color-1');

  // Multi-session rows (strictly xx:00 or xx:30)
  const [sessions, setSessions] = useState<SessionRow[]>([
    { day_of_week: 1, start_time: '08:30', end_time: '10:00', room: '', meeting_type: 'Lecture' },
  ]);

  useEffect(() => {
    if (initialData?.course) {
      setCourseCode(initialData.course.course_code || '');
      setCourseTitle(initialData.course.course_title || '');
      setUnits(initialData.course.units?.toString() || '3.0');
      setColorKey(initialData.course.color_key || 'color-1');
    } else {
      setCourseCode('');
      setCourseTitle('');
      setUnits('3.0');
      setColorKey('color-1');
    }

    if (initialData?.offering) {
      setSectionCode(initialData.offering.section_code || 'A');
      setInstructor(initialData.offering.instructor || '');
      setDefaultRoom(initialData.offering.default_room || '');
      if (initialData.offering.meeting_sessions?.length > 0) {
        setSessions(
          initialData.offering.meeting_sessions.map((s) => ({
            day_of_week: s.day_of_week,
            start_time: s.start_time.slice(0, 5),
            end_time: s.end_time.slice(0, 5),
            room: s.room || '',
            meeting_type: (s.meeting_type === 'Laboratory' || s.meeting_type === 'Other')
              ? s.meeting_type
              : 'Lecture',
          }))
        );
      }
    } else {
      setSectionCode('A');
      setInstructor('');
      setDefaultRoom('');
      setSessions([
        { day_of_week: 1, start_time: '08:30', end_time: '10:00', room: '', meeting_type: 'Lecture' },
      ]);
    }
    setError(null);
  }, [initialData, isOpen]);

  // Add brand new session
  const addSession = () => {
    const lastSession = sessions[sessions.length - 1];
    setSessions([
      ...sessions,
      {
        day_of_week: lastSession ? (lastSession.day_of_week % 5) + 1 : 1,
        start_time: lastSession ? lastSession.start_time : '08:30',
        end_time: lastSession ? lastSession.end_time : '10:00',
        room: defaultRoom,
        meeting_type: lastSession ? lastSession.meeting_type : 'Lecture',
      },
    ]);
  };

  // DUPLICATE SESSION FEATURE (copies exact time & room to next day)
  const duplicateSession = (index: number) => {
    const target = sessions[index];
    // Find next day of the week
    const nextDay = target.day_of_week < 5 ? target.day_of_week + 1 : 1;
    const cloned: SessionRow = {
      day_of_week: nextDay,
      start_time: target.start_time,
      end_time: target.end_time,
      room: target.room || defaultRoom,
      meeting_type: target.meeting_type,
    };
    setSessions([...sessions, cloned]);
  };

  // DELETE SINGLE SESSION
  const removeSession = (index: number) => {
    if (sessions.length > 1) {
      setSessions(sessions.filter((_, i) => i !== index));
    } else {
      // If only 1 session left, reset to blank session
      setSessions([
        { day_of_week: 1, start_time: '08:30', end_time: '10:00', room: defaultRoom, meeting_type: 'Lecture' },
      ]);
    }
  };

  const updateSession = (index: number, field: keyof SessionRow, value: any) => {
    setSessions(
      sessions.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  // Delete entire class
  const handleDeleteClass = async () => {
    if (!initialData?.offering?.id || !onDelete) return;
    if (confirm(`Are you sure you want to delete ${courseCode} (${sectionCode})?`)) {
      setIsDeleting(true);
      try {
        await onDelete(initialData.offering.id);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Failed to delete class offering.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!courseCode.trim()) {
      setError('Course code is required (e.g. CS 101).');
      return;
    }
    if (!courseTitle.trim()) {
      setError('Course title is required.');
      return;
    }

    // Validate sessions
    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i];
      if (!s.start_time || !s.end_time) {
        setError(`Session #${i + 1} must have both start and end times.`);
        return;
      }
      if (s.end_time <= s.start_time) {
        setError(`Session #${i + 1}: End time must be later than start time.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      await onSubmit({
        course_code: courseCode.trim().toUpperCase(),
        course_title: courseTitle.trim(),
        units: units ? parseFloat(units) : null,
        color_key: colorKey,
        section_code: sectionCode.trim() || 'A',
        instructor: instructor.trim(),
        default_room: defaultRoom.trim(),
        meeting_sessions: sessions.map((s) => ({
          ...s,
          room: s.room.trim() || defaultRoom.trim(),
        })),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save class offering.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.offering ? 'Edit Class Offering' : 'Add Class Offering'}
      description="Enter course details, sections, and exact full-hour or half-hour meeting times."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-status-danger-surface border border-status-danger-border text-xs text-status-danger flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Course Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Course Code"
            placeholder="e.g. CS 101"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
            autoFocus
          />
          <div className="sm:col-span-2">
            <Input
              label="Course Title"
              placeholder="e.g. Introduction to Programming"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Section, Instructor, Room, Units */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            label="Section"
            placeholder="e.g. BSCS-2A"
            value={sectionCode}
            onChange={(e) => setSectionCode(e.target.value)}
          />
          <Input
            label="Units"
            type="number"
            step="0.5"
            placeholder="3.0"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
          />
          <Input
            label="Instructor (Optional)"
            placeholder="e.g. Dr. Garcia"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
          />
          <Input
            label="Default Room"
            placeholder="e.g. Lab 2"
            value={defaultRoom}
            onChange={(e) => setDefaultRoom(e.target.value)}
          />
        </div>

        {/* Theme-Adaptive Course Color Palette */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-fg-secondary">
              Course Palette (Theme: {currentTheme.name})
            </label>
            <span className="text-[11px] text-fg-muted">
              Auto-adapts to active theme
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {currentTheme.coursePalette.map((c) => {
              const isSelected = colorKey === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  onClick={() => setColorKey(c.id)}
                  className={`h-9 rounded-md border p-1 text-center transition-all flex flex-col items-center justify-center relative ${
                    isSelected ? 'ring-2 ring-accent scale-105 shadow-sm' : 'hover:scale-102 opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: c.bg,
                    borderColor: c.border,
                    color: c.text,
                  }}
                >
                  <span className="text-[9px] font-semibold truncate w-full px-1">
                    {c.name.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-accent-contrast flex items-center justify-center">
                      <Check size={9} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meeting Sessions Section: Multi-Column Responsive Grid */}
        <div className="pt-2 border-t border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-semibold text-fg flex items-center gap-1.5">
                <Clock size={14} className="text-accent" /> Meeting Sessions ({sessions.length})
              </h4>
              <p className="text-[11px] text-fg-muted">
                Duplicate any session with 1 click to copy the time and room to another day.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSession}
              className="text-xs"
            >
              <Plus size={13} /> Add Session
            </Button>
          </div>

          {/* 2-Column Responsive Layout for Desktop, Stacks on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
            {sessions.map((session, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-border-default bg-surface-secondary/50 space-y-3 text-xs shadow-soft flex flex-col justify-between"
              >
                {/* Header with Session # and Actions (Duplicate & Delete) */}
                <div className="flex items-center justify-between pb-1 border-b border-border-subtle/60">
                  <span className="font-semibold text-fg text-xs flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-accent text-accent-contrast text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    Pattern #{idx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Duplicate Button */}
                    <button
                      type="button"
                      onClick={() => duplicateSession(idx)}
                      className="flex items-center gap-1 text-[11px] text-fg-secondary hover:text-accent px-1.5 py-0.5 rounded hover:bg-surface border border-border-subtle transition-colors shadow-xs"
                      title="Duplicate this session (copy time & room to another day)"
                    >
                      <Copy size={12} />
                      <span>Duplicate</span>
                    </button>

                    {/* Delete Session Button */}
                    <button
                      type="button"
                      onClick={() => removeSession(idx)}
                      className="flex items-center gap-1 text-[11px] text-fg-muted hover:text-status-danger px-1.5 py-0.5 rounded hover:bg-status-danger-surface border border-transparent hover:border-status-danger-border transition-colors"
                      title="Delete this session"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Day selector pills */}
                <div>
                  <label className="text-[10px] text-fg-muted font-medium block mb-1">
                    Weekday
                  </label>
                  <div className="flex items-center gap-1">
                    {WEEKDAYS.map((d) => {
                      const isSelected = session.day_of_week === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => updateSession(idx, 'day_of_week', d.value)}
                          className={`flex-1 py-1 text-center rounded text-[11px] font-medium border transition-colors ${
                            isSelected
                              ? 'bg-accent text-accent-contrast border-accent shadow-xs'
                              : 'bg-surface border-border-subtle text-fg-secondary hover:text-fg'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start, End, Room, Type */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Start Time Dropdown (only :00 or :30) */}
                  <div>
                    <label className="text-[10px] text-fg-muted font-medium block mb-1">
                      Start Time
                    </label>
                    <select
                      value={session.start_time}
                      onChange={(e) => updateSession(idx, 'start_time', e.target.value)}
                      required
                      className="w-full rounded-md border border-border-default bg-surface px-2 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {TIME_INTERVAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End Time Dropdown (only :00 or :30) */}
                  <div>
                    <label className="text-[10px] text-fg-muted font-medium block mb-1">
                      End Time
                    </label>
                    <select
                      value={session.end_time}
                      onChange={(e) => updateSession(idx, 'end_time', e.target.value)}
                      required
                      className="w-full rounded-md border border-border-default bg-surface px-2 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {TIME_INTERVAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Room */}
                  <div>
                    <label className="text-[10px] text-fg-muted font-medium block mb-1">
                      Room (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder={defaultRoom || 'e.g. Lab 2'}
                      value={session.room}
                      onChange={(e) => updateSession(idx, 'room', e.target.value)}
                      className="w-full rounded-md border border-border-default bg-surface px-2 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  {/* Session Type */}
                  <div>
                    <label className="text-[10px] text-fg-muted font-medium block mb-1">
                      Session Type
                    </label>
                    <select
                      value={session.meeting_type}
                      onChange={(e) => updateSession(idx, 'meeting_type', e.target.value)}
                      className="w-full rounded-md border border-border-default bg-surface px-2 py-1.5 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="Lecture">Lecture</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle">
          <div>
            {initialData?.offering && onDelete && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDeleteClass}
                disabled={isLoading || isDeleting}
              >
                <Trash2 size={13} /> Delete Class
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading || isDeleting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={isDeleting}>
              Save Class Offering
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

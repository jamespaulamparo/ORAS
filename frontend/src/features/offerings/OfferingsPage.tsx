import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithCsrf } from '../../lib/api';
import { Workspace, Course, Offering, ConflictCheckResult } from '../../types/planner';
import { Button } from '../../components/ui/Button';
import { ClassFormModal } from '../../components/forms/ClassFormModal';
import { SpreadsheetImportModal } from './SpreadsheetImportModal';
import { useTheme } from '../settings/ThemeContext';
import { 
  BookOpen, 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  Clock, 
  Search,
  MapPin,
  User as UserIcon,
  Layers
} from 'lucide-react';
import { DAY_NAMES } from '../../lib/timetable';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';

export const OfferingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getSubjectColor } = useTheme();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch current workspace
  const { data: workspace, isLoading } = useQuery<Workspace>({
    queryKey: ['workspace', 'current'],
    queryFn: () => fetchWithCsrf('/api/workspaces/current/'),
  });

  // Fetch all offerings in workspace
  const { data: offerings = [] } = useQuery<Offering[]>({
    queryKey: ['offerings', workspace?.id],
    queryFn: () => fetchWithCsrf(`/api/workspaces/${workspace!.id}/offerings/`),
    enabled: !!workspace?.id,
  });

  // Check conflicts among all offerings
  const { data: conflictData } = useQuery<ConflictCheckResult>({
    queryKey: ['conflicts', offerings.map(o => o.id)],
    queryFn: () =>
      fetchWithCsrf(`/api/workspaces/${workspace!.id}/check-conflicts/`, {
        method: 'POST',
        body: JSON.stringify({ offering_ids: offerings.map(o => o.id) }),
      }),
    enabled: !!workspace?.id && offerings.length > 1,
  });

  // Create course + offering mutation
  const createCourseMutation = useMutation({
    mutationFn: (data: any) =>
      fetchWithCsrf(`/api/workspaces/${workspace!.id}/courses/`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      showToast(`Added ${variables.course_code || 'class'} successfully`, 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to add class', 'danger');
    },
  });

  // Edit offering mutation
  const updateOfferingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      fetchWithCsrf(`/api/offerings/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      showToast(`Updated ${variables.data?.course_code || 'class'} successfully`, 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to update class', 'danger');
    },
  });

  // Delete offering mutation
  const deleteOfferingMutation = useMutation({
    mutationFn: (id: number) =>
      fetchWithCsrf(`/api/offerings/${id}/`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      showToast('Class offering deleted', 'info');
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to delete class', 'danger');
    },
  });

  const handleFormSubmit = async (formData: any) => {
    if (editingOffering) {
      await updateOfferingMutation.mutateAsync({
        id: editingOffering.id,
        data: formData, // Send full updated data including sessions and course fields!
      });
    } else {
      await createCourseMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (off: Offering) => {
    setEditingOffering(off);
    const parentCourse = workspace?.courses.find(c => c.id === off.course);
    setEditingCourse(parentCourse || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (off: Offering) => {
    if (confirm(`Remove offering "${off.course_code} (${off.section_code})"?`)) {
      await deleteOfferingMutation.mutateAsync(off.id);
    }
  };

  const filteredOfferings = offerings.filter(
    (off) =>
      off.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (off.instructor && off.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-semibold text-fg">Course Offerings</h1>
          <p className="text-xs text-fg-muted mt-1">
            Available classes, alternative sections, and weekly meeting sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload size={14} /> Import Spreadsheet
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingOffering(null);
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={14} /> Add Class
          </Button>
        </div>
      </div>

      {/* Conflicts Banner (if any) */}
      {conflictData?.has_conflicts && (
        <div className="p-4 rounded-lg bg-status-danger-surface border border-status-danger-border space-y-1.5">
          <div className="flex items-center gap-2 text-status-danger text-xs font-semibold">
            <AlertCircle size={15} />
            <span>Time Overlaps Detected ({conflictData.conflict_count})</span>
          </div>
          <ul className="text-xs text-status-danger space-y-1 pl-6 list-disc">
            {conflictData.conflicts.map((c, i) => (
              <li key={i}>{c.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            placeholder="Search code, title, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-border-default bg-surface text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <span className="text-xs text-fg-muted">
          {offerings.length} offering{offerings.length === 1 ? '' : 's'} cataloged
        </span>
      </div>

      {/* Offerings List / Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-fg-muted">Loading offerings...</div>
      ) : filteredOfferings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-default p-12 text-center bg-surface/50">
          <div className="w-10 h-10 rounded-full bg-surface-secondary text-fg-muted flex items-center justify-center mx-auto mb-3">
            <BookOpen size={20} />
          </div>
          <h3 className="text-sm font-medium text-fg">No course offerings found</h3>
          <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1 mb-4">
            {searchQuery
              ? 'No classes match your search query.'
              : 'Add your courses manually with their days and times, or import your spreadsheet.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingOffering(null);
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={14} /> Add First Class
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOfferings.map((off, idx) => {
            const color = getSubjectColor(off.course_color, idx);
            return (
              <div
                key={off.id}
                className="rounded-lg border border-border-default bg-surface p-4 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Code, Title, Section Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold border"
                          style={{
                            backgroundColor: color.bg,
                            borderColor: color.border,
                            color: color.text,
                          }}
                        >
                          {off.course_code}
                        </span>
                        {off.section_code && (
                          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-fg-secondary border border-border-subtle">
                            Sec {off.section_code}
                          </span>
                        )}
                        {off.course_units && (
                          <span className="text-[11px] text-fg-muted">
                            {off.course_units} units
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-fg mt-1.5">
                        {off.course_title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(off)}
                        className="p-1.5 rounded hover:bg-surface-secondary text-fg-muted hover:text-fg transition-colors"
                        title="Edit Class"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(off)}
                        className="p-1.5 rounded hover:bg-surface-secondary text-fg-muted hover:text-status-danger transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Instructor & Room */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted mt-2">
                    {off.instructor && (
                      <div className="flex items-center gap-1">
                        <UserIcon size={12} className="shrink-0" />
                        <span>{off.instructor}</span>
                      </div>
                    )}
                    {off.default_room && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="shrink-0" />
                        <span>{off.default_room}</span>
                      </div>
                    )}
                  </div>

                  {/* Meeting Sessions */}
                  <div className="mt-3 pt-3 border-t border-border-subtle space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-fg-muted block">
                      Meeting Pattern ({off.meeting_sessions.length} session{off.meeting_sessions.length === 1 ? '' : 's'})
                    </span>
                    <div className="space-y-1">
                      {off.meeting_sessions.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded bg-surface-secondary/60 text-fg"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-accent">
                              {DAY_NAMES[s.day_of_week]}
                            </span>
                            <span className="font-mono text-[11px] text-fg-secondary">
                              {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                            {s.room && <span>{s.room}</span>}
                            {s.meeting_type && (
                              <span className="px-1.5 py-0.2 rounded bg-surface border border-border-subtle text-[10px]">
                                {s.meeting_type}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Class Form Modal */}
      <ClassFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        onDelete={(id) => deleteOfferingMutation.mutateAsync(id)}
        initialData={
          editingOffering
            ? { course: editingCourse || undefined, offering: editingOffering }
            : null
        }
      />

      {/* Spreadsheet / CSV Importer Modal (Milestone 2) */}
      <SpreadsheetImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportOfferings={async (rows) => {
          for (const row of rows) {
            await createCourseMutation.mutateAsync({
              course_code: row.course_code,
              course_title: row.course_title,
              section_code: row.section_code,
              units: parseFloat(row.units) || 3.0,
              instructor: row.instructor,
              default_room: row.room,
              meeting_sessions: [
                {
                  day_of_week: row.day_of_week,
                  start_time: row.start_time,
                  end_time: row.end_time,
                  room: row.room,
                },
              ],
            });
          }
        }}
      />
    </div>
  );
};

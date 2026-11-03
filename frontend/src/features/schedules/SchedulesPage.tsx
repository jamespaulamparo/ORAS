import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithCsrf } from '../../lib/api';
import { Workspace, Offering, Course, ConflictCheckResult } from '../../types/planner';
import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { ClassFormModal } from '../../components/forms/ClassFormModal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { 
  Plus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Printer, 
  Sparkles, 
  Layers,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SchedulesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // View settings
  const [showWeekends, setShowWeekends] = useState(false);
  const [timeFormat12h, setTimeFormat12h] = useState(true);

  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);

  // Fetch current workspace
  const { data: workspace, isLoading } = useQuery<Workspace>({
    queryKey: ['workspace', 'current'],
    queryFn: () => fetchWithCsrf('/api/workspaces/current/'),
  });

  // Fetch all offerings
  const { data: offerings = [] } = useQuery<Offering[]>({
    queryKey: ['offerings', workspace?.id],
    queryFn: () => fetchWithCsrf(`/api/workspaces/${workspace!.id}/offerings/`),
    enabled: !!workspace?.id,
  });

  // Determine which offerings to display on active timetable:
  const activeSchedule = workspace?.schedules?.[0];
  const displayedOfferings = activeSchedule && activeSchedule.selections?.length > 0
    ? activeSchedule.selections.map(s => s.offering)
    : offerings;

  // Conflict detection query
  const { data: conflictData } = useQuery<ConflictCheckResult>({
    queryKey: ['conflicts', displayedOfferings.map(o => o.id)],
    queryFn: () =>
      fetchWithCsrf(`/api/workspaces/${workspace!.id}/check-conflicts/`, {
        method: 'POST',
        body: JSON.stringify({ offering_ids: displayedOfferings.map(o => o.id) }),
      }),
    enabled: !!workspace?.id && displayedOfferings.length > 1,
  });

  // Create course mutation
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
      showToast(`Added ${variables.course_code || 'class'} to timetable`, 'success');
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to add class', 'danger');
    },
  });

  // Update offering mutation (saves course details + section + all session changes)
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
    if (selectedOffering) {
      await updateOfferingMutation.mutateAsync({
        id: selectedOffering.id,
        data: formData, // Send entire updated object including course and sessions!
      });
    } else {
      await createCourseMutation.mutateAsync(formData);
    }
  };

  const handleSelectOffering = (off: Offering) => {
    setSelectedOffering(off);
    setIsClassModalOpen(true);
  };

  // Metrics computation
  const totalUnits = displayedOfferings.reduce((sum, off) => {
    const u = parseFloat(String(off.course_units || 0));
    return sum + (isNaN(u) ? 0 : u);
  }, 0);

  const distinctDays = new Set(
    displayedOfferings.flatMap(o => o.meeting_sessions.map(s => s.day_of_week))
  ).size;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">
      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-fg">
              {workspace?.name || 'Class Timetable'}
            </h1>
            {conflictData?.has_conflicts ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-danger-surface text-status-danger border border-status-danger-border flex items-center gap-1">
                <AlertCircle size={11} /> Overlaps
              </span>
            ) : (
              displayedOfferings.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-status-success-surface text-status-success border border-status-success-border flex items-center gap-1">
                  <CheckCircle2 size={11} /> Conflict-Free
                </span>
              )
            )}
          </div>
          <p className="text-xs text-fg-muted mt-0.5">
            {distinctDays} school day{distinctDays === 1 ? '' : 's'} · {totalUnits > 0 ? `${totalUnits} units · ` : ''}
            {displayedOfferings.length} scheduled class{displayedOfferings.length === 1 ? '' : 'es'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 12h/24h toggle */}
          <button
            type="button"
            onClick={() => setTimeFormat12h(!timeFormat12h)}
            className="px-2.5 py-1.5 rounded-md border border-border-default bg-surface text-xs font-mono text-fg-secondary hover:text-fg"
            title="Toggle 12-hour or 24-hour display"
          >
            {timeFormat12h ? '12h' : '24h'}
          </button>

          {/* Weekend Toggle */}
          <button
            type="button"
            onClick={() => setShowWeekends(!showWeekends)}
            className={`px-2.5 py-1.5 rounded-md border text-xs transition-colors ${
              showWeekends
                ? 'bg-accent text-accent-contrast border-accent'
                : 'border-border-default bg-surface text-fg-secondary hover:text-fg'
            }`}
          >
            {showWeekends ? '7 Days' : '5 Days'}
          </button>

          {/* Print / Export PDF */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            title="Print or Save as PDF"
          >
            <Printer size={14} /> Print
          </Button>

          {/* Generator Shortcut */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/builder')}
          >
            <Sparkles size={14} /> Generator
          </Button>

          {/* Add Class Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedOffering(null);
              setIsClassModalOpen(true);
            }}
          >
            <Plus size={14} /> Add Class
          </Button>
        </div>
      </div>

      {/* Conflict Diagnostic Box */}
      {conflictData?.has_conflicts && (
        <div className="p-4 rounded-lg bg-status-danger-surface border border-status-danger-border">
          <div className="flex items-center gap-2 text-status-danger text-xs font-semibold mb-1">
            <AlertCircle size={15} />
            <span>Time Overlap Detected ({conflictData.conflict_count})</span>
          </div>
          <p className="text-xs text-status-danger opacity-90 mb-2">
            The following classes have overlapping meeting hours on the same weekday:
          </p>
          <ul className="text-xs text-status-danger space-y-1 pl-5 list-disc font-medium">
            {conflictData.conflicts.map((c, i) => (
              <li key={i}>{c.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Timetable Display */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-fg-muted">
          Loading timetable...
        </div>
      ) : displayedOfferings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-default p-12 text-center bg-surface/50">
          <div className="w-10 h-10 rounded-full bg-surface-secondary text-fg-muted flex items-center justify-center mx-auto mb-3">
            <Calendar size={20} />
          </div>
          <h3 className="text-sm font-medium text-fg">Your timetable is empty</h3>
          <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1 mb-4">
            Add your subjects and sections manually or import your schedule spreadsheet to visualize your weekly classes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedOffering(null);
                setIsClassModalOpen(true);
              }}
            >
              <Plus size={14} /> Add Class
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/builder')}
            >
              <Sparkles size={14} /> Generator
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <TimetableGrid
            offerings={displayedOfferings}
            conflicts={conflictData?.conflicts || []}
            onSelectOffering={handleSelectOffering}
            showWeekends={showWeekends}
            timeFormat12h={timeFormat12h}
          />
        </div>
      )}

      {/* Class Form Modal */}
      <ClassFormModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSubmit={handleFormSubmit}
        onDelete={(id) => deleteOfferingMutation.mutateAsync(id)}
        initialData={
          selectedOffering
            ? {
                course: workspace?.courses.find(c => c.id === selectedOffering.course),
                offering: selectedOffering,
              }
            : null
        }
      />
    </div>
  );
};

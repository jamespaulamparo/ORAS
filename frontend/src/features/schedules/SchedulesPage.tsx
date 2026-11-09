import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithCsrf } from '../../lib/api';
import { Workspace, Offering, Course, ConflictCheckResult } from '../../types/planner';
import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { EnrolledCoursesTable } from '../../components/timetable/EnrolledCoursesTable';
import { ClassFormModal } from '../../components/forms/ClassFormModal';
import { SettingsModal } from '../settings/SettingsModal';
import { OrasMascot } from '../../components/ui/OrasMascot';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../settings/ThemeContext';
import { toPng } from 'html-to-image';
import { 
  Plus, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Download, 
  ChevronDown,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SchedulesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentTheme } = useTheme();

  // Export container ref
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // View settings
  const [showWeekends, setShowWeekends] = useState(false);
  const [timeFormat12h, setTimeFormat12h] = useState(true);

  // Modal states
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [slotPrefill, setSlotPrefill] = useState<{ day_of_week: number; start_time: string; end_time: string } | null>(null);

  // Listen to events from the dedicated ScheduleWorkspaceSidebar
  React.useEffect(() => {
    const handleOpenAdd = () => {
      setSelectedOffering(null);
      setSlotPrefill(null);
      setIsClassModalOpen(true);
    };
    const handleEditClass = (e: any) => {
      setSelectedOffering(e.detail);
      setSlotPrefill(null);
      setIsClassModalOpen(true);
    };
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener('oras:open-add-class', handleOpenAdd);
    window.addEventListener('oras:edit-class', handleEditClass);
    window.addEventListener('oras:open-settings', handleOpenSettings);

    return () => {
      window.removeEventListener('oras:open-add-class', handleOpenAdd);
      window.removeEventListener('oras:edit-class', handleEditClass);
      window.removeEventListener('oras:open-settings', handleOpenSettings);
    };
  }, []);

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
        data: formData,
      });
    } else {
      await createCourseMutation.mutateAsync(formData);
    }
  };

  const handleSelectOffering = (off: Offering) => {
    setSelectedOffering(off);
    setSlotPrefill(null);
    setIsClassModalOpen(true);
  };

  const handleEmptySlotClick = (slot: { day_of_week: number; start_time: string; end_time: string }) => {
    setSelectedOffering(null);
    setSlotPrefill(slot);
    setIsClassModalOpen(true);
  };

  // Export timetable strictly as high-resolution PNG
  const handleExportPng = async () => {
    setShowExportMenu(false);
    if (!scheduleRef.current) return;
    try {
      setIsExporting(true);
      showToast('Rendering timetable image...', 'info');
      const dataUrl = await toPng(scheduleRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: currentTheme.isDark ? currentTheme.sampleBg : '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `ORAS_${workspace?.name || 'Timetable'}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Downloaded schedule image', 'success');
    } catch (err: any) {
      showToast('Failed to export timetable PNG', 'danger');
    } finally {
      setIsExporting(false);
    }
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
      {/* Top Bar: Title & Consolidated Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-fg tracking-tight">
              {workspace?.name || 'Class Timetable'}
            </h1>
            {conflictData?.has_conflicts ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-status-danger-surface text-status-danger border border-status-danger-border flex items-center gap-1">
                <AlertCircle size={11} /> Overlaps
              </span>
            ) : (
              displayedOfferings.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-status-success-surface text-status-success border border-status-success-border flex items-center gap-1">
                  <CheckCircle2 size={11} /> Conflict-Free
                </span>
              )
            )}
          </div>
          <p className="text-xs text-fg-muted mt-0.5 font-medium">
            {distinctDays} school day{distinctDays === 1 ? '' : 's'} · {totalUnits > 0 ? `${totalUnits} units · ` : ''}
            {displayedOfferings.length} subject{displayedOfferings.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Clean Consolidated Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Dropdown (Schedule only: PNG or PDF) */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
            >
              <Download size={13} />
              <span>Export</span>
              <ChevronDown size={12} className="opacity-60" />
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-lg bg-surface border border-border-default shadow-card py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={handleExportPng}
                  className="w-full text-left px-3 py-2 hover:bg-surface-secondary text-fg flex items-center gap-2 transition-colors font-medium"
                >
                  <Download size={13} className="text-accent" />
                  <span>Download as PNG Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    window.print();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-surface-secondary text-fg flex items-center gap-2 transition-colors font-medium"
                >
                  <Printer size={13} className="text-accent" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Dedicated Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            title="Themes, 12h/24h, 5/7 days, and Account"
          >
            <Sliders size={13} />
            <span>Settings</span>
          </Button>

          {/* Generator Shortcut */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/builder')}
          >
            <Sparkles size={13} />
            <span>Generator</span>
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
            <Plus size={14} />
            <span>Add Class</span>
          </Button>
        </div>
      </div>

      {/* Conflict Diagnostic Box */}
      {conflictData?.has_conflicts && (
        <div className="p-4 rounded-lg bg-status-danger-surface border border-status-danger-border no-print">
          <div className="flex items-center gap-2 text-status-danger text-xs font-bold mb-1">
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

      {/* Printable Schedule Area */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-fg-muted font-medium">
          Loading timetable...
        </div>
      ) : displayedOfferings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default p-10 text-center bg-surface/50 flex flex-col items-center">
          <OrasMascot size="md" withSpeechBubble="Your timetable is fresh and ready! Click any empty time slot or + Add Class." />
          <h3 className="text-sm font-bold text-fg mt-4">No classes scheduled yet</h3>
          <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            Click directly on any blank calendar slot to schedule a 1-hour class, or launch the automated generator.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedOffering(null);
                setSlotPrefill(null);
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
        <div id="schedule-export-container" ref={scheduleRef} className="space-y-4 p-1">
          {/* Clean watermark / header for exported PNG/print */}
          <div className="hidden print:flex items-center justify-between pb-3 border-b border-border-default">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-fg">ORAS Timetable</h2>
              <span className="text-xs text-fg-muted font-medium">
                {workspace?.name} · {totalUnits} Units · {distinctDays} School Days
              </span>
            </div>
            <span className="text-xs font-mono text-fg-muted">oras.schedule</span>
          </div>

          {/* Timetable Grid with fixed 8am/5pm clipping, 100% width, and click-to-schedule */}
          <TimetableGrid
            offerings={displayedOfferings}
            conflicts={conflictData?.conflicts || []}
            onSelectOffering={handleSelectOffering}
            onSelectEmptySlot={handleEmptySlotClick}
            showWeekends={showWeekends}
            timeFormat12h={timeFormat12h}
          />

          {/* Color-Coded Enrolled Classes Summary Table on the bottom of the schedule */}
          <EnrolledCoursesTable
            offerings={displayedOfferings}
            onEditOffering={handleSelectOffering}
            onDeleteOffering={(id) => deleteOfferingMutation.mutateAsync(id)}
          />
        </div>
      )}

      {/* Class Form Modal */}
      <ClassFormModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setSlotPrefill(null);
        }}
        onSubmit={async (formData) => {
          await handleFormSubmit(formData);
          setSlotPrefill(null);
        }}
        onDelete={(id) => deleteOfferingMutation.mutateAsync(id)}
        initialData={
          selectedOffering
            ? {
                course: workspace?.courses.find(c => c.id === selectedOffering.course),
                offering: selectedOffering,
              }
            : slotPrefill
            ? {
                slotPrefill,
              }
            : null
        }
      />

      {/* Consolidated Dedicated Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        timeFormat12h={timeFormat12h}
        setTimeFormat12h={setTimeFormat12h}
        showWeekends={showWeekends}
        setShowWeekends={setShowWeekends}
      />
    </div>
  );
};
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithCsrf } from '../../lib/api';
import { Workspace, Offering } from '../../types/planner';
import { Button } from '../../components/ui/Button';
import { TimetableGrid } from '../../components/timetable/TimetableGrid';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../settings/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ArrowRight,
  Sliders,
  Layers,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { parseTimeToMinutes, DAY_NAMES } from '../../lib/timetable';

interface ScheduleAlternative {
  id: number;
  offerings: Offering[];
  score: number;
  distinctDays: number;
  earliestMin: number;
  latestMin: number;
  totalGapMin: number;
}

export const BuilderPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentTheme } = useTheme();

  // Preferences
  const [timePref, setTimePref] = useState<'any' | 'morning' | 'afternoon'>('any');
  const [compactDays, setCompactDays] = useState(true);
  const [freeFridays, setFreeFridays] = useState(false);
  const [selectedCourseCodes, setSelectedCourseCodes] = useState<string[]>([]);
  
  // Results
  const [isGenerated, setIsGenerated] = useState(false);
  const [alternatives, setAlternatives] = useState<ScheduleAlternative[]>([]);
  const [selectedAltIndex, setSelectedAltIndex] = useState(0);

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

  // Group offerings by course code
  const courseGroups: Record<string, Offering[]> = {};
  for (const off of offerings) {
    if (!courseGroups[off.course_code]) {
      courseGroups[off.course_code] = [];
    }
    courseGroups[off.course_code].push(off);
  }

  // Pre-select all courses by default if none selected
  React.useEffect(() => {
    if (offerings.length > 0 && selectedCourseCodes.length === 0) {
      setSelectedCourseCodes(Object.keys(courseGroups));
    }
  }, [offerings]);

  const toggleCourse = (code: string) => {
    if (selectedCourseCodes.includes(code)) {
      setSelectedCourseCodes(selectedCourseCodes.filter(c => c !== code));
    } else {
      setSelectedCourseCodes([...selectedCourseCodes, code]);
    }
  };

  // Backtracking solver
  const handleGenerate = () => {
    if (selectedCourseCodes.length === 0) {
      showToast('Select at least one subject to generate schedules', 'danger');
      return;
    }

    const groupsToSolve = selectedCourseCodes.map(code => courseGroups[code] || []);
    // Verify each selected course has at least one offering
    for (let i = 0; i < selectedCourseCodes.length; i++) {
      if (groupsToSolve[i].length === 0) {
        showToast(`Subject ${selectedCourseCodes[i]} has no offerings`, 'danger');
        return;
      }
    }

    const validSchedules: Offering[][] = [];

    // Check if two offerings conflict
    const hasOverlap = (a: Offering, b: Offering): boolean => {
      for (const sa of a.meeting_sessions) {
        for (const sb of b.meeting_sessions) {
          if (sa.day_of_week === sb.day_of_week) {
            const startA = parseTimeToMinutes(sa.start_time);
            const endA = parseTimeToMinutes(sa.end_time);
            const startB = parseTimeToMinutes(sb.start_time);
            const endB = parseTimeToMinutes(sb.end_time);
            // Half-open interval test: max(startA, startB) < min(endA, endB)
            if (Math.max(startA, startB) < Math.min(endA, endB)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // Recursive search
    const search = (index: number, currentCombination: Offering[]) => {
      if (validSchedules.length >= 25) return; // Limit to top 25 valid alternatives

      if (index === groupsToSolve.length) {
        validSchedules.push([...currentCombination]);
        return;
      }

      for (const offering of groupsToSolve[index]) {
        let conflict = false;
        for (const existing of currentCombination) {
          if (hasOverlap(existing, offering)) {
            conflict = true;
            break;
          }
        }

        if (!conflict) {
          currentCombination.push(offering);
          search(index + 1, currentCombination);
          currentCombination.pop();
        }
      }
    };

    search(0, []);

    if (validSchedules.length === 0) {
      showToast('No conflict-free combinations possible. Try selecting fewer subjects or adding alternative sections.', 'danger');
      setAlternatives([]);
      setIsGenerated(true);
      return;
    }

    // Score and rank alternatives based on user preferences
    const scored: ScheduleAlternative[] = validSchedules.map((combo, idx) => {
      let earliest = 24 * 60;
      let latest = 0;
      const days = new Set<number>();
      const sessionsByDay: Record<number, { start: number; end: number }[]> = {};

      for (const off of combo) {
        for (const s of off.meeting_sessions) {
          const sMin = parseTimeToMinutes(s.start_time);
          const eMin = parseTimeToMinutes(s.end_time);
          days.add(s.day_of_week);
          if (sMin < earliest) earliest = sMin;
          if (eMin > latest) latest = eMin;

          if (!sessionsByDay[s.day_of_week]) sessionsByDay[s.day_of_week] = [];
          sessionsByDay[s.day_of_week].push({ start: sMin, end: eMin });
        }
      }

      // Calculate total gaps between classes on the same day
      let totalGaps = 0;
      for (const dayNum in sessionsByDay) {
        const sorted = sessionsByDay[dayNum].sort((a, b) => a.start - b.start);
        for (let i = 0; i < sorted.length - 1; i++) {
          const gap = sorted[i + 1].start - sorted[i].end;
          if (gap > 0) totalGaps += gap;
        }
      }

      // Preference scoring formula
      let score = 100;
      if (compactDays) {
        score -= days.size * 10; // Fewer campus days gets higher score
      }
      if (freeFridays && !days.has(5)) {
        score += 25; // Bonus for Friday off
      }
      if (timePref === 'morning') {
        if (earliest >= 8 * 60 && earliest <= 10 * 60) score += 20;
        if (latest > 16 * 60) score -= (latest - 16 * 60) / 10;
      } else if (timePref === 'afternoon') {
        if (earliest < 10 * 60) score -= (10 * 60 - earliest) / 10;
        if (latest >= 13 * 60) score += 15;
      }

      // Penalize dead gaps between classes
      score -= Math.floor(totalGaps / 30) * 3;

      return {
        id: idx + 1,
        offerings: combo,
        score,
        distinctDays: days.size,
        earliestMin: earliest,
        latestMin: latest,
        totalGapMin: totalGaps,
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    setAlternatives(scored);
    setSelectedAltIndex(0);
    setIsGenerated(true);
    showToast(`Found ${scored.length} valid conflict-free schedules!`, 'success');
  };

  // Apply selected alternative to current schedule mutation
  const applyScheduleMutation = useMutation({
    mutationFn: async (chosenOfferings: Offering[]) => {
      const activeSchedule = workspace?.schedules?.[0];
      if (activeSchedule) {
        await fetchWithCsrf(`/api/schedules/${activeSchedule.id}/`, {
          method: 'PATCH',
          body: JSON.stringify({
            offering_ids: chosenOfferings.map(o => o.id),
          }),
        });
      } else {
        await fetchWithCsrf(`/api/workspaces/${workspace!.id}/schedules/`, {
          method: 'POST',
          body: JSON.stringify({
            name: 'Generated Timetable',
            offering_ids: chosenOfferings.map(o => o.id),
          }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'current'] });
      queryClient.invalidateQueries({ queryKey: ['offerings'] });
      showToast('Applied schedule to your timetable!', 'success');
      navigate('/schedules');
    },
    onError: (err: any) => {
      showToast(err.message || 'Failed to apply schedule', 'danger');
    },
  });

  const activeAlt = alternatives[selectedAltIndex];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h1 className="text-xl font-bold text-fg tracking-tight">Schedule Generator</h1>
          </div>
          <p className="text-xs text-fg-muted mt-0.5">
            Select your subjects and let the deterministic constraint solver assemble optimal, conflict-free alternatives.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleGenerate}
          disabled={selectedCourseCodes.length === 0}
        >
          <Sparkles size={14} />
          <span>Generate Valid Schedules</span>
        </Button>
      </div>

      {/* Main Grid: Controls & Course Selector Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preferences & Course Checkbox Stack */}
        <div className="lg:col-span-4 space-y-5">
          {/* Scheduling Preferences Box */}
          <div className="p-4 rounded-xl border border-border-default bg-surface shadow-soft space-y-3.5 text-xs">
            <h3 className="font-bold text-fg flex items-center gap-1.5">
              <Sliders size={14} className="text-accent" />
              <span>Optimization Preferences</span>
            </h3>

            {/* Time Preference */}
            <div>
              <label className="text-[11px] font-semibold text-fg-muted block mb-1">Time of Day</label>
              <div className="grid grid-cols-3 gap-1.5 p-0.5 rounded-lg bg-surface-secondary border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setTimePref('any')}
                  className={`py-1 rounded-md text-xs font-semibold transition-colors ${
                    timePref === 'any' ? 'bg-accent text-accent-contrast shadow-xs' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  Any Time
                </button>
                <button
                  type="button"
                  onClick={() => setTimePref('morning')}
                  className={`py-1 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                    timePref === 'morning' ? 'bg-accent text-accent-contrast shadow-xs' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  <Sun size={11} /> Morning
                </button>
                <button
                  type="button"
                  onClick={() => setTimePref('afternoon')}
                  className={`py-1 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                    timePref === 'afternoon' ? 'bg-accent text-accent-contrast shadow-xs' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  <Moon size={11} /> Afternoon
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1 border-t border-border-subtle">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-fg font-medium">Minimize Campus Days</span>
                <input
                  type="checkbox"
                  checked={compactDays}
                  onChange={(e) => setCompactDays(e.target.checked)}
                  className="rounded text-accent focus:ring-accent"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-fg font-medium">Aim for Free Fridays</span>
                <input
                  type="checkbox"
                  checked={freeFridays}
                  onChange={(e) => setFreeFridays(e.target.checked)}
                  className="rounded text-accent focus:ring-accent"
                />
              </label>
            </div>
          </div>

          {/* Course Subject Selector Stack */}
          <div className="p-4 rounded-xl border border-border-default bg-surface shadow-soft space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-fg flex items-center gap-1.5">
                <Layers size={14} className="text-accent" />
                <span>Select Subjects to Take</span>
              </h3>
              <span className="font-mono text-[11px] text-fg-muted">
                {selectedCourseCodes.length} of {Object.keys(courseGroups).length}
              </span>
            </div>

            {Object.keys(courseGroups).length === 0 ? (
              <div className="p-4 text-center text-fg-muted border border-dashed border-border-subtle rounded-lg">
                No course offerings found. Add classes in the Offerings tab first.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {Object.entries(courseGroups).map(([code, offs]) => {
                  const isSelected = selectedCourseCodes.includes(code);
                  const firstOff = offs[0];
                  return (
                    <div
                      key={code}
                      onClick={() => toggleCourse(code)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-accent bg-accent-surface/30'
                          : 'border-border-subtle bg-surface hover:bg-surface-secondary'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-fg">{code}</span>
                          <span className="text-[10px] font-mono px-1 rounded bg-surface border border-border-subtle text-fg-muted">
                            {offs.length} section{offs.length === 1 ? '' : 's'}
                          </span>
                        </div>
                        <span className="text-[11px] text-fg-muted truncate block">
                          {firstOff.course_title}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-accent focus:ring-accent pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Generated Alternatives Preview */}
        <div className="lg:col-span-8 space-y-4">
          {!isGenerated ? (
            <div className="rounded-2xl border border-dashed border-border-default p-12 text-center bg-surface/40 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent-surface text-accent flex items-center justify-center">
                <Sparkles size={22} />
              </div>
              <h3 className="text-sm font-bold text-fg">Ready to generate combinations</h3>
              <p className="text-xs text-fg-muted max-w-md mx-auto leading-relaxed">
                Choose your desired subjects on the left and click "Generate Valid Schedules". ORAS will evaluate every possible section combination, filter out conflicts, and present the cleanest options.
              </p>
            </div>
          ) : alternatives.length === 0 ? (
            <div className="rounded-2xl border border-status-danger-border bg-status-danger-surface p-8 text-center space-y-2">
              <AlertCircle size={24} className="text-status-danger mx-auto" />
              <h3 className="text-sm font-bold text-status-danger">No conflict-free schedules found</h3>
              <p className="text-xs text-status-danger opacity-90 max-w-md mx-auto">
                All possible section combinations for the selected subjects have time collisions. Try selecting fewer subjects or add alternative sections.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Alternatives Navigator Carousel */}
              <div className="p-3 rounded-xl border border-border-default bg-surface shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-fg-muted uppercase font-bold tracking-wider block">
                    Alternative {selectedAltIndex + 1} of {alternatives.length}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 font-bold text-fg">
                    <span>Rank #{selectedAltIndex + 1}</span>
                    <span>·</span>
                    <span className="text-status-success font-semibold">
                      {activeAlt.distinctDays} school days
                    </span>
                    <span>·</span>
                    <span className="font-mono text-fg-muted text-[11px]">
                      {activeAlt.totalGapMin === 0 ? 'No Gaps' : `${activeAlt.totalGapMin}m gap`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Selector Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] p-0.5 rounded-lg bg-surface-secondary border border-border-subtle">
                    {alternatives.map((alt, idx) => (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => setSelectedAltIndex(idx)}
                        className={`w-6 h-6 rounded text-[11px] font-mono font-bold transition-colors ${
                          selectedAltIndex === idx
                            ? 'bg-accent text-accent-contrast shadow-xs'
                            : 'text-fg-muted hover:text-fg'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => applyScheduleMutation.mutate(activeAlt.offerings)}
                    isLoading={applyScheduleMutation.isPending}
                  >
                    <Check size={14} />
                    <span>Apply to Timetable</span>
                  </Button>
                </div>
              </div>

              {/* Live Preview Timetable Grid */}
              <div className="rounded-xl border border-border-default bg-surface shadow-card p-1">
                <TimetableGrid
                  offerings={activeAlt.offerings}
                  conflicts={[]}
                  showWeekends={false}
                  timeFormat12h={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

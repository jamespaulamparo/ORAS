import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWithCsrf } from '../../lib/api';
import { Workspace, Offering } from '../../types/planner';
import { useTheme } from '../../features/settings/ThemeContext';
import { 
  Plus, 
  Sparkles, 
  Sliders, 
  Menu, 
  ArrowLeft,
  Layers
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { OrasLogo } from '../ui/OrasLogo';

interface ScheduleWorkspaceSidebarProps {
  onOpenClassModal?: () => void;
  onOpenSettings?: () => void;
  onSwitchToMainNav: () => void;
}

export const ScheduleWorkspaceSidebar: React.FC<ScheduleWorkspaceSidebarProps> = ({
  onOpenClassModal,
  onOpenSettings,
  onSwitchToMainNav,
}) => {
  const navigate = useNavigate();
  const { currentTheme, getSubjectColor } = useTheme();

  // Fetch current workspace
  const { data: workspace } = useQuery<Workspace>({
    queryKey: ['workspace', 'current'],
    queryFn: () => fetchWithCsrf('/api/workspaces/current/'),
  });

  // Fetch all offerings
  const { data: offerings = [] } = useQuery<Offering[]>({
    queryKey: ['offerings', workspace?.id],
    queryFn: () => fetchWithCsrf(`/api/workspaces/${workspace!.id}/offerings/`),
    enabled: !!workspace?.id,
  });

  const activeSchedule = workspace?.schedules?.[0];
  const displayedOfferings = activeSchedule && activeSchedule.selections?.length > 0
    ? activeSchedule.selections.map(s => s.offering)
    : offerings;

  const totalUnits = displayedOfferings.reduce((sum, off) => {
    const u = parseFloat(String(off.course_units || 0));
    return sum + (isNaN(u) ? 0 : u);
  }, 0);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border-subtle bg-surface px-4 py-5 shrink-0 justify-between select-none">
      <div className="space-y-5">
        {/* Clean Header: Brand + Menu Exit Button */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2">
            <OrasLogo size="sm" />
          </Link>
          <button
            type="button"
            onClick={onSwitchToMainNav}
            className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-secondary text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Switch to general navigation"
          >
            <Menu size={14} />
            <span>Menu</span>
          </button>
        </div>

        {/* Schedule Title & Units Summary (Clean & Unslop, No Duplicate Conflict Badges) */}
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-fg truncate">
            {workspace?.name || 'Class Timetable'}
          </h2>
          <p className="text-xs text-fg-muted font-mono">
            {displayedOfferings.length} subjects · {totalUnits} units
          </p>
        </div>

        {/* Primary Class Creation Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('oras:open-add-class'));
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-accent text-accent-contrast font-bold text-xs hover:bg-accent-hover shadow-soft flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Add Class</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="w-full py-2 px-3.5 rounded-xl bg-surface border border-border-default hover:border-border-strong text-fg text-xs font-semibold hover:bg-surface-secondary flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles size={13} className="text-accent" />
            <span>Generator</span>
          </button>
        </div>

        {/* Enrolled Subjects Outline */}
        <div className="space-y-2 pt-2 border-t border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-fg-muted uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} /> Subjects
            </span>
            <span className="text-[11px] font-mono text-fg-muted">
              {displayedOfferings.length}
            </span>
          </div>

          <div className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
            {displayedOfferings.length === 0 ? (
              <div className="p-4 text-center text-xs text-fg-muted rounded-xl border border-dashed border-border-subtle space-y-1">
                <p className="font-medium">No subjects yet.</p>
                <p className="text-[11px]">Click + Add Class or tap empty calendar space.</p>
              </div>
            ) : (
              displayedOfferings.map((off, idx) => {
                const color = getSubjectColor(off.course_color, idx);
                return (
                  <div
                    key={off.id}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('oras:edit-class', { detail: off }));
                    }}
                    className="p-2.5 rounded-lg hover:bg-surface-secondary border border-transparent hover:border-border-subtle cursor-pointer transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: color.bg, borderColor: color.border }}
                      />
                      <div className="truncate">
                        <span className="font-bold text-fg block truncate text-xs">
                          {off.course_code}
                        </span>
                        <span className="text-[11px] text-fg-muted truncate block max-w-[130px]">
                          {off.course_title}
                        </span>
                      </div>
                    </div>
                    {off.section_code && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-fg-muted shrink-0 font-medium">
                        {off.section_code}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="pt-4 border-t border-border-subtle space-y-2">
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('oras:open-settings'));
          }}
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-secondary text-xs text-fg-secondary hover:text-fg transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold">
            <Sliders size={14} className="text-accent" />
            <span>Settings</span>
          </span>
          <span className="text-xs font-semibold text-fg">
            {currentTheme.name}
          </span>
        </button>

        <button
          type="button"
          onClick={onSwitchToMainNav}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-surface-secondary text-xs text-fg-muted hover:text-fg font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Exit to Main Menu</span>
        </button>
      </div>
    </aside>
  );
};

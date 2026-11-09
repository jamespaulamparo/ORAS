import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useTheme } from './ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { 
  Palette, 
  Clock, 
  Calendar, 
  User, 
  Check, 
  Moon, 
  Sun, 
  Type,
  LogIn,
  LogOut,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeFormat12h?: boolean;
  setTimeFormat12h?: (val: boolean) => void;
  showWeekends?: boolean;
  setShowWeekends?: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  timeFormat12h = true,
  setTimeFormat12h,
  showWeekends = false,
  setShowWeekends,
}) => {
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const { user, logout } = useAuth();
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all');
  const [activeTab, setActiveTab] = useState<'themes' | 'display' | 'account'>('themes');

  const darkThemes = themes.filter((t) => t.isDark);
  const lightThemes = themes.filter((t) => !t.isDark);

  const displayedThemes =
    filterMode === 'dark'
      ? darkThemes
      : filterMode === 'light'
      ? lightThemes
      : themes;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Preferences"
      description="Customize themes, display rules, and session controls in one place."
      maxWidth="2xl"
    >
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-3 mb-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('themes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'themes'
              ? 'bg-accent text-accent-contrast shadow-sm'
              : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
          }`}
        >
          <Palette size={14} />
          <span>Themes ({themes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('display')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'display'
              ? 'bg-accent text-accent-contrast shadow-sm'
              : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
          }`}
        >
          <Sliders size={14} />
          <span>Display & Timetable</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'account'
              ? 'bg-accent text-accent-contrast shadow-sm'
              : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
          }`}
        >
          <User size={14} />
          <span>Student Account</span>
        </button>
      </div>

      {/* Tab 1: Themes */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-fg-muted">
              Current: <strong className="text-fg">{currentTheme.name}</strong> ({currentTheme.isDark ? 'Dark' : 'Light'})
            </span>

            {/* Filter pills */}
            <div className="flex items-center p-0.5 rounded-md bg-surface-secondary border border-border-subtle text-[11px]">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  filterMode === 'all' ? 'bg-surface text-fg shadow-xs font-semibold' : 'text-fg-muted'
                }`}
              >
                All (16)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('dark')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium transition-colors ${
                  filterMode === 'dark' ? 'bg-surface text-fg shadow-xs font-semibold' : 'text-fg-muted'
                }`}
              >
                <Moon size={10} /> Dark (8)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('light')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded font-medium transition-colors ${
                  filterMode === 'light' ? 'bg-surface text-fg shadow-xs font-semibold' : 'text-fg-muted'
                }`}
              >
                <Sun size={10} /> Light (8)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {displayedThemes.map((t) => {
              const isSelected = theme === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between group ${
                    isSelected
                      ? 'border-accent ring-2 ring-accent bg-surface shadow-sm'
                      : 'border-border-default hover:border-border-strong bg-surface/70 hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-fg truncate">{t.name}</span>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-accent text-accent-contrast flex items-center justify-center shrink-0">
                        <Check size={9} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  {/* Surface preview */}
                  <div
                    className="w-full h-8 rounded border mb-2 flex items-center justify-center p-1"
                    style={{ backgroundColor: t.sampleBg, borderColor: t.sampleAccent }}
                  >
                    <div
                      className="w-full h-3 rounded text-[8px] flex items-center justify-center font-medium"
                      style={{ backgroundColor: t.sampleAccent, color: '#ffffff' }}
                    >
                      {t.name}
                    </div>
                  </div>

                  {/* Mini Palette preview */}
                  <div className="grid grid-cols-4 gap-1 w-full">
                    {t.coursePalette.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="h-2 rounded border"
                        style={{ backgroundColor: c.bg, borderColor: c.border }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Display & Timetable Preferences */}
      {activeTab === 'display' && (
        <div className="space-y-4 text-xs">
          {/* Time format */}
          {setTimeFormat12h && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border-subtle">
              <div>
                <span className="font-semibold text-fg block">Time Display Format</span>
                <span className="text-[11px] text-fg-muted">Choose between 12-hour (8:30 AM) and 24-hour (08:30) timestamps.</span>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-surface border border-border-subtle font-mono">
                <button
                  type="button"
                  onClick={() => setTimeFormat12h(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    timeFormat12h ? 'bg-accent text-accent-contrast' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  12h
                </button>
                <button
                  type="button"
                  onClick={() => setTimeFormat12h(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    !timeFormat12h ? 'bg-accent text-accent-contrast' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  24h
                </button>
              </div>
            </div>
          )}

          {/* Weekend Toggle */}
          {setShowWeekends && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary border border-border-subtle">
              <div>
                <span className="font-semibold text-fg block">Schedule Days</span>
                <span className="text-[11px] text-fg-muted">Show standard Monday–Friday school week or include Saturday & Sunday.</span>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-surface border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowWeekends(false)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    !showWeekends ? 'bg-accent text-accent-contrast' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  5 Days
                </button>
                <button
                  type="button"
                  onClick={() => setShowWeekends(true)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    showWeekends ? 'bg-accent text-accent-contrast' : 'text-fg-secondary hover:text-fg'
                  }`}
                >
                  7 Days
                </button>
              </div>
            </div>
          )}

          {/* Typography Default */}
          <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle">
            <span className="font-semibold text-fg block mb-1">Typography Architecture</span>
            <span className="text-[11px] text-fg-muted block mb-2">
              ORAS uses <strong>Plus Jakarta Sans</strong>, a geometric rounded grotesque crafted for high-legibility student schedules.
            </span>
            <div className="flex items-center gap-2 text-[11px] font-mono text-fg-muted bg-surface p-2 rounded border border-border-subtle">
              <span>08:30 – 10:00 AM</span>
              <span>·</span>
              <span>CS 101 Discrete Structures</span>
              <span>·</span>
              <span className="text-status-success font-semibold">Conflict-Free</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Account & Session */}
      {activeTab === 'account' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-lg bg-surface-secondary border border-border-subtle">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-fg text-sm block">{user.username}</span>
                    <span className="text-fg-muted text-[11px] block">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="px-3 py-1.5 rounded-md bg-status-danger-surface text-status-danger hover:bg-status-danger hover:text-white border border-status-danger-border text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
                <p className="text-[11px] text-fg-muted">
                  Your schedules and subjects are synced securely to your cloud workspace.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                    <div>
                      <span className="font-bold text-fg block">Instant Guest Student Session</span>
                      <span className="text-[11px] text-fg-muted block">No sign-up required. Your timetable persists on this device.</span>
                    </div>
                  </div>
                  <Link
                    to="/auth"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-md bg-accent text-accent-contrast font-semibold text-xs hover:bg-accent-hover transition-colors flex items-center gap-1.5"
                  >
                    <LogIn size={13} /> Optional Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-border-subtle flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-surface border border-border-default text-xs font-semibold text-fg hover:bg-surface-secondary transition-colors"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};
import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../auth/AuthContext';
import { Check, Sparkles, User, Palette, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const { user } = useAuth();
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all');

  // Themes are ordered: 8 Dark themes first, then 8 Light themes
  const darkThemes = themes.filter(t => t.isDark);
  const lightThemes = themes.filter(t => !t.isDark);

  const displayedThemes =
    filterMode === 'dark'
      ? darkThemes
      : filterMode === 'light'
      ? lightThemes
      : themes;

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-8">
      <div className="pb-6 border-b border-border-subtle">
        <h1 className="text-xl font-semibold text-fg">Themes & Settings</h1>
        <p className="text-xs text-fg-muted mt-1">
          Explore curated Ellipsus-inspired themes. Notice how each theme dynamically transforms your course block colors.
        </p>
      </div>

      {/* Theme Presets */}
      <section className="bg-surface rounded-lg border border-border-default p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Palette size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-fg">Ellipsus Theme Collection</h2>
            </div>
            <p className="text-xs text-fg-muted">
              Equal collection of 8 Dark themes (appear first) and 8 Light themes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-md bg-surface-secondary border border-border-subtle text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-surface text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              All (16)
            </button>
            <button
              onClick={() => setFilterMode('dark')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                filterMode === 'dark'
                  ? 'bg-surface text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Moon size={11} /> Dark (8)
            </button>
            <button
              onClick={() => setFilterMode('light')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition-colors ${
                filterMode === 'light'
                  ? 'bg-surface text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Sun size={11} /> Light (8)
            </button>
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedThemes.map((t) => {
            const isSelected = theme === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTheme(t.key)}
                className={`flex flex-col text-left p-3.5 rounded-lg border transition-all relative group ${
                  isSelected
                    ? 'border-accent ring-2 ring-accent shadow-soft bg-surface'
                    : 'border-border-default hover:border-border-strong bg-surface/80 hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-semibold text-fg">{t.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-mono px-1 rounded bg-surface-secondary text-fg-muted">
                      {t.isDark ? 'Dark' : 'Light'}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-accent text-accent-contrast flex items-center justify-center">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Theme surface swatch */}
                <div
                  className="w-full h-11 rounded border mb-2 flex items-center justify-center p-1.5 shadow-sm"
                  style={{ backgroundColor: t.sampleBg, borderColor: t.sampleAccent }}
                >
                  <div
                    className="w-full h-4 rounded text-[9px] flex items-center justify-center font-medium shadow-sm transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: t.sampleAccent, color: '#ffffff' }}
                  >
                    {t.name}
                  </div>
                </div>

                {/* Course Block Mini Palette Preview for this theme! */}
                <div className="w-full mb-2 pt-1 border-t border-border-subtle/50">
                  <span className="text-[9px] text-fg-muted block mb-1">Course Palette:</span>
                  <div className="grid grid-cols-4 gap-1">
                    {t.coursePalette.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="h-3 rounded border text-[7px] flex items-center justify-center font-mono"
                        style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-fg-muted line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Theme's Course Block Colors */}
      <section className="bg-surface rounded-lg border border-border-default p-6 shadow-soft">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-fg">
              Course Block Colors for "{currentTheme.name}"
            </h2>
          </div>
          <span className="text-xs font-mono text-fg-muted">
            {currentTheme.coursePalette.length} colors in palette
          </span>
        </div>
        <p className="text-xs text-fg-muted mb-4">
          When you switch themes, your timetable classes automatically change into these colors to preserve perfect harmony.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {currentTheme.coursePalette.map((c) => (
            <div
              key={c.id}
              className="p-2.5 rounded-md border text-center transition-all shadow-sm flex flex-col justify-between"
              style={{
                backgroundColor: c.bg,
                borderColor: c.border,
                color: c.text,
              }}
            >
              <div className="text-xs font-semibold">{c.name}</div>
              <div className="text-[10px] opacity-80 mt-1 font-mono">08:30 - 10:00</div>
              <div
                className="text-[9px] font-medium px-1 rounded mt-1.5"
                style={{ backgroundColor: c.tagBg, color: c.tagText }}
              >
                Lecture
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account Info */}
      <section className="bg-surface rounded-lg border border-border-default p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-fg">Student Session</h2>
        </div>
        <p className="text-xs text-fg-muted mb-4">
          You are using an instant, anonymous student session. You can optionally sign in if you want to sync your schedules across browsers.
        </p>

        {user ? (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-fg-secondary">Username</span>
              <span className="font-mono text-fg">{user.username}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-fg-secondary">Email</span>
              <span className="font-mono text-fg">{user.email}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs p-3 rounded-md bg-surface-secondary border border-border-subtle">
            <span className="text-fg-secondary">
              Guest session active. Your classes and settings persist automatically.
            </span>
            <Link to="/auth" className="text-accent font-medium hover:underline">
              Sign In or Register
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

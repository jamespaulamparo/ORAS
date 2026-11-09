import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Palette, 
  FileSpreadsheet, 
  Layers, 
  ShieldCheck, 
  Printer, 
  BookOpen,
  Sliders,
  MapPin,
  Sparkles,
  Code2
} from 'lucide-react';
import { useTheme } from '../settings/ThemeContext';
import { OrasLogo } from '../../components/ui/OrasLogo';

export const LandingPage: React.FC = () => {
  const { currentTheme } = useTheme();

  // Curated realistic sample classes demonstrating university timetable layout
  const sampleSchedule = [
    { day: 'Mon', dayFull: 'Monday', items: [
      { code: 'CS 201', title: 'Data Structures & Algorithms', time: '08:30 – 10:00', room: 'Lab 1', colorIdx: 0 },
      { code: 'MATH 102', title: 'Integral Calculus', time: '10:30 – 12:00', room: 'Hall 3', colorIdx: 1 },
      { code: 'CS 205', title: 'Discrete Mathematics', time: '13:30 – 15:00', room: 'Room 204', colorIdx: 2 },
    ]},
    { day: 'Tue', dayFull: 'Tuesday', items: [
      { code: 'PHYS 101', title: 'University Physics I', time: '09:00 – 10:30', room: 'Aud B', colorIdx: 3 },
      { code: 'FILI 101', title: 'Malayuning Komunikasyon', time: '13:00 – 14:30', room: 'Room 102', colorIdx: 4 },
    ]},
    { day: 'Wed', dayFull: 'Wednesday', items: [
      { code: 'CS 201', title: 'Data Structures & Algorithms', time: '08:30 – 10:00', room: 'Lab 1', colorIdx: 0 },
      { code: 'MATH 102', title: 'Integral Calculus', time: '10:30 – 12:00', room: 'Hall 3', colorIdx: 1 },
      { code: 'CS 205', title: 'Discrete Mathematics', time: '13:30 – 15:00', room: 'Room 204', colorIdx: 2 },
    ]},
    { day: 'Thu', dayFull: 'Thursday', items: [
      { code: 'PHYS 101', title: 'University Physics I', time: '09:00 – 10:30', room: 'Aud B', colorIdx: 3 },
      { code: 'FILI 101', title: 'Malayuning Komunikasyon', time: '13:00 – 14:30', room: 'Room 102', colorIdx: 4 },
    ]},
    { day: 'Fri', dayFull: 'Friday', items: [
      { code: 'PHYS 101L', title: 'Physics Laboratory', time: '09:00 – 12:00', room: 'Sci Lab 2', colorIdx: 5 },
      { code: 'PE 102', title: 'Physical Wellness & Fitness', time: '14:00 – 16:00', room: 'Gym', colorIdx: 6 },
    ]},
  ];

  return (
    <div className="min-h-screen bg-canvas text-fg selection:bg-accent-surface selection:text-fg flex flex-col justify-between">
      {/* Minimalist Top Header (Zero Clutter) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-canvas/90 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <OrasLogo size="md" />
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="text-xs font-semibold text-fg-secondary hover:text-fg px-3 py-1.5 rounded-md hover:bg-surface-secondary transition-colors"
            >
              Settings
            </Link>

            <Link
              to="/schedules"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover shadow-soft transition-all"
            >
              <span>Open Timetable</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Short, Direct Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-20 sm:pb-16 text-center">
          <h1 className="text-6xl sm:text-8xl font-black tracking-[0.2em] text-fg uppercase font-sans">
            ORAS
          </h1>
          <p className="mt-3 text-sm sm:text-base text-fg-muted font-medium italic">
            "Time is what we want most, but what we use worst." — William Penn
          </p>
          <p className="mt-2 text-base sm:text-xl text-fg font-bold tracking-tight">
            Conflict-free university schedule planning.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/schedules"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover shadow-card hover:shadow-floating transition-all"
            >
              <span>Launch Timetable Planner</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/offerings"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-md bg-surface border border-border-default hover:border-border-strong text-fg hover:bg-surface-secondary shadow-soft transition-colors"
            >
              <FileSpreadsheet size={15} className="text-fg-muted" />
              <span>Add Offerings</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-fg-muted font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-status-success" />
              <span>Instant anonymous access</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-status-success" />
              <span>Strict :00 / :30 time increments</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-status-success" />
              <span>16 Bespoke themes</span>
            </span>
          </div>
        </section>

        {/* Realistic Sample Timetable Showcase */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="rounded-xl border border-border-default bg-surface shadow-card overflow-hidden">
            {/* Timetable Mockup Header */}
            <div className="p-4 sm:p-5 border-b border-border-subtle bg-surface-secondary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-fg">
                    First Semester Timetable
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-status-success-surface text-status-success border border-status-success-border flex items-center gap-1">
                    <CheckCircle2 size={11} /> 0 Conflicts
                  </span>
                </div>
                <p className="text-xs text-fg-muted mt-0.5 font-mono">
                  5 school days · 19.0 Total Units · 7 enrolled subjects
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-fg-muted hidden sm:inline">
                  Palette: <strong className="text-fg">{currentTheme.name}</strong>
                </span>
                <Link
                  to="/schedules"
                  className="text-xs font-bold px-3 py-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover transition-colors inline-flex items-center gap-1"
                >
                  <span>Open in Editor</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Timetable Grid Preview: Solid aesthetic blocks */}
            <div className="p-4 sm:p-6 overflow-x-auto">
              <div className="min-w-[650px] grid grid-cols-5 gap-3">
                {sampleSchedule.map((col) => (
                  <div key={col.day} className="flex flex-col space-y-2.5">
                    {/* Day Column Header */}
                    <div className="py-2 text-center border-b border-border-default">
                      <span className="text-xs font-bold text-fg block tracking-tight">
                        {col.dayFull}
                      </span>
                      <span className="text-[10px] text-fg-muted font-mono">
                        {col.items.length} class{col.items.length === 1 ? '' : 'es'}
                      </span>
                    </div>

                    {/* Classes in Day */}
                    <div className="flex-1 space-y-2.5">
                      {col.items.map((item, itemIdx) => {
                        const color = currentTheme.coursePalette[item.colorIdx % currentTheme.coursePalette.length];
                        return (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-md border text-xs flex flex-col justify-between shadow-xs hover:shadow-sm transition-all"
                            style={{
                              backgroundColor: color.bg,
                              borderColor: color.border,
                              color: color.text,
                            }}
                          >
                            <div>
                              <div className="font-bold text-xs truncate">
                                {item.code}
                              </div>
                              <div className="text-[11px] font-medium opacity-90 line-clamp-1 mt-0.5">
                                {item.title}
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 space-y-0.5 text-[10px] opacity-90 font-mono">
                              <div className="flex items-center gap-1">
                                <Clock size={10} className="shrink-0" />
                                <span>{item.time}</span>
                              </div>
                              {item.room && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={10} className="shrink-0" />
                                  <span className="truncate">{item.room}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Purpose & Student Reality Section */}
        <section className="border-t border-border-subtle bg-surface-secondary/40 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                Built for the realities of university enrollment
              </h2>
              <p className="mt-2 text-sm text-fg-secondary leading-relaxed font-medium">
                Advisers hand you course offering slips or section lists. You are expected to piece together a workable semester schedule without conflicting lectures or impossible gaps. ORAS gives you the exact tools to do it with zero friction.
              </p>
            </div>

            {/* Personas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-2.5">
                <div className="w-8 h-8 rounded-md bg-accent-surface text-fg flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-sm font-bold text-fg">The Irregular Student</h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Taking prerequisite subjects alongside senior majors? Test sections from different batches and find section combinations that actually fit without overlaps.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-2.5">
                <div className="w-8 h-8 rounded-md bg-accent-surface text-fg flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-sm font-bold text-fg">The Block Section Student</h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Enrolled in a fixed block but need to choose between multiple laboratory schedules or elective slots? Add alternative offerings and easily switch sections.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-2.5">
                <div className="w-8 h-8 rounded-md bg-accent-surface text-fg flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-sm font-bold text-fg">The Commuter & Working Student</h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Eliminate 4-hour dead campus gaps. Identify schedules that consolidate classes into fewer days or prevent 7:00 AM starts so your transit stays manageable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About ORAS Section */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Code2 size={18} className="text-accent" />
              <h2 className="text-2xl font-bold tracking-tight text-fg">
                About ORAS
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-fg-muted">
              Origin, architecture, and design philosophy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-3">
              <h3 className="text-sm font-bold text-fg">Philosophy: Time as a Canvas</h3>
              <p className="text-fg-secondary leading-relaxed">
                <strong>ORAS</strong> is named after the Filipino word for <em>hour</em> or <em>time</em> (from Spanish <em>horas</em>). The project exists because students shouldn't have to battle clunky registration portals, broken spreadsheets, or AI chatbots just to see what their week looks like.
              </p>
              <p className="text-fg-muted leading-relaxed">
                Inspired by the minimalist, typography-first craftsmanship of tools like Ellipsus, ORAS treats the weekly timetable with the elegance of an editorial manuscript: solid color harmony, clear type hierarchy, and zero clutter.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-3">
              <h3 className="text-sm font-bold text-fg">Engineering & Stack</h3>
              <ul className="space-y-1.5 text-fg-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Frontend:</strong> React 19, TypeScript, Vite, Tailwind CSS, Plus Jakarta Sans.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Backend:</strong> Python 3.14, Django 5.x, SQLite & PostgreSQL engine.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Conflict Engine:</strong> Half-open interval mathematical validation <code>[start, end)</code>.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Zero Bloat:</strong> No AI chatbots, no login gates, instant guest student session.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border-subtle bg-surface-secondary/60 py-16 text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
              Ready to plan your classes?
            </h2>
            <p className="text-xs sm:text-sm text-fg-secondary">
              Open the planner right now. No sign-up required.
            </p>
            <div className="pt-2">
              <Link
                to="/schedules"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover shadow-card transition-all"
              >
                <span>Open ORAS Timetable</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface px-4 sm:px-6 py-8 text-xs text-fg-muted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <OrasLogo size="sm" />
            <span className="text-border-strong">|</span>
            <span>ORAS University Timetable Planner</span>
          </div>

          <div className="flex items-center gap-5 text-fg-secondary font-medium">
            <Link to="/schedules" className="hover:text-fg transition-colors">
              Timetable
            </Link>
            <Link to="/offerings" className="hover:text-fg transition-colors">
              Offerings
            </Link>
            <Link to="/settings" className="hover:text-fg transition-colors">
              Settings & Themes
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
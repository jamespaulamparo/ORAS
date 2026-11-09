import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Clock, 
  MapPin, 
  ArrowUpRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';
import { useTheme } from '../settings/ThemeContext';
import { OrasLogo } from '../../components/ui/OrasLogo';
import { LiveHeroClock } from '../../components/ui/LiveHeroClock';
import { OrasMascot } from '../../components/ui/OrasMascot';
import { DMMMSU_NLUC_BSIS_CURRICULUM } from '../../lib/commonCourses';

// Positive, hopeful reflections on time management, student well-being, and QOL (rotates slowly: every 9 seconds)
const TIME_QUOTES = [
  { text: 'A well-planned schedule is not a cage, but the key that unlocks your freedom.', author: 'Academic Balance' },
  { text: 'Organizing your time is an act of deep kindness to your future self.', author: 'Student Wellness' },
  { text: 'When your week has clarity, your mind finally finds room to breathe.', author: 'Mindful Scheduling' },
  { text: 'Plan your hours deliberately so you can rest completely, without guilt.', author: 'Quality of Life' },
  { text: 'Good scheduling turns university chaos into quiet confidence.', author: 'Student Peace' },
  { text: 'You do not need more hours in a day; you only need clarity in the ones you have.', author: 'Time Mastery' },
  { text: 'Protect your peace: eliminate dead campus gaps and reclaim your evenings.', author: 'Campus Harmony' },
];

export const LandingPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Very slow transition (9000ms) to avoid distracting the reader
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % TIME_QUOTES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // Scroll animation hooks for timetable expansion
  const previewRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: previewScroll } = useScroll({
    target: previewRef,
    offset: ['start end', 'center center'],
  });
  const previewScale = useTransform(previewScroll, [0, 1], [0.93, 1]);
  const previewOpacity = useTransform(previewScroll, [0, 0.4], [0.5, 1]);
  const previewY = useTransform(previewScroll, [0, 1], [30, 0]);

  // Authentic DMMMSU-NLUC BSIS 2nd Year Sample Schedule
  const sampleSchedule = [
    { day: 'Mon', dayFull: 'Monday', items: [
      { code: 'CC 104', title: 'Data Structures and Algorithms', time: '08:30 – 10:00', room: 'IT Lab 1', colorIdx: 0 },
      { code: 'IS 103', title: 'Information Management (Database 1)', time: '10:30 – 12:00', room: 'Hall 3', colorIdx: 1 },
      { code: 'CC 105', title: 'Discrete Mathematics', time: '13:30 – 15:00', room: 'Room 204', colorIdx: 2 },
    ]},
    { day: 'Tue', dayFull: 'Tuesday', items: [
      { code: 'GE 107', title: 'Science, Technology, and Society', time: '09:00 – 10:30', room: 'Aud B', colorIdx: 3 },
      { code: 'GE 108', title: 'Ethics', time: '13:00 – 14:30', room: 'Room 102', colorIdx: 4 },
    ]},
    { day: 'Wed', dayFull: 'Wednesday', items: [
      { code: 'CC 104', title: 'Data Structures and Algorithms', time: '08:30 – 10:00', room: 'IT Lab 1', colorIdx: 0 },
      { code: 'IS 103', title: 'Information Management (Database 1)', time: '10:30 – 12:00', room: 'Hall 3', colorIdx: 1 },
      { code: 'CC 105', title: 'Discrete Mathematics', time: '13:30 – 15:00', room: 'Room 204', colorIdx: 2 },
    ]},
    { day: 'Thu', dayFull: 'Thursday', items: [
      { code: 'GE 107', title: 'Science, Technology, and Society', time: '09:00 – 10:30', room: 'Aud B', colorIdx: 3 },
      { code: 'GE 108', title: 'Ethics', time: '13:00 – 14:30', room: 'Room 102', colorIdx: 4 },
    ]},
    { day: 'Fri', dayFull: 'Friday', items: [
      { code: 'PATHFit 3', title: 'Physical Activities in Dance/Sports', time: '08:00 – 10:00', room: 'Gymnasium', colorIdx: 5 },
      { code: 'GE-Elec 1', title: 'Living in the IT Era', time: '13:30 – 15:30', room: 'IT Room 3', colorIdx: 6 },
    ]},
  ];

  // Group curriculum by year for horizontal pathway showcase
  const curriculumYears = [
    {
      year: 1,
      title: 'First Year: Foundations',
      description: 'Computing fundamentals, programming basics, and general education core.',
      courses: DMMMSU_NLUC_BSIS_CURRICULUM.filter(c => c.yearLevel === 1).slice(0, 4),
    },
    {
      year: 2,
      title: 'Second Year: Data & Architecture',
      description: 'Algorithms, database management, discrete mathematics, and emerging technologies.',
      courses: DMMMSU_NLUC_BSIS_CURRICULUM.filter(c => c.yearLevel === 2).slice(0, 4),
    },
    {
      year: 3,
      title: 'Third Year: Systems & Strategy',
      description: 'Systems analysis, business process management, data mining, and networking.',
      courses: DMMMSU_NLUC_BSIS_CURRICULUM.filter(c => c.yearLevel === 3).slice(0, 4),
    },
    {
      year: 4,
      title: 'Fourth Year: Capstone & Practicum',
      description: 'Senior capstone research, IT audit, and 486-hour industry internship.',
      courses: DMMMSU_NLUC_BSIS_CURRICULUM.filter(c => c.yearLevel === 4),
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-fg selection:bg-accent-surface selection:text-fg flex flex-col justify-between">
      {/* Clean, Restrained Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-canvas/80 border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <OrasLogo size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-fg-secondary">
            <a href="#timetable-preview" className="hover:text-fg transition-colors">
              Timetable
            </a>
            <a href="#curriculum-pathway" className="hover:text-fg transition-colors">
              Curriculum
            </a>
            <a href="#method" className="hover:text-fg transition-colors">
              How it Works
            </a>
            <Link to="/about" className="hover:text-fg transition-colors flex items-center gap-1">
              <span>Research & About</span>
              <ArrowUpRight size={11} className="opacity-60" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="text-xs font-medium text-fg-secondary hover:text-fg px-2.5 py-1.5 rounded-md hover:bg-surface-secondary transition-colors"
            >
              Themes
            </Link>

            <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -0.5 }}>
              <Link
                to="/schedules"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-accent text-accent-contrast hover:bg-accent-hover shadow-soft transition-all"
              >
                <span>Open Timetable</span>
                <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Scrollytelling Body */}
      <main className="flex-1">
        {/* Hero Section: Left ORAS + Right HUGE Live Local Clock */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: ORAS Kinetic Branding & Live Quote */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <h1 className="text-7xl sm:text-9xl font-black tracking-[0.16em] text-fg uppercase font-sans leading-none">
                  ORAS
                </h1>
                <div className="pt-2">
                  <OrasMascot size="sm" withSpeechBubble="Plan your hours, protect your peace!" />
                </div>
              </div>

              {/* Contemplative Quotes Ticker (Unitalicized, very slow transition) */}
              <div className="h-20 flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quoteIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-1.5"
                  >
                    <p className="text-base sm:text-xl text-fg font-medium tracking-tight leading-snug">
                      {TIME_QUOTES[quoteIdx].text}
                    </p>
                    <p className="text-xs font-mono text-fg-muted uppercase tracking-wider">
                      — {TIME_QUOTES[quoteIdx].author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -0.5 }}>
                  <Link
                    to="/schedules"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-xl bg-accent text-accent-contrast hover:bg-accent-hover shadow-card transition-all"
                  >
                    <span>Launch Timetable Planner</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>

                <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -0.5 }}>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl bg-surface border border-border-default hover:border-border-strong text-fg hover:bg-surface-secondary shadow-soft transition-colors"
                  >
                    <Compass size={14} className="text-accent" />
                    <span>Why ORAS was Built</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: HUGE Live Local Clock Auto-Adjusted to Local Time */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <LiveHeroClock />
            </motion.div>
          </div>
        </section>

        {/* Section 2: Scroll-Driven Timetable Card Expansion (Interactive Scrollytelling) */}
        <section id="timetable-preview" ref={previewRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-fg tracking-tight">
                BS Information Systems · 2nd Year Timetable
              </h2>
              <p className="text-xs text-fg-muted font-mono mt-0.5">
                DMMMSU-NLUC Bacnotan · 20.0 Units · Solid Harmonic Theme Blocks
              </p>
            </div>
            <Link
              to="/schedules"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Open live editor</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <motion.div
            style={{
              scale: previewScale,
              opacity: previewOpacity,
              y: previewY,
            }}
            className="rounded-2xl border border-border-default bg-surface shadow-card overflow-hidden"
          >
            {/* Header row */}
            <div className="p-3 sm:p-4 border-b border-border-subtle bg-surface-secondary/50 flex items-center justify-between text-xs">
              <span className="font-bold text-fg">Monday – Friday Grid</span>
              <span className="text-fg-muted font-mono text-[11px]">
                Active Theme: {currentTheme.name}
              </span>
            </div>

            {/* Timetable Grid Preview: Solid aesthetic blocks */}
            <div className="p-4 sm:p-6 overflow-x-auto">
              <div className="min-w-[650px] grid grid-cols-5 gap-3">
                {sampleSchedule.map((col) => (
                  <div key={col.day} className="flex flex-col space-y-2">
                    <div className="py-2 text-center border-b border-border-default">
                      <span className="text-xs font-bold text-fg block tracking-tight">
                        {col.dayFull}
                      </span>
                      <span className="text-[10px] text-fg-muted font-mono">
                        {col.items.length} subjects
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      {col.items.map((item, itemIdx) => {
                        const color = currentTheme.coursePalette[item.colorIdx % currentTheme.coursePalette.length];
                        return (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-lg border text-xs flex flex-col justify-between shadow-xs hover:shadow-soft transition-all"
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

                            <div className="mt-2.5 pt-1.5 border-t border-black/10 dark:border-white/10 space-y-0.5 text-[10px] opacity-90 font-mono">
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
          </motion.div>
        </section>

        {/* Section 3: Horizontal Pinned Curriculum Pathway (DMMMSU-NLUC BSIS) */}
        <section id="curriculum-pathway" className="border-t border-border-subtle bg-surface-secondary/40 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
            <div className="max-w-xl">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
                DMMMSU-NLUC BSIS Curricular Pathway
              </h2>
              <p className="text-xs sm:text-sm text-fg-muted mt-1 font-medium">
                Every subject from First Year to Fourth Year is preloaded for instant search and schedule validation.
              </p>
            </div>

            {/* 4-Year Pathway Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {curriculumYears.map((yr) => (
                <div
                  key={yr.year}
                  className="p-5 rounded-xl border border-border-default bg-surface shadow-soft space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider">
                      Year 0{yr.year}
                    </span>
                    <h3 className="text-sm font-bold text-fg">{yr.title}</h3>
                    <p className="text-xs text-fg-muted leading-relaxed">
                      {yr.description}
                    </p>
                  </div>

                  {/* Course Pills */}
                  <div className="space-y-1 pt-2 border-t border-border-subtle">
                    {yr.courses.map((c) => (
                      <div
                        key={c.code}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className="font-bold text-fg truncate text-[11px]">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-mono text-fg-muted shrink-0">
                          {c.units}.0u
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: How It Works (Parallax Staggered Steps) */}
        <section id="method" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              How ORAS Operates
            </h2>
            <p className="text-xs sm:text-sm text-fg-muted mt-1 font-medium">
              Three deliberate operations designed for student autonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-2.5"
            >
              <span className="text-xs font-mono font-bold text-accent">01 / ENLIST</span>
              <h3 className="text-sm font-bold text-fg">Enter or Autocomplete Subjects</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Type course codes like <code>CC 104</code> or <code>IS 103</code>. Instant autocomplete fills course titles and unit counts, snapping session times strictly to :00 or :30.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-2.5"
            >
              <span className="text-xs font-mono font-bold text-accent">02 / VALIDATE</span>
              <h3 className="text-sm font-bold text-fg">Half-Open Interval Check</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                The math engine applies <code>[start, end)</code> intervals. Classes sharing a 10:30 boundary never falsely collide, while real overlaps produce detailed diagnostics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 rounded-xl border border-border-default bg-surface shadow-soft space-y-2.5"
            >
              <span className="text-xs font-mono font-bold text-accent">03 / EXPORT</span>
              <h3 className="text-sm font-bold text-fg">Save High-Resolution Timetable</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                Export strictly the weekly timetable as a sharp 2x PNG for phone lockscreens or print a clean PDF with zero website navigation chrome.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 5: Academic Research Teaser Banner */}
        <section className="border-t border-border-subtle bg-surface py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-border-default bg-surface-secondary/50 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                  Academic Research
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-fg">
                  The Enrollment Scramble & Student Agency
                </h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Explore our in-depth research examining cognitive overload during university enlistment, irregular student schedule penalties, and why deterministic software outperforms AI chatbots.
                </p>
              </div>

              <motion.div whileTap={{ scale: 0.96 }} whileHover={{ y: -0.5 }}>
                <Link
                  to="/about"
                  className="px-5 py-2.5 rounded-xl bg-surface border border-border-default hover:border-border-strong text-fg text-xs font-bold hover:bg-surface-secondary shadow-soft flex items-center gap-2 transition-colors shrink-0"
                >
                  <span>Read Full Research</span>
                  <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Restrained Professional Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface px-4 sm:px-6 py-10 text-xs text-fg-muted">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 space-y-2">
            <OrasLogo size="sm" />
            <p className="text-[11px] text-fg-muted max-w-sm leading-relaxed mt-2">
              A minimalist, typography-first timetable planner for university students. Designed for clarity, speed, and zero friction.
            </p>
            <div className="text-[10px] font-mono text-fg-muted pt-1">
              DMMMSU-NLUC BSIS Curriculum · Bacnotan, La Union
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-fg uppercase tracking-wider block">
              Application
            </span>
            <ul className="space-y-1.5 text-fg-secondary">
              <li>
                <Link to="/schedules" className="hover:text-fg transition-colors">
                  Timetable Workspace
                </Link>
              </li>
              <li>
                <Link to="/builder" className="hover:text-fg transition-colors">
                  Schedule Generator
                </Link>
              </li>
              <li>
                <Link to="/offerings" className="hover:text-fg transition-colors">
                  Offerings Manager
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-fg transition-colors">
                  16 Bespoke Themes
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-fg uppercase tracking-wider block">
              Research & Notes
            </span>
            <ul className="space-y-1.5 text-fg-secondary">
              <li>
                <Link to="/about" className="hover:text-fg transition-colors">
                  Research & Philosophy
                </Link>
              </li>
              <li>
                <span className="text-fg-muted">Bacnotan, La Union</span>
              </li>
              <li>
                <span className="text-fg-muted">React 19 & Django 5</span>
              </li>
              <li>
                <span className="text-fg-muted">MIT License</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-fg-muted">
          <span>&copy; {new Date().getFullYear()} ORAS Planner. Crafted for university students.</span>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-fg transition-colors">About</Link>
            <Link to="/settings" className="hover:text-fg transition-colors">Settings</Link>
            <Link to="/schedules" className="hover:text-fg transition-colors">Open App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

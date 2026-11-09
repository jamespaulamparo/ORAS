import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { OrasLogo } from '../../components/ui/OrasLogo';
import { 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Code2, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  MapPin,
  Calendar,
  Compass
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-canvas text-fg selection:bg-accent-surface selection:text-fg flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-canvas/80 border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <OrasLogo size="sm" />
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link to="/" className="text-fg-secondary hover:text-fg transition-colors">
              Home
            </Link>
            <Link to="/schedules" className="text-fg-secondary hover:text-fg transition-colors">
              Timetable
            </Link>
            <Link to="/settings" className="text-fg-secondary hover:text-fg transition-colors">
              Settings
            </Link>
            <Link
              to="/schedules"
              className="px-3 py-1.5 rounded-md bg-accent text-accent-contrast font-semibold hover:bg-accent-hover transition-colors flex items-center gap-1"
            >
              <span>Planner</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-surface text-accent text-xs font-semibold border border-accent/20">
            <Compass size={13} />
            <span>Research & Academic Case Study</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-fg">
            The Philosophy & Research Behind ORAS
          </h1>
          <p className="text-base sm:text-lg text-fg-muted font-medium max-w-2xl leading-relaxed">
            Why state university enrollment causes immense cognitive fatigue, and how deliberate typographic software restores agency to students.
          </p>
        </motion.div>

        {/* Section 1: The Enrollment Scramble */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-surface border border-border-default shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2 text-accent">
            <Clock size={18} />
            <h2 className="text-lg font-bold text-fg">The Enrollment Reality: Cognitive Load & Chaos</h2>
          </div>
          <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
            Every semester in universities across the Philippines and worldwide, thousands of undergraduate students face the <em>enrollment scramble</em>. Department chairs release PDF offering lists, handwritten whiteboards, or fragmented portal tables showing dozens of course codes, section designations, room codes, and overlapping hours.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-secondary border border-border-subtle space-y-1.5">
              <span className="font-bold text-fg block">The Irregular Penalty</span>
              <p className="text-fg-muted leading-relaxed">
                Students retaking prerequisite subjects or advancing electives must cross-match multiple year levels manually, frequently leading to accidental 15-minute overlaps discovered on day one.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-secondary border border-border-subtle space-y-1.5">
              <span className="font-bold text-fg block">Dead Time & Commuting</span>
              <p className="text-fg-muted leading-relaxed">
                Poorly coordinated schedules force students to endure 4-to-5-hour vacant gaps in hallways and libraries, exhausting commuting budgets and study energy.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-secondary border border-border-subtle space-y-1.5">
              <span className="font-bold text-fg block">System Inefficiency</span>
              <p className="text-fg-muted leading-relaxed">
                Most institutional enrollment portals are transactional databases designed for registrars, not intuitive visual planners for students trying to balance their lives.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Grounded at DMMMSU-NLUC */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-surface border border-border-default shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2 text-accent">
            <GraduationCap size={18} />
            <h2 className="text-lg font-bold text-fg">Curricular Grounding: DMMMSU-NLUC BSIS (2026)</h2>
          </div>
          <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
            ORAS is built and calibrated with authentic curriculum data from the <strong>Bachelor of Science in Information Systems (BSIS)</strong> at <strong>Don Mariano Marcos Memorial State University – North La Union Campus (DMMMSU-NLUC)</strong> in Sapilang, Bacnotan, La Union.
          </p>
          <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
            From 1st Year computing fundamentals (<code>CC 101</code>, <code>CC 102</code>, <code>IS 101</code>) and General Education mandates to 4th Year Enterprise Systems, Systems Audit, and Capstone Research (<code>IS 111</code>, <code>IS 113</code>), ORAS provides instant autocomplete and exact unit tracking tailored to state university curriculum standards.
          </p>
          <div className="p-3.5 rounded-xl bg-accent-surface/50 border border-accent/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent shrink-0" />
              <span className="text-fg font-medium">Don Mariano Marcos Memorial State University, North La Union Campus</span>
            </div>
            <span className="font-mono text-accent text-[11px] font-bold">Bacnotan, La Union</span>
          </div>
        </motion.section>

        {/* Section 3: The Ellipsus Inspiration & Design Philosophy */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-surface border border-border-default shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2 text-accent">
            <BookOpen size={18} />
            <h2 className="text-lg font-bold text-fg">Design Philosophy: The Ellipsus Manuscript Principle</h2>
          </div>
          <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
            The aesthetic heart of ORAS draws inspiration from <em>Ellipsus</em>, the minimalist writing tool celebrated for treating text with dignified typography and rich thematic palettes.
          </p>
          <div className="space-y-3 text-xs sm:text-sm text-fg-secondary">
            <p className="leading-relaxed">
              We asked: <em>Why should a student timetable look like an Excel sheet or a generic pastel calendar?</em>
            </p>
            <ul className="space-y-2 list-disc pl-5 text-xs text-fg-muted">
              <li>
                <strong className="text-fg">16 Curated Bespoke Themes:</strong> 8 Dark themes (Leatherbound, Red Velvet, Ultra Dark, Midnight, Graphite, Espresso, Evergreen, Sepia) and 8 Light themes (Paper, Maple, Pumpkin Spice, Valentine, Roseglow, Sage, Sandstone, Minimal).
              </li>
              <li>
                <strong className="text-fg">Harmonic Course Colors:</strong> When you switch themes, all course blocks dynamically transform their solid fills, borders, and badge contrasts to match the palette.
              </li>
              <li>
                <strong className="text-fg">Zero AI / Chatbot Bloat:</strong> No automated chatbots trying to guess your life. ORAS gives you deterministic, lightning-fast tools that obey your exact commands.
              </li>
              <li>
                <strong className="text-fg">Anonymous First:</strong> No mandatory sign-up, email verification, or tracking cookies. Students can open the site, build a schedule, export it, and go.
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Section 4: Mathematical Validation Engine */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-surface border border-border-default shadow-soft space-y-4"
        >
          <div className="flex items-center gap-2 text-accent">
            <Code2 size={18} />
            <h2 className="text-lg font-bold text-fg">Under the Hood: Half-Open Intervals & Tech Stack</h2>
          </div>
          <p className="text-xs sm:text-sm text-fg-secondary leading-relaxed">
            Scheduling bugs commonly stem from naive comparison operators. In real life, Class A ending at 10:30 and Class B starting at 10:30 in adjacent rooms is a valid back-to-back transition, not a conflict.
          </p>
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border-subtle font-mono text-xs text-fg">
            <code>Interval Conflict Test: max(start_A, start_B) &lt; min(end_A, end_B)</code>
          </div>
          <p className="text-xs text-fg-muted leading-relaxed">
            Because ORAS implements strictly half-open intervals <code>[start, end)</code>, adjacent boundaries never collide.
          </p>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-surface border border-border-subtle">
              <span className="text-[10px] text-fg-muted uppercase font-bold block">Frontend</span>
              <span className="font-semibold text-fg">React 19 & Vite</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border-subtle">
              <span className="text-[10px] text-fg-muted uppercase font-bold block">Backend</span>
              <span className="font-semibold text-fg">Python 3.14 & Django</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border-subtle">
              <span className="text-[10px] text-fg-muted uppercase font-bold block">Motion</span>
              <span className="font-semibold text-fg">Framer Motion</span>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border-subtle">
              <span className="text-[10px] text-fg-muted uppercase font-bold block">Typography</span>
              <span className="font-semibold text-fg">Plus Jakarta Sans</span>
            </div>
          </div>
        </motion.section>

        {/* CTA Footer */}
        <div className="text-center pt-6 space-y-3">
          <h3 className="text-xl font-bold text-fg">Take control of your university hours</h3>
          <p className="text-xs text-fg-muted">Jump straight into the timetable builder.</p>
          <Link
            to="/schedules"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-contrast font-bold text-xs hover:bg-accent-hover shadow-card transition-all"
          >
            <span>Open ORAS Timetable</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface px-4 sm:px-6 py-8 text-xs text-fg-muted">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <OrasLogo size="sm" />
            <span className="text-border-strong">|</span>
            <span>ORAS University Timetable Planner</span>
          </div>
          <div className="flex items-center gap-4 text-fg-secondary font-medium">
            <Link to="/" className="hover:text-fg transition-colors">Home</Link>
            <Link to="/schedules" className="hover:text-fg transition-colors">Timetable</Link>
            <Link to="/offerings" className="hover:text-fg transition-colors">Offerings</Link>
            <Link to="/settings" className="hover:text-fg transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

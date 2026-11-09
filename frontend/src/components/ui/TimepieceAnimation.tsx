import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const TimepieceAnimation: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Rotate clock hand based on scroll
  const clockRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
  // Sand height in hourglass top and bottom bulb
  const sandTop = useTransform(scrollYProgress, [0, 0.7], [16, 2]);
  const sandBottom = useTransform(scrollYProgress, [0, 0.7], [2, 16]);

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex items-center gap-6 sm:gap-10">
        {/* Minimalist Hourglass with Sand Passing */}
        <div className="flex flex-col items-center">
          <svg
            width="56"
            height="80"
            viewBox="0 0 56 80"
            fill="none"
            className="text-fg-secondary"
          >
            {/* Hourglass Glass Shell */}
            <path
              d="M10 8 H46 L32 38 C30 40 30 40 28 40 C26 40 26 40 24 38 L10 8 Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="opacity-70"
            />
            <path
              d="M10 72 H46 L32 42 C30 40 30 40 28 40 C26 40 26 40 24 42 L10 72 Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="opacity-70"
            />
            {/* Top & Bottom Brass Plates */}
            <line x1="6" y1="8" x2="50" y2="8" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            <line x1="6" y1="72" x2="50" y2="72" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />

            {/* Falling Sand Stream (Animated loop) */}
            <motion.line
              x1="28"
              y1="38"
              x2="28"
              y2="58"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              animate={{ strokeDashoffset: [-10, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />

            {/* Top Sand Fill (Shrinks as time passes) */}
            <motion.path
              d="M16 16 H40 L30 32 H26 Z"
              fill="var(--accent)"
              className="opacity-40"
              animate={{ opacity: [0.5, 0.3, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />

            {/* Bottom Sand Mound (Accumulates) */}
            <path
              d="M15 68 H41 L34 56 H22 Z"
              fill="var(--accent)"
              className="opacity-60"
            />
          </svg>
          <span className="text-[10px] font-mono text-fg-muted mt-1 uppercase tracking-wider">
            Sandglass
          </span>
        </div>

        {/* Minimalist Analog Timepiece Clock */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-border-default bg-surface/90 flex items-center justify-center shadow-soft">
            {/* Hour tick marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-full h-full pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className="w-0.5 h-1.5 bg-fg-muted mx-auto rounded-full mt-1 opacity-60" />
              </div>
            ))}

            {/* Hour hand */}
            <motion.div
              style={{ rotate: clockRotate }}
              className="absolute w-full h-full pointer-events-none"
            >
              <div className="w-1 h-5 bg-fg rounded-full mx-auto mt-4 origin-bottom" />
            </motion.div>

            {/* Minute hand (Continuous realistic tick) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute w-full h-full pointer-events-none"
            >
              <div className="w-0.5 h-7 bg-accent rounded-full mx-auto mt-2 origin-bottom" />
            </motion.div>

            {/* Center pinion dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface z-10" />
          </div>
          <span className="text-[10px] font-mono text-fg-muted mt-1 uppercase tracking-wider">
            :00 / :30 Tick
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface OrasMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withSpeechBubble?: string;
}

export const OrasMascot: React.FC<OrasMascotProps> = ({
  size = 'md',
  className = '',
  withSpeechBubble,
}) => {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
    xl: 'w-44 h-44 sm:w-52 sm:h-52',
  }[size];

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      {/* Timey - Animated Floating Mascot */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.6,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeMap} shrink-0`}
      >
        <img
          src="/oras-mascot.svg"
          alt="Timey - The ORAS Companion"
          className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform"
          draggable={false}
        />
      </motion.div>

      {/* Speech Bubble */}
      {withSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-xs p-3 rounded-2xl bg-surface border border-border-default shadow-soft text-xs text-fg leading-snug"
        >
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-surface border-l border-b border-border-default rotate-45" />
          <p className="font-semibold text-accent text-[11px] mb-0.5">Timey says:</p>
          <p className="font-medium relative z-10">{withSpeechBubble}</p>
        </motion.div>
      )}
    </div>
  );
};

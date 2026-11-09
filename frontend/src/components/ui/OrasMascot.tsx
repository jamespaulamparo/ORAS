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
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    xl: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  return (
    <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
      {/* Animated Floating Mascot */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 1.5, 0, -1.5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
        }}
        className={`relative ${sizeMap} shrink-0`}
      >
        <img
          src="/oras-mascot.svg"
          alt="Tik-Tik the ORAS Mascot"
          className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform"
          draggable={false}
        />
      </motion.div>

      {/* Optional Animated Speech Bubble */}
      {withSpeechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-xs p-3 rounded-2xl bg-surface border border-border-default shadow-soft text-xs text-fg leading-snug"
        >
          {/* Bubble tail pointing left to mascot */}
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-surface border-l border-b border-border-default rotate-45" />
          <p className="font-medium relative z-10">{withSpeechBubble}</p>
        </motion.div>
      )}
    </div>
  );
};

import React from 'react';

interface OrasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export const OrasLogo: React.FC<OrasLogoProps> = ({
  className = '',
  size = 'md',
  iconOnly = false,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 text-fg ${className}`}>
      {/* Geometric Hourglass/Time Piece Icon */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes} text-accent shrink-0`}
      >
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="7"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 9L23 23M23 9L9 23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.2" fill="currentColor" />
        <circle cx="16" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="16" cy="24.5" r="1.5" fill="currentColor" />
      </svg>

      {!iconOnly && (
        <span className="font-bold tracking-[0.2em] text-sm sm:text-base leading-none text-fg uppercase font-sans">
          ORAS
        </span>
      )}
    </div>
  );
};

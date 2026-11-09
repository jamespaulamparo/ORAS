import React, { useState, useEffect, useRef } from 'react';

export const LiveHeroClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    // High-precision smooth animation frame for fluid clock hands
    const updateClock = () => {
      setNow(new Date());
      requestRef.current = requestAnimationFrame(updateClock);
    };
    requestRef.current = requestAnimationFrame(updateClock);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Angular coordinates
  const secondDeg = (seconds + milliseconds / 1000) * 6;
  const minuteDeg = (minutes + seconds / 60) * 6;
  const hourDeg = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;

  // Formatted digital time
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const digitalTimeStr = `${displayHours}:${pad(minutes)}:${pad(seconds)} ${ampm}`;

  // Local timezone name / offset
  const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-[340px] sm:max-w-[380px]">
      {/* Imposing Swiss/Braun-inspired Minimalist Analog Clock Dial */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border-2 border-border-default bg-surface shadow-card flex items-center justify-center">
        {/* Subtle inner dial track */}
        <div className="absolute inset-2 sm:inset-3 rounded-full border border-border-subtle/60 pointer-events-none" />

        {/* 12 Hour Marker Notches */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const isQuarter = i % 3 === 0;
          return (
            <div
              key={deg}
              className="absolute w-full h-full pointer-events-none"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div
                className={`mx-auto rounded-full mt-2.5 ${
                  isQuarter
                    ? 'w-1 h-3.5 bg-fg'
                    : 'w-0.5 h-2 bg-fg-muted/60'
                }`}
              />
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          className="absolute w-full h-full pointer-events-none"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        >
          <div className="w-1.5 h-16 sm:h-20 bg-fg rounded-full mx-auto mt-14 sm:mt-18 shadow-xs origin-bottom" />
        </div>

        {/* Minute Hand */}
        <div
          className="absolute w-full h-full pointer-events-none"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        >
          <div className="w-1 h-24 sm:h-28 bg-fg/90 rounded-full mx-auto mt-7 sm:mt-9 shadow-xs origin-bottom" />
        </div>

        {/* Smooth Sweep Second Hand */}
        <div
          className="absolute w-full h-full pointer-events-none"
          style={{ transform: `rotate(${secondDeg}deg)` }}
        >
          <div className="w-0.5 h-28 sm:h-34 bg-accent rounded-full mx-auto mt-4 origin-bottom" />
          {/* Second hand counterweight */}
          <div className="w-1 h-4 bg-accent rounded-full mx-auto -mt-2 origin-top opacity-80" />
        </div>

        {/* Center Pinion */}
        <div className="w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-surface shadow-sm z-20" />
      </div>

      {/* Prominent Live Digital Readout */}
      <div className="mt-4 text-center">
        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-fg tabular-nums">
          {digitalTimeStr}
        </div>
        <div className="text-[11px] font-mono text-fg-muted uppercase tracking-wider mt-0.5">
          {timeZoneName} Time
        </div>
      </div>
    </div>
  );
};

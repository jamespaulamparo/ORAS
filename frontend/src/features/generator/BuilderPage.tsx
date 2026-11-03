import React from 'react';
import { Sparkles } from 'lucide-react';

export const BuilderPage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
        <div>
          <h1 className="text-xl font-semibold text-fg">Build a Schedule</h1>
          <p className="text-xs text-fg-muted mt-1">Select your courses and let OR-Tools generate conflict-free timetable combinations.</p>
        </div>
      </div>
      <div className="mt-8 rounded-lg border border-dashed border-border-default p-12 text-center bg-surface/50">
        <div className="w-10 h-10 rounded-full bg-surface-secondary text-fg-muted flex items-center justify-center mx-auto mb-3">
          <Sparkles size={20} />
        </div>
        <h3 className="text-sm font-medium text-fg">Schedule Generator</h3>
        <p className="text-xs text-fg-muted max-w-sm mx-auto mt-1">
          Constraint-based CP-SAT generation will be connected in Milestone 3.
        </p>
      </div>
    </div>
  );
};

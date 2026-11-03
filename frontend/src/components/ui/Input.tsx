import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-fg-secondary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-md border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-1 transition-colors ${
            error
              ? 'border-status-danger focus:border-status-danger focus:ring-status-danger'
              : 'border-border-default focus:border-accent focus:ring-accent'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-status-danger">{error}</span>}
        {helperText && !error && <span className="text-xs text-fg-muted">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

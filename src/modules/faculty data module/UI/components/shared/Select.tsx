import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, containerClassName = '', className = '', placeholder, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 7)}`;
    const errorId = `${selectId}-error`;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        <label htmlFor={selectId} className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`w-full bg-slate-950 border text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-gitam-green transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-gitam-coral focus:border-gitam-coral' : 'border-slate-800 focus:border-gitam-green'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="text-[11px] text-gitam-coral font-semibold flex items-center gap-1 animate-scale-up">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
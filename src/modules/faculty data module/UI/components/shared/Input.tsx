import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, id, containerClassName = '', className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 7)}`;
    const errorId = `${inputId}-error`;

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        <label htmlFor={inputId} className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? errorId : undefined}
            className={`w-full bg-slate-950 border text-sm text-white rounded-xl py-2.5 focus:outline-none focus:border-gitam-green transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              Icon ? 'pl-10 pr-4' : 'px-4'
            } ${
              error ? 'border-gitam-coral focus:border-gitam-coral' : 'border-slate-800 focus:border-gitam-green'
            } ${className}`}
            {...props}
          />
        </div>
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

Input.displayName = 'Input';
export default Input;
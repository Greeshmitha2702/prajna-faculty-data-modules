import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}) => {
  // Base classes for branding styling
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gitam-green focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant mappings
  const variants = {
    primary: 'bg-gitam-green hover:bg-gitam-green/90 text-white shadow-[0_4px_12px_rgba(0,115,103,0.25)] active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 hover:border-slate-600',
    danger: 'bg-gitam-coral hover:bg-gitam-coral/90 text-white shadow-[0_4px_12px_rgba(221,115,110,0.25)]',
    outline: 'bg-transparent border border-slate-750 hover:border-slate-600 text-slate-300 hover:text-white hover:bg-slate-900/40',
    gold: 'bg-gitam-antique-gold hover:bg-gitam-antique-gold/90 text-white shadow-[0_4px_12px_rgba(165,130,85,0.25)]',
  };

  // Size mappings
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-xs gap-2',
    lg: 'px-6 py-3 text-sm gap-2.5',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="loading"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
}) => {
  const baseClass = 'animate-pulse bg-slate-800/80';
  
  const variants = {
    rect: 'rounded-xl',
    text: 'h-3.5 rounded-sm w-3/4',
    circle: 'rounded-full',
  };

  return (
    <div
      aria-hidden="true"
      className={`${baseClass} ${variants[variant]} ${className}`}
    />
  );
};

export default Skeleton;
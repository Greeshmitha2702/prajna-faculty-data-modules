import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="p-12 text-center text-slate-400 space-y-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
      <div className="w-14 h-14 bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-center mx-auto text-slate-500 shadow-inner">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
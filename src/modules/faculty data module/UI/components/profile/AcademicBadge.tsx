import React from 'react';
import { ExternalLink, LucideIcon } from 'lucide-react';

interface AcademicBadgeProps {
  label: string;
  value?: string;
  url: string | null;
  icon: LucideIcon;
  colorClass: string;
}

export const AcademicBadge: React.FC<AcademicBadgeProps> = ({
  label,
  value,
  url,
  icon: Icon,
  colorClass,
}) => {
  return (
    <div className="p-3.5 bg-slate-950/80 border border-slate-850 rounded-xl flex items-center justify-between group transition hover:border-slate-800">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
            {label}
          </span>
          <span className="text-xs font-bold text-slate-300 block truncate mt-1">
            {value || 'Not Configured'}
          </span>
        </div>
      </div>
      
      {url && value ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-white transition cursor-pointer"
          title={`Open ${label} Page`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <span className="text-[10px] text-gitam-coral bg-gitam-coral/10 border border-gitam-coral/20 px-2 py-0.5 rounded font-bold uppercase select-none">
          Missing
        </span>
      )}
    </div>
  );
};
export default AcademicBadge;

import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { Award, Trophy, CalendarDays, ArrowUpRight } from 'lucide-react';

interface QuickStatsPanelProps {
  profile: FacultyProfile;
}

export const QuickStatsPanel: React.FC<QuickStatsPanelProps> = ({ profile }) => {
  // Simple calculation of experience based on DOJ year vs current year (2026)
  const dojYear = new Date(profile.doj).getFullYear();
  const experienceYears = 2026 - dojYear;

  // FEI Score mapping: Kishore Budda has 653, Rahul Sharma has 842, Priya Sharma has 842
  const feiScore = profile.facultyId === 'HOD456' ? 653 : 842;
  const deptRank = profile.facultyId === 'HOD456' ? '#24' : '#5';
  const rankChange = profile.facultyId === 'HOD456' ? '↑ +3 this week' : '↑ +2 this week';

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* FEI Score */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden">
        <div className="absolute top-2 right-2 w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-gitam-green/10 text-gitam-green border border-gitam-green/20 flex items-center justify-center mb-3">
          <Award className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-white leading-none">{feiScore}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 select-none">
          FEI Score
        </span>
      </div>

      {/* Department Rank */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden">
        <div className="absolute top-2 right-2 w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-gitam-antique-gold/10 text-gitam-antique-gold border border-gitam-antique-gold/20 flex items-center justify-center mb-3">
          <Trophy className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-white leading-none">{deptRank}</span>
        <span className="text-[9px] text-gitam-light-green font-bold tracking-wider mt-1">
          {rankChange}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 select-none">
          Dept Rank
        </span>
      </div>

      {/* Experience Years */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg relative group overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3">
          <CalendarDays className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-white leading-none">{experienceYears} Years</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 select-none">
          Experience
        </span>
      </div>
    </div>
  );
};
export default QuickStatsPanel;

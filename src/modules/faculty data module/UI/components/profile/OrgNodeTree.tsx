import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { CheckCircle2, AlertCircle, ShieldAlert, Award } from 'lucide-react';

interface OrgNodeTreeProps {
  profile: FacultyProfile;
}

interface NodeData {
  level: string;
  roleTitle: string;
  name: string;
  designation: string;
  departmentOrSchool: string;
  campus: string;
  status: 'verified' | 'active_reviewer' | 'authorized';
  statusText: string;
  avatarInitials: string;
  colorTheme: 'green' | 'gold' | 'purple' | 'slate';
}

export const OrgNodeTree: React.FC<OrgNodeTreeProps> = ({ profile }) => {
  // 1. Resolve reporting hierarchy names dynamically based on user's campus / department
  const isBengaluru = profile.campus === 'BENGALURU';
  const isHyderabad = profile.campus === 'HYDERABAD';

  // HOD Node resolver
  const hodName = isBengaluru 
    ? 'Dr. Kishore Budda' 
    : isHyderabad 
      ? 'Dr. Srinivas Prasad' 
      : 'Dr. Rahul Sharma';
  
  // Dean Node resolver
  const deanName = profile.school.includes('Technology') 
    ? 'Dr. M. G. Rao' 
    : 'Dr. V. R. Sastry';

  // Director Node resolver
  const directorName = isBengaluru 
    ? 'Dr. L. S. Prasad' 
    : isHyderabad 
      ? 'Dr. D. S. Rao' 
      : 'Dr. Rahul Sharma';

  const nodes: NodeData[] = [
    {
      level: 'L0',
      roleTitle: 'Submitter (Faculty)',
      name: `${profile.firstName} ${profile.lastName}`,
      designation: profile.designation,
      departmentOrSchool: `${profile.department} • ${profile.school}`,
      campus: `${profile.campus} Campus`,
      status: 'verified',
      statusText: 'Verified profile data',
      avatarInitials: `${profile.firstName[0]}${profile.lastName[0]}`,
      colorTheme: 'green',
    },
    {
      level: 'L1',
      roleTitle: 'Level 1: Verification (HOD)',
      name: hodName,
      designation: 'Head of Department',
      departmentOrSchool: `${profile.department} • ${profile.school}`,
      campus: `${profile.campus} Campus`,
      status: 'active_reviewer',
      statusText: 'Active Reviewer (Pending Action)',
      avatarInitials: hodName.split(' ').slice(1).map(n => n[0]).join('') || 'HD',
      colorTheme: 'gold',
    },
    {
      level: 'L2',
      roleTitle: 'Level 2: Endorsement (Dean)',
      name: deanName,
      designation: `Dean, ${profile.school}`,
      departmentOrSchool: profile.school,
      campus: 'GITAM Central Administration',
      status: 'authorized',
      statusText: 'Authorized Sign-off',
      avatarInitials: deanName.split(' ').slice(1).map(n => n[0]).join('') || 'DN',
      colorTheme: 'purple',
    },
    {
      level: 'L3',
      roleTitle: 'Level 3: Final Sign-off (Director)',
      name: directorName,
      designation: isBengaluru || isHyderabad ? 'Campus Director' : 'Director & PVC Office',
      departmentOrSchool: `${profile.school} • Academic Senate`,
      campus: `${profile.campus} Campus`,
      status: 'authorized',
      statusText: 'Authorized Sign-off',
      avatarInitials: directorName.split(' ').slice(1).map(n => n[0]).join('') || 'DIR',
      colorTheme: 'slate',
    },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto py-4">
      {/* Visual vertical connector line */}
      <div className="absolute left-[26px] top-8 bottom-8 w-0.5 bg-slate-800 hidden sm:block"></div>

      <div className="space-y-6">
        {nodes.map((node, index) => {
          // Resolve theme colors dynamically
          const isGreen = node.colorTheme === 'green';
          const isGold = node.colorTheme === 'gold';
          const isPurple = node.colorTheme === 'purple';

          let badgeColor = 'bg-slate-950 text-slate-400 border-slate-800';
          let avatarColor = 'bg-slate-800 text-slate-350 border-slate-700';
          let statusColor = 'text-slate-450';
          let StatusIcon = Award;

          if (isGreen) {
            badgeColor = 'bg-gitam-green/20 text-gitam-light-green border-gitam-green/30';
            avatarColor = 'bg-gitam-green/10 text-gitam-light-green border-gitam-green/40';
            statusColor = 'text-gitam-light-green';
            StatusIcon = CheckCircle2;
          } else if (isGold) {
            badgeColor = 'bg-gitam-antique-gold/20 text-gitam-antique-gold border-gitam-antique-gold/30';
            avatarColor = 'bg-gitam-antique-gold/10 text-gitam-antique-gold border-gitam-antique-gold/40';
            statusColor = 'text-gitam-antique-gold';
            StatusIcon = AlertCircle;
          } else if (isPurple) {
            badgeColor = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            avatarColor = 'bg-purple-500/10 text-purple-400 border-purple-500/40';
            statusColor = 'text-purple-400';
            StatusIcon = ShieldAlert;
          }

          return (
            <div key={index} className="flex flex-col sm:flex-row items-start gap-4 relative group">
              {/* Level Avatar Circle */}
              <div className="flex items-center gap-3 sm:gap-0 sm:shrink-0 relative z-10">
                <div className={`w-[54px] h-[54px] rounded-full border-2 flex items-center justify-center font-bold text-sm select-none transition-transform duration-300 group-hover:scale-105 ${avatarColor}`}>
                  {node.avatarInitials}
                </div>
                <span className="sm:hidden text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {node.roleTitle}
                </span>
              </div>

              {/* Node Metadata Detail Card */}
              <div className="flex-1 w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-300 hover:shadow-xl group-hover:translate-x-0.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Title & Level Tag */}
                  <div className="flex items-center gap-2">
                    <span className={`hidden sm:inline text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${badgeColor}`}>
                      {node.level}
                    </span>
                    <span className="hidden sm:inline text-xs font-bold text-white/90">
                      {node.roleTitle}
                    </span>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 text-[10px] font-bold border border-slate-850 max-w-max ${statusColor}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {node.statusText}
                  </div>
                </div>

                {/* Node Identity Details */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <h4 className="text-base font-extrabold text-white font-display">
                    {node.name}
                  </h4>
                  <span className="text-xs font-semibold text-slate-400">
                    {node.designation}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 font-medium">
                  <span className="text-gitam-beige/80">{node.departmentOrSchool}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{node.campus}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OrgNodeTree;

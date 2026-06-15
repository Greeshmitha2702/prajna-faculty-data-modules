import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApproverHierarchyCardProps {
  profile: FacultyProfile;
}

export const ApproverHierarchyCard: React.FC<ApproverHierarchyCardProps> = ({ profile }) => {
  // Mock name based on campus
  const hodName = profile.campus === 'VISAKHAPATNAM' ? 'Dr. Rahul Sharma' : 'Dr. Kishore Budda';
  const directorName = 'Dr. Kishore Budda (Director)';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-gitam-beige" />
          Active Approvers
        </h3>
        <Link
          to="/profile/hierarchy"
          className="text-xs font-bold text-gitam-green hover:underline flex items-center gap-1 cursor-pointer"
        >
          View Tree
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* L1 Approver Card */}
        <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2 relative group hover:border-slate-800 transition">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-gitam-antique-gold/20 text-gitam-antique-gold border border-gitam-antique-gold/30">
              L1 APPROVER
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">HOD</span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">{hodName}</h4>
          <p className="text-[11px] text-slate-450">Head of Department • {profile.department}</p>
        </div>

        {/* L2 Approver Card */}
        <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2 relative group hover:border-slate-800 transition">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
              L2 APPROVER
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Director</span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">{directorName}</h4>
          <p className="text-[11px] text-slate-450">Director of School • {profile.school}</p>
        </div>
      </div>
    </div>
  );
};
export default ApproverHierarchyCard;

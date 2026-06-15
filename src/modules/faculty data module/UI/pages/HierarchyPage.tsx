import React from 'react';
import { useAuth } from '../mock/mockAuth';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { OrgNodeTree } from '../components/profile/OrgNodeTree';

export const HierarchyPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
          Approver & Reporting Hierarchy
        </h1>
        <p className="text-slate-450 text-xs leading-relaxed max-w-2xl">
          PRAJNA automatically routes profile changes and credential verification requests through this reporting chain. Verification authority is campus-isolated.
        </p>
      </div>

      {/* Visual Organogram Node Tree */}
      <OrgNodeTree profile={user} />

      {/* Rules Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gitam-light-green" />
          Approval Rules & Guidelines
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gitam-light-green"></span>
              Auto-Approved Actions
            </h4>
            <p>
              Updates to profile photos, research interests, and residential address are saved immediately. These do not require workflow approval.
            </p>
          </div>
          
          <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gitam-antique-gold"></span>
              Verification Routing (L1)
            </h4>
            <p>
              New qualifications, academic designations, and external profiles (ORCID, Scopus, VIDWAN) require Level 1 (HOD) approval before they are formally published.
            </p>
          </div>
          
          <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Escalation Rules (L2 & L3)
            </h4>
            <p>
              High-impact changes or modifications involving core identity elements require endorsement from the Dean (L2) and the Campus Director (L3).
            </p>
          </div>

          <div className="space-y-3 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-slate-400 shrink-0" />
              SLA & Expiry Limits
            </h4>
            <p>
              Verification requests will expire and automatically escalate to the next tier if they remain pending with an approver for more than 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HierarchyPage;

import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { useAuth } from '../../mock/mockAuth';
import { Mail, Phone, MapPin, Lock } from 'lucide-react';

interface ContactDetailsCardProps {
  profile: FacultyProfile;
}

export const ContactDetailsCard: React.FC<ContactDetailsCardProps> = ({ profile }) => {
  const { user: currentUser } = useAuth();

  // 1. Tenant/Campus Isolation Check
  const campusMismatch = currentUser && profile.campus !== currentUser.campus;

  // 2. Role-Based Access Control (RBAC) Logic
  const checkAccess = (): { granted: boolean; reason?: string } => {
    if (!currentUser) return { granted: false, reason: 'Authentication required' };
    if (campusMismatch) return { granted: false, reason: 'Cross-campus data isolation active' };

    // Rule A: Self access
    if (currentUser.facultyId === profile.facultyId) {
      return { granted: true };
    }

    // Rule B: Admin access
    if (currentUser.role === 'ADMIN') {
      return { granted: true };
    }

    // Rule C: PVC access (Full campus visibility)
    if (currentUser.role === 'PVC') {
      return { granted: true };
    }

    // Rule D: Director / Dean access (School level visibility)
    if (currentUser.role === 'DIRECTOR' || currentUser.role === 'DEAN') {
      if (currentUser.school === profile.school) {
        return { granted: true };
      }
      return { granted: false, reason: 'Contact details restricted to your School' };
    }

    // Rule E: HOD access (Department level visibility)
    if (currentUser.role === 'HOD') {
      if (currentUser.department === profile.department) {
        return { granted: true };
      }
      return { granted: false, reason: 'Contact details restricted to your Department' };
    }

    // Rule F: Other Faculty trying to view another Faculty's details
    return { granted: false, reason: 'Access restricted to authorized roles (HOD/Director)' };
  };

  const { granted, reason } = checkAccess();

  // Render locked screen if access is denied
  if (!granted) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Contact Details
        </h3>
        <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-300">Access Restricted</p>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
              {reason || 'You do not have the required permissions to view this contact information.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider">
          Contact Details
        </h3>
        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-gitam-green/20 text-gitam-light-green border border-gitam-green/30 select-none">
          SECURE
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Email Address */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
              Official Email
            </span>
            <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-slate-200 hover:text-gitam-green hover:underline truncate block mt-1.5">
              {profile.email}
            </a>
          </div>
        </div>

        {/* Contact Phone */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500 shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
              Contact Number
            </span>
            <a href={`tel:${profile.contactNumber}`} className="text-sm font-semibold text-slate-200 hover:text-gitam-green hover:underline block mt-1.5">
              {profile.contactNumber}
            </a>
          </div>
        </div>

        {/* Residential Address */}
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
              Residential Address
            </span>
            <p className="text-xs font-semibold text-slate-350 leading-relaxed mt-1.5">
              {profile.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactDetailsCard;

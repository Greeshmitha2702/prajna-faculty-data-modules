import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { calculateProfileCompleteness } from '../../mock/completenessEngine';
import { Edit2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileHeroBannerProps {
  profile: FacultyProfile;
  isOwnProfile: boolean;
}

export const ProfileHeroBanner: React.FC<ProfileHeroBannerProps> = ({ profile, isOwnProfile }) => {
  const completeness = calculateProfileCompleteness(profile);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Decorative cover header */}
      <div className="h-40 bg-gradient-to-r from-gitam-dark-green via-gitam-green to-gitam-green/40 opacity-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="px-6 pb-6 flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 relative z-10">
        {/* User avatar */}
        <div className="relative shrink-0">
          <img
            src={profile.profilePhotoUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-28 h-28 rounded-full border-4 border-slate-950 object-cover bg-slate-900 shadow-2xl"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-gitam-light-green border-2 border-slate-950 rounded-full" title="Online"></span>
        </div>

        {/* Profile metadata */}
        <div className="flex-1 space-y-1 pt-4 md:pt-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              {profile.firstName} {profile.lastName}
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-450 border border-slate-800 select-none">
              ID: {profile.facultyId}
            </span>
            {isOwnProfile && (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gitam-green/20 text-gitam-light-green border border-gitam-green/30 select-none">
                ME
              </span>
            )}
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gitam-antique-gold/20 text-gitam-antique-gold border border-gitam-antique-gold/30 select-none">
              {profile.role}
            </span>
          </div>
          
          <p className="text-sm font-semibold text-slate-200">
            {profile.designation} • <span className="text-gitam-beige">{profile.department}</span>
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <p>{profile.school}</p>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <p className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gitam-beige shrink-0" />
              {profile.campus} Campus
            </p>
          </div>
        </div>

        {/* Profile completeness card */}
        <div className="w-full md:w-auto flex items-center gap-4 bg-slate-950/70 border border-slate-850 rounded-xl p-3 md:p-4 mt-4 md:mt-0 backdrop-blur-sm self-stretch md:self-auto">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#1e293b" strokeWidth="4.5" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#A58255"
                strokeWidth="4.5"
                strokeDasharray={151}
                strokeDashoffset={151 - (151 * completeness) / 100}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-black text-white">{completeness}%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gitam-antique-gold uppercase tracking-wider">
              Profile Completeness
            </p>
            <p className="text-xs text-slate-450 mt-0.5 leading-tight">
              {completeness === 100
                ? 'Profile is fully completed!'
                : 'Complete identifiers to gain score bonus'}
            </p>
          </div>
        </div>

        {/* Edit Action Button */}
        {isOwnProfile && (
          <Link
            to="/profile/edit"
            className="w-full md:w-auto px-4 py-2.5 bg-gitam-green hover:bg-gitam-green/95 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 justify-center shrink-0 shadow-[0_4px_12px_rgba(0,115,103,0.2)] hover:shadow-[0_4px_16px_rgba(0,115,103,0.35)]"
          >
            <Edit2 className="w-4.5 h-4.5" />
            Edit Profile
          </Link>
        )}
      </div>
    </div>
  );
};
export default ProfileHeroBanner;

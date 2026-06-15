import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { AcademicBadge } from './AcademicBadge';
import { GraduationCap, FileCode, Search, Award } from 'lucide-react';

interface AcademicIdsCardProps {
  profile: FacultyProfile;
}

export const AcademicIdsCard: React.FC<AcademicIdsCardProps> = ({ profile }) => {
  const identifiers = [
    {
      label: 'ORCID ID',
      value: profile.orcidId,
      url: profile.orcidId ? `https://orcid.org/${profile.orcidId}` : null,
      icon: FileCode,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Scopus Author ID',
      value: profile.scopusId,
      url: profile.scopusId ? `https://www.scopus.com/authid/detail.uri?authorId=${profile.scopusId}` : null,
      icon: Search,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    },
    {
      label: 'Google Scholar ID',
      value: profile.googleScholarId,
      url: profile.googleScholarId ? `https://scholar.google.com/citations?user=${profile.googleScholarId}` : null,
      icon: GraduationCap,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'VIDWAN Expert ID',
      value: profile.vidwanId,
      url: profile.vidwanId ? `https://vidwan.inflibnet.ac.in/profile/${profile.vidwanId}` : null,
      icon: Award,
      color: 'text-gitam-antique-gold bg-gitam-antique-gold/10 border-gitam-antique-gold/20',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
      <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider mb-2">
        Scholarly Identifiers
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {identifiers.map((id, index) => (
          <AcademicBadge
            key={index}
            label={id.label}
            value={id.value}
            url={id.url}
            icon={id.icon}
            colorClass={id.color}
          />
        ))}
      </div>
    </div>
  );
};
export default AcademicIdsCard;

import React from 'react';
import { Qualification } from '../../mock/mockProfiles';
import { Award, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QualificationsListProps {
  qualifications: Qualification[];
  isOwnProfile: boolean;
}

export const QualificationsList: React.FC<QualificationsListProps> = ({
  qualifications,
  isOwnProfile,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-gitam-antique-gold" />
          Qualifications & Credentials
        </h3>
        {isOwnProfile && (
          <Link
            to="/profile/qualifications"
            className="text-xs font-bold text-gitam-green hover:underline flex items-center gap-1 cursor-pointer"
          >
            Manage
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="space-y-3.5">
        {qualifications.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No qualifications logged yet.</p>
        ) : (
          qualifications.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-slate-950/80 border border-slate-850 rounded-xl flex items-center justify-between gap-4 group transition hover:border-slate-800"
            >
              <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-bold text-white tracking-tight">{q.degree}</h4>
                <p className="text-xs text-slate-350 truncate">{q.specialization}</p>
                <p className="text-[10px] text-slate-450 mt-0.5">
                  {q.university} • <span className="text-slate-500">Class of {q.yearOfCompletion}</span>
                </p>
              </div>
              <a
                href={q.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg border border-slate-850 flex items-center gap-1.5 text-xs transition cursor-pointer"
                title="View Verified Certificate"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline font-semibold">View Proof</span>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default QualificationsList;

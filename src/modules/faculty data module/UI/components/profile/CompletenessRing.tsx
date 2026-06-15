import React from 'react';
import { FacultyProfile } from '../../mock/mockProfiles';
import { calculateProfileCompleteness, getCompletenessBreakdown } from '../../mock/completenessEngine';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CompletenessRingProps {
  profile: FacultyProfile;
}

export const CompletenessRing: React.FC<CompletenessRingProps> = ({ profile }) => {
  const percentage = calculateProfileCompleteness(profile);
  const breakdown = getCompletenessBreakdown(profile);
  const missingItems = breakdown.filter((item) => !item.isCompleted);

  // SVG parameters for the progress circle
  const radius = 54;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
      <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider">
        Profile Integrity Check
      </h3>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Left section: SVG Progress Ring */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center select-none">
            {/* SVG Circular Ring */}
            <svg width={144} height={144} className="transform -rotate-90 w-full h-full">
              <circle
                cx={72}
                cy={72}
                r={normalizedRadius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={72}
                cy={72}
                r={normalizedRadius}
                fill="none"
                stroke="#A58255"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-white">{percentage}%</span>
              <p className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5">
                Complete
              </p>
            </div>
          </div>
          <span className="mt-4 text-xs font-bold text-slate-400">
            {percentage === 100 ? '🎉 Verified Profile' : 'Points Bonus Pending'}
          </span>
        </div>

        {/* Right section: Action Items Checklist */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">
              Checklist Breakdown
            </h4>
            <div className="space-y-2">
              {breakdown.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 py-1 px-2 rounded-lg text-xs font-medium transition ${
                    item.isCompleted ? 'text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-gitam-light-green shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{item.field}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${item.isCompleted ? 'text-slate-600' : 'text-gitam-antique-gold'}`}>
                    +{item.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Nudges */}
          {missingItems.length > 0 && (
            <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 space-y-3">
              <h5 className="text-[10px] font-bold text-gitam-coral uppercase tracking-wider flex items-center gap-1.5 leading-none">
                <AlertCircle className="w-4 h-4" />
                Actions Required for 100%
              </h5>
              <div className="space-y-2">
                {missingItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <p className="text-slate-400 truncate pr-2">{item.actionRequired}</p>
                    <Link
                      to={item.field.includes('Qualification') ? '/profile/qualifications' : '/profile/edit'}
                      className="text-[10px] font-extrabold text-gitam-green hover:underline shrink-0"
                    >
                      Fix Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CompletenessRing;

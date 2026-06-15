import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../mock/mockAuth';
import { mockProfiles } from '../mock/mockProfiles';
import { Layers } from 'lucide-react';

// Import sub-components
import { ProfileHeroBanner } from '../components/profile/ProfileHeroBanner';
import { QuickStatsPanel } from '../components/profile/QuickStatsPanel';
import { ContactDetailsCard } from '../components/profile/ContactDetailsCard';
import { AcademicIdsCard } from '../components/profile/AcademicIdsCard';
import { QualificationsList } from '../components/profile/QualificationsList';
import { ApproverHierarchyCard } from '../components/profile/ApproverHierarchyCard';
import { CompletenessRing } from '../components/profile/CompletenessRing';

// Import shared UI components
import Skeleton from '../components/shared/Skeleton';

export const ProfileViewPage: React.FC = () => {
  const { facultyId } = useParams<{ facultyId: string }>();
  const { user: currentUser } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  // Determine which profile to show
  const targetFacultyId = facultyId || currentUser?.facultyId || '';
  const profile = mockProfiles[targetFacultyId];

  // Trigger simulated loading skeleton when changing target profile
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [targetFacultyId]);

  // If profile does not exist
  if (!profile) {
    return (
      <div className="text-center py-12" role="status">
        <h2 className="text-xl font-semibold text-white">Profile Not Found</h2>
        <p className="text-slate-400 mt-2">The requested faculty member does not exist.</p>
      </div>
    );
  }

  // Tenant Isolation check: Verify campus matches
  if (currentUser && profile.campus !== currentUser.campus) {
    return <Navigate to="/forbidden" replace />;
  }

  const isOwnProfile = currentUser?.facultyId === profile.facultyId;

  return (
    <div className="space-y-6">
      {/* Page Loading Skeletons */}
      {pageLoading ? (
        <div className="space-y-6" aria-busy="true" aria-label="Loading profile information">
          {/* Banner Skeleton */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48 rounded" />
                <Skeleton className="h-4 w-36 rounded" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-3 w-3/4 rounded" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-8 w-full rounded-xl" />
                <Skeleton className="h-8 w-full rounded-xl" />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <Skeleton className="h-4 w-36 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                  <Skeleton className="h-14 rounded-xl" />
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 1. Profile Hero Banner */}
          <ProfileHeroBanner profile={profile} isOwnProfile={isOwnProfile} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Stats, Contacts & Scholarly Identifiers */}
            <div className="space-y-6 lg:col-span-1">
              {/* Detailed Profile Completeness (Only for own profile) */}
              {isOwnProfile && <CompletenessRing profile={profile} />}

              {/* 2. Quick Stats Panel */}
              <QuickStatsPanel profile={profile} />

              {/* 3. Contact Details Card */}
              <ContactDetailsCard profile={profile} />

              {/* 4. Active Approvers Summary */}
              <ApproverHierarchyCard profile={profile} />
            </div>

            {/* Right Column: Qualifications, Research Interests & Scholarly Identifiers */}
            <div className="space-y-6 lg:col-span-2">
              {/* 5. Academic IDs Badge Card */}
              <AcademicIdsCard profile={profile} />

              {/* 6. Educational Qualifications List */}
              <QualificationsList qualifications={profile.qualifications} isOwnProfile={isOwnProfile} />

              {/* Research Interests Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-gitam-antique-white uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-gitam-green" />
                  Research Interests
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {profile.researchInterests.length === 0 ? (
                    <p className="text-xs text-slate-400">No research interests listed.</p>
                  ) : (
                    profile.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="text-xs bg-slate-950/80 border border-slate-850 text-slate-350 px-3 py-2 rounded-xl font-semibold hover:border-slate-800 transition select-none"
                      >
                        {interest}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default ProfileViewPage;

import { FacultyProfile } from './mockProfiles';

/**
 * Calculates the profile completeness percentage dynamically based on filled fields:
 * - Designation: 10%
 * - Profile Photo: 15%
 * - ORCID ID: 15%
 * - Scopus ID: 15%
 * - Contact Number: 5%
 * - Residential Address: 10%
 * - Qualifications: 15% per credential, up to 30% max
 * 
 * Total: 100%
 */
export const calculateProfileCompleteness = (profile: FacultyProfile): number => {
  let percentage = 0;

  if (profile.designation && profile.designation.trim() !== '') {
    percentage += 10;
  }
  
  if (profile.profilePhotoUrl && profile.profilePhotoUrl.trim() !== '') {
    percentage += 15;
  }
  
  if (profile.orcidId && profile.orcidId.trim() !== '') {
    percentage += 15;
  }
  
  if (profile.scopusId && profile.scopusId.trim() !== '') {
    percentage += 15;
  }
  
  if (profile.contactNumber && profile.contactNumber.trim() !== '') {
    percentage += 5;
  }
  
  if (profile.address && profile.address.trim() !== '') {
    percentage += 10;
  }

  const qualificationCount = profile.qualifications ? profile.qualifications.length : 0;
  percentage += Math.min(qualificationCount * 15, 30);

  return percentage;
};

export interface CompletenessBreakdown {
  field: string;
  weight: number;
  isCompleted: boolean;
  actionRequired: string;
}

/**
 * Returns a detailed checklist of profile fields, their weights, completion status,
 * and recommendations to nudge the user toward 100% completeness.
 */
export const getCompletenessBreakdown = (profile: FacultyProfile): CompletenessBreakdown[] => {
  const qualificationsCount = profile.qualifications ? profile.qualifications.length : 0;

  return [
    {
      field: 'Designation',
      weight: 10,
      isCompleted: !!profile.designation && profile.designation.trim() !== '',
      actionRequired: 'Add your official academic designation',
    },
    {
      field: 'Profile Photo',
      weight: 15,
      isCompleted: !!profile.profilePhotoUrl && profile.profilePhotoUrl.trim() !== '',
      actionRequired: 'Upload a professional profile photo',
    },
    {
      field: 'ORCID ID',
      weight: 15,
      isCompleted: !!profile.orcidId && profile.orcidId.trim() !== '',
      actionRequired: 'Link your ORCID scholarly identifier',
    },
    {
      field: 'Scopus Author ID',
      weight: 15,
      isCompleted: !!profile.scopusId && profile.scopusId.trim() !== '',
      actionRequired: 'Link your Scopus author identifier',
    },
    {
      field: 'Contact Number',
      weight: 5,
      isCompleted: !!profile.contactNumber && profile.contactNumber.trim() !== '',
      actionRequired: 'Update your contact phone number',
    },
    {
      field: 'Residential Address',
      weight: 10,
      isCompleted: !!profile.address && profile.address.trim() !== '',
      actionRequired: 'Enter your residential address details',
    },
    {
      field: 'Primary Qualification',
      weight: 15,
      isCompleted: qualificationsCount >= 1,
      actionRequired: 'Log at least one educational qualification degree',
    },
    {
      field: 'Secondary Qualification',
      weight: 15,
      isCompleted: qualificationsCount >= 2,
      actionRequired: 'Log a second qualification degree (e.g. Masters or PhD)',
    },
  ];
};

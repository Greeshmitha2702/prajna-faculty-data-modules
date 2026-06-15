export interface Qualification {
  id: string;
  degree: string;
  specialization: string;
  university: string;
  yearOfCompletion: number;
  certificateUrl: string;
}

export interface FacultyProfile {
  facultyId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  dob: string;
  doj: string;
  designation: string;
  department: string;
  school: string;
  campus: 'BENGALURU' | 'HYDERABAD' | 'VISAKHAPATNAM';
  role: 'FACULTY' | 'HOD' | 'DEAN' | 'DIRECTOR' | 'PVC' | 'ADMIN';
  profilePhotoUrl: string;
  researchInterests: string[];
  orcidId?: string;
  scopusId?: string;
  googleScholarId?: string;
  vidwanId?: string;
  profileCompletionPercentage: number;
  createdAt: string;
  updatedAt: string;
  qualifications: Qualification[];
}

export const mockProfiles: Record<string, FacultyProfile> = {
  FAC123: {
    facultyId: 'FAC123',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'psharma@gitam.edu',
    contactNumber: '+919876543210',
    address: 'Flat 402, Block A, Green Meadows Apartments, Bengaluru, Karnataka - 560089',
    dob: '1988-08-15',
    doj: '2019-06-18',
    designation: 'Assistant Professor',
    department: 'CSE',
    school: 'School of Technology',
    campus: 'BENGALURU',
    role: 'FACULTY',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    researchInterests: ['Artificial Intelligence', 'Distributed Systems', 'Natural Language Processing'],
    orcidId: '0000-0002-1825-0097',
    scopusId: '57204859300',
    googleScholarId: 'z-rS2oIAAAAJ',
    vidwanId: '184905',
    profileCompletionPercentage: 78,
    createdAt: '2019-06-18T10:00:00Z',
    updatedAt: '2026-06-04T10:30:00Z',
    qualifications: [
      {
        id: 'q1',
        degree: 'Ph.D.',
        specialization: 'Computer Science & Engineering',
        university: 'IIT Hyderabad',
        yearOfCompletion: 2018,
        certificateUrl: 'https://prajna-proof-bucket.s3.amazonaws.com/uploads/phd_cert.pdf',
      },
      {
        id: 'q2',
        degree: 'M.Tech',
        specialization: 'Software Engineering',
        university: 'NIT Warangal',
        yearOfCompletion: 2013,
        certificateUrl: 'https://prajna-proof-bucket.s3.amazonaws.com/uploads/mtech_cert.pdf',
      },
    ],
  },
  HOD456: {
    facultyId: 'HOD456',
    firstName: 'Kishore',
    lastName: 'Budda',
    email: 'kbudda@gitam.edu',
    contactNumber: '+919701516999',
    address: 'Director\'s Quarters, GITAM Bengaluru Campus, Doddaballapur Road, Bengaluru - 562163',
    dob: '1976-03-22',
    doj: '2010-07-12',
    designation: 'Professor & Director',
    department: 'ECE',
    school: 'School of Technology',
    campus: 'BENGALURU',
    role: 'HOD',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    researchInterests: ['VLSI Design', 'Microprocessors', 'Embedded Systems', 'IoT Solutions'],
    orcidId: '0000-0001-9482-1234',
    scopusId: '57198234500',
    googleScholarId: 'kBuddaAAAAAJ',
    vidwanId: '98421',
    profileCompletionPercentage: 100,
    createdAt: '2010-07-12T09:00:00Z',
    updatedAt: '2026-06-10T12:00:00Z',
    qualifications: [
      {
        id: 'q3',
        degree: 'Ph.D.',
        specialization: 'Microelectronics',
        university: 'IISc Bangalore',
        yearOfCompletion: 2008,
        certificateUrl: 'https://prajna-proof-bucket.s3.amazonaws.com/uploads/kb_phd_cert.pdf',
      },
    ],
  },
  DIR789: {
    facultyId: 'DIR789',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rsharma@gitam.edu',
    contactNumber: '+919988776655',
    address: 'MIG-23, Sector 4, MVP Colony, Visakhapatnam, Andhra Pradesh - 530017',
    dob: '1982-11-04',
    doj: '2015-08-01',
    designation: 'Director & Professor',
    department: 'CSE',
    school: 'School of Core Engineering',
    campus: 'VISAKHAPATNAM',
    role: 'DIRECTOR',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    researchInterests: ['Machine Learning', 'Cyber Security', 'Cloud Computing'],
    orcidId: '0000-0003-4921-3950',
    scopusId: '57385920300',
    googleScholarId: 'rSharmaAAAAAJ',
    vidwanId: '124802',
    profileCompletionPercentage: 85,
    createdAt: '2015-08-01T10:00:00Z',
    updatedAt: '2026-05-20T14:30:00Z',
    qualifications: [
      {
        id: 'q4',
        degree: 'Ph.D.',
        specialization: 'Cyber Security',
        university: 'Andhra University',
        yearOfCompletion: 2014,
        certificateUrl: 'https://prajna-proof-bucket.s3.amazonaws.com/uploads/rahul_phd.pdf',
      },
    ],
  },
};

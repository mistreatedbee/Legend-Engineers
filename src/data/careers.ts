export interface CareerOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  closingDate: string;
  status: 'Open' | 'Closed';
}

/**
 * Career openings — add, edit, or remove entries here.
 * Only openings with status "Open" are shown on the website.
 */
export const careerOpenings: CareerOpening[] = [
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    department: 'Mechanical Engineering',
    location: 'South Africa',
    type: 'Full-time',
    description:
      'Join our engineering team and contribute to industrial engineering projects across Mpumalanga and beyond.',
    requirements: [
      'Relevant engineering qualification (BEng/BTech Mechanical)',
      'Relevant industry experience in industrial or civil projects',
      'Good communication skills and ability to work in multidisciplinary teams',
    ],
    closingDate: '2026-06-30',
    status: 'Open',
  },
  {
    id: 'geotechnical-technician',
    title: 'Geotechnical Technician',
    department: 'Geotechnical Investigations',
    location: 'Mpumalanga, South Africa',
    type: 'Full-time',
    description:
      'Support field investigations, soil sampling, and laboratory coordination for geotechnical projects.',
    requirements: [
      'Diploma or certificate in geotechnical / civil engineering technology',
      'Field experience with soil testing equipment',
      "Valid driver's licence and willingness to travel to site",
    ],
    closingDate: '2026-05-15',
    status: 'Open',
  },
  {
    id: 'civil-engineering-intern',
    title: 'Civil Engineering Intern',
    department: 'Civil Engineering',
    location: 'Witbank (eMalahleni), South Africa',
    type: 'Internship',
    description:
      'Gain hands-on experience on civil infrastructure and site investigation projects under senior engineers.',
    requirements: [
      'Currently studying towards a civil engineering qualification',
      'Strong interest in site investigations and project delivery',
      'Proficiency in Microsoft Office; CAD experience is advantageous',
    ],
    closingDate: '2026-04-30',
    status: 'Open',
  },
];

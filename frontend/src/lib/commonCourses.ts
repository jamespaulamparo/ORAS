/**
 * Complete Curriculum of Bachelor of Science in Information Systems (BSIS)
 * Don Mariano Marcos Memorial State University - North La Union Campus (DMMMSU NLUC)
 * Valid for Academic Year 2026 and current CMO curriculum standards.
 */

export interface CommonCourse {
  code: string;
  title: string;
  units: number;
  yearLevel: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  category: 'Major' | 'GE' | 'Elective' | 'Mandated';
}

export const DMMMSU_NLUC_BSIS_CURRICULUM: CommonCourse[] = [
  // =========================================================================
  // FIRST YEAR - FIRST SEMESTER
  // =========================================================================
  {
    code: 'IS 101',
    title: 'Fundamentals of Information Systems',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'CC 101',
    title: 'Introduction to Computing',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'CC 102',
    title: 'Computer Programming 1 (Fundamentals)',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'GE 101',
    title: 'Understanding the Self',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'GE',
  },
  {
    code: 'GE 102',
    title: 'Readings in Philippine History',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'GE',
  },
  {
    code: 'GE 103',
    title: 'The Contemporary World',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'GE',
  },
  {
    code: 'PATHFit 1',
    title: 'Movement Competency Training',
    units: 2.0,
    yearLevel: 1,
    semester: 1,
    category: 'Mandated',
  },
  {
    code: 'NSTP 1',
    title: 'National Service Training Program 1',
    units: 3.0,
    yearLevel: 1,
    semester: 1,
    category: 'Mandated',
  },

  // =========================================================================
  // FIRST YEAR - SECOND SEMESTER
  // =========================================================================
  {
    code: 'CC 103',
    title: 'Computer Programming 2 (Object-Oriented Programming)',
    units: 3.0,
    yearLevel: 1,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'IS 102',
    title: 'Organization and Management Concepts',
    units: 3.0,
    yearLevel: 1,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'GE 104',
    title: 'Mathematics in the Modern World',
    units: 3.0,
    yearLevel: 1,
    semester: 2,
    category: 'GE',
  },
  {
    code: 'GE 105',
    title: 'Purposive Communication',
    units: 3.0,
    yearLevel: 1,
    semester: 2,
    category: 'GE',
  },
  {
    code: 'GE 106',
    title: 'Art Appreciation',
    units: 3.0,
    yearLevel: 1,
    semester: 2,
    category: 'GE',
  },
  {
    code: 'PATHFit 2',
    title: 'Fitness-Based Exercise Activities',
    units: 2.0,
    yearLevel: 1,
    semester: 2,
    category: 'Mandated',
  },
  {
    code: 'NSTP 2',
    title: 'National Service Training Program 2',
    units: 3.0,
    yearLevel: 1,
    semester: 2,
    category: 'Mandated',
  },

  // =========================================================================
  // SECOND YEAR - FIRST SEMESTER
  // =========================================================================
  {
    code: 'CC 104',
    title: 'Data Structures and Algorithms',
    units: 3.0,
    yearLevel: 2,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IS 103',
    title: 'Information Management (Database Systems 1)',
    units: 3.0,
    yearLevel: 2,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'CC 105',
    title: 'Discrete Mathematics',
    units: 3.0,
    yearLevel: 2,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'GE 107',
    title: 'Science, Technology, and Society',
    units: 3.0,
    yearLevel: 2,
    semester: 1,
    category: 'GE',
  },
  {
    code: 'GE 108',
    title: 'Ethics',
    units: 3.0,
    yearLevel: 2,
    semester: 1,
    category: 'GE',
  },
  {
    code: 'GE-Elec 1',
    title: 'Living in the IT Era',
    units: 3.0,
    yearLevel: 2,
    semester: 1,
    category: 'GE',
  },
  {
    code: 'PATHFit 3',
    title: 'Physical Activities in Dance and Sports',
    units: 2.0,
    yearLevel: 2,
    semester: 1,
    category: 'Mandated',
  },

  // =========================================================================
  // SECOND YEAR - SECOND SEMESTER
  // =========================================================================
  {
    code: 'IS 104',
    title: 'Advanced Database Systems',
    units: 3.0,
    yearLevel: 2,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'IS 105',
    title: 'Enterprise Architecture',
    units: 3.0,
    yearLevel: 2,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'CC 106',
    title: 'Applications Development and Emerging Technologies',
    units: 3.0,
    yearLevel: 2,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'GE 109',
    title: 'Life and Works of Rizal',
    units: 3.0,
    yearLevel: 2,
    semester: 2,
    category: 'GE',
  },
  {
    code: 'GE-Elec 2',
    title: 'Gender and Society',
    units: 3.0,
    yearLevel: 2,
    semester: 2,
    category: 'GE',
  },
  {
    code: 'PATHFit 4',
    title: 'Recreational and Outdoor Activities',
    units: 2.0,
    yearLevel: 2,
    semester: 2,
    category: 'Mandated',
  },

  // =========================================================================
  // THIRD YEAR - FIRST SEMESTER
  // =========================================================================
  {
    code: 'IS 106',
    title: 'Systems Analysis and Design',
    units: 3.0,
    yearLevel: 3,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IS 107',
    title: 'IS Strategy, Management, and Acquisition',
    units: 3.0,
    yearLevel: 3,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IS 108',
    title: 'Business Process Management',
    units: 3.0,
    yearLevel: 3,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IT 101',
    title: 'Networking and Communications',
    units: 3.0,
    yearLevel: 3,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IS-PE 1',
    title: 'IS Professional Elective 1: Business Analytics and Data Mining',
    units: 3.0,
    yearLevel: 3,
    semester: 1,
    category: 'Elective',
  },
  {
    code: 'GE-Elec 3',
    title: 'Philippine Popular Culture',
    units: 3.0,
    yearLevel: 3,
    semester: 1,
    category: 'GE',
  },

  // =========================================================================
  // THIRD YEAR - SECOND SEMESTER
  // =========================================================================
  {
    code: 'IS 109',
    title: 'IS Project Management',
    units: 3.0,
    yearLevel: 3,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'IS 110',
    title: 'Quantitative Methods in Information Systems',
    units: 3.0,
    yearLevel: 3,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'IS 111',
    title: 'Capstone Project and Research 1',
    units: 3.0,
    yearLevel: 3,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'IS 112',
    title: 'Information Assurance and Security',
    units: 3.0,
    yearLevel: 3,
    semester: 2,
    category: 'Major',
  },
  {
    code: 'IS-PE 2',
    title: 'IS Professional Elective 2: Enterprise Systems and ERP',
    units: 3.0,
    yearLevel: 3,
    semester: 2,
    category: 'Elective',
  },

  // =========================================================================
  // FOURTH YEAR - FIRST SEMESTER
  // =========================================================================
  {
    code: 'IS 113',
    title: 'Capstone Project and Research 2',
    units: 3.0,
    yearLevel: 4,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IS 114',
    title: 'Evaluation of Business Performance',
    units: 3.0,
    yearLevel: 4,
    semester: 1,
    category: 'Major',
  },
  {
    code: 'IS-PE 3',
    title: 'IS Professional Elective 3: IT Audit and Controls',
    units: 3.0,
    yearLevel: 4,
    semester: 1,
    category: 'Elective',
  },
  {
    code: 'IS-PE 4',
    title: 'IS Professional Elective 4: Human-Computer Interaction',
    units: 3.0,
    yearLevel: 4,
    semester: 1,
    category: 'Elective',
  },

  // =========================================================================
  // FOURTH YEAR - SECOND SEMESTER
  // =========================================================================
  {
    code: 'IS 115',
    title: 'Practicum / Industry Internship (486 Hours)',
    units: 6.0,
    yearLevel: 4,
    semester: 2,
    category: 'Major',
  },
];

// Default export alias for forms and autocomplete lookups
export const COMMON_COURSES = DMMMSU_NLUC_BSIS_CURRICULUM;

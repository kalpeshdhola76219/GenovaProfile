import { DocumentData, DocumentType } from '../types/document';

export const DEFAULT_MALE_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23e2e8f0'/%3E%3Cstop offset='100%25' stop-color='%23cbd5e1'/%3E%3C/linearGradient%3E%3ClinearGradient id='skin' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fed7aa'/%3E%3Cstop offset='100%25' stop-color='%23fdba74'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3Cpath d='M30 240 C30 160, 60 145, 100 145 C140 145, 170 160, 170 240 Z' fill='%231e293b'/%3E%3Cpath d='M85 145 L100 170 L115 145 Z' fill='%23ffffff'/%3E%3Ccircle cx='100' cy='85' r='42' fill='url(%23skin)'/%3E%3Cpath d='M62 70 C60 40, 140 40, 138 70 C130 50, 70 50, 62 70 Z' fill='%230f172a'/%3E%3Ccircle cx='87' cy='85' r='3.5' fill='%230f172a'/%3E%3Ccircle cx='113' cy='85' r='3.5' fill='%230f172a'/%3E%3Cpath d='M92 105 Q100 112 108 105' stroke='%23ea580c' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export const DEFAULT_FEMALE_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 240'%3E%3Cdefs%3E%3ClinearGradient id='bg2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f1f5f9'/%3E%3Cstop offset='100%25' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3ClinearGradient id='skin2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fed7aa'/%3E%3Cstop offset='100%25' stop-color='%23fdba74'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg2)'/%3E%3Cpath d='M30 240 C30 165, 65 145, 100 145 C135 145, 170 165, 170 240 Z' fill='%23047857'/%3E%3Ccircle cx='100' cy='85' r='42' fill='url(%23skin2)'/%3E%3Cpath d='M58 85 C58 40, 142 40, 142 85 C142 120, 134 140, 130 145 C115 130, 85 130, 70 145 C66 140, 58 120, 58 85 Z' fill='%231c1917'/%3E%3Ccircle cx='87' cy='85' r='3.5' fill='%230f172a'/%3E%3Ccircle cx='113' cy='85' r='3.5' fill='%230f172a'/%3E%3Cpath d='M93 105 Q100 111 107 105' stroke='%23e11d48' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

export const createEmptyDocument = (type: DocumentType, templateId: string): DocumentData => {
  const timestamp = new Date().toISOString();

  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    title:
      type === 'biodata'
        ? 'My Matrimonial Profile'
        : type === 'cover-letter'
        ? 'My Cover Letter'
        : 'My Professional Resume',
    templateId,
    createdAt: timestamp,
    updatedAt: timestamp,
    customization: {
      fontFamily: type === 'biodata' ? 'cormorant' : 'jakarta',
      fontSize: 'base',
      headingSize: 'lg',
      lineHeight: 'normal',
      margins: 'normal',
      sectionSpacing: 'normal',
      primaryColor:
        type === 'biodata' ? '#881337' : type === 'cover-letter' ? '#1e3a8a' : '#1e3a8a',
      accentColor:
        type === 'biodata' ? '#b45309' : type === 'cover-letter' ? '#3b82f6' : '#0284c7',
      showPhoto: type !== 'cover-letter',
      ...(type === 'cover-letter' ? { justifyText: true } : {}),
    },
    personal: {
      fullName: '',
      professionalTitle: '',
      profilePhoto: '',
      dateOfBirth: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      bloodGroup: '',
      complexion: '',
      religion: '',
      caste: '',
      subCaste: '',
      gotra: '',
      rashi: '',
      nakshatra: '',
      motherTongue: '',
      maritalStatus: 'Never Married',
      manglik: 'No',
      placeOfBirth: '',
      timeOfBirth: '',
    },
    contact: {
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      country: '',
      linkedin: '',
      portfolio: '',
      website: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    family: {
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      brothersCount: '0',
      sistersCount: '0',
      marriedBrothers: '0',
      marriedSisters: '0',
      familyType: 'Nuclear',
      familyStatus: 'Middle Class',
      nativePlace: '',
      familyAddress: '',
      additionalMembers: [],
    },
    marriage: {
      aboutMe: '',
      hobbies: '',
      interests: '',
      lifestyle: '',
      partnerExpectations: '',
    },
    summary: '',
    coverLetter: {
      coverLetterType: 'experienced',
      dateFormat: 'DD/MM/YYYY',
      letterDate: new Date().toLocaleDateString('en-GB'),
      hiringManagerName: '',
      hiringManagerTitle: '',
      companyName: '',
      companyAddress: '',
      jobTitle: '',
      jobReferenceId: '',
      jobSource: '',
      salutation: '',
      letterBody: '',
      currentCompany: '',
      currentRole: '',
      signOff: 'Sincerely,',
      signatureName: '',
      enclosures: '',
    },
    customSections: [],
  };
};

export const sampleBiodataDocument: DocumentData = {
  id: 'demo_biodata_001',
  type: 'biodata',
  title: 'Rahul Sharma - Matrimonial Profile',
  templateId: 'biodata-traditional-indian',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customization: {
    fontFamily: 'cormorant',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#991b1b', // Traditional crimson / maroon
    accentColor: '#b45309', // Auspicious gold/amber
    paperColor: '#fffdfa',
    showPhoto: true,
  },
  personal: {
    fullName: 'Rahul Sharma',
    professionalTitle: 'Lead Software Architect',
    profilePhoto: DEFAULT_MALE_AVATAR,
    dateOfBirth: '1995-10-14',
    age: '29 Years',
    gender: 'Male',
    height: "5' 11\" (180 cm)",
    weight: '74 kg',
    bloodGroup: 'B+ Positive',
    complexion: 'Fair',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Gaur',
    gotra: 'Kashyap',
    rashi: 'Mithun (Gemini)',
    nakshatra: 'Ardra',
    motherTongue: 'Hindi',
    maritalStatus: 'Never Married',
    manglik: 'Non-Manglik',
    placeOfBirth: 'Jaipur, Rajasthan',
    timeOfBirth: '08:45 AM',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    address: 'B-402, Royal Palms Residency, Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    linkedin: 'linkedin.com/in/rahulsharma-tech',
  },
  education: [
    {
      id: 'edu_1',
      degree: 'M.Tech in Computer Science & Engineering',
      institute: 'Indian Institute of Technology (IIT) Delhi',
      location: 'New Delhi',
      startYear: '2017',
      endYear: '2019',
      score: '9.2 CGPA',
      description: 'Specialization in Distributed Systems and Cloud Computing.',
    },
    {
      id: 'edu_2',
      degree: 'B.Tech in Computer Science',
      institute: 'NIT Jaipur (MNIT)',
      location: 'Jaipur',
      startYear: '2013',
      endYear: '2017',
      score: '8.8 CGPA',
      description: 'Department Gold Medalist, President of Student Tech Council.',
    },
  ],
  experience: [
    {
      id: 'exp_1',
      company: 'Oracle India Cloud Infrastructure',
      jobTitle: 'Lead Software Architect',
      location: 'Bengaluru / Hybrid',
      startDate: '2021',
      endDate: 'Present',
      currentlyWorking: true,
      description: 'Leading engineering teams designing hyperscale cloud native infrastructure.',
      achievements: 'Annual CTC: ₹42 LPA',
    },
  ],
  skills: [
    { id: 'sk_1', name: 'Classical Guitar', category: 'soft' },
    { id: 'sk_2', name: 'Marathon Runner', category: 'soft' },
    { id: 'sk_3', name: 'Hindi & English Fluency', category: 'language' },
  ],
  projects: [],
  certifications: [],
  achievements: [
    {
      id: 'ach_1',
      title: 'National Merit Scholarship Awardee',
      description: 'Awarded for academic excellence during engineering degree.',
      date: '2016',
    },
  ],
  family: {
    fatherName: 'Dr. Rameshwar Sharma',
    fatherOccupation: 'Senior Chief Medical Officer (Retd. Govt. Hospital)',
    motherName: 'Mrs. Sunita Sharma',
    motherOccupation: 'Senior Lecturer in Literature (Govt. PG College)',
    brothersCount: '1',
    sistersCount: '1',
    marriedBrothers: '1 (Elder - Director at Morgan Stanley, London)',
    marriedSisters: '0 (Younger - Pursuing MD Medicine at AIIMS)',
    familyType: 'Nuclear with strong cultural ties',
    familyStatus: 'Upper Middle Class / Respectable cultured family',
    nativePlace: 'Jaipur, Rajasthan',
    familyAddress: 'Plot 12, Doctors Colony, Near Central Park, Jaipur',
    additionalMembers: [],
  },
  marriage: {
    aboutMe: 'I am a grounded, ambitious, and caring individual with a blend of modern progressive outlook and deep-rooted cultural values. I enjoy acoustic music, weekend road trips, reading contemporary philosophy, and spending quality time with family. I believe in mutual respect, laughter, and open communication in a marriage.',
    hobbies: 'Acoustic Guitar, Badminton, Reading, Landscape Photography, Trekking',
    interests: 'Cloud Computing, Indian Classical Music, World History, Fitness',
    lifestyle: 'Pure Vegetarian, Teetotaler, Non-Smoker, Daily Yoga & Meditation',
    partnerExpectations: 'Looking for an educated, understanding, and warm-hearted life companion who values family bonds while pursuing her own career aspirations. Someone with a positive approach to life, good sense of humor, and mutual respect.',
  },
  summary: '',
  customSections: [
    {
      id: 'kundali_section',
      title: 'Horoscope / Astrological Details',
      type: 'key-value',
      items: [
        { id: 'kv_1', key: 'Gana', value: 'Deva Gana' },
        { id: 'kv_2', key: 'Nadi', value: 'Madhya Nadi' },
        { id: 'kv_3', key: 'Charan', value: 'Second (2nd) Charan' },
        { id: 'kv_4', key: 'Kundali Matching', value: 'Gun Milan 30+ preferable, Kundali available upon request' },
      ],
    },
  ],
};

export const sampleResumeDocument: DocumentData = {
  id: 'demo_resume_001',
  type: 'resume',
  title: 'Priya Patel - Senior Full Stack Engineer CV',
  templateId: 'resume-ats-professional',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customization: {
    fontFamily: 'jakarta',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#0f172a',
    accentColor: '#2563eb',
    showPhoto: false, // ATS friendly default
  },
  personal: {
    fullName: 'Priya Patel',
    professionalTitle: 'Staff Full Stack Software Engineer',
    profilePhoto: DEFAULT_FEMALE_AVATAR,
    dateOfBirth: '1996-04-20',
  },
  contact: {
    phone: '+1 (415) 555-0192',
    email: 'priya.patel.tech@example.com',
    city: 'San Francisco',
    state: '',
    country: 'United States',
    linkedin: 'linkedin.com/in/priyapatel-eng',
    portfolio: 'priyapatel.dev',
    website: 'github.com/priyapatel-code',
  },
  summary: 'Staff Software Engineer with 8+ years of expertise architecting high-throughput distributed microservices and modern web applications. Spearheaded the migration of payment infrastructure processing $120M+ monthly volume with 99.999% uptime. Proven track record leading cross-functional squads of 12+ engineers, championing developer productivity, and optimizing cloud performance.',
  experience: [
    {
      id: 'exp_1',
      company: 'Stripe, Inc.',
      jobTitle: 'Staff Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      currentlyWorking: true,
      description: 'Lead technical architect for global merchant payouts and settlement pipelines.',
      achievements: '• Re-architected batch settlement engine using Go, Kafka, and Postgres, reducing reconciliation processing latency by 68%.\n• Designed multi-region idempotency layer mitigating duplicate payment anomalies under heavy network partition.\n• Mentored 8 junior and mid-level engineers, establishing code review rubrics and reliability standards.',
    },
    {
      id: 'exp_2',
      company: 'Twilio Inc.',
      jobTitle: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2022-02',
      currentlyWorking: false,
      description: 'Owned mission-critical real-time voice routing APIs handling 15,000 requests per second.',
      achievements: '• Reduced p99 latency from 180ms to 42ms through intelligent distributed caching and gRPC migration.\n• Led zero-downtime database migration of 40TB customer profile records across AWS regions.',
    },
    {
      id: 'exp_3',
      company: 'Atlassian',
      jobTitle: 'Software Engineer II',
      location: 'Bengaluru / Sydney',
      startDate: '2017-07',
      endDate: '2019-05',
      currentlyWorking: false,
      description: 'Engineered real-time collaboration editor components using React, WebSockets, and TypeScript.',
      achievements: '• Improved browser render performance for large documents by 45% using virtualized tree structures.',
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'Master of Science in Computer Science',
      institute: 'Stanford University',
      location: 'Stanford, CA',
      startYear: '2015',
      endYear: '2017',
      score: '3.95 GPA',
      description: 'Focus on Distributed Systems, High Performance Database Architecture, and Machine Learning.',
    },
    {
      id: 'edu_2',
      degree: 'Bachelor of Technology in Computer Science',
      institute: 'IIT Bombay',
      location: 'Mumbai, India',
      startYear: '2011',
      endYear: '2015',
      score: '9.4 / 10 CGPA',
      description: 'Graduated Institute Honor, National Olympiad Finalist.',
    },
  ],
  skills: [
    { id: 'sk_1', name: 'TypeScript / React / Next.js', category: 'technical', level: 'Expert' },
    { id: 'sk_2', name: 'Go (Golang) / Python / Node.js', category: 'technical', level: 'Expert' },
    { id: 'sk_3', name: 'PostgreSQL / Redis / DynamoDB', category: 'technical', level: 'Expert' },
    { id: 'sk_4', name: 'Kafka / Distributed Event Queues', category: 'technical', level: 'Intermediate' },
    { id: 'sk_5', name: 'Docker / Kubernetes / Terraform', category: 'tool', level: 'Expert' },
    { id: 'sk_6', name: 'AWS / GCP Cloud Architecture', category: 'tool', level: 'Expert' },
    { id: 'sk_7', name: 'System Design & High Availability', category: 'technical', level: 'Expert' },
    { id: 'sk_8', name: 'Technical Leadership & Mentorship', category: 'soft', level: 'Expert' },
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'OmniStream: Open Source Event Gateway',
      role: 'Creator & Maintainer',
      technologies: 'Go, WebSockets, Redis Streams, eBPF',
      link: 'github.com/priyapatel-code/omnistream',
      description: 'Lightweight real-time bi-directional streaming gateway with 12,000+ GitHub stars and 200k monthly downloads.',
    },
    {
      id: 'proj_2',
      name: 'Distributed KV-Store Implementation',
      role: 'Author',
      technologies: 'Raft Consensus, Rust, gRPC',
      link: 'priyapatel.dev/projects/raft-kv',
      description: 'Production-ready fault-tolerant distributed consensus key-value storage engine.',
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023-08',
      credentialId: 'AWS-PSA-8829103',
      credentialUrl: 'aws.amazon.com/verification',
    },
    {
      id: 'cert_2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Linux Foundation / CNCF',
      issueDate: '2022-11',
      credentialId: 'CKA-99210-LF',
    },
  ],
  achievements: [
    {
      id: 'ach_1',
      title: 'Keynote Speaker at QCon San Francisco',
      description: 'Delivered talk on "Zero Downtime Migrations in Financial Payout Pipelines" to 800+ attendees.',
      date: '2023',
    },
    {
      id: 'ach_2',
      title: 'US Patent Granted (US11048291B2)',
      description: 'Method and System for Distributed Idempotency Resolution in Multi-Region Cloud Datastores.',
      date: '2021',
    },
  ],
  family: {},
  marriage: {},
  customSections: [
    {
      id: 'lang_section',
      title: 'Languages',
      type: 'key-value',
      items: [
        { id: 'l_1', key: 'English', value: 'Native / Bilingual Proficiency' },
        { id: 'l_2', key: 'Hindi & Gujarati', value: 'Fluent Speaker' },
        { id: 'l_3', key: 'German', value: 'Elementary (A2)' },
      ],
    },
  ],
};

export const sampleInternationalResumeDocument: DocumentData = {
  ...sampleResumeDocument,
  id: 'sample_resume_prem_international',
  title: 'Priya Patel - International Global Lead Resume',
  templateId: 'resume-prem-international',
  customization: {
    fontFamily: 'jakarta',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    showPhoto: true,
  },
  personal: {
    fullName: 'Priya Patel',
    professionalTitle: 'Staff Software Engineer & Solutions Architect',
    profilePhoto: DEFAULT_FEMALE_AVATAR,
  },
  contact: {
    phone: '+1 (415) 555-0192',
    email: 'priya.patel@example.com',
    city: 'San Francisco',
    state: '',
    country: 'United States',
    linkedin: 'linkedin.com/in/priyapatel',
    portfolio: 'priyapatel.dev',
    website: 'priyapatel.dev',
  },
  summary:
    'Experienced technology lead with a proven track record architecting high-throughput distributed systems, cross-functional engineering teams, and scalable cloud infrastructure.',
  experience: [
    {
      id: 'int_exp_1',
      company: 'Stripe, Inc.',
      jobTitle: 'Staff Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      currentlyWorking: true,
      description:
        'Lead technical architect for merchant settlement infrastructure, processing high-volume transactions with 99.999% reliability.',
      achievements:
        '• Re-architected batch settlement pipelines, reducing reconciliation latency by 68%.\n• Mentored 8 junior and mid-level engineers, establishing engineering quality rubrics.',
    },
    {
      id: 'int_exp_2',
      company: 'Twilio Inc.',
      jobTitle: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2019',
      endDate: '2022',
      currentlyWorking: false,
      description:
        'Engineered mission-critical real-time voice and communication routing APIs handling 15,000+ requests per second.',
      achievements:
        '• Reduced p99 API latency from 180ms to 42ms through distributed caching layers.',
    },
  ],
  education: [
    {
      id: 'int_edu_1',
      degree: 'Master of Science in Computer Science',
      institute: 'Stanford University',
      location: 'Stanford, CA',
      endYear: '2017',
      score: '3.95 GPA',
    },
    {
      id: 'int_edu_2',
      degree: 'Bachelor of Technology in Computer Science',
      institute: 'IIT Bombay',
      location: 'Mumbai, India',
      endYear: '2015',
      score: '9.4 CGPA',
    },
  ],
  skills: [
    { id: 'int_sk_1', name: 'Distributed Systems', category: 'technical', level: 'Expert' },
    { id: 'int_sk_2', name: 'Cloud Architecture (AWS/GCP)', category: 'tool', level: 'Expert' },
    { id: 'int_sk_3', name: 'TypeScript / React / Node.js', category: 'technical', level: 'Expert' },
    { id: 'int_sk_4', name: 'System Design & Scalability', category: 'technical', level: 'Expert' },
    { id: 'int_sk_5', name: 'Engineering Leadership', category: 'soft', level: 'Expert' },
  ],
  projects: [
    {
      id: 'int_proj_1',
      name: 'OmniStream: Real-time Event Gateway',
      role: 'Lead Architect',
      technologies: 'Go, WebSockets, Kafka, Redis',
      link: 'github.com/priyapatel/omnistream',
      description: 'Distributed streaming platform routing over 50,000 requests per second with sub-20ms latency.',
    },
  ],
  certifications: [
    {
      id: 'int_cert_1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
    },
    {
      id: 'int_cert_2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'CNCF / Linux Foundation',
      issueDate: '2022',
    },
  ],
  achievements: [
    {
      id: 'int_ach_1',
      title: 'US Patent Granted (US11048291B2)',
      description: 'Distributed Idempotency Resolution in Multi-Region Cloud Datastores.',
      date: '2021',
    },
  ],
  family: {},
  marriage: {},
  customSections: [],
};

export const sampleModernCorporateResumeDocument: DocumentData = {
  ...sampleResumeDocument,
  id: 'sample_resume_modern_corporate',
  title: 'Rahul Sharma - Modern Corporate Resume',
  templateId: 'resume-modern-corporate',
  customization: {
    fontFamily: 'jakarta',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    showPhoto: true,
  },
  personal: {
    fullName: 'Rahul Sharma',
    professionalTitle: 'Senior Technology Consultant & Architect',
    profilePhoto: DEFAULT_MALE_AVATAR,
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    city: 'Bengaluru',
    state: '',
    country: 'India',
    linkedin: 'linkedin.com/in/rahulsharma-tech',
    portfolio: 'rahulsharma.dev',
    website: 'rahulsharma.dev',
  },
  summary:
    'Results-oriented Senior Consultant with 8+ years experience guiding Fortune 500 enterprises through cloud architecture, engineering modernization, and high-velocity digital transformation initiatives.',
  experience: [
    {
      id: 'corp_exp_1',
      jobTitle: 'Senior Strategy & Technology Consultant',
      company: 'McKinsey & Company',
      location: 'Mumbai / Hybrid',
      startDate: '2021',
      endDate: 'Present',
      currentlyWorking: true,
      description:
        'Advising Tier-1 financial institutions and technology enterprises on digital commercialization and scalable cloud architectures.',
      achievements:
        '• Directed multi-region transformation roadmap delivering 44% latency reduction.\n• Spearheaded high-throughput API gateway migration.',
    },
    {
      id: 'corp_exp_2',
      jobTitle: 'Lead Software Architect',
      company: 'Oracle Cloud Systems',
      location: 'Bengaluru',
      startDate: '2018',
      endDate: '2021',
      currentlyWorking: false,
      description:
        'Led technical design and delivery of distributed cloud infrastructure components.',
      achievements: '• Optimized cloud datastore throughput by 35% with distributed caching.',
    },
  ],
  education: [
    {
      id: 'corp_edu_1',
      degree: 'MBA (Strategy & Finance)',
      institute: 'IIM Ahmedabad',
      endYear: '2018',
      score: 'Top 5%',
    },
    {
      id: 'corp_edu_2',
      degree: 'B.Tech in Computer Science',
      institute: 'Nirma University',
      endYear: '2016',
      score: '9.1 CGPA',
    },
  ],
  skills: [
    { id: 'corp_sk_1', name: 'Cloud Architecture (AWS/Azure)', category: 'tool', level: 'Expert' },
    { id: 'corp_sk_2', name: 'Enterprise Strategy', category: 'soft', level: 'Expert' },
    { id: 'corp_sk_3', name: 'Distributed Systems', category: 'technical', level: 'Expert' },
    { id: 'corp_sk_4', name: 'Agile Delivery', category: 'soft', level: 'Expert' },
    { id: 'corp_sk_5', name: 'Stakeholder Management', category: 'soft', level: 'Expert' },
  ],
  projects: [
    {
      id: 'corp_proj_1',
      name: 'Cloud Modernization Core',
      role: 'Lead Consultant',
      technologies: 'AWS, Microservices, Spring Boot',
      link: 'github.com/rahulsharma/cloud-mod',
      description: 'Led multi-datacenter enterprise cloud migration roadmap for major banking client.',
    },
  ],
  certifications: [
    {
      id: 'corp_cert_1',
      name: 'TOGAF 9 Certified Enterprise Architect',
      issuer: 'The Open Group',
      issueDate: '2022',
    },
    {
      id: 'corp_cert_2',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2021',
    },
  ],
  achievements: [
    {
      id: 'corp_ach_1',
      title: 'McKinsey Client Excellence Award',
      description: 'Awarded for exceptional delivery impact on digital transformation program.',
      date: '2023',
    },
  ],
  family: {},
  marriage: {},
  customSections: [],
};

export const sampleMinimalExecutiveResumeDocument: DocumentData = {
  ...sampleResumeDocument,
  id: 'sample_resume_minimal_executive',
  title: 'Vikramaditya Singhania - Minimal Executive Resume',
  templateId: 'resume-prem-minimal-executive',
  customization: {
    fontFamily: 'cormorant',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#0f172a',
    accentColor: '#475569',
    showPhoto: false,
  },
  personal: {
    fullName: 'Vikramaditya Singhania',
    professionalTitle: 'Chief Executive Officer / Managing Director',
    profilePhoto: '',
  },
  contact: {
    phone: '+1 (212) 555-0188',
    email: 'v.singhania@executive-holdings.com',
    city: 'New York',
    state: '',
    country: 'United States',
    linkedin: 'linkedin.com/in/v-singhania-exec',
  },
  summary:
    'Distinguished executive leader with 15+ years of general management, enterprise scaling, and board-level governance. Demonstrated track record guiding multinational enterprises through market expansion, accretive M&A, and digital transformation.',
  skills: [
    { id: 'ph_s1', name: 'Enterprise Strategy & P&L', category: 'soft', level: 'Expert' },
    { id: 'ph_s2', name: 'Mergers & Acquisitions (M&A)', category: 'soft', level: 'Expert' },
    { id: 'ph_s3', name: 'Board & Investor Governance', category: 'soft', level: 'Expert' },
    { id: 'ph_s4', name: 'Global Market Expansion', category: 'soft', level: 'Expert' },
    { id: 'ph_s5', name: 'Digital Transformation', category: 'technical', level: 'Expert' },
    { id: 'ph_s6', name: 'Executive Team Mentorship', category: 'soft', level: 'Expert' },
  ],
  experience: [
    {
      id: 'ph_e1',
      jobTitle: 'Chief Executive Officer',
      company: 'Apex Global Holdings, Inc.',
      location: 'New York, NY',
      startDate: '2020',
      endDate: 'Present',
      currentlyWorking: true,
      description:
        'Accountable for $450M global enterprise P&L spanning North America, EMEA, and APAC across 2,400 employees.',
      achievements:
        '• Expanded enterprise EBITDA margin from 14% to 26% over a three-year strategic horizon.\n• Closed three strategic accretive acquisitions unlocking $80M in synergistic annual revenues.',
    },
    {
      id: 'ph_e2',
      jobTitle: 'Chief Operating Officer',
      company: 'Vanguard Industrial Technologies',
      location: 'Chicago, IL',
      startDate: '2016',
      endDate: '2020',
      currentlyWorking: false,
      description:
        'Directed global supply chain, cloud transformation, and commercial operations across 12 manufacturing facilities.',
      achievements:
        '• Restructured operational workflows, mitigating $32M in cost inefficiencies.\n• Spearheaded digital automation initiative modernizing enterprise ERP infrastructure.',
    },
  ],
  education: [
    {
      id: 'ph_ed1',
      degree: 'Master of Business Administration (MBA)',
      institute: 'Harvard Business School',
      endYear: '2012',
    },
    {
      id: 'ph_ed2',
      degree: 'Bachelor of Science in Industrial Engineering',
      institute: 'Columbia University',
      endYear: '2008',
    },
  ],
  projects: [],
  certifications: [
    {
      id: 'ph_c1',
      name: 'NACD Certified Director',
      issuer: 'National Association of Corporate Directors',
      issueDate: '2021',
    },
  ],
  achievements: [
    {
      id: 'ph_a1',
      title: 'Top 50 Global Business Leaders',
      description: 'Recognized for executive leadership in enterprise value creation.',
      date: '2022',
    },
  ],
  family: {},
  marriage: {},
  customSections: [],
};

export const sampleMonacoSovereignResumeDocument: DocumentData = {
  ...sampleResumeDocument,
  id: 'sample_resume_monaco_sovereign',
  title: 'Alexander Sterling - Monaco Sovereign Executive Resume',
  templateId: 'resume-monaco-sovereign',
  customization: {
    fontFamily: 'jakarta',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#0a0a0c', // Sovereign Obsidian
    accentColor: '#c5a059',  // Monaco Champagne Gold
    showPhoto: false,
  },
  personal: {
    fullName: 'Alexander Sterling',
    professionalTitle: 'Chief Strategy Officer • Cross-Border Enterprise Architect',
    profilePhoto: '',
  },
  contact: {
    phone: '+44 20 7946 0912',
    email: 'a.sterling@sterling-holdings.ch',
    city: 'London',
    state: '',
    country: 'United Kingdom',
    linkedin: 'linkedin.com/in/alexander-sterling-exec',
    portfolio: 'sterling-advisory.ch',
    website: 'sterling-advisory.ch',
  },
  executiveMetrics: [
    { id: 'm1', value: '12+', label: 'Years Experience' },
    { id: 'm2', value: '$180M+', label: 'Portfolio Managed' },
    { id: 'm3', value: '18', label: 'Global Markets' },
    { id: 'm4', value: '99.99%', label: 'Delivery Rigor' },
  ],
  showExecutiveMetrics: true,
  summary:
    'Distinguished executive leader with 12+ years of international cross-border advisory, corporate governance, and digital enterprise modernization. Trusted advisor to multinational boardrooms, institutional sovereign funds, and market-defining growth enterprises across European, North American, and Asia-Pacific markets.',
  experience: [
    {
      id: 'm_exp_1',
      jobTitle: 'Chief Strategy Officer & Managing Director',
      company: 'Sterling & Vance Global Advisory',
      location: 'London & Zurich',
      startDate: '2021',
      endDate: 'Present',
      currentlyWorking: true,
      description:
        'Oversee global enterprise transformation mandates and cross-border restructuring portfolios.\nDirect high-stakes board-level fiduciary assessments across sovereign and institutional holdings.',
      achievements:
        '• Steered $180M+ portfolio integration across 18 regional jurisdictions.\n• Elevated institutional client retention rate to 99.4% through structured operational governance.',
    },
    {
      id: 'm_exp_2',
      jobTitle: 'Senior Vice President — Global Enterprise Solutions',
      company: 'Rothschild & Partners Capital Group',
      location: 'New York & London',
      startDate: '2016',
      endDate: '2021',
      currentlyWorking: false,
      description:
        'Directed international operational due diligence, technology restructuring, and portfolio scaling for Tier-1 multinational clients.',
      achievements:
        '• Accelerated cross-border transaction completion cycle times by 38%.\n• Built an elite 35-person multidisciplinary advisory cohort spanning 4 continental hubs.',
    },
    {
      id: 'm_exp_3',
      jobTitle: 'Director of Strategic Transformation',
      company: 'Deloitte Global Advisory Services',
      location: 'Singapore',
      startDate: '2012',
      endDate: '2016',
      currentlyWorking: false,
      description:
        'Led strategic advisory programs for financial institutions scaling pan-Asian operations.',
      achievements:
        '• Formulated risk and compliance protocols adopted across 6 regional sovereign entities.',
    },
  ],
  projects: [
    {
      id: 'm_proj_1',
      name: 'Pan-European Sovereign Wealth Modernization Program',
      role: 'Principal Executive Advisor',
      technologies: 'Sovereign Fund Governance • Digital Asset Custody • Basel IV',
      link: 'sterling-advisory.ch/case-studies/sovereign',
      description:
        'Architected comprehensive risk mitigation and capital governance framework for a multi-billion dollar state sovereign fund.',
    },
    {
      id: 'm_proj_2',
      name: 'Cross-Border Capital Infrastructure Migration',
      role: 'Lead Architect',
      technologies: 'Enterprise Cloud Architecture • Distributed Ledgers • ISO 20022',
      link: 'sterling-advisory.ch/case-studies/crossborder',
      description:
        'Guided real-time clearing synchronization across 14 financial clearing institutions with zero operational downtime.',
    },
  ],
  education: [
    {
      id: 'm_edu_1',
      degree: 'Master of Business Administration (MBA)',
      institute: 'INSEAD',
      location: 'Fontainebleau & Singapore',
      endYear: '2012',
      score: "Dean's Honor List",
    },
    {
      id: 'm_edu_2',
      degree: 'Master of Science in International Finance',
      institute: 'London School of Economics (LSE)',
      location: 'London, UK',
      endYear: '2010',
      score: 'First Class Distinction',
    },
  ],
  skills: [
    { id: 'm_sk_1', name: 'Cross-Border M&A Strategy', category: 'soft', level: 'Expert' },
    { id: 'm_sk_2', name: 'Board & Investor Governance', category: 'soft', level: 'Expert' },
    { id: 'm_sk_3', name: 'Portfolio Capital Allocation', category: 'soft', level: 'Expert' },
    { id: 'm_sk_4', name: 'Sovereign Advisory', category: 'soft', level: 'Expert' },
    { id: 'm_sk_5', name: 'Enterprise Architecture', category: 'technical', level: 'Expert' },
    { id: 'm_sk_6', name: 'Risk & Regulatory Compliance', category: 'technical', level: 'Expert' },
    { id: 'm_sk_7', name: 'Digital Transformation', category: 'technical', level: 'Expert' },
    { id: 'm_sk_8', name: 'Executive Mentorship & P&L', category: 'soft', level: 'Expert' },
  ],
  certifications: [
    {
      id: 'm_cert_1',
      name: 'Chartered Financial Analyst (CFA)',
      issuer: 'CFA Institute',
      issueDate: 'Charterholder',
    },
    {
      id: 'm_cert_2',
      name: 'Certified International Director (IDP-C)',
      issuer: 'INSEAD Corporate Governance Centre',
      issueDate: 'Active',
    },
  ],
  achievements: [
    {
      id: 'm_ach_1',
      title: 'Global Leadership Award in Cross-Border Enterprise Strategy (2023)',
      description: 'Recognized by International Financial Review for pioneering institutional advisory architectures.',
    },
  ],
  family: {},
  marriage: {},
  customSections: [],
};

export const sampleCoverLetterDocument: DocumentData = {
  id: 'demo_coverletter_001',
  type: 'cover-letter',
  title: 'Rahul Sharma - Cover Letter (Google / DeepMind)',
  templateId: 'coverletter-modern-corporate',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customization: {
    fontFamily: 'jakarta',
    fontSize: 'base',
    headingSize: 'lg',
    lineHeight: 'normal',
    margins: 'normal',
    sectionSpacing: 'normal',
    primaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    showPhoto: false,
    justifyText: true,
  },
  personal: {
    fullName: 'Rahul Sharma',
    professionalTitle: 'Senior Strategy & Operations Manager',
    profilePhoto: '',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    linkedin: 'linkedin.com/in/rahulsharma-strategy',
    portfolio: 'rahulsharma.co',
  },
  education: [
    {
      id: 'edu_cl_1',
      degree: 'MBA (Strategy & Finance)',
      institute: 'IIM Ahmedabad',
      endYear: '2020',
    },
  ],
  experience: [
    {
      id: 'exp_cl_1',
      company: 'McKinsey & Company',
      jobTitle: 'Engagement Manager',
      startDate: '2021',
      endDate: 'Present',
    },
  ],
  skills: [
    { id: 'sk_cl_1', name: 'Strategic Planning', category: 'technical' },
    { id: 'sk_cl_2', name: 'Cross-functional Leadership', category: 'soft' },
  ],
  projects: [],
  certifications: [],
  achievements: [],
  family: {},
  marriage: {},
  summary: '',
  coverLetter: {
    coverLetterType: 'experienced',
    dateFormat: 'DD/MM/YYYY',
    letterDate: new Date().toLocaleDateString('en-GB'),
    hiringManagerName: 'Sarah Jenkins',
    hiringManagerTitle: 'Director of Talent Acquisition',
    companyName: 'Google Cloud & AI Systems',
    companyAddress: 'Prestige Technostar, Whitefield, Bengaluru',
    jobTitle: 'Senior Strategy & Operations Lead',
    jobReferenceId: 'GOOG-29401',
    jobSource: 'LinkedIn',
    currentCompany: 'McKinsey & Company',
    currentRole: 'Engagement Manager',
    totalExperienceYears: '8 Years',
    letterBody: `I am writing to express my strong interest in the Senior Strategy & Operations Lead position (Ref: GOOG-29401) at Google Cloud & AI Systems. With 8 years of experience driving strategic planning, enterprise cloud go-to-market initiatives, and P&L governance—most recently as an Engagement Manager at McKinsey & Company—I am eager to bring structured execution and commercial rigor to your team in Bengaluru.

In my current role, I architected a multi-region delivery framework that reduced enterprise customer onboarding cycle times by 44% while leading a 25-member cross-functional operations team maintaining 99.2% SLA compliance. By partnering closely with product, engineering, and finance stakeholders, I also unlocked $120M in annualized incremental revenues across Tier-1 enterprise accounts using data-driven executive reporting in Tableau, SQL, and SAP S/4 HANA.

Google Cloud’s pioneering advancements in enterprise infrastructure, generative AI integration, and developer enablement present the exact high-scale challenges where my background delivers measurable impact. I would welcome the opportunity to discuss in an interview how my operational leadership and strategic perspective align with Google Cloud’s upcoming objectives. Thank you for your time and consideration.`,
    signOff: 'Sincerely,',
    signatureName: 'Rahul Sharma',
    enclosures: 'Resume, MBA Degree Certificate',
  },
  customSections: [],
};

export const previewBiodataData: DocumentData = {
  ...sampleBiodataDocument,
  id: 'preview_biodata',
};

export const previewResumeData: DocumentData = {
  ...sampleResumeDocument,
  id: 'preview_resume',
};

export const previewCoverLetterData: DocumentData = {
  ...sampleCoverLetterDocument,
  id: 'preview_coverletter',
};

export function getSampleDataForType(type: DocumentType, templateId: string): DocumentData {
  let base: DocumentData;
  if (type === 'resume') {
    if (templateId === 'resume-prem-international') {
      base = sampleInternationalResumeDocument;
    } else if (templateId === 'resume-modern-corporate') {
      base = sampleModernCorporateResumeDocument;
    } else if (templateId === 'resume-monaco-sovereign') {
      base = sampleMonacoSovereignResumeDocument;
    } else if (templateId === 'resume-prem-minimal-executive') {
      base = sampleMinimalExecutiveResumeDocument;
    } else {
      base = sampleResumeDocument;
    }
  } else if (type === 'cover-letter') {
    base = sampleCoverLetterDocument;
  } else {
    base = sampleBiodataDocument;
  }
  return {
    ...JSON.parse(JSON.stringify(base)),
    id: 'doc_' + Date.now(),
    type,
    templateId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

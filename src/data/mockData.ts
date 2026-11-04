import { Campaign, DonorWallEntry, TrustSettings, NewsletterSubscriber } from '../types/donation';

export const DEFAULT_TRUST_SETTINGS: TrustSettings = {
  trustName: 'Kindred Horizons Public Charitable Trust',
  trustPan: 'AAATK9412F',
  section80GRegNo: 'CIT(E)/DELHI/80G/2023-24/A/10294',
  darpanId: 'DL/2023/0381920',
  csrRegNo: 'CSR00049281',
  upiVpa: 'kindredhorizons@icici',
  superAdminEmail: 'lavanyagurbhele@gmail.com',
  accountNumber: '50200084920192',
  ifscCode: 'ICIC0000007',
  bankBranch: 'Connaught Place, New Delhi',
  admins: [
    {
      id: 'admin-1',
      name: 'Lavanya Gurbhele',
      email: 'lavanyagurbhele@gmail.com',
      role: 'Super Admin',
      designation: 'Managing Trustee & Founder',
      permissions: ['All Permissions', 'Campaign Creation', 'Banking Escrow', 'Statutory 80G', 'User Moderation'],
      avatarColor: 'bg-amber-600',
      isPrimary: true
    },
    {
      id: 'admin-2',
      name: 'Bhakti Kapse',
      email: 'bhakti.kapse@kindredhorizons.org',
      role: 'Co-Admin',
      designation: 'Director of Field Operations & Project Verification',
      permissions: ['Campaign Management', 'Field Logs', 'Beneficiary Audit', 'Milestone Clearance'],
      avatarColor: 'bg-emerald-600',
      isPrimary: false
    },
    {
      id: 'admin-3',
      name: 'Aarya Sarode',
      email: 'aarya.sarode@kindredhorizons.org',
      role: 'Co-Admin',
      designation: 'Director of Treasury & Section 80G Compliance',
      permissions: ['Donation Ledger', 'Form 10BE Audits', 'Statutory Returns', 'Banking Gateway'],
      avatarColor: 'bg-sky-600',
      isPrimary: false
    },
    {
      id: 'admin-4',
      name: 'Aastha Kelelkar',
      email: 'aastha.kelelkar@kindredhorizons.org',
      role: 'Co-Admin',
      designation: 'Director of Community Engagement & Donor Relations',
      permissions: ['Campaign Management', 'Donor Relations', 'Subscriber Dispatches', 'Field Logs', 'Transparency Audits'],
      avatarColor: 'bg-indigo-600',
      isPrimary: false
    }
  ]
};

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'sahel-clean-water',
    title: 'Thar & Bundelkhand Solar Groundwater Aquifer Wells',
    subtitle: 'Deploying continuous solar-powered deep borewells and reverse-osmosis water stations',
    category: 'water',
    categoryLabel: 'Clean Water',
    location: 'Barmer & Mahoba Districts, India',
    targetAmount: 2200000, // ₹22,00,000
    raisedAmount: 1785000, // ₹17,85,000
    donorCount: 1840,
    daysLeft: 12,
    emergencyMultiplier: 2,
    summary: 'Acute groundwater salinity and dry seasonal aquifers force families to walk 6km for non-potable pond water. This project deploys 16 solar-powered deep borewells with multigrade sand and UV filtration, providing 60,000 liters of pure drinking water every day.',
    impactMetrics: [
      { label: 'Clean Water Delivered Daily', value: '60,000 Litres' },
      { label: 'Families Sustained', value: '4,200 Households' },
      { label: 'Borewell Depth', value: '180 Metres' },
      { label: 'Solar Array Capacity', value: '24 kW Peak' }
    ],
    fieldNotes: [
      'October 18: Borewell #9 struck potable sweet-water aquifer at 172m depth in Barmer.',
      'October 09: Village Water Panchayat in Mahoba completed certified pump maintenance training.',
      'September 26: Water quality sample certified: TDS < 120 ppm with zero bacterial contamination.'
    ],
    milestones: [
      { date: 'Aug 2026', title: 'Hydrogeological Sounding & NOC', description: 'Central Ground Water Authority permissions granted.', completed: true },
      { date: 'Sep 2026', title: 'Solar Pumping System Procurement', description: 'Submersible stainless helical pumps delivered to field depot.', completed: true },
      { date: 'Oct 2026', title: 'Deep Drilling & Casing Phase', description: 'Active drilling of 16 borewells with local panchayat committees.', completed: true },
      { date: 'Nov 2026', title: 'UV/RO Commissioning & Handover', description: 'Handover to women-led water stewardship committees.', completed: false }
    ],
    svgTheme: 'water',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Fresh potable water pouring from a solar groundwater well pump in Barmer, Rajasthan'
  },
  {
    id: 'pediatric-trauma-units',
    title: 'Rural Pediatric Trauma & Mobile Neo-Natal ICU Ambulances',
    subtitle: 'Equipping all-terrain medical ambulances with infant incubators and trauma triage',
    category: 'medical',
    categoryLabel: 'Medical Care',
    location: 'Tribal Belts, Odisha & Chhattisgarh',
    targetAmount: 2800000, // ₹28,00,000
    raisedAmount: 2340000, // ₹23,40,000
    donorCount: 2290,
    daysLeft: 8,
    summary: 'In remote forested hilly areas, expectant mothers and critically ill infants face delays of up to 4 hours to reach tertiary healthcare. We deploy 5 heavy-duty 4x4 mobile emergency ICUs staffed with trained pediatric nurses and satellite telemetry.',
    impactMetrics: [
      { label: 'Children Treated Monthly', value: '1,800 Patients' },
      { label: 'Emergency Neonatal Rescues', value: '420 Infants' },
      { label: 'Response Transit Radius', value: '90 Kilometers' },
      { label: 'ICU Beds per Vehicle', value: '2 Full Units' }
    ],
    fieldNotes: [
      'October 19: Ambulance #2 safely resuscitated an infant in respiratory distress en route to district hospital.',
      'October 12: Received emergency pediatric oxygen concentrators and portable ECG packs.',
      'September 29: AIIMS telemedicine satellite video uplink linked to all 5 mobile vans.'
    ],
    milestones: [
      { date: 'Jul 2026', title: 'Vehicle Fabrication & 4WD Snorkels', description: 'All-terrain chassis reinforced for flooded tribal riverbeds.', completed: true },
      { date: 'Aug 2026', title: 'Neonatal Incubators Mounted', description: 'Vibration-dampened medical cradles and dual oxygen tanks.', completed: true },
      { date: 'Sep 2026', title: 'Deployment in Koraput & Bastar', description: '3 units operational 24/7 with emergency wireless dispatch.', completed: true },
      { date: 'Nov 2026', title: 'Fleet Expansion: Units 4 & 5', description: 'Final commissioning for Eastern Ghats remote interior.', completed: false }
    ],
    svgTheme: 'medical',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Frontline medical healthcare worker caring for an infant in rural mobile clinic'
  },
  {
    id: 'cloud-forest-sanctuary',
    title: 'Western Ghats Shola & Rain-Canopy Ecological Reserve',
    subtitle: 'Conserving 8,500 hectares of biodiversity corridor and endemic flora sanctuaries',
    category: 'ecology',
    categoryLabel: 'Ecology',
    location: 'Agasthyamalai & Nilgiris, India',
    targetAmount: 1800000, // ₹18,00,000
    raisedAmount: 1395000, // ₹13,95,000
    donorCount: 1240,
    daysLeft: 19,
    summary: 'The ancient Western Ghats mountain rainforests host endangered Nilgiri Tahr, Lion-tailed Macaques, and sacred freshwater springs. We protect continuous forest corridors with indigenous forest dweller cooperative wardens.',
    impactMetrics: [
      { label: 'Hectares Safeguarded', value: '8,500 Ha' },
      { label: 'Endangered Species Supported', value: '64 Species' },
      { label: 'Indigenous Forest Wardens', value: '38 Rangers' },
      { label: 'Native Seedlings Planted', value: '120,000 Trees' }
    ],
    fieldNotes: [
      'October 17: Camera trap sighting of a mother Nilgiri Marten with two healthy pups in restored section.',
      'October 04: Community seed bank completed collection of 42 endemic evergreen shola species.',
      'September 22: Firebreak patrolling and infrared drone surveillance network commissioned.'
    ],
    milestones: [
      { date: 'May 2026', title: 'Ecological Survey & Tribal Council Consent', description: 'Gram Sabha resolutions passed in 9 forest fringe villages.', completed: true },
      { date: 'Jul 2026', title: 'Corridor Reconnection Phase I', description: '3,800 hectares under community conservation agreements.', completed: true },
      { date: 'Sep 2026', title: 'Anti-Poaching Outposts', description: 'Solar-powered wireless relay towers and watchtowers built.', completed: true },
      { date: 'Dec 2026', title: 'Full Canopy Buffer Enclosure', description: 'Connecting southern wildlife sanctuaries seamlessly.', completed: false }
    ],
    svgTheme: 'ecology',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Sunlight filtering through misty mountain rainforest canopy in the Western Ghats'
  },
  {
    id: 'bay-islands-flood-relief',
    title: 'Assam & Coastal Bengal Flash Flood Emergency Relief',
    subtitle: 'Delivering motorized rescue skiffs, water purification units, and dry relief rations',
    category: 'crisis',
    categoryLabel: 'Crisis Relief',
    location: 'Brahmaputra Valley & Sundarbans Delta',
    targetAmount: 3200000, // ₹32,00,000
    raisedAmount: 3050000, // ₹30,50,000
    donorCount: 3950,
    daysLeft: 4,
    emergencyMultiplier: 2,
    summary: 'Torrential monsoon breaches flooded low-lying riverine islands. This immediate response deploys flat-bottom rescue crafts, solar emergency lanterns, clean potable water sachets, and emergency family medical packs.',
    impactMetrics: [
      { label: 'Displaced Families Sheltered', value: '6,400 Families' },
      { label: 'Halazone Water Purifiers', value: '950,000 Tablets' },
      { label: 'Dry Ration Grocery Kits', value: '22,000 Kits' },
      { label: 'Rescue Boat Missions', value: '380 Sorties' }
    ],
    fieldNotes: [
      'October 20: 1,500 dry ration kits containing rice, pulses, jaggery and ORS offloaded via shallow boats.',
      'October 16: Mobile water purification barge operating in Majuli island, providing 50,000L safe water daily.',
      'October 11: 4,000 mosquito nets and anti-venom supplies distributed to flood camp clinics.'
    ],
    milestones: [
      { date: 'Immediate', title: 'Emergency Boat Deployments', description: '18 motorized skiffs mobilized for family evacuations.', completed: true },
      { date: 'Day 3', title: 'Potable Water Purification Barge', description: 'Supplying fresh water to 12 inundated island hamlets.', completed: true },
      { date: 'Current', title: 'Dry Ration & Medical Kits', description: 'Active distribution of 22,000 emergency relief kits.', completed: true },
      { date: 'Phase 4', title: 'Embankment Repair & School Restorations', description: 'Permanent flood-resilient raised school platforms.', completed: false }
    ],
    svgTheme: 'crisis',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Flood emergency rescue boats providing food rations and safe drinking water'
  },
  {
    id: 'girls-stem-literacy',
    title: 'Kasturba Rural Girls STEM & Coding Laboratories',
    subtitle: 'Constructing solar-powered robotics labs, digital libraries, and secondary scholarships',
    category: 'education',
    categoryLabel: 'Education',
    location: 'Rural Rajasthan & Bihar',
    targetAmount: 1400000, // ₹14,00,000
    raisedAmount: 1080000, // ₹10,80,000
    donorCount: 980,
    daysLeft: 24,
    summary: 'Secondary graduation rates for first-generation schoolgirls in rural belts remain severely hindered by lack of science equipment. We construct state-of-the-art solar powered STEM labs with offline digital tablets, telescopes, and robotics kits.',
    impactMetrics: [
      { label: 'Girls Enrolled Annually', value: '1,500 Students' },
      { label: 'Science Labs Constructed', value: '10 Laboratories' },
      { label: 'Full Secondary Scholarships', value: '420 Students' },
      { label: 'Female STEM Mentors', value: '24 Instructors' }
    ],
    fieldNotes: [
      'October 16: Lab #6 solar inverter installed; 30 tablets preloaded with NCERT science simulations.',
      'October 07: Chemistry glassware and biology microscopes delivered to 4 remote block schools.',
      'September 25: First cohort of 60 girls demonstrated solar circuit models at district science mela.'
    ],
    milestones: [
      { date: 'Jun 2026', title: 'School MoUs & Gram Panchayat Approvals', description: 'Agreements signed with 10 government secondary schools.', completed: true },
      { date: 'Aug 2026', title: 'Classroom Solarization & Lab Benches', description: '10 kW rooftop solar and weather-sealed computer tables.', completed: true },
      { date: 'Oct 2026', title: 'Lab Apparatus & Microcontroller Kits', description: 'Digital microscopes, Arduino kits, Hindi/English learning tools.', completed: true },
      { date: 'Jan 2027', title: 'Inaugural Class Term', description: 'Commencement of daily hands-on STEM & coding classes.', completed: false }
    ],
    svgTheme: 'education',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Smiling young schoolgirls studying science in a rural solar-powered STEM classroom'
  }
];

export const INITIAL_DONOR_WALL: DonorWallEntry[] = [
  {
    id: 'dw-1',
    donorName: 'Aarav & Priya Deshmukh',
    amount: 50000,
    frequency: 'once',
    campaignTitle: 'Thar & Bundelkhand Solar Groundwater Aquifer Wells',
    timestamp: '18 minutes ago',
    tributeType: 'in_honor',
    tributeName: 'Late Nana Sahib Deshmukh',
    message: 'In honour of our grandfather who always taught us that providing water to the thirsty is the greatest seva.'
  },
  {
    id: 'dw-2',
    donorName: 'Dr. Sunita Kulkarni',
    amount: 10000,
    frequency: 'monthly',
    campaignTitle: 'Rural Pediatric Trauma & Mobile Neo-Natal ICU Ambulances',
    timestamp: '45 minutes ago',
    tributeType: 'general',
    message: 'Salute to the nurses and paramedical teams braving river crossings to save newborn lives.'
  },
  {
    id: 'dw-3',
    donorName: 'Anonymous Supporter',
    amount: 25000,
    frequency: 'once',
    campaignTitle: 'Assam & Coastal Bengal Flash Flood Emergency Relief',
    timestamp: '1 hour ago',
    message: 'For the flood-affected families in the Brahmaputra valley. We stand with you.'
  },
  {
    id: 'dw-4',
    donorName: 'Rameshwaram Charitable Fund',
    amount: 100000,
    frequency: 'once',
    campaignTitle: 'Thar & Bundelkhand Solar Groundwater Aquifer Wells',
    timestamp: '2 hours ago',
    tributeType: 'in_memory',
    tributeName: 'Shri R.K. Singhania',
    message: 'Dedicated to clean water access in the arid villages of Barmer.'
  },
  {
    id: 'dw-5',
    donorName: 'Kavita Menon',
    amount: 5000,
    frequency: 'monthly',
    campaignTitle: 'Western Ghats Shola & Rain-Canopy Ecological Reserve',
    timestamp: '3 hours ago',
    message: 'May our children inherit the pristine forests and wild rivers of the Western Ghats.'
  },
  {
    id: 'dw-6',
    donorName: 'Rajesh & Meera Gurbhele',
    amount: 15000,
    frequency: 'once',
    campaignTitle: 'Kasturba Rural Girls STEM & Coding Laboratories',
    timestamp: '5 hours ago',
    message: 'When you educate a girl child, you empower a whole village. Truly inspiring initiative.'
  }
];

export const TRANSPARENCY_METRICS = {
  directFieldDeployment: 88.6,
  fieldLogisticsAndColdChain: 7.8,
  governanceAndAuditing: 3.6,
  section80GRegNo: 'CIT(E)/DELHI/80G/2023-24/A/10294',
  trustPan: 'AAATK9412F',
  darpanId: 'DL/2023/0381920',
  accreditations: [
    { title: 'Income Tax Exemption', score: 'Section 80G & 12A Certified (Form 10BE issued)', year: 'Valid till AY 2029-30' },
    { title: 'NITI Aayog NGO Darpan', score: 'Darpan ID: DL/2023/0381920 (Verified)', year: '2026' },
    { title: 'MCA CSR-1 Registration', score: 'Registration No: CSR00049281', year: 'Eligible for Corporate CSR' },
    { title: 'Statutory Independent Audit', score: 'Chartered Accountants Clean Audit Opinion', year: 'FY 2025-26' }
  ],
  auditedReports: [
    { year: '2025-26', name: 'Annual Audited Balance Sheet & Income-Expenditure Account', size: '2.8 MB', date: 'Audited July 2026' },
    { year: '2025-26', name: 'Form 10BD / 10BE Section 80G Certificate Ledger', size: '1.4 MB', date: 'Filed Income Tax Portal' },
    { year: '2024-25', name: 'NITI Aayog Annual Program Utilization Report', size: '3.6 MB', date: 'Published May 2025' }
  ]
};

export const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'ananya.deshmukh@gmail.com',
    name: 'Ananya Deshmukh',
    subscribedAt: '2026-10-18T09:30:00Z',
    source: 'Hero Express Form',
    status: 'active',
    preferredFrequency: 'weekly_dispatch',
    interests: ['water', 'medical']
  },
  {
    id: 'sub-2',
    email: 'vikram.kothari@mumbai-tech.in',
    name: 'Vikram Kothari',
    subscribedAt: '2026-10-19T14:15:00Z',
    source: 'Field Dispatch Banner',
    status: 'active',
    preferredFrequency: 'monthly_impact',
    interests: ['education', 'ecology']
  },
  {
    id: 'sub-3',
    email: 'priya.sharma@delhi-ngo.org',
    name: 'Dr. Priya Sharma',
    subscribedAt: '2026-10-20T11:42:00Z',
    source: 'Footer Newsletter',
    status: 'active',
    preferredFrequency: 'critical_alerts',
    interests: ['crisis', 'medical']
  },
  {
    id: 'sub-4',
    email: 'sunil.nair@kerala-relief.org',
    name: 'Sunil Nair',
    subscribedAt: '2026-10-21T08:10:00Z',
    source: 'Homepage Newsletter Section',
    status: 'active',
    preferredFrequency: 'weekly_dispatch',
    interests: ['water', 'crisis']
  },
  {
    id: 'sub-5',
    email: 'meera.joshi@pune-alumni.org',
    name: 'Meera Joshi',
    subscribedAt: '2026-10-15T16:20:00Z',
    source: '80G Tax Exemption Portal',
    status: 'active',
    preferredFrequency: 'monthly_impact',
    interests: ['education']
  }
];


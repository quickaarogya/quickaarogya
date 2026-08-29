import {
  UserProfile,
  FamilyMember,
  EmergencyProfile,
  Doctor,
  Hospital,
  Medicine,
  Pharmacy,
  MedicationSchedule,
  MedicationLog,
  Appointment,
  MedicalDocument,
  BiomarkerReportItem,
  LabTest,
  LabBooking,
  HealthcareExpense,
  PharmacyOrder,
  HealthNotification,
  HealthInboxItem
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr-101',
  userId: 'auth-001',
  firstName: 'Arjun',
  lastName: 'Sharma',
  email: 'arjun.sharma@example.com',
  phone: '+91 98765 43210',
  dateOfBirth: '1988-06-14',
  gender: 'male',
  bloodGroup: 'B+',
  abhaId: '14-5521-9874-2201',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  heightCm: 176,
  weightKg: 74.5,
  createdAt: '2025-01-10T10:00:00Z',
};

export const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'fam-1',
    primaryUserProfileId: 'usr-101',
    fullName: 'Savitri Sharma',
    relationship: 'parent',
    dateOfBirth: '1959-03-22',
    gender: 'female',
    bloodGroup: 'O+',
    abhaId: '14-1189-3321-4490',
    permissionLevel: 'full_proxy',
    permissions: [
      'VIEW_APPOINTMENTS',
      'BOOK_APPOINTMENTS',
      'VIEW_MEDICATIONS',
      'MANAGE_MEDICATIONS',
      'VIEW_RECORDS',
      'UPLOAD_RECORDS',
      'VIEW_EXPENSES',
      'EMERGENCY_ACCESS'
    ],
    chronicConditions: ['Primary Hypertension', 'Osteoarthritis'],
    allergies: ['Dust', 'Shellfish'],
    emergencyContact: '+91 98110 12345',
    notes: 'Hypertension and Osteoarthritis. Requires daily medication supervision.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fam-2',
    primaryUserProfileId: 'usr-101',
    fullName: 'Ramesh Sharma',
    relationship: 'parent',
    dateOfBirth: '1954-11-08',
    gender: 'male',
    bloodGroup: 'B+',
    abhaId: '14-9981-6672-1102',
    permissionLevel: 'full_proxy',
    permissions: [
      'VIEW_APPOINTMENTS',
      'BOOK_APPOINTMENTS',
      'VIEW_MEDICATIONS',
      'MANAGE_MEDICATIONS',
      'VIEW_RECORDS',
      'UPLOAD_RECORDS',
      'VIEW_EXPENSES',
      'EMERGENCY_ACCESS'
    ],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Coronary Artery Stent (2021)'],
    allergies: ['Sulfa Drugs'],
    emergencyContact: '+91 98110 12345',
    notes: 'Type-2 Diabetes and Mild Cardiac Stent in 2021.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'fam-3',
    primaryUserProfileId: 'usr-101',
    fullName: 'Aarav Sharma',
    relationship: 'child',
    dateOfBirth: '2018-09-12',
    gender: 'male',
    bloodGroup: 'B+',
    permissionLevel: 'full_proxy',
    permissions: [
      'VIEW_APPOINTMENTS',
      'BOOK_APPOINTMENTS',
      'VIEW_MEDICATIONS',
      'MANAGE_MEDICATIONS',
      'VIEW_RECORDS',
      'UPLOAD_RECORDS',
      'EMERGENCY_ACCESS'
    ],
    chronicConditions: ['Childhood Asthma'],
    allergies: ['Peanuts'],
    vaccinationsDue: [
      {
        vaccineName: 'MMR Booster (Measles, Mumps, Rubella)',
        dueDate: '2026-09-15',
        status: 'due'
      }
    ],
    notes: 'Mild seasonal asthma and dust allergy.',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialEmergencyProfile: EmergencyProfile = {
  id: 'emg-001',
  userProfileId: 'usr-101',
  fullName: 'Arjun Sharma',
  bloodGroup: 'B+',
  dateOfBirth: '1988-06-14',
  allergies: ['Penicillin', 'Sulfa Drugs'],
  chronicConditions: ['Mild Asthma', 'Allergic Rhinitis'],
  currentMedicationsSummary: ['Montelukast 10mg (Night)', 'Levocetirizine 5mg (SOS)'],
  implantedDevices: ['None'],
  organDonor: true,
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Priya Sharma',
      relationship: 'Spouse',
      phone: '+91 98765 88990',
      isPrimary: true
    },
    {
      id: 'ec-2',
      name: 'Dr. Vivek Mehra (Family Physician)',
      relationship: 'Doctor',
      phone: '+91 98110 12345',
      isPrimary: false
    }
  ],
  publicEmergencyToken: 'emg_tok_8f93a7c1b2',
  requiresPin: false,
  updatedAt: '2026-08-20T14:30:00Z'
};

export const initialDoctors: Doctor[] = [
  {
    "id": "SAG-D-0001",
    "name": "Dr. Himanshu Samaiya",
    "title": "Consultant - Internal Medicine & Diabetology",
    "specialization": "Internal Medicine / Diabetology",
    "qualification": "MBBS, MD (Internal Medicine), Fellowship Diabetology",
    "experienceYears": 16,
    "consultationFee": 500,
    "ratingAverage": 4.95,
    "ratingCount": 680,
    "patientCount": "7.2k+",
    "reviewsCount": "3.5k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Senior consultant in internal medicine, chronic disease management, diabetes reversal counseling, and infectious disease therapies at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0002",
    "name": "Dr. Priyanka Gupta",
    "title": "Consultant Gynaecologist & Laparoscopic Surgeon",
    "specialization": "Obstetrics & Gynaecology",
    "qualification": "MBBS, MS (OB-GYN), FMAS",
    "experienceYears": 14,
    "consultationFee": 500,
    "ratingAverage": 4.96,
    "ratingCount": 790,
    "patientCount": "8.1k+",
    "reviewsCount": "4.2k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Specialized in high-risk obstetric deliveries, minimally invasive laparoscopic gynecological procedures, infertility counseling, and women wellness at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0003",
    "name": "Dr. Rohit Namdev",
    "title": "Consultant Urologist & Renal Transplant Surgeon",
    "specialization": "Urology & Andrology",
    "qualification": "MBBS, MS (Surgery), MCh (Urology)",
    "experienceYears": 15,
    "consultationFee": 600,
    "ratingAverage": 4.97,
    "ratingCount": 520,
    "patientCount": "6.4k+",
    "reviewsCount": "2.8k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Expert in laser kidney stone surgery, prostate management, andrology, and reconstructive urology at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0004",
    "name": "Dr. Vikas Gupta",
    "title": "Consultant Nephrologist",
    "specialization": "Nephrology",
    "qualification": "MBBS, MD (Medicine), DM (Nephrology)",
    "experienceYears": 13,
    "consultationFee": 600,
    "ratingAverage": 4.93,
    "ratingCount": 440,
    "patientCount": "5.1k+",
    "reviewsCount": "2.2k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Renowned nephrologist managing chronic kidney disease, hemodialysis, hypertension, and glomerular diseases at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1594824813620-21f45610a26d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0006",
    "name": "Dr. Chetan V. Shende",
    "title": "Head Consultant Joint Replacement Surgeon",
    "specialization": "Orthopaedics & Joint Replacement",
    "qualification": "MBBS, MS (Orthopaedics), MCh (Joint Replacements)",
    "experienceYears": 17,
    "consultationFee": 550,
    "ratingAverage": 4.96,
    "ratingCount": 730,
    "patientCount": "8.5k+",
    "reviewsCount": "4.1k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Primary and revision total knee and hip replacement specialist, arthroscopic ligament reconstructions, and trauma surgeon at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0018",
    "name": "Dr. Kishore Kameliya",
    "title": "Chief Interventional Cardiologist",
    "specialization": "Interventional Cardiology",
    "qualification": "MBBS, MD (Med), DM (Cardiology), FSCAI",
    "experienceYears": 18,
    "consultationFee": 650,
    "ratingAverage": 4.99,
    "ratingCount": 1140,
    "patientCount": "11.2k+",
    "reviewsCount": "6.4k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Senior interventional cardiologist with 18+ years of expertise in primary coronary angioplasty, complex stenting, pacemaker implantation, and heart failure management at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0016",
    "name": "Dr. Shashank Singh Baghel",
    "title": "Consultant Neurosurgeon",
    "specialization": "Neurosurgery / Brain & Spine",
    "qualification": "MBBS, MS (Surgery), MCh (Neurosurgery)",
    "experienceYears": 16,
    "consultationFee": 650,
    "ratingAverage": 4.98,
    "ratingCount": 920,
    "patientCount": "9.4k+",
    "reviewsCount": "4.9k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Specialized in micro-neurosurgery, brain tumor excision, endoscopic spine surgery, and neurotrauma care at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0015",
    "name": "Dr. Rohit Kushwaha",
    "title": "Consultant Neurologist",
    "specialization": "Neurology",
    "qualification": "MBBS, MD (Medicine), DM (Neurology)",
    "experienceYears": 15,
    "consultationFee": 650,
    "ratingAverage": 4.97,
    "ratingCount": 890,
    "patientCount": "8.6k+",
    "reviewsCount": "4.3k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Expert in acute stroke management, epilepsy, Parkinson's disease, neuromuscular disorders, and intractable headaches at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0010",
    "name": "Dr. Akanksha Jaiswal",
    "title": "Consultant Child & Newborn Specialist",
    "specialization": "Paediatrics & Neonatology",
    "qualification": "MBBS, DNB (Paediatrics), FIAP",
    "experienceYears": 12,
    "consultationFee": 450,
    "ratingAverage": 4.98,
    "ratingCount": 820,
    "patientCount": "7.9k+",
    "reviewsCount": "4.1k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Compassionate paediatrician specializing in newborn intensive care, childhood developmental assessments, and immunization regimens at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0011",
    "name": "Dr. Vijay Bhaskar Rao",
    "title": "Senior Consultant General & Laparoscopic Surgeon",
    "specialization": "General / GI / Laparoscopic Surgery",
    "qualification": "MBBS, MS (General Surgery), FMAS",
    "experienceYears": 19,
    "consultationFee": 550,
    "ratingAverage": 4.96,
    "ratingCount": 710,
    "patientCount": "9.1k+",
    "reviewsCount": "4.8k",
    "hospitalName": "Bansal Hospital Sagar",
    "hospitalId": "SAG-F-0001",
    "clinicAddress": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "about": "Leading laparoscopic surgeon performing advanced hernia repairs, gallbladder removals, appendix surgeries, and gastrointestinal procedures at Bansal Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0025",
    "name": "Dr. Prince Agrawal",
    "title": "Senior Consultant - Obstetrics & High-Risk Pregnancy",
    "specialization": "Obstetrics & Gynaecology",
    "qualification": "MBBS, MS (OB-GYN), Fellowship Maternal Fetal Medicine",
    "experienceYears": 15,
    "consultationFee": 400,
    "ratingAverage": 4.95,
    "ratingCount": 740,
    "patientCount": "8.2k+",
    "reviewsCount": "3.9k",
    "hospitalName": "Government Maternity Hospital",
    "hospitalId": "SAG-F-0037",
    "clinicAddress": "Vaishali Nagar, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Senior obstetrician specializing in high-risk pregnancy management, normal deliveries, and antenatal health at Government Maternity Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0026",
    "name": "Dr. Durga Agrawal",
    "title": "Consultant Obstetrician & Women Health Specialist",
    "specialization": "Obstetrics & Gynaecology",
    "qualification": "MBBS, DGO, DNB (OB-GYN)",
    "experienceYears": 14,
    "consultationFee": 400,
    "ratingAverage": 4.94,
    "ratingCount": 690,
    "patientCount": "7.8k+",
    "reviewsCount": "3.6k",
    "hospitalName": "Government Maternity Hospital",
    "hospitalId": "SAG-F-0037",
    "clinicAddress": "Vaishali Nagar, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Expert in prenatal care, painless delivery management, post-partum recovery, and maternal nutrition at Government Maternity Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0152",
    "name": "Dr. Sanjay Kumar Sharma",
    "title": "Senior Paediatrician & Neonatal Care Specialist",
    "specialization": "Paediatrics & Neonatology",
    "qualification": "MBBS, MD (Paediatrics), DCH",
    "experienceYears": 16,
    "consultationFee": 350,
    "ratingAverage": 4.93,
    "ratingCount": 610,
    "patientCount": "6.9k+",
    "reviewsCount": "3.2k",
    "hospitalName": "Government Maternity Hospital",
    "hospitalId": "SAG-F-0037",
    "clinicAddress": "Vaishali Nagar, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Dedicated paediatrician managing newborn resuscitation, neonatal jaundice, infant immunizations, and growth milestones at Government Maternity Hospital.",
    "avatarUrl": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0153",
    "name": "Dr. Tarendra Singh Thakur",
    "title": "Consultant Paediatrician",
    "specialization": "Paediatrics",
    "qualification": "MBBS, DNB (Paediatrics)",
    "experienceYears": 13,
    "consultationFee": 350,
    "ratingAverage": 4.92,
    "ratingCount": 540,
    "patientCount": "5.8k+",
    "reviewsCount": "2.7k",
    "hospitalName": "Government Maternity Hospital",
    "hospitalId": "SAG-F-0037",
    "clinicAddress": "Vaishali Nagar, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Child specialist providing gentle care for newborn infections, pediatric asthma, seasonal fevers, and developmental assessments.",
    "avatarUrl": "https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0154",
    "name": "Dr. Verma Sailendra",
    "title": "Consultant Child Wellness Specialist",
    "specialization": "Paediatrics",
    "qualification": "MBBS, DCH",
    "experienceYears": 12,
    "consultationFee": 300,
    "ratingAverage": 4.9,
    "ratingCount": 480,
    "patientCount": "5.1k+",
    "reviewsCount": "2.3k",
    "hospitalName": "Government Maternity Hospital",
    "hospitalId": "SAG-F-0037",
    "clinicAddress": "Vaishali Nagar, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Primary paediatrician focused on preventative child care, nutrition guidance, and childhood illness prevention at Government Maternity Hospital.",
    "avatarUrl": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0081",
    "name": "Dr. Khan M Ajmal Nafis",
    "title": "Professor & Senior Consultant Physician",
    "specialization": "General Medicine / Internal Medicine",
    "qualification": "MBBS, MD (Medicine)",
    "experienceYears": 20,
    "consultationFee": 300,
    "ratingAverage": 4.96,
    "ratingCount": 880,
    "patientCount": "12.4k+",
    "reviewsCount": "5.8k",
    "hospitalName": "Bundelkhand Medical College & Hospital",
    "hospitalId": "SAG-F-0002",
    "clinicAddress": "Tilli Road, Sagar, MP 470002",
    "phone": "07582-236370",
    "about": "Senior faculty and clinical physician with 20+ years expertise in complex multi-organ disorders, tropical fevers, metabolic syndromes, and ICU care at BMC Hospital.",
    "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0146",
    "name": "Dr. T.N. Dubey",
    "title": "Senior Consultant Neurologist & Physician",
    "specialization": "Neurology / Medicine",
    "qualification": "MBBS, MD (Medicine), DM (Neurology)",
    "experienceYears": 22,
    "consultationFee": 400,
    "ratingAverage": 4.98,
    "ratingCount": 1040,
    "patientCount": "14.2k+",
    "reviewsCount": "6.9k",
    "hospitalName": "Bundelkhand Medical College & Hospital",
    "hospitalId": "SAG-F-0002",
    "clinicAddress": "Tilli Road, Sagar, MP 470002",
    "phone": "07582-236370",
    "about": "Distinguished neurologist managing stroke prevention, neuro-degenerative diseases, peripheral neuropathies, and migraine management at BMC Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0042",
    "name": "Dr. Satyendra Mishra",
    "title": "Chief Chest Physician & Pulmonologist",
    "specialization": "Pulmonology / Chest Medicine",
    "qualification": "MBBS, MD (Respiratory Medicine), DTCD",
    "experienceYears": 17,
    "consultationFee": 400,
    "ratingAverage": 4.95,
    "ratingCount": 780,
    "patientCount": "8.9k+",
    "reviewsCount": "4.1k",
    "hospitalName": "Bundelkhand Medical College & Hospital",
    "hospitalId": "SAG-F-0002",
    "clinicAddress": "Medical College Road, Tilli, Sagar",
    "phone": "09755112432",
    "about": "Senior pulmonologist treating asthma, chronic obstructive pulmonary disease (COPD), post-viral fibrosis, interstitial lung disease, and sleep apnea.",
    "avatarUrl": "https://images.unsplash.com/photo-1594824813620-21f45610a26d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0151",
    "name": "Dr. Pawan Ghanghoria",
    "title": "Consultant Paediatric Neurologist",
    "specialization": "Paediatric Neurology",
    "qualification": "MBBS, MD (Paediatrics), Fellowship Paediatric Neurology",
    "experienceYears": 14,
    "consultationFee": 450,
    "ratingAverage": 4.97,
    "ratingCount": 650,
    "patientCount": "6.7k+",
    "reviewsCount": "3.4k",
    "hospitalName": "Bundelkhand Medical College & Hospital",
    "hospitalId": "SAG-F-0002",
    "clinicAddress": "Tilli Road, Sagar, MP 470002",
    "phone": "07582-236370",
    "about": "Specialized in childhood epilepsy, cerebral palsy rehabilitation, developmental delay assessments, and neuromuscular disorders in children.",
    "avatarUrl": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0137",
    "name": "Dr. Deepak Raghuvanshi",
    "title": "Consultant General & Laparoscopic Surgeon",
    "specialization": "General / Laparoscopic Surgery",
    "qualification": "MBBS, MS (Surgery), FMAS",
    "experienceYears": 15,
    "consultationFee": 350,
    "ratingAverage": 4.93,
    "ratingCount": 590,
    "patientCount": "6.2k+",
    "reviewsCount": "3.1k",
    "hospitalName": "Bundelkhand Medical College & Hospital",
    "hospitalId": "SAG-F-0002",
    "clinicAddress": "Tilli Road, Sagar, MP 470002",
    "phone": "07582-236370",
    "about": "General and trauma surgeon with extensive experience in open and minimally invasive abdominal surgeries, trauma casualty, and surgical oncology.",
    "avatarUrl": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0027",
    "name": "Dr. Brijesh Yadav",
    "title": "Senior Child & Newborn Specialist",
    "specialization": "Paediatrics / Neonatology",
    "qualification": "MBBS, MD (Paediatrics), DCH",
    "experienceYears": 15,
    "consultationFee": 200,
    "ratingAverage": 4.94,
    "ratingCount": 780,
    "patientCount": "9.6k+",
    "reviewsCount": "4.8k",
    "hospitalName": "Government District Hospital Sagar",
    "hospitalId": "SAG-F-0003",
    "clinicAddress": "Tilli Road, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Dedicated paediatrician managing primary child OPD, seasonal pediatric infections, newborn triage, and vaccination drives at Government District Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0028",
    "name": "Dr. Shantiswaroop Parashar",
    "title": "Senior General Physician",
    "specialization": "General Medicine",
    "qualification": "MBBS, MD (Medicine)",
    "experienceYears": 18,
    "consultationFee": 200,
    "ratingAverage": 4.92,
    "ratingCount": 710,
    "patientCount": "10.1k+",
    "reviewsCount": "5.2k",
    "hospitalName": "Government District Hospital Sagar",
    "hospitalId": "SAG-F-0003",
    "clinicAddress": "Tilli Road, Sagar, MP 470001",
    "phone": "09826071736",
    "about": "Experienced physician diagnosing acute fevers, hypertension, seasonal ailments, and adult wellness at Government District Hospital Sagar.",
    "avatarUrl": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0093",
    "name": "Dr. Satish Mishra",
    "title": "Senior Allopathic Physician",
    "specialization": "General Medicine",
    "qualification": "MBBS, MD (Med)",
    "experienceYears": 16,
    "consultationFee": 200,
    "ratingAverage": 4.91,
    "ratingCount": 620,
    "patientCount": "8.4k+",
    "reviewsCount": "3.9k",
    "hospitalName": "Government District Hospital Sagar",
    "hospitalId": "SAG-F-0003",
    "clinicAddress": "Tilli Road, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "General physician providing daily OPD consultations, lifestyle medicine guidance, and preventative primary care.",
    "avatarUrl": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0142",
    "name": "Dr. R.D. Nanhoriya",
    "title": "Consultant ENT Specialist",
    "specialization": "ENT",
    "qualification": "MBBS, MS (ENT), DLO",
    "experienceYears": 17,
    "consultationFee": 250,
    "ratingAverage": 4.93,
    "ratingCount": 670,
    "patientCount": "7.9k+",
    "reviewsCount": "3.7k",
    "hospitalName": "Government District Hospital Sagar",
    "hospitalId": "SAG-F-0003",
    "clinicAddress": "Tilli Road, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "ENT surgeon treating chronic sinusitis, tonsillitis, hearing disorders, allergic rhinitis, and ear microsurgery.",
    "avatarUrl": "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0036",
    "name": "Dr. Ankur Jain",
    "title": "Head Consultant General & Laparoscopic Surgeon",
    "specialization": "General & Laparoscopic Surgery",
    "qualification": "MBBS, MS (Surgery), FMAS",
    "experienceYears": 18,
    "consultationFee": 450,
    "ratingAverage": 4.97,
    "ratingCount": 960,
    "patientCount": "11.2k+",
    "reviewsCount": "5.8k",
    "hospitalName": "Bhagyoday Tirth Chikitsalay",
    "hospitalId": "SAG-F-0014",
    "clinicAddress": "Shastri Nagar, Kareela, Khurai Road, Sagar, MP 470002",
    "phone": "07582266671",
    "about": "Senior surgeon leading minimal access laparoscopic surgery, hernia management, gallbladder procedures, and trauma surgeries at Bhagyodaya Tirth Chikitsalay.",
    "avatarUrl": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0031",
    "name": "Dr. Kanchi Jain",
    "title": "Head MDS Endodontist & Implantologist",
    "specialization": "Dentistry / Endodontics",
    "qualification": "BDS, MDS (Conservative Dentistry & Endodontics)",
    "experienceYears": 13,
    "consultationFee": 350,
    "ratingAverage": 4.96,
    "ratingCount": 840,
    "patientCount": "8.1k+",
    "reviewsCount": "4.4k",
    "hospitalName": "Bhagyoday Tirth Chikitsalay",
    "hospitalId": "SAG-F-0014",
    "clinicAddress": "Shastri Nagar, Kareela, Khurai Road, Sagar, MP 470002",
    "phone": "07582266671",
    "about": "Specialized in painless single-sitting root canal treatments, aesthetic composite restorations, crown & bridge prosthetics, and dental implants at Bhagyoday Tirth Hospital.",
    "avatarUrl": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0155",
    "name": "Dr. Saurabh Vinod Jain",
    "title": "Consultant Dental Surgeon",
    "specialization": "Dentistry",
    "qualification": "BDS, MDS",
    "experienceYears": 12,
    "consultationFee": 300,
    "ratingAverage": 4.94,
    "ratingCount": 680,
    "patientCount": "6.5k+",
    "reviewsCount": "3.2k",
    "hospitalName": "Bhagyoday Tirth Chikitsalay",
    "hospitalId": "SAG-F-0014",
    "clinicAddress": "Shastri Nagar, Kareela, Khurai Road, Sagar, MP 470002",
    "phone": "07582266671",
    "about": "Expert in restorative dentistry, scaling, tooth whitening, extractions, and preventative dental hygiene.",
    "avatarUrl": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0129",
    "name": "Dr. Shailendra Kumar Jain",
    "title": "Consultant Gastroenterologist",
    "specialization": "Gastroenterology",
    "qualification": "MBBS, MD (Medicine), DM (Gastroenterology)",
    "experienceYears": 15,
    "consultationFee": 500,
    "ratingAverage": 4.95,
    "ratingCount": 720,
    "patientCount": "7.4k+",
    "reviewsCount": "3.8k",
    "hospitalName": "Bhagyoday Tirth Chikitsalay",
    "hospitalId": "SAG-F-0014",
    "clinicAddress": "Shastri Nagar, Kareela, Khurai Road, Sagar, MP 470002",
    "phone": "07582266671",
    "about": "Specialized in diagnostic and therapeutic upper GI endoscopy, colonoscopy, liver cirrhosis management, and acute pancreatitis care.",
    "avatarUrl": "https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0072",
    "name": "Dr. N.S. Mourya",
    "title": "Consultant Physician & Cardiologist",
    "specialization": "General Medicine / Cardiology",
    "qualification": "MBBS, MD (Medicine), PGDCC (Cardiology)",
    "experienceYears": 19,
    "consultationFee": 500,
    "ratingAverage": 4.96,
    "ratingCount": 890,
    "patientCount": "10.4k+",
    "reviewsCount": "5.1k",
    "hospitalName": "Sagar Heart Care Hospital",
    "hospitalId": "SAG-F-0016",
    "clinicAddress": "Sagar Cantt / Tilli Road, Sagar",
    "phone": "07582-220515",
    "about": "Chief consultant managing hypertension, ischemic heart diseases, heart failure, 2D Echocardiography, and comprehensive cardiac rehabilitation at Sagar Heart Care Hospital.",
    "avatarUrl": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0023",
    "name": "Dr. Rakesh Tikadar",
    "title": "Interventional Cardiologist",
    "specialization": "Interventional Cardiology",
    "qualification": "MBBS, MD (Med), DM (Cardiology)",
    "experienceYears": 17,
    "consultationFee": 600,
    "ratingAverage": 4.95,
    "ratingCount": 820,
    "patientCount": "9.1k+",
    "reviewsCount": "4.6k",
    "hospitalName": "Sagar Heart Care Hospital",
    "hospitalId": "SAG-F-0016",
    "clinicAddress": "Sagar Cantt / Tilli Road, Sagar",
    "phone": "07582-220515",
    "about": "Interventional cardiologist performing coronary angiography, angioplasty stenting, and heart disease management.",
    "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0091",
    "name": "Dr. Puneet Rastogi",
    "title": "Consultant Cardiologist",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD, DM (Cardiology)",
    "experienceYears": 16,
    "consultationFee": 550,
    "ratingAverage": 4.94,
    "ratingCount": 750,
    "patientCount": "8.2k+",
    "reviewsCount": "3.9k",
    "hospitalName": "Sagar Heart Care Hospital",
    "hospitalId": "SAG-F-0016",
    "clinicAddress": "Sagar Cantt / Tilli Road, Sagar",
    "phone": "07582-220515",
    "about": "Specialized in clinical cardiology, arrhythmias, preventive heart health, and cardiac ICU monitoring.",
    "avatarUrl": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0136",
    "name": "Dr. Sandeep",
    "title": "Consultant Physician - Diabetes & Heart Health",
    "specialization": "Diabetes / Cardiology",
    "qualification": "MBBS, MD (Internal Medicine)",
    "experienceYears": 14,
    "consultationFee": 450,
    "ratingAverage": 4.92,
    "ratingCount": 610,
    "patientCount": "6.8k+",
    "reviewsCount": "3.2k",
    "hospitalName": "Sagar Heart Care Hospital",
    "hospitalId": "SAG-F-0016",
    "clinicAddress": "Sagar Cantt / Tilli Road, Sagar",
    "phone": "07582-220515",
    "about": "Diabetologist and physician managing metabolic syndrome, diabetic nephropathy, and cardiovascular risk reduction.",
    "avatarUrl": "https://images.unsplash.com/photo-1594824813620-21f45610a26d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0024",
    "name": "Dr. Vinaydeep Bidoliya",
    "title": "Head Orthopaedic Surgeon",
    "specialization": "Orthopaedics",
    "qualification": "MBBS, MS (Orthopaedics), Fellowship Arthroscopy",
    "experienceYears": 17,
    "consultationFee": 500,
    "ratingAverage": 4.92,
    "ratingCount": 670,
    "patientCount": "7.8k+",
    "reviewsCount": "3.9k",
    "hospitalName": "Shri Siddhi Vinayak Hospital",
    "hospitalId": "SAG-F-0033",
    "clinicAddress": "Poddar Colony, Tilli Road, Sagar, MP 470002",
    "phone": "07582-236200",
    "about": "Senior orthopaedic surgeon managing complex bone fractures, joint dislocations, arthroscopic ligament repairs, and degenerative arthritis.",
    "avatarUrl": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0108",
    "name": "Dr. Ayush Chouhan",
    "title": "Consultant Orthopaedic Doctor",
    "specialization": "Orthopaedics",
    "qualification": "MBBS, MS (Orthopaedics)",
    "experienceYears": 13,
    "consultationFee": 450,
    "ratingAverage": 4.91,
    "ratingCount": 520,
    "patientCount": "5.9k+",
    "reviewsCount": "2.8k",
    "hospitalName": "Shri Siddhi Vinayak Hospital",
    "hospitalId": "SAG-F-0033",
    "clinicAddress": "Poddar Colony, Tilli Road, Sagar, MP 470002",
    "phone": "07582-236200",
    "about": "Specialized in sports injuries, knee pain management, musculoskeletal trauma, and conservative orthopaedic therapies.",
    "avatarUrl": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0114",
    "name": "Dr. Nachiket Kailash Panse",
    "title": "Consultant Orthopaedic & Spine Surgeon",
    "specialization": "Orthopaedics / Spine",
    "qualification": "MBBS, MS (Ortho), Fellowship Spine Surgery",
    "experienceYears": 16,
    "consultationFee": 550,
    "ratingAverage": 4.96,
    "ratingCount": 780,
    "patientCount": "8.4k+",
    "reviewsCount": "4.1k",
    "hospitalName": "Sri Paras Fracture & General Hospital",
    "hospitalId": "SAG-F-0034",
    "clinicAddress": "Tilli Road, State Bank Colony, Poddar Colony, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Spine and orthopaedic surgeon treating slip disc, cervical spondylosis, sciatica, spinal deformities, and trauma reconstruction.",
    "avatarUrl": "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0116",
    "name": "Dr. Amit Richariya",
    "title": "Consultant Orthopaedic Doctor",
    "specialization": "Orthopaedics",
    "qualification": "MBBS, D.Ortho, MS (Orthopaedics)",
    "experienceYears": 14,
    "consultationFee": 450,
    "ratingAverage": 4.93,
    "ratingCount": 610,
    "patientCount": "6.8k+",
    "reviewsCount": "3.3k",
    "hospitalName": "Sri Paras Fracture & General Hospital",
    "hospitalId": "SAG-F-0034",
    "clinicAddress": "Tilli Road, State Bank Colony, Poddar Colony, Sagar, MP 470001",
    "phone": "07582-236200",
    "about": "Specialized in joint preservation, fracture stabilization, osteoporosis management, and post-fracture physical rehabilitation.",
    "avatarUrl": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0012-NEO",
    "name": "Dr. Akanksha Jaiswal",
    "title": "Consultant Pediatrician & Neonatologist",
    "specialization": "Paediatrics & Neonatology",
    "qualification": "MBBS, DNB (Paediatrics), FIAP",
    "experienceYears": 12,
    "consultationFee": 400,
    "ratingAverage": 4.98,
    "ratingCount": 820,
    "patientCount": "7.9k+",
    "reviewsCount": "4.1k",
    "hospitalName": "Neo Children Hospital",
    "hospitalId": "SAG-F-0012",
    "clinicAddress": "Opposite Medical College, Ashok Vihar, Sagar, MP 470001",
    "phone": "09407096372",
    "about": "Dedicated neonatal intensive care specialist, child growth tracking, childhood allergic diseases, and pediatric urgent care.",
    "avatarUrl": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0138",
    "name": "Dr. Umesh G.S.",
    "title": "Head Consultant Eye Surgeon",
    "specialization": "Ophthalmology",
    "qualification": "MBBS, MS (Ophthalmology), Fellowship Cornea",
    "experienceYears": 18,
    "consultationFee": 400,
    "ratingAverage": 4.95,
    "ratingCount": 860,
    "patientCount": "10.2k+",
    "reviewsCount": "4.9k",
    "hospitalName": "Gandhi Eye Hospital",
    "hospitalId": "SAG-F-0062",
    "clinicAddress": "Behind HDFC Bank, Goughat Parkota, Sagar, MP 470002",
    "phone": "09302483960",
    "about": "Senior eye surgeon specializing in micro-incision cataract surgery (MICS), laser vision correction, glaucoma management, and corneal transplants at Gandhi Eye Hospital.",
    "avatarUrl": "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0141",
    "name": "Dr. Jayant Rao",
    "title": "Consultant Ophthalmologist",
    "specialization": "Ophthalmology",
    "qualification": "MBBS, MS (Ophthalmology)",
    "experienceYears": 14,
    "consultationFee": 350,
    "ratingAverage": 4.92,
    "ratingCount": 620,
    "patientCount": "6.9k+",
    "reviewsCount": "3.2k",
    "hospitalName": "Gandhi Eye Hospital",
    "hospitalId": "SAG-F-0062",
    "clinicAddress": "Behind HDFC Bank, Goughat Parkota, Sagar, MP 470002",
    "phone": "09302483960",
    "about": "Expert in diabetic retinopathy screening, pediatric vision disorders, dry eye therapies, and computer vision syndrome management.",
    "avatarUrl": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0029",
    "name": "Dr. Pawan Gupta",
    "title": "Chief Dermatologist & Laser Specialist",
    "specialization": "Dermatology",
    "qualification": "MBBS, MD (DVL), Fellow in Dermatosurgery",
    "experienceYears": 14,
    "consultationFee": 450,
    "ratingAverage": 4.95,
    "ratingCount": 810,
    "patientCount": "8.6k+",
    "reviewsCount": "4.3k",
    "hospitalName": "Yuva Skin Clinic",
    "hospitalId": "SAG-F-0127",
    "clinicAddress": "Dwarika Vihar Chowk near BMC, Tilli, Sagar, MP 470001",
    "phone": "07772820400",
    "about": "Chief dermatologist at Yuva Skin Clinic providing advanced acne scar laser resurfacing, hair loss therapies (PRP), psoriasis treatment, and allergy patch testing.",
    "avatarUrl": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0032",
    "name": "Dr. Rajesh Patel",
    "title": "Consultant Gastroenterologist & Hepatologist",
    "specialization": "Gastroenterology",
    "qualification": "MBBS, MD (Medicine), DM (Gastroenterology)",
    "experienceYears": 16,
    "consultationFee": 600,
    "ratingAverage": 4.95,
    "ratingCount": 910,
    "patientCount": "9.8k+",
    "reviewsCount": "4.9k",
    "hospitalName": "Dr Patel's Gastro Digestive Care",
    "hospitalId": "SAG-F-0140",
    "clinicAddress": "Beside Paras Fracture Hospital, Medical College Road, Tilli, Sagar",
    "phone": "07240969347",
    "about": "Specialized in fatty liver reversal, acidity & GERD management, IBS treatment, video endoscopy, and colonoscopy at Dr Patel's Gastro Digestive Care.",
    "avatarUrl": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0037",
    "name": "Dr. Anurag Jain",
    "title": "Consultant Diabetologist & Metabolic Physician",
    "specialization": "Diabetology & Endocrinology",
    "qualification": "MBBS, MD (Medicine), PG Diabetology (Boston)",
    "experienceYears": 15,
    "consultationFee": 500,
    "ratingAverage": 4.95,
    "ratingCount": 830,
    "patientCount": "8.9k+",
    "reviewsCount": "4.4k",
    "hospitalName": "Deepshree Health & Eye Clinic",
    "hospitalId": "SAG-F-0064",
    "clinicAddress": "Near Chaitanya Hospital, Gopal Ganj, Sagar, MP 470001",
    "phone": "07987044304",
    "about": "Leading diabetologist offering personalized diabetes reversal protocols, continuous glucose monitoring (CGM), and thyroid disorder therapies.",
    "avatarUrl": "https://images.unsplash.com/photo-1605684954998-685c79d6a018?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0038",
    "name": "Dr. Supriya Jain",
    "title": "Consultant Eye Surgeon & Retina Specialist",
    "specialization": "Ophthalmology",
    "qualification": "MBBS, MS (Ophthalmology)",
    "experienceYears": 14,
    "consultationFee": 450,
    "ratingAverage": 4.94,
    "ratingCount": 610,
    "patientCount": "7.1k+",
    "reviewsCount": "3.4k",
    "hospitalName": "Deepshree Health & Eye Clinic",
    "hospitalId": "SAG-F-0064",
    "clinicAddress": "Near Chaitanya Hospital, Gopal Ganj, Sagar, MP 470001",
    "phone": "07987044304",
    "about": "Ophthalmologist specializing in cataract surgery, refractive errors, pediatric ophthalmology, and dry eye syndromes.",
    "avatarUrl": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0034",
    "name": "Dr. Priyanshu Jain",
    "title": "Consultant Pulmonologist & Sleep Specialist",
    "specialization": "Pulmonology / Chest Medicine",
    "qualification": "MBBS, MD (Pulmonary Medicine), DNB",
    "experienceYears": 14,
    "consultationFee": 500,
    "ratingAverage": 4.93,
    "ratingCount": 690,
    "patientCount": "7.6k+",
    "reviewsCount": "3.8k",
    "hospitalName": "Aakriti Medico / Dr Priyanshu Jain Clinic",
    "hospitalId": "SAG-F-0147",
    "clinicAddress": "Opposite Nao Mandir, Jheel Boat Club, Sagar, MP 470002",
    "phone": "07582-236200",
    "about": "Chest physician treating tuberculosis, chronic cough, smoking cessation, pulmonary function testing (PFT), and sleep apnea.",
    "avatarUrl": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0040",
    "name": "Dr. Shantanu Kesharwani",
    "title": "Chief Dermatologist & Hair Transplant Specialist",
    "specialization": "Dermatology & Cosmetology",
    "qualification": "MBBS, MD (DVL)",
    "experienceYears": 13,
    "consultationFee": 500,
    "ratingAverage": 4.94,
    "ratingCount": 780,
    "patientCount": "8.2k+",
    "reviewsCount": "4.1k",
    "hospitalName": "SkinGlow Clinic",
    "hospitalId": "SAG-F-0126",
    "clinicAddress": "In front of Hotel Devyog, Teen Batti, Katra Bazaar, Sagar, MP 470002",
    "phone": "07582-244134",
    "about": "Dermatologist and cosmetologist providing laser hair reduction, pigmentation peeling, scar removal, and hair restoration therapies.",
    "avatarUrl": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0064",
    "name": "Dr. Pramendra Tiwari",
    "title": "Head Consultant Physiotherapist & Sports Rehab Specialist",
    "specialization": "Physiotherapy & Sports Rehabilitation",
    "qualification": "BPT, MPT (Orthopaedics & Sports Rehab), MIAP",
    "experienceYears": 14,
    "consultationFee": 350,
    "ratingAverage": 4.93,
    "ratingCount": 620,
    "patientCount": "7.4k+",
    "reviewsCount": "3.7k",
    "hospitalName": "Dr Pramendra Tiwari Physiotherapy Clinic",
    "hospitalId": "SAG-F-0107",
    "clinicAddress": "Sagar Apartment, Ajmani Complex, Makronia, Sagar",
    "phone": "08817777265",
    "about": "Expert in neuro-muscular rehabilitation, slip disc therapy, sciatica pain relief, post-joint replacement gait training, and sports injury recovery.",
    "avatarUrl": "https://images.unsplash.com/photo-1594824813620-21f45610a26d?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0060",
    "name": "Dr. Vikas Patel",
    "title": "Senior Consultant Homoeopath",
    "specialization": "Homeopathy",
    "qualification": "BHMS, MD (Homeopathy)",
    "experienceYears": 14,
    "consultationFee": 300,
    "ratingAverage": 4.91,
    "ratingCount": 480,
    "patientCount": "6.2k+",
    "reviewsCount": "2.9k",
    "hospitalName": "Ambe Homoeo Clinic",
    "hospitalId": "SAG-F-0055",
    "clinicAddress": "Tilak Ganj, Sagar, MP 470002",
    "phone": "07582-236200",
    "about": "Classical homeopathic treatment for chronic skin allergies, sinusitis, migraine, childhood immunity building, and digestive ailments.",
    "avatarUrl": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Wednesday",
      "Friday",
      "Saturday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  },
  {
    "id": "SAG-D-0063",
    "name": "Dr. Qazi Wasim Uddin",
    "title": "Consultant Homoeopath",
    "specialization": "Homeopathy",
    "qualification": "BHMS, MD (Homeo)",
    "experienceYears": 15,
    "consultationFee": 350,
    "ratingAverage": 4.93,
    "ratingCount": 560,
    "patientCount": "6.8k+",
    "reviewsCount": "3.2k",
    "hospitalName": "Alpha Care Homeo Clinic",
    "hospitalId": "SAG-F-0056",
    "clinicAddress": "Opposite Jheel Boat Club, Sagar, MP 470002",
    "phone": "09755338675",
    "about": "Holistic homeopathic consultations for lifestyle disorders, chronic asthma, joint pain, and constitutional well-being.",
    "avatarUrl": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80",
    "languages": [
      "Hindi",
      "English"
    ],
    "consultationTypes": [
      "in_person",
      "video_teleconsult"
    ],
    "availableDays": [
      "Monday",
      "Tuesday",
      "Thursday",
      "Friday"
    ],
    "availableSlots": [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM"
    ],
    "isVerified": true
  }
];

export const initialHospitals: Hospital[] = [
  {
    "id": "SAG-F-0001",
    "name": "Bansal Hospital Sagar",
    "type": "Multispecialty Super Specialty",
    "locality": "Makronia",
    "address": "Prabhakar Nagar, Makronia, Sagar, MP 470004",
    "phone": "07582-472000",
    "distanceKm": 2.1,
    "has24x7Emergency": true,
    "icuBedsAvailable": 28,
    "totalBeds": 350,
    "rating": 4.96,
    "imageUrl": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "24/7 Level 1 Trauma Care",
      "Cath Lab",
      "Advanced Neuro ICU",
      "Modular OTs",
      "In-house Pharmacy"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-472000 / 108"
  },
  {
    "id": "SAG-F-0002",
    "name": "Bundelkhand Medical College & Hospital",
    "type": "Government / Teaching Hospital",
    "locality": "Tilli",
    "address": "Tilli Road, Sagar, MP 470002",
    "phone": "07582-236370",
    "distanceKm": 1.4,
    "has24x7Emergency": true,
    "icuBedsAvailable": 42,
    "totalBeds": 750,
    "rating": 4.88,
    "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "Government Multispecialty",
      "Critical Care ICU",
      "Burn Unit",
      "Blood Bank",
      "Ayushman Bharat"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-236370 / 108"
  },
  {
    "id": "SAG-F-0003",
    "name": "Government District Hospital Sagar",
    "type": "Government / Multispecialty",
    "locality": "Tilli",
    "address": "Tilli Road, Sagar, MP 470001",
    "phone": "07582-236200",
    "distanceKm": 1.6,
    "has24x7Emergency": true,
    "icuBedsAvailable": 20,
    "totalBeds": 450,
    "rating": 4.82,
    "imageUrl": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "24/7 Emergency Casualty",
      "General Medicine OPD",
      "Maternity Ward",
      "Free Generic Pharmacy",
      "ABHA OPD"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-236200 / 108"
  },
  {
    "id": "SAG-F-0037",
    "name": "Government Maternity Hospital",
    "type": "Government Maternity & Child Hospital",
    "locality": "Vaishali Nagar",
    "address": "Vaishali Nagar, Sagar, MP 470001",
    "phone": "07582-236200",
    "distanceKm": 2.8,
    "has24x7Emergency": true,
    "icuBedsAvailable": 15,
    "totalBeds": 180,
    "rating": 4.89,
    "imageUrl": "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "24/7 Labour & Delivery",
      "NICU & Neonatal ICU",
      "High-Risk Pregnancy Suite",
      "Immunization Center",
      "Women Wellness OPD"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-236200 / 108"
  },
  {
    "id": "SAG-F-0014",
    "name": "Bhagyoday Tirth Chikitsalay",
    "type": "Charitable / Multispecialty Hospital",
    "locality": "Khurai Road",
    "address": "Shastri Nagar, Kareela, Khurai Road, Sagar, MP 470002",
    "phone": "07582266671",
    "distanceKm": 3.4,
    "has24x7Emergency": true,
    "icuBedsAvailable": 24,
    "totalBeds": 600,
    "rating": 4.97,
    "imageUrl": "/images/hospitals/bhagyodaya-tirth.jpg",
    "facilities": [
      "Advanced Surgery Complex",
      "Endodontics & Dental Wing",
      "Dialysis Wing",
      "In-house Diagnostic Labs",
      "24/7 Ambulance"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582266671 / 108"
  },
  {
    "id": "SAG-F-0016",
    "name": "Sagar Heart Care Hospital",
    "type": "Cardiac & Multispecialty Hospital",
    "locality": "Sagar Cantt / Tilli Road",
    "address": "Sagar Cantt / Tilli Road, Sagar, MP 470001",
    "phone": "07582-220515",
    "distanceKm": 1.9,
    "has24x7Emergency": true,
    "icuBedsAvailable": 16,
    "totalBeds": 120,
    "rating": 4.93,
    "imageUrl": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "24/7 Cardiac Emergency",
      "Cath Lab & Angioplasty",
      "Echo & TMT Suite",
      "Cardiac ICU (CCU)",
      "Pacemaker Center"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-220515 / 108"
  },
  {
    "id": "SAG-F-0033",
    "name": "Shri Siddhi Vinayak Hospital",
    "type": "Orthopaedic & Multispecialty Hospital",
    "locality": "Poddar Colony",
    "address": "Poddar Colony, Tilli Road, Sagar, MP 470002",
    "phone": "07582-236200",
    "distanceKm": 2.2,
    "has24x7Emergency": true,
    "icuBedsAvailable": 12,
    "totalBeds": 100,
    "rating": 4.91,
    "imageUrl": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "Joint Replacement Suite",
      "Arthroscopy & Sports Injury",
      "Fracture Clinic",
      "Physiotherapy Attached",
      "24/7 Trauma"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-236200 / 108"
  },
  {
    "id": "SAG-F-0034",
    "name": "Sri Paras Fracture & General Hospital",
    "type": "Orthopaedic & Spine Hospital",
    "locality": "Poddar Colony",
    "address": "Tilli Road, State Bank Colony, Poddar Colony, Sagar, MP 470001",
    "phone": "07582-236200",
    "distanceKm": 2.3,
    "has24x7Emergency": true,
    "icuBedsAvailable": 10,
    "totalBeds": 85,
    "rating": 4.9,
    "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "Spine Surgery",
      "Complex Trauma Fixation",
      "Digital X-Ray & C-Arm",
      "Joint Care OPD",
      "Rehab Center"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07582-236200 / 108"
  },
  {
    "id": "SAG-F-0012",
    "name": "Neo Children Hospital",
    "type": "Paediatric Specialty Hospital",
    "locality": "Tilli",
    "address": "Opposite Medical College, Ashok Vihar, Sagar, MP 470001",
    "phone": "09407096372",
    "distanceKm": 1.5,
    "has24x7Emergency": true,
    "icuBedsAvailable": 18,
    "totalBeds": 90,
    "rating": 4.94,
    "imageUrl": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "24/7 Paediatric ER",
      "Level 3 NICU",
      "Paediatric Neurology",
      "Newborn Immunization",
      "Child Nutrition Clinic"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "09407096372 / 108"
  },
  {
    "id": "SAG-F-0062",
    "name": "Gandhi Eye Hospital",
    "type": "Eye Hospital & Laser Center",
    "locality": "Goughat Parkota",
    "address": "Behind HDFC Bank, Goughat Parkota, Sagar, MP 470002",
    "phone": "09302483960",
    "distanceKm": 3.1,
    "has24x7Emergency": false,
    "icuBedsAvailable": 4,
    "totalBeds": 50,
    "rating": 4.92,
    "imageUrl": "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "Cataract Phaco Surgery",
      "Lasik Vision Correction",
      "Glaucoma Clinic",
      "Retina & Cornea Care",
      "Optical Center"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "09302483960 / 108"
  },
  {
    "id": "SAG-F-0004",
    "name": "Khemchand Hospital",
    "type": "Private Multispecialty Hospital",
    "locality": "Bada Bazaar",
    "address": "Keshavganj Ward, Vardhman Colony, Bada Bazaar, Sagar, MP 470002",
    "phone": "07898922699",
    "distanceKm": 3.5,
    "has24x7Emergency": true,
    "icuBedsAvailable": 10,
    "totalBeds": 80,
    "rating": 4.87,
    "imageUrl": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "General Medicine OPD",
      "General Surgery",
      "Obstetric Care",
      "Pathology Lab",
      "24/7 Pharmacy"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "07898922699 / 108"
  },
  {
    "id": "SAG-F-0005",
    "name": "Shree Laxmi Narayan Hospital",
    "type": "Private Multispecialty Hospital",
    "locality": "University Road",
    "address": "University Road, Sagar, MP 470001",
    "phone": "09893554608",
    "distanceKm": 2.6,
    "has24x7Emergency": true,
    "icuBedsAvailable": 8,
    "totalBeds": 70,
    "rating": 4.85,
    "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "Physician OPD",
      "Gynaecology Care",
      "Surgery",
      "X-Ray & Lab",
      "Ambulance"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "09893554608 / 108"
  },
  {
    "id": "SAG-F-0006",
    "name": "MEERA HOSPITAL",
    "type": "Private Multispecialty Hospital",
    "locality": "Moti Nagar",
    "address": "Near Moti Nagar Police Station / Chameli Chowk, Sagar, MP 470002",
    "phone": "09479356033",
    "distanceKm": 3.8,
    "has24x7Emergency": true,
    "icuBedsAvailable": 8,
    "totalBeds": 65,
    "rating": 4.86,
    "imageUrl": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "General Medicine",
      "Emergency Casualty",
      "Minor OT",
      "Inpatient Wards",
      "Diagnostics"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "09479356033 / 108"
  },
  {
    "id": "SAG-F-0007",
    "name": "Kalyanika Hospital",
    "type": "Private General Hospital",
    "locality": "Tilli",
    "address": "Near Nirmal Bandhan Marriage Hall, Medical College Road, Tilli, Sagar",
    "phone": "08770976421",
    "distanceKm": 1.7,
    "has24x7Emergency": true,
    "icuBedsAvailable": 6,
    "totalBeds": 50,
    "rating": 4.84,
    "imageUrl": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&auto=format&fit=crop&q=80",
    "facilities": [
      "General Medicine",
      "OPD & Day Care",
      "Observation Ward",
      "Pathology",
      "Pharmacy"
    ],
    "city": "Sagar, Madhya Pradesh",
    "emergencyHelpline": "08770976421 / 108"
  }
];

export const initialMedicines: Medicine[] = [
  // --- PAIN & FEVER RELIEF ---
  {
    id: 'med-7',
    brandName: 'Dolo 650 Tablet',
    genericName: 'Paracetamol Tablets IP 650mg',
    form: 'tablet',
    strength: '1 Strip (15 Tablets)',
    category: 'otc_wellness',
    manufacturer: 'Micro Labs Ltd',
    price: 32,
    mrp: 35,
    discountPercent: 8,
    prescriptionRequired: false,
    rating: 4.95,
    ratingCount: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 300,
    description: 'Fast-acting fever and pain relief tablets. Suitable for viral fever, headache, body ache and toothache.'
  },
  {
    id: 'med-9',
    brandName: 'Combiflam Tablet',
    genericName: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    form: 'tablet',
    strength: '1 Strip (20 Tablets)',
    category: 'otc_wellness',
    manufacturer: 'Sanofi India Ltd',
    price: 42,
    mrp: 48,
    discountPercent: 12,
    prescriptionRequired: false,
    rating: 4.88,
    ratingCount: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 240,
    description: 'Dual-action pain relief for severe headache, muscle spasms, dental pain, and joint stiffness.'
  },
  {
    id: 'med-10',
    brandName: 'Saridon Headache Relief',
    genericName: 'Paracetamol (250mg) + Propyphenazone (150mg) + Caffeine (50mg)',
    form: 'tablet',
    strength: '1 Strip (10 Tablets)',
    category: 'otc_wellness',
    manufacturer: 'Bayer Healthcare',
    price: 45,
    mrp: 50,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.85,
    ratingCount: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 180,
    description: 'Trusted 3-action formula for quick headache, migraine, and mental fatigue relief in 15 minutes.'
  },
  {
    id: 'med-8',
    brandName: 'Volini Pain Relief Gel',
    genericName: 'Diclofenac Diethylamine, Methyl Salicylate & Menthol',
    form: 'ointment',
    strength: '75g Tube',
    category: 'must_haves',
    manufacturer: 'Sun Pharma',
    price: 130,
    mrp: 155,
    discountPercent: 16,
    prescriptionRequired: false,
    rating: 4.8,
    ratingCount: 920,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 80,
    description: 'Deep penetrating nanogel formula for instant relief from neck, shoulder, back, and joint sprains.'
  },
  {
    id: 'med-11',
    brandName: 'Moov Fast Pain Relief Spray',
    genericName: '100% Ayurvedic Pain Relief Active Spray',
    form: 'drops',
    strength: '50g Spray Can',
    category: 'must_haves',
    manufacturer: 'Reckitt Benckiser',
    price: 165,
    mrp: 185,
    discountPercent: 11,
    prescriptionRequired: false,
    rating: 4.75,
    ratingCount: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 110,
    description: 'Quick action pain relief spray made with Nilgiri oil, Wintergreen oil, and Mint extracts.'
  },

  // --- COLD, COUGH & ALLERGIES ---
  {
    id: 'med-12',
    brandName: 'Vicks VapoRub',
    genericName: 'Menthol, Camphor & Eucalyptus Oil Ointment',
    form: 'ointment',
    strength: '50ml Jar',
    category: 'must_haves',
    manufacturer: 'Procter & Gamble',
    price: 145,
    mrp: 160,
    discountPercent: 9,
    prescriptionRequired: false,
    rating: 4.92,
    ratingCount: 5400,
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 220,
    description: 'Provides 8 hours of multi-symptom relief from cold, cough, blocked nose, and breathing congestion.'
  },
  {
    id: 'med-13',
    brandName: 'Otrivin Oxy Fast Relief Nasal Spray',
    genericName: 'Oxymetazoline Hydrochloride Nasal Solution (0.05%)',
    form: 'drops',
    strength: '10ml Spray Bottle',
    category: 'otc_wellness',
    manufacturer: 'GSK Consumer Healthcare',
    price: 108,
    mrp: 120,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.86,
    ratingCount: 1650,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 140,
    description: 'Unblocks stuffy nose in 25 seconds and keeps nasal airways clear for up to 12 hours.'
  },
  {
    id: 'med-14',
    brandName: 'Strepsils Honey & Lemon Lozenges',
    genericName: 'Dichlorobenzyl Alcohol + Amylmetacresol',
    form: 'tablet',
    strength: '1 Strip (8 Lozenges)',
    category: 'otc_wellness',
    manufacturer: 'Reckitt Benckiser',
    price: 38,
    mrp: 42,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.88,
    ratingCount: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 400,
    description: 'Double antibacterial action for soothing sore throats and irritating dry cough tickles.'
  },
  {
    id: 'med-3',
    brandName: 'Montair LC',
    genericName: 'Montelukast Sodium 10mg + Levocetirizine 5mg',
    form: 'tablet',
    strength: '1 Strip (10 Tablets)',
    category: 'chronic_care',
    manufacturer: 'Cipla Ltd',
    price: 204,
    mrp: 255,
    discountPercent: 20,
    prescriptionRequired: true,
    rating: 4.7,
    ratingCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 120,
    description: 'Relieves symptoms of allergic rhinitis, seasonal allergies, sneezing, runny nose, and asthma.'
  },

  // --- FIRST AID & ANTISEPTIC ---
  {
    id: 'med-15',
    brandName: 'Dettol Antiseptic Liquid',
    genericName: 'Chloroxylenol (4.8% w/v) Antiseptic Solution',
    form: 'syrup',
    strength: '250ml Bottle',
    category: 'must_haves',
    manufacturer: 'Reckitt Benckiser',
    price: 135,
    mrp: 150,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.95,
    ratingCount: 6800,
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 190,
    description: 'Trusted antiseptic liquid for first aid wound cleansing, minor cuts, bites, and personal hygiene.'
  },
  {
    id: 'med-16',
    brandName: 'Band-Aid Washproof Strips',
    genericName: 'Medical Grade Adhesive Wound Bandages',
    form: 'ointment',
    strength: 'Pack of 20 Strips',
    category: 'must_haves',
    manufacturer: 'Johnson & Johnson',
    price: 55,
    mrp: 65,
    discountPercent: 15,
    prescriptionRequired: false,
    rating: 4.89,
    ratingCount: 3400,
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 250,
    description: 'Water-resistant, breathable sterile bandages with Quilt-Aid padding for quick healing.'
  },
  {
    id: 'med-17',
    brandName: 'Betadine 10% Antiseptic Ointment',
    genericName: 'Povidone Iodine Ointment IP 10%',
    form: 'ointment',
    strength: '20g Tube',
    category: 'must_haves',
    manufacturer: 'Win-Medicare',
    price: 115,
    mrp: 130,
    discountPercent: 12,
    prescriptionRequired: false,
    rating: 4.9,
    ratingCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 85,
    description: 'Broad spectrum microbicidal ointment for prevention and treatment of skin infections in minor burns and abrasions.'
  },

  // --- STOMACH & DIGESTION ---
  {
    id: 'med-18',
    brandName: 'Eno Regular Fruit Salt',
    genericName: 'Svarjiksara (51.8%) + Nimbukamlam (48.2%)',
    form: 'powder',
    strength: '100g Bottle',
    category: 'otc_wellness',
    manufacturer: 'GSK Consumer Healthcare',
    price: 140,
    mrp: 155,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.94,
    ratingCount: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 210,
    description: 'Works in 6 seconds to neutralize stomach acid and relieve acidity, reflux, and bloating.'
  },
  {
    id: 'med-19',
    brandName: 'Digene Gel Mint Flavour',
    genericName: 'Magnesium Hydroxide, Aluminium Hydroxide & Simethicone',
    form: 'syrup',
    strength: '200ml Bottle',
    category: 'otc_wellness',
    manufacturer: 'Abbott Healthcare',
    price: 142,
    mrp: 165,
    discountPercent: 14,
    prescriptionRequired: false,
    rating: 4.88,
    ratingCount: 1950,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 130,
    description: 'Sugar-free antacid gel with soothing mint cooling for long-lasting acidity and gas relief.'
  },
  {
    id: 'med-20',
    brandName: 'Electral ORS Powder',
    genericName: 'WHO Recommended Oral Rehydration Salts',
    form: 'powder',
    strength: '21.8g Sachet',
    category: 'must_haves',
    manufacturer: 'FDC Limited',
    price: 22,
    mrp: 24,
    discountPercent: 8,
    prescriptionRequired: false,
    rating: 4.96,
    ratingCount: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 500,
    description: 'Restores essential body fluids and electrolytes lost due to dehydration, heat stroke, or diarrhea.'
  },

  // --- DAILY VITAMINS & NUTRITION ---
  {
    id: 'med-6',
    brandName: 'Shelcal 500',
    genericName: 'Elemental Calcium (500mg) + Vitamin D3 (250 IU)',
    form: 'tablet',
    strength: '1 Strip (15 Tablets)',
    category: 'must_haves',
    manufacturer: 'Torrent Pharmaceuticals',
    price: 118,
    mrp: 135,
    discountPercent: 12,
    prescriptionRequired: false,
    rating: 4.75,
    ratingCount: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 150,
    description: 'Dietary supplement to maintain healthy bone mineral density, joint strength, and calcium levels.'
  },
  {
    id: 'med-21',
    brandName: 'Becosules Z Multivitamin Capsules',
    genericName: 'Vitamin B-Complex Forte with Vitamin C and Zinc',
    form: 'capsule',
    strength: '1 Strip (20 Capsules)',
    category: 'must_haves',
    manufacturer: 'Pfizer India',
    price: 48,
    mrp: 55,
    discountPercent: 13,
    prescriptionRequired: false,
    rating: 4.88,
    ratingCount: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 280,
    description: 'Helps in boosting energy metabolism, immunity, treating mouth ulcers, and improving skin texture.'
  },
  {
    id: 'med-22',
    brandName: 'Limcee 500mg Vitamin C Chewable',
    genericName: 'Ascorbic Acid (100mg) + Sodium Ascorbate (450mg)',
    form: 'tablet',
    strength: '1 Strip (15 Chewables)',
    category: 'must_haves',
    manufacturer: 'Abbott Healthcare',
    price: 24,
    mrp: 28,
    discountPercent: 14,
    prescriptionRequired: false,
    rating: 4.93,
    ratingCount: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 350,
    description: 'Tasty orange chewable Vitamin C tablets for antioxidant support, radiant skin, and daily immunity.'
  },
  {
    id: 'med-23',
    brandName: 'Evion 400 Vitamin E Capsules',
    genericName: 'Tocopheryl Acetate (Vitamin E) IP 400mg',
    form: 'capsule',
    strength: '1 Strip (10 Capsules)',
    category: 'skin_care',
    manufacturer: 'Procter & Gamble',
    price: 36,
    mrp: 40,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.91,
    ratingCount: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 220,
    description: 'Essential Vitamin E for deep skin nourishment, hair nourishment, and healthy cell growth.'
  },

  // --- SKINCARE & BODY ESSENTIALS ---
  {
    id: 'med-1',
    brandName: 'Cetaphil Gentle Skin Cleanser',
    genericName: 'Hydrating Face Wash for Sensitive Skin',
    form: 'cleanser',
    strength: '125ml Bottle',
    category: 'skin_care',
    manufacturer: 'Galderma India',
    price: 341,
    mrp: 428,
    discountPercent: 20,
    prescriptionRequired: false,
    rating: 4.8,
    ratingCount: 1420,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 45,
    description: 'Dermatologist-recommended soap-free gentle cleanser for dry to normal, sensitive skin.'
  },
  {
    id: 'med-2',
    brandName: 'CeraVe Moisturising Lotion',
    genericName: 'Essential Ceramides + Hyaluronic Acid',
    form: 'lotion',
    strength: '473ml Dispenser Bottle',
    category: 'skin_care',
    manufacturer: "L'Oréal India",
    price: 1440,
    mrp: 1600,
    discountPercent: 10,
    prescriptionRequired: false,
    rating: 4.9,
    ratingCount: 2310,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-5984687b8764?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 28,
    description: 'Lightweight daily moisturizer with 3 essential ceramides for 24-hour barrier hydration.'
  },

  // --- CHRONIC & HEART CARE (PRESCRIPTION) ---
  {
    id: 'med-4',
    brandName: 'Telma 40',
    genericName: 'Telmisartan Tablets IP 40mg',
    form: 'tablet',
    strength: '1 Strip (15 Tablets)',
    category: 'chronic_care',
    manufacturer: 'Glenmark Pharmaceuticals',
    price: 185,
    mrp: 210,
    discountPercent: 12,
    prescriptionRequired: true,
    rating: 4.85,
    ratingCount: 650,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 95,
    description: 'Angiotensin receptor blocker used for primary hypertension and cardiovascular risk reduction.'
  },
  {
    id: 'med-5',
    brandName: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    form: 'tablet',
    strength: '1 Strip (10 Tablets)',
    category: 'medicines',
    manufacturer: 'GSK India',
    price: 204,
    mrp: 232,
    discountPercent: 12,
    prescriptionRequired: true,
    rating: 4.9,
    ratingCount: 520,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 60,
    description: 'Broad-spectrum penicillin antibiotic for bacterial respiratory, skin, and ENT infections.'
  },
  {
    id: 'med-24',
    brandName: 'Glycomet GP2 Tablet',
    genericName: 'Glimepiride (2mg) + Metformin (500mg)',
    form: 'tablet',
    strength: '1 Strip (15 Tablets)',
    category: 'chronic_care',
    manufacturer: 'USV Private Limited',
    price: 198,
    mrp: 230,
    discountPercent: 14,
    prescriptionRequired: true,
    rating: 4.82,
    ratingCount: 910,
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    stockQuantity: 110,
    description: 'Dual anti-diabetic medicine prescribed for glycemic control in Type 2 Diabetes Mellitus.'
  }
];

export const initialPharmacies: Pharmacy[] = [
  {
    id: 'pharma-1',
    name: 'Apollo 24|7 Express Pharmacy',
    address: 'A-14, Green Park Main Market, New Delhi',
    distanceKm: 0.8,
    rating: 4.8,
    isOpen24x7: true,
    phone: '+91 11 4165 8899',
    estimatedDeliveryMins: 25,
    deliveryFee: 0,
    operatingHours: '24 Hours (All 7 Days)',
    deliveryRadiusKm: 8.5,
    licenseNumber: 'DL-2026-PHA-88192'
  },
  {
    id: 'pharma-2',
    name: 'MedPlus Superstore & Pharmacy',
    address: 'Shop 4, C-Block Commercial Complex, Hauz Khas',
    distanceKm: 1.4,
    rating: 4.6,
    isOpen24x7: false,
    phone: '+91 11 2686 4411',
    estimatedDeliveryMins: 35,
    deliveryFee: 29,
    operatingHours: '08:00 AM - 11:00 PM',
    deliveryRadiusKm: 6.0,
    licenseNumber: 'DL-2025-PHA-41029'
  },
  {
    id: 'pharma-3',
    name: 'Tata 1mg Neighborhood Chemist',
    address: 'SCF 18, Sector 14 Urban Estate',
    distanceKm: 2.1,
    rating: 4.7,
    isOpen24x7: true,
    phone: '+91 11 2625 9900',
    estimatedDeliveryMins: 30,
    deliveryFee: 0
  }
];

export const initialPharmacyOrders: PharmacyOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'QA-ORD-9021',
    patientProfileId: 'usr-101',
    patientName: 'Arjun Sharma',
    pharmacyId: 'pharma-1',
    pharmacyName: 'Apollo 24|7 Express Pharmacy',
    items: [
      {
        medicineId: 'med-3',
        medicineName: 'Montair LC (10mg / 5mg)',
        genericName: 'Montelukast Sodium + Levocetirizine',
        strength: '10mg / 5mg',
        form: 'tablet',
        quantity: 2,
        unitPrice: 204,
        mrp: 255,
        totalPrice: 408,
        requiresPrescription: true
      },
      {
        medicineId: 'med-1',
        medicineName: 'Cetaphil Gentle Skin Cleanser (125ml)',
        genericName: 'Hydrating Face Wash',
        strength: '125ml',
        form: 'cleanser',
        quantity: 1,
        unitPrice: 341,
        mrp: 428,
        totalPrice: 341,
        requiresPrescription: false
      }
    ],
    subtotal: 749,
    discountAmount: 134,
    deliveryFee: 0,
    totalAmount: 749,
    deliveryType: 'delivery',
    deliveryAddress: 'Flat 402, Heritage Heights, Green Park, New Delhi',
    status: 'out_for_delivery',
    requiresPrescription: true,
    prescriptionDocumentId: 'doc-1',
    prescriptionFileName: 'Prescription_Dr_Ananya_Aug2026.pdf',
    prescriptionVerified: true,
    estimatedDeliveryTime: 'Arriving in ~15 mins',
    createdAt: '2026-08-27T03:30:00.000Z',
    paymentMethod: 'upi',
    paymentStatus: 'paid'
  }
];

export const initialMedicationSchedules: MedicationSchedule[] = [
  {
    id: 'sched-1',
    patientProfileId: 'usr-101',
    patientName: 'Arjun Sharma',
    medicineName: 'Montair LC',
    genericName: 'Montelukast Sodium (10mg) + Levocetirizine (5mg)',
    strength: '10mg / 5mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Night)',
    timing: 'bedtime',
    timesOfDay: ['21:30'],
    startDate: '2026-08-01',
    isChronic: false,
    endDate: '2026-09-15',
    initialQuantity: 30,
    remainingQuantity: 8,
    refillThreshold: 5,
    instructions: 'Take with warm water before sleeping. Do not drive immediately after.',
    colorTag: '#0d9488',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Ananya Roy (Pulmonologist)',
    prescriptionReference: 'Rx #QA-2026-901',
    notes: 'Seasonal allergic rhinitis management.',
    reminderEnabled: true,
  },
  {
    id: 'sched-2',
    patientProfileId: 'fam-1',
    patientName: 'Savitri Sharma (Mother)',
    medicineName: 'Telma 40',
    genericName: 'Telmisartan Tablets IP',
    strength: '40mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Morning)',
    timing: 'after_food',
    timesOfDay: ['08:30'],
    startDate: '2025-01-01',
    isChronic: true,
    initialQuantity: 60,
    remainingQuantity: 4,
    refillThreshold: 7,
    instructions: 'Check Blood Pressure weekly. Keep recorded in the log.',
    colorTag: '#0284c7',
    isActive: true,
    status: 'refill_required',
    prescribingDoctor: 'Dr. Rajesh Kumar (Cardiologist)',
    prescriptionReference: 'Rx #MED-2025-442',
    notes: 'Primary hypertension management.',
    reminderEnabled: true,
  },
  {
    id: 'sched-3',
    patientProfileId: 'fam-2',
    patientName: 'Ramesh Sharma (Father)',
    medicineName: 'Glycomet-GP 1',
    genericName: 'Metformin Hydrochloride (500mg) + Glimepiride (1mg)',
    strength: '500mg / 1mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Twice Daily (Morning, Night)',
    timing: 'before_food',
    timesOfDay: ['08:00', '20:00'],
    startDate: '2024-06-01',
    isChronic: true,
    initialQuantity: 60,
    remainingQuantity: 18,
    refillThreshold: 10,
    instructions: 'Take 15 minutes before breakfast and dinner. Do not skip meals.',
    colorTag: '#d97706',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Sunita Rao (Endocrinologist)',
    prescriptionReference: 'Rx #DIA-2024-108',
    notes: 'Type 2 Diabetes Mellitus glycemic control.',
    reminderEnabled: true,
  },
  {
    id: 'sched-4',
    patientProfileId: 'fam-1',
    patientName: 'Savitri Sharma (Mother)',
    medicineName: 'Shelcal 500',
    genericName: 'Calcium Carbonate (1250mg eq to Calcium 500mg) + Vitamin D3 (250 IU)',
    strength: '500mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Afternoon)',
    timing: 'after_food',
    timesOfDay: ['13:30'],
    startDate: '2025-03-15',
    isChronic: true,
    initialQuantity: 30,
    remainingQuantity: 12,
    refillThreshold: 5,
    instructions: 'Take after lunch with a glass of water.',
    colorTag: '#16a34a',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Rajesh Kumar (Cardiologist)',
    prescriptionReference: 'Rx #MED-2025-442',
    notes: 'Bone density support.',
    reminderEnabled: true,
  },
  {
    id: 'sched-5',
    patientProfileId: 'fam-2',
    patientName: 'Ramesh Sharma (Father)',
    medicineName: 'Ecosprin 75',
    genericName: 'Aspirin Gastro-resistant Tablets IP (75mg)',
    strength: '75mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Night)',
    timing: 'after_food',
    timesOfDay: ['20:30'],
    startDate: '2024-04-10',
    isChronic: true,
    initialQuantity: 30,
    remainingQuantity: 3,
    refillThreshold: 5,
    instructions: 'Take after dinner. Essential for cardio-vascular health and anti-platelet therapy.',
    colorTag: '#e11d48',
    isActive: true,
    status: 'refill_required',
    prescribingDoctor: 'Dr. Ananya Roy (Cardiologist)',
    prescriptionReference: 'Rx #CAR-2024-991',
    notes: 'Post-angioplasty daily blood thinner.',
    reminderEnabled: true,
  },
  {
    id: 'sched-6',
    patientProfileId: 'fam-1',
    patientName: 'Savitri Sharma (Mother)',
    medicineName: 'Thyronorm 50mcg',
    genericName: 'Thyroxine Sodium Tablets IP (50mcg)',
    strength: '50mcg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Early Morning)',
    timing: 'empty_stomach',
    timesOfDay: ['06:30'],
    startDate: '2023-11-01',
    isChronic: true,
    initialQuantity: 100,
    remainingQuantity: 24,
    refillThreshold: 15,
    instructions: 'Take first thing in the morning with plain water. Wait 45 mins before tea/coffee.',
    colorTag: '#9333ea',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Sunita Rao (Endocrinologist)',
    prescriptionReference: 'Rx #THY-2023-712',
    notes: 'Hypothyroidism maintenance therapy.',
    reminderEnabled: true,
  },
  {
    id: 'sched-7',
    patientProfileId: 'fam-2',
    patientName: 'Ramesh Sharma (Father)',
    medicineName: 'Atorva 20',
    genericName: 'Atorvastatin Tablets IP (20mg)',
    strength: '20mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Night)',
    timing: 'bedtime',
    timesOfDay: ['21:00'],
    startDate: '2024-04-10',
    isChronic: true,
    initialQuantity: 30,
    remainingQuantity: 9,
    refillThreshold: 7,
    instructions: 'Take at night before sleep for optimal lipid lipid regulation.',
    colorTag: '#2563eb',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Ananya Roy (Cardiologist)',
    prescriptionReference: 'Rx #CAR-2024-991',
    notes: 'Hyperlipidemia and cholesterol management.',
    reminderEnabled: true,
  },
  {
    id: 'sched-8',
    patientProfileId: 'fam-3',
    patientName: 'Ananya Sharma (Daughter)',
    medicineName: 'Zincovit Syrup',
    genericName: 'Multivitamin, Multimineral & Zinc Suspension',
    strength: '200ml',
    form: 'syrup',
    unit: 'ml',
    dosage: '5ml Syrup',
    doseQuantity: 5,
    frequency: 'Once Daily (Morning)',
    timing: 'after_food',
    timesOfDay: ['09:00'],
    startDate: '2026-07-01',
    isChronic: false,
    initialQuantity: 200,
    remainingQuantity: 45,
    refillThreshold: 30,
    instructions: 'Shake well before use. Take 5ml after breakfast for daily immunity.',
    colorTag: '#f59e0b',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Sneha Agrawal (Pediatrician)',
    prescriptionReference: 'Rx #PED-2026-302',
    notes: 'Childhood growth, appetite, and immunity booster.',
    reminderEnabled: true,
  },
  {
    id: 'sched-9',
    patientProfileId: 'fam-1',
    patientName: 'Savitri Sharma (Mother)',
    medicineName: 'Pantocid 40',
    genericName: 'Pantoprazole Gastro-resistant Tablets IP (40mg)',
    strength: '40mg',
    form: 'tablet',
    unit: 'tablets',
    dosage: '1 Tablet',
    doseQuantity: 1,
    frequency: 'Once Daily (Morning)',
    timing: 'empty_stomach',
    timesOfDay: ['07:30'],
    startDate: '2025-01-01',
    isChronic: true,
    initialQuantity: 30,
    remainingQuantity: 2,
    refillThreshold: 5,
    instructions: 'Take 30 minutes before breakfast to prevent GERD and gastritis.',
    colorTag: '#059669',
    isActive: true,
    status: 'refill_required',
    prescribingDoctor: 'Dr. Rajesh Kumar (Cardiologist)',
    prescriptionReference: 'Rx #MED-2025-442',
    notes: 'Acid reflux and gastric mucosal protection.',
    reminderEnabled: true,
  },
  {
    id: 'sched-10',
    patientProfileId: 'usr-101',
    patientName: 'Arjun Sharma',
    medicineName: 'Becosules Z',
    genericName: 'B-Complex Forte with Vitamin C and Zinc',
    strength: 'Capsules',
    form: 'capsule',
    unit: 'capsules',
    dosage: '1 Capsule',
    doseQuantity: 1,
    frequency: 'Once Daily (Afternoon)',
    timing: 'after_food',
    timesOfDay: ['14:00'],
    startDate: '2026-06-15',
    isChronic: false,
    initialQuantity: 30,
    remainingQuantity: 14,
    refillThreshold: 5,
    instructions: 'Take with lunch. Improves energy metabolism and stamina.',
    colorTag: '#ea580c',
    isActive: true,
    status: 'active',
    prescribingDoctor: 'Dr. Vikram Seth (General Physician)',
    prescriptionReference: 'Rx #GEN-2026-119',
    notes: 'Daily nutritional vitality and stress management.',
    reminderEnabled: true,
  }
];

export const initialMedicationLogs: MedicationLog[] = [
  {
    id: 'log-1',
    scheduleId: 'sched-2',
    medicineName: 'Telma 40',
    scheduledTime: 'Today, 08:30 AM',
    takenTime: '08:32 AM',
    status: 'taken'
  },
  {
    id: 'log-2',
    scheduleId: 'sched-3',
    medicineName: 'Glycomet-GP 1',
    scheduledTime: 'Today, 08:00 AM',
    takenTime: '08:05 AM',
    status: 'taken'
  },
  {
    id: 'log-3',
    scheduleId: 'sched-4',
    medicineName: 'Shelcal 500',
    scheduledTime: 'Today, 01:30 PM',
    status: 'pending'
  },
  {
    id: 'log-4',
    scheduleId: 'sched-1',
    medicineName: 'Montair LC',
    scheduledTime: 'Today, 09:30 PM',
    status: 'pending'
  },
  {
    id: 'log-5',
    scheduleId: 'sched-3',
    medicineName: 'Glycomet-GP 1',
    scheduledTime: 'Today, 08:00 PM',
    status: 'pending'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    appointmentNumber: 'QA-APT-2026-901',
    doctorId: 'doc-1',
    doctorName: 'Dr. Ananya Roy',
    doctorSpecialty: 'Cardiologist',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    patientProfileId: 'fam-1',
    patientName: 'Savitri Sharma (Mother)',
    hospitalName: 'Apollo Heart Institute',
    dateTime: 'Tomorrow at 11:00 AM',
    type: 'in_person',
    status: 'confirmed',
    tokenNumber: 8,
    currentQueueToken: 4,
    symptoms: 'Routine 6-month hypertensive cardiac checkup and 2D-Echocardiogram review.',
    consultationFee: 1200,
    paymentStatus: 'paid'
  },
  {
    id: 'apt-2',
    appointmentNumber: 'QA-APT-2026-882',
    doctorId: 'doc-2',
    doctorName: 'Dr. Rajesh Deshmukh',
    doctorSpecialty: 'Endocrinologist',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    patientProfileId: 'fam-2',
    patientName: 'Ramesh Sharma (Father)',
    hospitalName: 'Fortis Health Center',
    dateTime: 'Saturday, 30 Aug at 03:00 PM',
    type: 'video_teleconsult',
    status: 'booked',
    symptoms: 'Quarterly HbA1c titration and fasting glucose management.',
    meetingLink: 'https://telehealth.quickaarogya.in/room/dr-rajesh-deshmukh-882',
    consultationFee: 1000,
    paymentStatus: 'paid'
  }
];

export const initialMedicalDocuments: MedicalDocument[] = [
  {
    id: 'doc-rec-1',
    patientProfileId: 'usr-101',
    patientName: 'Arjun Sharma',
    category: 'prescription',
    title: 'Allergy & Bronchial Care Prescription',
    doctorOrLabName: 'Dr. Vivek Mehra, MBBS',
    date: '2026-08-01',
    fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    fileSizeBytes: 1420000,
    tags: ['Prescription', 'Asthma', 'Montair LC', 'Cipla'],
    isAiExtracted: true,
    extractedSummary: 'Rx: Montair LC 1 tab OD at night x 45 days. Steam inhalation twice daily. Avoid cold food items.'
  },
  {
    id: 'doc-rec-2',
    patientProfileId: 'fam-2',
    patientName: 'Ramesh Sharma (Father)',
    category: 'lab_report',
    title: 'Comprehensive Diabetic & Lipid Profile',
    doctorOrLabName: 'Dr. Lal PathLabs',
    date: '2026-07-28',
    fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
    fileSizeBytes: 2150000,
    tags: ['HbA1c', 'Lipid Profile', 'Creatinine', 'Fasting Blood Sugar'],
    isAiExtracted: true,
    extractedSummary: 'HbA1c measured at 6.8% (Good diabetic control). Total Cholesterol slightly elevated at 214 mg/dL. Renal function normal.'
  },
  {
    id: 'doc-rec-3',
    patientProfileId: 'fam-1',
    patientName: 'Savitri Sharma (Mother)',
    category: 'radiology_scan',
    title: 'Digital X-Ray Bilateral Knees (AP/Lat)',
    doctorOrLabName: 'Mahajan Imaging Center',
    date: '2026-05-14',
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    fileSizeBytes: 4800000,
    tags: ['X-Ray', 'Knee', 'Osteoarthritis', 'Grade 2'],
    isAiExtracted: true,
    extractedSummary: 'Grade II medial joint space narrowing in both knees. Mild subchondral sclerosis. Recommended physiotherapeutic quad exercises.'
  }
];

export const initialBiomarkers: BiomarkerReportItem[] = [
  {
    id: 'bio-1',
    documentId: 'doc-rec-2',
    biomarker: 'HbA1c (Glycated Hemoglobin)',
    value: '6.8',
    numericValue: 6.8,
    unit: '%',
    refMin: 4.0,
    refMax: 5.6,
    status: 'high',
    explanation: 'Indicates good average blood sugar control over the past 3 months for a diabetic patient.'
  },
  {
    id: 'bio-2',
    documentId: 'doc-rec-2',
    biomarker: 'Fasting Blood Sugar (FBS)',
    value: '112',
    numericValue: 112,
    unit: 'mg/dL',
    refMin: 70,
    refMax: 99,
    status: 'high',
    explanation: 'Slightly above normal fasting threshold; maintain current low-glycemic dietary regimen.'
  },
  {
    id: 'bio-3',
    documentId: 'doc-rec-2',
    biomarker: 'Serum Creatinine',
    value: '0.92',
    numericValue: 0.92,
    unit: 'mg/dL',
    refMin: 0.7,
    refMax: 1.3,
    status: 'normal',
    explanation: 'Kidney filtration efficiency is healthy and within optimal range.'
  },
  {
    id: 'bio-4',
    documentId: 'doc-rec-2',
    biomarker: 'Total Cholesterol',
    value: '214',
    numericValue: 214,
    unit: 'mg/dL',
    refMin: 125,
    refMax: 200,
    status: 'high',
    explanation: 'Mild elevation. Recommended brisk walking 30 mins daily and reducing saturated fats.'
  }
];

export const initialLabTests: LabTest[] = [
  {
    id: 'lab-1',
    name: 'Comprehensive Health & Full Body Checkup (72 Tests)',
    category: 'Health Checkup Package',
    sampleType: 'Blood & Urine',
    fastingRequiredHours: 10,
    reportTurnaroundHours: 24,
    price: 1499,
    mrp: 3200,
    description: 'Includes Complete Hemogram, Lipid Profile, Liver Function (LFT), Kidney Function (KFT), Thyroid (TSH), Blood Sugar, and Urine Routine.',
    parametersCount: 72
  },
  {
    id: 'lab-2',
    name: 'HbA1c & Average Blood Glucose Panel',
    category: 'Blood Test',
    sampleType: 'Blood',
    fastingRequiredHours: 0,
    reportTurnaroundHours: 12,
    price: 399,
    mrp: 650,
    description: 'Gold standard test for 3-month glycemic history. No fasting required.',
    parametersCount: 3
  },
  {
    id: 'lab-3',
    name: 'Vitamin D (25-OH) & Vitamin B12 Vitality Duo',
    category: 'Blood Test',
    sampleType: 'Blood',
    fastingRequiredHours: 0,
    reportTurnaroundHours: 18,
    price: 899,
    mrp: 1800,
    description: 'Crucial for bone density, nerve vitality, fatigue diagnosis, and immunity evaluation.',
    parametersCount: 2
  },
  {
    id: 'lab-4',
    name: 'Complete Lipid & Cardiovascular Risk Profile',
    category: 'Blood Test',
    sampleType: 'Blood',
    fastingRequiredHours: 12,
    reportTurnaroundHours: 12,
    price: 450,
    mrp: 850,
    description: 'Measures Total Cholesterol, HDL Good Cholesterol, LDL Bad Cholesterol, Triglycerides, and VLDL.',
    parametersCount: 8
  }
];

export const initialLabBookings: LabBooking[] = [
  {
    id: 'lb-101',
    bookingNumber: 'QA-LAB-2026-441',
    patientProfileId: 'fam-2',
    patientName: 'Ramesh Sharma (Father)',
    testNames: ['Comprehensive Health & Full Body Checkup (72 Tests)'],
    totalPrice: 1499,
    collectionType: 'home_collection',
    scheduledDate: '2026-08-29',
    scheduledTimeSlot: '07:30 AM - 08:30 AM',
    status: 'collector_assigned',
    phlebotomistName: 'Sunil Kumar (Certified Phlebotomist)',
    phlebotomistPhone: '+91 98711 55667'
  }
];

export const initialHealthcareExpenses: HealthcareExpense[] = [
  {
    id: 'exp-1',
    patientProfileId: 'usr-101',
    title: 'Monthly Chronic Medicines (Telma + Glycomet + Shelcal)',
    category: 'medicines',
    amount: 1420,
    date: '2026-08-15',
    paymentMethod: 'UPI',
    isInsuranceClaimed: false
  },
  {
    id: 'exp-2',
    patientProfileId: 'fam-1',
    title: 'Dr. Ananya Roy Cardiology Consultation',
    category: 'doctor_consultation',
    amount: 1200,
    date: '2026-08-10',
    paymentMethod: 'Credit Card',
    isInsuranceClaimed: true,
    claimStatus: 'settled'
  },
  {
    id: 'exp-3',
    patientProfileId: 'fam-2',
    title: 'Quarterly Full Body Preventive Lab Test',
    category: 'lab_diagnostics',
    amount: 1499,
    date: '2026-07-28',
    paymentMethod: 'UPI',
    isInsuranceClaimed: false
  }
];

export const initialInboxItems: HealthInboxItem[] = [
  {
    id: 'inbox-1',
    userId: 'usr-101',
    category: 'appointments',
    type: 'appointment',
    title: 'Appointment Tomorrow with Dr. Ananya Roy',
    message: 'Follow-up consultation scheduled for tomorrow at 11:00 AM at Apollo Hospital. Token queue allocated: #8.',
    priority: 'important',
    isRead: false,
    timestamp: '20 mins ago',
    createdAt: '2026-08-27T05:00:00Z',
    relatedEntity: {
      type: 'appointment',
      id: 'apt-1',
      name: 'Dr. Ananya Roy (Cardiologist)'
    },
    action: {
      label: 'View Appointment',
      url: '/appointments'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-27T05:00:00Z' },
      { channel: 'push', status: 'delivered', provider: 'FCM Gateway', sentAt: '2026-08-27T05:00:01Z' },
      { channel: 'sms', status: 'delivered', provider: 'Twilio SMS', sentAt: '2026-08-27T05:00:02Z' },
      { channel: 'whatsapp', status: 'delivered', provider: 'Meta Cloud API', sentAt: '2026-08-27T05:00:02Z' }
    ],
    familyMemberId: 'fam-1',
    familyMemberName: 'Savitri Sharma (Mother)'
  },
  {
    id: 'inbox-2',
    userId: 'usr-101',
    category: 'medicines',
    type: 'refill_alert',
    title: 'Medicine Running Low: Telma 40',
    message: 'Only 4 tablets remaining for Savitri Sharma. At 1 tablet daily, medication will run out in ~4 days.',
    priority: 'important',
    isRead: false,
    timestamp: '45 mins ago',
    createdAt: '2026-08-27T04:30:00Z',
    relatedEntity: {
      type: 'medication',
      id: 'sched-2',
      name: 'Telma 40 (Telmisartan 40mg)'
    },
    action: {
      label: '1-Click Refill',
      url: '/medicines'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-27T04:30:00Z' },
      { channel: 'push', status: 'delivered', provider: 'FCM Gateway', sentAt: '2026-08-27T04:30:01Z' }
    ],
    familyMemberId: 'fam-1',
    familyMemberName: 'Savitri Sharma (Mother)'
  },
  {
    id: 'inbox-3',
    userId: 'usr-101',
    category: 'family',
    type: 'family_attention',
    title: 'Family Member Needs Attention: High Blood Pressure Alert',
    message: 'Savitri Sharma reported elevated blood pressure reading (148/92 mmHg). Review care plan and medication adherence.',
    priority: 'urgent',
    isRead: false,
    timestamp: '1 hour ago',
    createdAt: '2026-08-27T04:15:00Z',
    relatedEntity: {
      type: 'family_member',
      id: 'fam-1',
      name: 'Savitri Sharma'
    },
    action: {
      label: 'View Care Circle',
      url: '/family'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-27T04:15:00Z' },
      { channel: 'push', status: 'delivered', provider: 'FCM High Priority', sentAt: '2026-08-27T04:15:01Z' },
      { channel: 'sms', status: 'delivered', provider: 'Twilio SMS', sentAt: '2026-08-27T04:15:02Z' }
    ],
    familyMemberId: 'fam-1',
    familyMemberName: 'Savitri Sharma'
  },
  {
    id: 'inbox-4',
    userId: 'usr-101',
    category: 'medicines',
    type: 'dose_reminder',
    title: 'Medicine Due: Glycomet-GP 1',
    message: 'Morning dose (1 Tablet before breakfast) scheduled at 08:00 AM for Ramesh Sharma.',
    priority: 'important',
    isRead: false,
    timestamp: '2 hours ago',
    createdAt: '2026-08-27T03:30:00Z',
    relatedEntity: {
      type: 'medication',
      id: 'sched-3',
      name: 'Glycomet-GP 1'
    },
    action: {
      label: 'Log Dose',
      url: '/medicines'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-27T03:30:00Z' },
      { channel: 'push', status: 'delivered', provider: 'FCM Gateway', sentAt: '2026-08-27T03:30:01Z' }
    ],
    familyMemberId: 'fam-2',
    familyMemberName: 'Ramesh Sharma (Father)'
  },
  {
    id: 'inbox-5',
    userId: 'usr-101',
    category: 'appointments',
    type: 'appointment_cancelled',
    title: 'Appointment Cancelled: Dr. Siddharth Verma',
    message: 'Orthopedic consultation on 2026-09-06 was cancelled. Fee refund of ₹1,100 has been initiated to your UPI account.',
    priority: 'urgent',
    isRead: false,
    timestamp: '3 hours ago',
    createdAt: '2026-08-27T02:00:00Z',
    relatedEntity: {
      type: 'appointment',
      id: 'apt-cancelled-1',
      name: 'Dr. Siddharth Verma'
    },
    action: {
      label: 'Reschedule Visit',
      url: '/appointments'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-27T02:00:00Z' },
      { channel: 'sms', status: 'delivered', provider: 'Twilio SMS', sentAt: '2026-08-27T02:00:01Z' },
      { channel: 'email', status: 'delivered', provider: 'Resend Mail', sentAt: '2026-08-27T02:00:02Z' }
    ]
  },
  {
    id: 'inbox-6',
    userId: 'usr-101',
    category: 'tests',
    type: 'lab_ready',
    title: 'Lab Report Available: Comprehensive Diabetic & Lipid Profile',
    message: 'Diagnostic test results from Dr. Lal PathLabs are verified and ready for download in your Medical Vault.',
    priority: 'normal',
    isRead: true,
    timestamp: 'Yesterday',
    createdAt: '2026-08-26T14:00:00Z',
    relatedEntity: {
      type: 'lab_booking',
      id: 'lb-101',
      name: 'Comprehensive Diabetic & Lipid Profile'
    },
    action: {
      label: 'View Lab Report',
      url: '/records'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-26T14:00:00Z' },
      { channel: 'whatsapp', status: 'delivered', provider: 'Meta Cloud API', sentAt: '2026-08-26T14:00:01Z' }
    ],
    familyMemberId: 'fam-2',
    familyMemberName: 'Ramesh Sharma'
  },
  {
    id: 'inbox-7',
    userId: 'usr-101',
    category: 'records',
    type: 'prescription_uploaded',
    title: 'Prescription Uploaded: Allergy & Bronchial Care',
    message: 'Dr. Vivek Mehra added an encrypted digital prescription (Rx #QA-2026-901) for Montair LC 10mg.',
    priority: 'normal',
    isRead: true,
    timestamp: '2 days ago',
    createdAt: '2026-08-25T11:00:00Z',
    relatedEntity: {
      type: 'document',
      id: 'doc-rec-1',
      name: 'Allergy & Bronchial Care Prescription'
    },
    action: {
      label: 'Open Document Vault',
      url: '/records'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-25T11:00:00Z' },
      { channel: 'email', status: 'delivered', provider: 'Resend Mail', sentAt: '2026-08-25T11:00:02Z' }
    ]
  },
  {
    id: 'inbox-8',
    userId: 'usr-101',
    category: 'appointments',
    type: 'followup_due',
    title: 'Follow-Up Due: Quarterly HbA1c Review',
    message: '3 months since last endocrinology consultation with Dr. Rajesh Deshmukh. Schedule your routine glycemic review.',
    priority: 'important',
    isRead: false,
    timestamp: '3 days ago',
    createdAt: '2026-08-24T09:00:00Z',
    relatedEntity: {
      type: 'appointment',
      id: 'apt-2',
      name: 'Dr. Rajesh Deshmukh'
    },
    action: {
      label: 'Book Consultation',
      url: '/doctors'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-24T09:00:00Z' },
      { channel: 'push', status: 'delivered', provider: 'FCM Gateway', sentAt: '2026-08-24T09:00:01Z' }
    ],
    familyMemberId: 'fam-2',
    familyMemberName: 'Ramesh Sharma'
  },
  {
    id: 'inbox-9',
    userId: 'usr-101',
    category: 'orders',
    type: 'order_delivered',
    title: 'Medicine Order Delivered: Apollo 24|7 Express',
    message: 'Order #QA-ORD-9021 containing Montair LC and Cetaphil Gentle Cleanser was delivered to Flat 402, Heritage Heights.',
    priority: 'normal',
    isRead: true,
    timestamp: '4 days ago',
    createdAt: '2026-08-23T16:20:00Z',
    relatedEntity: {
      type: 'order',
      id: 'ord-101',
      name: 'Order #QA-ORD-9021'
    },
    action: {
      label: 'View Order Details',
      url: '/pharmacies'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-23T16:20:00Z' },
      { channel: 'sms', status: 'delivered', provider: 'Twilio SMS', sentAt: '2026-08-23T16:20:01Z' }
    ]
  },
  {
    id: 'inbox-10',
    userId: 'usr-101',
    category: 'payments',
    type: 'payment_completed',
    title: 'Payment Completed: ₹1,200 via UPI',
    message: 'Consultation fee for Dr. Ananya Roy confirmed. Official Section 80D tax invoice is available.',
    priority: 'normal',
    isRead: true,
    timestamp: '5 days ago',
    createdAt: '2026-08-22T10:15:00Z',
    relatedEntity: {
      type: 'payment',
      id: 'pay-101',
      name: 'UPI Ref: 681920381029'
    },
    action: {
      label: 'Download Invoice',
      url: '/expenses'
    },
    deliveryChannels: [
      { channel: 'in_app', status: 'delivered', sentAt: '2026-08-22T10:15:00Z' },
      { channel: 'email', status: 'delivered', provider: 'Resend Mail', sentAt: '2026-08-22T10:15:02Z' }
    ]
  }
];

export const initialNotifications: HealthNotification[] = initialInboxItems.map(item => ({
  id: item.id,
  type: item.type,
  title: item.title,
  message: item.message,
  time: item.timestamp,
  isRead: item.isRead,
  actionUrl: item.action?.url,
  urgency: item.priority === 'urgent' ? 'high' : item.priority === 'important' ? 'medium' : 'low',
  category: item.category,
  priority: item.priority,
  relatedEntity: item.relatedEntity,
  actionLabel: item.action?.label
}));


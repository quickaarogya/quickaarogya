import {
  PrismaClient,
  Role,
  Gender,
  BloodGroup,
  AppointmentStatus,
  AppointmentType,
  OrderStatus,
  OrganizationType,
  VerificationStatus,
  StaffRole
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Starting database seed with Organizations, StaffMembers, Doctors & Pharmacies...');

  // 1. Clean existing data in logical cascade order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.medicineInventory.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Multi-Vendor Organizations
  // Organization 1: Super Specialty Hospital
  const orgHospital = await prisma.organization.create({
    data: {
      id: 'org-apollo-hospital',
      name: 'Apollo Hospital & Heart Center',
      type: OrganizationType.HOSPITAL,
      verificationStatus: VerificationStatus.VERIFIED
    }
  });

  // Organization 2: Independent Doctor Practice
  const orgDoctorClinic = await prisma.organization.create({
    data: {
      id: 'org-dr-vivek-clinic',
      name: 'Dr. Vivek Mehra Lifestyle & Diabetes Clinic',
      type: OrganizationType.INDEPENDENT_DOCTOR,
      verificationStatus: VerificationStatus.VERIFIED
    }
  });

  // Organization 3: Retail Pharmacy Store
  const orgPharmacy = await prisma.organization.create({
    data: {
      id: 'org-apollo-pharmacy',
      name: 'Apollo 24|7 Express Pharmacy Sector 18',
      type: OrganizationType.PHARMACY,
      verificationStatus: VerificationStatus.VERIFIED
    }
  });

  // 3. Create Primary Patient User
  const patientUser = await prisma.user.create({
    data: {
      id: 'auth-001',
      email: 'arjun.sharma@example.com',
      phoneNumber: '+91 98765 43210',
      role: Role.PATIENT,
      isPhoneVerified: true,
      isEmailVerified: true,
      profile: {
        create: {
          id: 'usr-101',
          firstName: 'Arjun',
          lastName: 'Sharma',
          dateOfBirth: new Date('1988-06-14'),
          gender: Gender.MALE,
          bloodGroup: BloodGroup.B_POSITIVE,
          abhaId: '14-5521-9874-2201',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          heightCm: 176.0,
          weightKg: 74.5,
        }
      }
    }
  });

  // 4. Create Doctor Users & Profiles (owned by Organizations)
  const doctorUser1 = await prisma.user.create({
    data: {
      id: 'auth-doc-1',
      email: 'dr.ananya@aarogya.health',
      phoneNumber: '+91 98765 00001',
      role: Role.DOCTOR,
      isPhoneVerified: true,
      isEmailVerified: true,
      doctorProfile: {
        create: {
          id: 'doc-1',
          organizationId: orgHospital.id,
          medicalLicenseNumber: 'MCI-2012-78901',
          specialization: 'Cardiologist',
          subSpecialties: ['Interventional Cardiology', 'Heart Failure Specialist'],
          qualification: 'MBBS, MD (Medicine), DM (Cardiology)',
          experienceYears: 14,
          consultationFee: 1200.0,
          ratingAverage: 4.9,
          ratingCount: 184,
          isVerified: true,
          about: 'Senior Consultant Interventional Cardiologist specializing in preventive cardiology and hypertension.'
        }
      },
      staffMemberships: {
        create: {
          id: 'staff-1',
          organizationId: orgHospital.id,
          role: StaffRole.DOCTOR,
          isActive: true
        }
      }
    }
  });

  const doctorUser2 = await prisma.user.create({
    data: {
      id: 'auth-doc-2',
      email: 'dr.vivek@aarogya.health',
      phoneNumber: '+91 98765 00002',
      role: Role.DOCTOR,
      isPhoneVerified: true,
      isEmailVerified: true,
      doctorProfile: {
        create: {
          id: 'doc-2',
          organizationId: orgDoctorClinic.id,
          medicalLicenseNumber: 'DMC-2015-44219',
          specialization: 'General Physician',
          subSpecialties: ['Internal Medicine', 'Diabetology'],
          qualification: 'MBBS, MD (General Medicine)',
          experienceYears: 10,
          consultationFee: 700.0,
          ratingAverage: 4.8,
          ratingCount: 142,
          isVerified: true,
          about: 'Specialist in chronic lifestyle disease management, diabetes reversal and geriatric care.'
        }
      },
      staffMemberships: {
        create: {
          id: 'staff-3',
          organizationId: orgDoctorClinic.id,
          role: StaffRole.DOCTOR,
          isActive: true
        }
      }
    }
  });

  // Staff User 3: Hospital Administrator
  const staffUserHospital = await prisma.user.create({
    data: {
      id: 'auth-staff-apollo',
      email: 'pooja.admin@apollo.org',
      phoneNumber: '+91 98765 00003',
      role: Role.HOSPITAL_ADMIN,
      isPhoneVerified: true,
      isEmailVerified: true,
      profile: {
        create: {
          id: 'usr-staff-apollo',
          firstName: 'Pooja',
          lastName: 'Nair',
          dateOfBirth: new Date('1990-04-12'),
          gender: Gender.FEMALE,
          bloodGroup: BloodGroup.A_POSITIVE,
          abhaId: '14-8822-1100-9922'
        }
      },
      staffMemberships: {
        create: {
          id: 'staff-2',
          organizationId: orgHospital.id,
          role: StaffRole.ORG_ADMIN,
          isActive: true
        }
      }
    }
  });

  // Staff User 4: Pharmacist
  const staffUserPharmacy = await prisma.user.create({
    data: {
      id: 'auth-staff-pharmacy',
      email: 'rohan.pharma@apollo.org',
      phoneNumber: '+91 98765 00004',
      role: Role.PHARMACY_ADMIN,
      isPhoneVerified: true,
      isEmailVerified: true,
      profile: {
        create: {
          id: 'usr-staff-pharmacy',
          firstName: 'Rohan',
          lastName: 'Gupta',
          dateOfBirth: new Date('1992-08-25'),
          gender: Gender.MALE,
          bloodGroup: BloodGroup.O_POSITIVE,
          abhaId: '14-7733-4411-8833'
        }
      },
      staffMemberships: {
        create: {
          id: 'staff-4',
          organizationId: orgPharmacy.id,
          role: StaffRole.PHARMACIST,
          isActive: true
        }
      }
    }
  });

  // 5. Create Hospitals (Directory entity)
  const hospitalApollo = await prisma.hospital.create({
    data: {
      id: 'hosp-1',
      name: 'Apollo Hospital & Heart Center',
      registrationNumber: 'HOSP-APOLLO-001',
      type: 'Super Specialty',
      addressLine1: 'Sarita Vihar, Mathura Road',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110076',
      latitude: 28.5398,
      longitude: 77.2917,
      emergencyHelpline: '+91 11 2692 5858',
      hasEmergencyService: true,
      facilities: ['24x7 Emergency', 'Cath Lab', 'ICU', 'Trauma Care', 'Blood Bank'],
      isVerified: true
    }
  });

  // 6. Create Pharmacies (owned by Organization)
  const pharmacyApollo = await prisma.pharmacy.create({
    data: {
      id: 'pharma-1',
      organizationId: orgPharmacy.id,
      name: 'Apollo 24|7 Express Pharmacy',
      drugLicenseNumber: 'DL-20B-18492',
      phone: '+91 1800 200 2424',
      email: 'express@apollopharmacy.org',
      addressLine1: 'Block C, Sector 18',
      city: 'Noida',
      postalCode: '201301',
      latitude: 28.5708,
      longitude: 77.3261,
      deliveryRadiusKm: 15.0,
      isOpen24x7: true,
      isVerified: true
    }
  });

  // 7. Create Medicines & Inventories
  const medDolo = await prisma.medicine.create({
    data: {
      id: 'med-3',
      brandName: 'Dolo 650',
      genericName: 'Paracetamol 650mg',
      dosageForm: 'tablet',
      strength: '650mg',
      manufacturer: 'Micro Labs Ltd',
      prescriptionRequired: false,
      sideEffects: ['Nausea'],
      contraindications: ['Severe Liver Disease'],
      inventory: {
        create: {
          id: 'inv-3',
          pharmacyId: 'pharma-1',
          batchNumber: 'DL2026-11',
          expiryDate: new Date('2028-01-31'),
          stockQuantity: 500,
          mrp: 35.0,
          sellingPrice: 30.0,
          isAvailable: true
        }
      }
    }
  });

  // 8. Create Initial Appointment
  await prisma.appointment.create({
    data: {
      id: 'apt-seed-1',
      appointmentNumber: 'QA-APT-2026-8801',
      doctorId: 'doc-1',
      patientProfileId: 'usr-101',
      hospitalId: 'hosp-1',
      appointmentDatetime: new Date('2026-08-30T10:30:00Z'),
      type: AppointmentType.IN_PERSON,
      status: AppointmentStatus.CONFIRMED,
      tokenNumber: 8,
      currentQueueToken: 5,
      symptoms: 'Quarterly hypertension checkup and review of blood pressure records.',
      consultationFee: 1200.0
    }
  });

  console.log('[Seed] Database seeded with 3 Organizations, 4 StaffMembers, Doctors & Pharmacies linked!');
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

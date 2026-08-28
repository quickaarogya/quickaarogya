import prisma from '@/lib/prisma';
import {
  OrganizationType,
  VerificationStatus,
  StaffRole as PrismaStaffRole,
  Role as PrismaRole,
  Gender as PrismaGender,
  BloodGroup as PrismaBloodGroup
} from '@prisma/client';
import { hashPassword } from './auth.service';
import { AarogyaStorage } from '@/lib/storage';

export type StaffRole = 'ORG_ADMIN' | 'DOCTOR' | 'PHARMACIST' | 'RECEPTIONIST' | 'LAB_TECH' | PrismaStaffRole;

export const StaffRole = {
  ORG_ADMIN: 'ORG_ADMIN' as const,
  DOCTOR: 'DOCTOR' as const,
  PHARMACIST: 'PHARMACIST' as const,
  RECEPTIONIST: 'RECEPTIONIST' as const,
  LAB_TECH: 'LAB_TECH' as const
};

export type StaffPermission =
  | 'VIEW_ORGANIZATION'
  | 'MANAGE_ORGANIZATION'
  | 'MANAGE_STAFF'
  | 'VIEW_APPOINTMENTS'
  | 'MANAGE_APPOINTMENTS'
  | 'CREATE_PRESCRIPTION'
  | 'VIEW_ORDERS'
  | 'MANAGE_ORDERS'
  | 'MANAGE_INVENTORY'
  | 'VIEW_LAB_BOOKINGS'
  | 'MANAGE_LAB_BOOKINGS'
  | 'VIEW_FINANCIALS';

export const ROLE_DEFAULT_PERMISSIONS: Record<StaffRole, StaffPermission[]> = {
  [StaffRole.ORG_ADMIN]: [
    'VIEW_ORGANIZATION',
    'MANAGE_ORGANIZATION',
    'MANAGE_STAFF',
    'VIEW_APPOINTMENTS',
    'MANAGE_APPOINTMENTS',
    'CREATE_PRESCRIPTION',
    'VIEW_ORDERS',
    'MANAGE_ORDERS',
    'MANAGE_INVENTORY',
    'VIEW_LAB_BOOKINGS',
    'MANAGE_LAB_BOOKINGS',
    'VIEW_FINANCIALS'
  ],
  [StaffRole.DOCTOR]: [
    'VIEW_ORGANIZATION',
    'VIEW_APPOINTMENTS',
    'MANAGE_APPOINTMENTS',
    'CREATE_PRESCRIPTION'
  ],
  [StaffRole.RECEPTIONIST]: [
    'VIEW_ORGANIZATION',
    'VIEW_APPOINTMENTS'
  ],
  [StaffRole.PHARMACIST]: [
    'VIEW_ORGANIZATION',
    'VIEW_ORDERS',
    'MANAGE_ORDERS',
    'MANAGE_INVENTORY'
  ],
  [StaffRole.LAB_TECH]: [
    'VIEW_ORGANIZATION',
    'VIEW_LAB_BOOKINGS',
    'MANAGE_LAB_BOOKINGS'
  ]
};

export interface VendorOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  verificationStatus: VerificationStatus;
  licenseNumber?: string | null;
  licenseDocumentUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  staffCount?: number;
}

export interface VendorStaffMember {
  id: string;
  userId: string;
  organizationId: string;
  role: StaffRole;
  isActive: boolean;
  user?: {
    email: string;
    phoneNumber: string;
  };
  organization?: VendorOrganization;
  customPermissions?: StaffPermission[];
}

// In-Memory fallback store for vendor applications & staff memberships
const MEMORY_APPLICATIONS: VendorOrganization[] = [
  {
    id: 'org-apollo-hospital',
    name: 'Apollo Hospital & Heart Center',
    type: OrganizationType.HOSPITAL,
    verificationStatus: VerificationStatus.VERIFIED,
    licenseNumber: 'HOSP-APOLLO-001',
    contactEmail: 'contact@apollo.org',
    contactPhone: '+91 11 2692 5858',
    createdAt: '2026-01-01T00:00:00Z',
    staffCount: 2
  },
  {
    id: 'org-dr-vivek-clinic',
    name: 'Dr. Vivek Mehra Lifestyle & Diabetes Clinic',
    type: OrganizationType.INDEPENDENT_DOCTOR,
    verificationStatus: VerificationStatus.VERIFIED,
    licenseNumber: 'DMC-2015-44219',
    contactEmail: 'dr.vivek@aarogya.health',
    contactPhone: '+91 98765 00002',
    createdAt: '2026-01-01T00:00:00Z',
    staffCount: 1
  },
  {
    id: 'org-apollo-pharmacy',
    name: 'Apollo 24|7 Express Pharmacy Sector 18',
    type: OrganizationType.PHARMACY,
    verificationStatus: VerificationStatus.VERIFIED,
    licenseNumber: 'DL-20B-18492',
    contactEmail: 'express@apollopharmacy.org',
    contactPhone: '+91 1800 200 2424',
    createdAt: '2026-01-01T00:00:00Z',
    staffCount: 1
  },
  {
    id: 'org-medplus-pharmacy',
    name: 'MedPlus Superstore & Pharmacy Hauz Khas',
    type: OrganizationType.PHARMACY,
    verificationStatus: VerificationStatus.VERIFIED,
    licenseNumber: 'DL-2025-PHA-41029',
    contactEmail: 'orders@medplusdelhi.com',
    contactPhone: '+91 11 2686 4411',
    createdAt: '2026-01-01T00:00:00Z',
    staffCount: 1
  }
];

const MEMORY_STAFF: VendorStaffMember[] = [
  {
    id: 'staff-1',
    userId: 'auth-doc-1',
    organizationId: 'org-apollo-hospital',
    role: StaffRole.DOCTOR,
    isActive: true,
    organization: MEMORY_APPLICATIONS[0]
  },
  {
    id: 'staff-2',
    userId: 'auth-staff-apollo',
    organizationId: 'org-apollo-hospital',
    role: StaffRole.ORG_ADMIN,
    isActive: true,
    organization: MEMORY_APPLICATIONS[0]
  },
  {
    id: 'staff-3',
    userId: 'auth-doc-2',
    organizationId: 'org-dr-vivek-clinic',
    role: StaffRole.DOCTOR,
    isActive: true,
    organization: MEMORY_APPLICATIONS[1]
  },
  {
    id: 'staff-4',
    userId: 'auth-staff-pharmacy',
    organizationId: 'org-apollo-pharmacy',
    role: StaffRole.PHARMACIST,
    isActive: true,
    organization: MEMORY_APPLICATIONS[2],
    customPermissions: ['VIEW_FINANCIALS']
  },
  {
    id: 'staff-5',
    userId: 'auth-staff-medplus',
    organizationId: 'org-medplus-pharmacy',
    role: StaffRole.PHARMACIST,
    isActive: true,
    organization: MEMORY_APPLICATIONS[3],
    customPermissions: ['VIEW_FINANCIALS']
  }
];

export class OrganizationService {
  static async getOrganizations(filters?: {
    type?: OrganizationType;
    status?: VerificationStatus;
  }): Promise<VendorOrganization[]> {
    try {
      if (typeof window === 'undefined') {
        const whereClause: any = {};
        if (filters?.type) whereClause.type = filters.type;
        if (filters?.status) whereClause.verificationStatus = filters.status;

        const dbOrgs = await prisma.organization.findMany({
          where: whereClause,
          include: { staffMembers: true },
          orderBy: { createdAt: 'desc' }
        });

        if (dbOrgs && dbOrgs.length > 0) {
          return dbOrgs.map(o => ({
            id: o.id,
            name: o.name,
            type: o.type,
            verificationStatus: o.verificationStatus,
            licenseNumber: o.licenseNumber,
            licenseDocumentUrl: o.licenseDocumentUrl,
            contactEmail: o.contactEmail,
            contactPhone: o.contactPhone,
            rejectionReason: o.rejectionReason,
            createdAt: o.createdAt.toISOString(),
            staffCount: o.staffMembers.length
          }));
        }
      }
    } catch (err) {
      console.warn('[OrganizationService] Prisma getOrganizations error:', err);
    }

    let filtered = [...MEMORY_APPLICATIONS];
    if (filters?.type) filtered = filtered.filter(o => o.type === filters.type);
    if (filters?.status) filtered = filtered.filter(o => o.verificationStatus === filters.status);
    return filtered;
  }

  static async getOrganizationById(id: string): Promise<VendorOrganization | null> {
    const orgs = await this.getOrganizations();
    return orgs.find(o => o.id === id) || null;
  }

  static async getPendingApplications(): Promise<VendorOrganization[]> {
    return this.getOrganizations({ status: VerificationStatus.PENDING });
  }

  static async applyForPartnership(data: {
    organizationName: string;
    organizationType: OrganizationType;
    adminFullName: string;
    adminEmail: string;
    adminPhone: string;
    adminPasswordPlain: string;
    licenseNumber: string;
    licenseDocumentUrl?: string;
    specializationOrCategory?: string;
    addressLine1?: string;
    city?: string;
  }): Promise<{
    organization: VendorOrganization;
    staffMember: VendorStaffMember;
    userId: string;
  }> {
    const orgId = `org-${Date.now()}`;
    const userId = `usr-admin-${Date.now()}`;
    const staffId = `staff-${Date.now()}`;
    const cleanEmail = data.adminEmail.trim().toLowerCase();

    const names = data.adminFullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || 'Admin';

    let userRole: PrismaRole = PrismaRole.HOSPITAL_ADMIN;
    let staffRole: StaffRole = StaffRole.ORG_ADMIN;

    if (data.organizationType === OrganizationType.INDEPENDENT_DOCTOR) {
      userRole = PrismaRole.DOCTOR;
      staffRole = StaffRole.DOCTOR;
    } else if (data.organizationType === OrganizationType.PHARMACY) {
      userRole = PrismaRole.PHARMACY_ADMIN;
      staffRole = StaffRole.PHARMACIST;
    } else if (data.organizationType === OrganizationType.LAB) {
      userRole = PrismaRole.LAB_ADMIN;
      staffRole = StaffRole.LAB_TECH;
    }

    const newOrg: VendorOrganization = {
      id: orgId,
      name: data.organizationName,
      type: data.organizationType,
      verificationStatus: VerificationStatus.PENDING,
      licenseNumber: data.licenseNumber,
      licenseDocumentUrl: data.licenseDocumentUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500',
      contactEmail: cleanEmail,
      contactPhone: data.adminPhone,
      createdAt: new Date().toISOString(),
      staffCount: 1
    };

    const newStaff: VendorStaffMember = {
      id: staffId,
      userId,
      organizationId: orgId,
      role: staffRole,
      isActive: true,
      user: {
        email: cleanEmail,
        phoneNumber: data.adminPhone
      },
      organization: newOrg
    };

    try {
      if (typeof window === 'undefined') {
        await prisma.organization.create({
          data: {
            id: orgId,
            name: data.organizationName,
            type: data.organizationType,
            verificationStatus: VerificationStatus.PENDING,
            licenseNumber: data.licenseNumber,
            licenseDocumentUrl: newOrg.licenseDocumentUrl,
            contactEmail: cleanEmail,
            contactPhone: data.adminPhone
          }
        });

        const createdUser = await prisma.user.create({
          data: {
            id: userId,
            email: cleanEmail,
            phoneNumber: data.adminPhone,
            role: userRole,
            passwordHash: hashPassword(data.adminPasswordPlain),
            profile: {
              create: {
                id: `prof-${userId}`,
                firstName,
                lastName,
                dateOfBirth: new Date('1985-05-15'),
                gender: PrismaGender.OTHER,
                bloodGroup: PrismaBloodGroup.UNKNOWN
              }
            },
            staffMemberships: {
              create: {
                id: staffId,
                organizationId: orgId,
                role: staffRole,
                isActive: true
              }
            }
          }
        });

        if (data.organizationType === OrganizationType.INDEPENDENT_DOCTOR) {
          await prisma.doctor.create({
            data: {
              id: `doc-${Date.now()}`,
              userId: createdUser.id,
              organizationId: orgId,
              medicalLicenseNumber: data.licenseNumber,
              specialization: data.specializationOrCategory || 'General Practice',
              subSpecialties: ['Family Medicine'],
              qualification: 'MBBS',
              experienceYears: 5,
              consultationFee: 500,
              isVerified: false,
              about: `Practitioner at ${data.organizationName}`
            }
          });
        }

        if (data.organizationType === OrganizationType.PHARMACY) {
          await prisma.pharmacy.create({
            data: {
              id: `pharma-${Date.now()}`,
              organizationId: orgId,
              name: data.organizationName,
              drugLicenseNumber: data.licenseNumber,
              phone: data.adminPhone,
              email: cleanEmail,
              addressLine1: data.addressLine1 || 'Main Market',
              city: data.city || 'New Delhi',
              postalCode: '110001',
              isVerified: false
            }
          });
        }
      }
    } catch (err) {
      console.warn('[OrganizationService] Prisma applyForPartnership error:', err);
    }

    // Also sync to client/fallback storage
    if (data.organizationType === OrganizationType.INDEPENDENT_DOCTOR) {
      AarogyaStorage.addDoctor({
        id: `doc-${orgId}`,
        organizationId: orgId,
        name: data.adminFullName.startsWith('Dr.') ? data.adminFullName : `Dr. ${data.adminFullName}`,
        title: 'Senior Specialist',
        specialization: data.specializationOrCategory || 'Cardiology',
        qualification: 'MBBS, MD',
        experienceYears: 6,
        consultationFee: 600,
        ratingAverage: 5.0,
        ratingCount: 1,
        patientCount: '10+ Patients',
        reviewsCount: '1 Verified Review',
        languages: ['English', 'Hindi'],
        consultationTypes: ['in_person', 'video_teleconsult'],
        hospitalName: data.organizationName,
        hospitalId: orgId,
        clinicAddress: data.addressLine1 || 'Main Clinic Road',
        avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        availableSlots: ['10:00 AM', '11:00 AM', '04:00 PM'],
        isVerified: false,
        about: `Practitioner at ${data.organizationName}`
      });
    } else if (data.organizationType === OrganizationType.PHARMACY) {
      AarogyaStorage.addPharmacy({
        id: `pharma-${orgId}`,
        organizationId: orgId,
        name: data.organizationName,
        address: `${data.addressLine1 || 'Main Road'}, ${data.city || 'Delhi'}`,
        distanceKm: 2.0,
        rating: 4.8,
        isOpen24x7: true,
        phone: data.adminPhone,
        estimatedDeliveryMins: 30,
        deliveryFee: 25,
        deliveryRadiusKm: 10,
        isVerified: false
      });
    }

    MEMORY_APPLICATIONS.unshift(newOrg);
    MEMORY_STAFF.unshift(newStaff);
    return {
      organization: newOrg,
      staffMember: newStaff,
      userId
    };
  }

  static async reviewOrganization(
    organizationId: string,
    decision: 'VERIFIED' | 'REJECTED',
    reviewNotes?: string
  ): Promise<VendorOrganization> {
    const status = decision === 'VERIFIED' ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;

    try {
      if (typeof window === 'undefined') {
        const updated = await prisma.organization.update({
          where: { id: organizationId },
          data: {
            verificationStatus: status,
            rejectionReason: decision === 'REJECTED' ? reviewNotes || 'Documentation failed verification checks' : null
          }
        });

        if (decision === 'VERIFIED') {
          await prisma.doctor.updateMany({
            where: { organizationId },
            data: { isVerified: true }
          });

          await prisma.pharmacy.updateMany({
            where: { organizationId },
            data: { isVerified: true }
          });
        } else if (decision === 'REJECTED') {
          await prisma.doctor.updateMany({
            where: { organizationId },
            data: { isVerified: false }
          });

          await prisma.pharmacy.updateMany({
            where: { organizationId },
            data: { isVerified: false }
          });
        }

        return {
          id: updated.id,
          name: updated.name,
          type: updated.type,
          verificationStatus: updated.verificationStatus,
          licenseNumber: updated.licenseNumber,
          licenseDocumentUrl: updated.licenseDocumentUrl,
          contactEmail: updated.contactEmail,
          contactPhone: updated.contactPhone,
          rejectionReason: updated.rejectionReason,
          createdAt: updated.createdAt.toISOString()
        };
      }
    } catch (err) {
      console.warn('[OrganizationService] Prisma reviewOrganization error:', err);
    }

    // Also sync to client/fallback storage
    if (decision === 'VERIFIED') {
      AarogyaStorage.updateDoctorVerification(organizationId, true);
      AarogyaStorage.updatePharmacyVerification(organizationId, true);
    } else if (decision === 'REJECTED') {
      AarogyaStorage.updateDoctorVerification(organizationId, false);
      AarogyaStorage.updatePharmacyVerification(organizationId, false);
    }

    const org = MEMORY_APPLICATIONS.find(o => o.id === organizationId);
    if (!org) throw new Error(`Organization ${organizationId} not found.`);

    org.verificationStatus = status;
    org.rejectionReason = decision === 'REJECTED' ? reviewNotes || 'Documentation unverified' : null;
    return org;
  }

  static async createOrganization(data: {
    id?: string;
    name: string;
    type: OrganizationType;
    verificationStatus?: VerificationStatus;
  }): Promise<VendorOrganization> {
    const orgId = data.id || `org-${Date.now()}`;
    const status = data.verificationStatus || VerificationStatus.PENDING;

    try {
      if (typeof window === 'undefined') {
        const created = await prisma.organization.create({
          data: {
            id: orgId,
            name: data.name,
            type: data.type,
            verificationStatus: status
          }
        });

        return {
          id: created.id,
          name: created.name,
          type: created.type,
          verificationStatus: created.verificationStatus,
          createdAt: created.createdAt.toISOString()
        };
      }
    } catch (err) {
      console.warn('[OrganizationService] Prisma createOrganization error:', err);
    }

    const created: VendorOrganization = {
      id: orgId,
      name: data.name,
      type: data.type,
      verificationStatus: status,
      createdAt: new Date().toISOString()
    };
    MEMORY_APPLICATIONS.push(created);
    return created;
  }

  static async addStaffMember(data: {
    id?: string;
    userId: string;
    organizationId: string;
    role: StaffRole;
    isActive?: boolean;
    customPermissions?: StaffPermission[];
  }): Promise<VendorStaffMember> {
    const staffId = data.id || `staff-${Date.now()}`;
    const active = data.isActive ?? true;

    try {
      if (typeof window === 'undefined') {
        const created = await prisma.staffMember.create({
          data: {
            id: staffId,
            userId: data.userId,
            organizationId: data.organizationId,
            role: data.role,
            isActive: active
          }
        });

        const member: VendorStaffMember = {
          id: created.id,
          userId: created.userId,
          organizationId: created.organizationId,
          role: created.role,
          isActive: created.isActive,
          customPermissions: data.customPermissions
        };
        MEMORY_STAFF.push(member);
        return member;
      }
    } catch (err) {
      console.warn('[OrganizationService] Prisma addStaffMember error:', err);
    }

    const fallbackMember: VendorStaffMember = {
      id: staffId,
      userId: data.userId,
      organizationId: data.organizationId,
      role: data.role,
      isActive: active,
      customPermissions: data.customPermissions
    };
    MEMORY_STAFF.push(fallbackMember);
    return fallbackMember;
  }

  static async getStaffMembershipsForUser(userId: string): Promise<VendorStaffMember[]> {
    try {
      if (typeof window === 'undefined') {
        const memberships = await prisma.staffMember.findMany({
          where: { userId },
          include: { organization: true }
        });

        if (memberships && memberships.length > 0) {
          return memberships.map(m => ({
            id: m.id,
            userId: m.userId,
            organizationId: m.organizationId,
            role: m.role,
            isActive: m.isActive,
            organization: {
              id: m.organization.id,
              name: m.organization.name,
              type: m.organization.type,
              verificationStatus: m.organization.verificationStatus,
              licenseNumber: m.organization.licenseNumber,
              licenseDocumentUrl: m.organization.licenseDocumentUrl,
              contactEmail: m.organization.contactEmail,
              contactPhone: m.organization.contactPhone,
              rejectionReason: m.organization.rejectionReason,
              createdAt: m.organization.createdAt.toISOString()
            }
          }));
        }
      }
    } catch (err) {
      console.warn('[OrganizationService] Prisma getStaffMembershipsForUser error:', err);
    }

    const localMemberships = MEMORY_STAFF.filter(s => s.userId === userId);
    if (localMemberships.length > 0) {
      return localMemberships;
    }

    // Default seeded fallback for known test users
    if (userId === 'auth-doc-1' || userId === 'usr-doc-1') {
      return [MEMORY_STAFF[0]];
    }

    return [];
  }

  // Strict Vendor Staff Authorization & Cross-Organization Privilege Escalation Guard
  static checkStaffPermission(
    actorUserId: string,
    targetOrganizationId: string,
    requiredPermission: StaffPermission,
    options?: {
      targetDoctorId?: string;
      actorDoctorId?: string;
      customGrantedPermissions?: StaffPermission[];
    }
  ): boolean {
    // 1. Resolve Staff Membership in target organization
    const actorMemberships = MEMORY_STAFF.filter(s => s.userId === actorUserId);
    const membership = actorMemberships.find(m => m.organizationId === targetOrganizationId);

    // 2. Strict Cross-Organization Access Boundary (Prevent BOLA/IDOR)
    if (!membership) {
      throw new Error(
        `403 Forbidden: Access denied. Cross-organization horizontal privilege escalation prevented for user [${actorUserId}] on organization [${targetOrganizationId}].`
      );
    }

    // 3. Active Status Check
    if (!membership.isActive) {
      throw new Error(
        `403 Forbidden: Access denied. Staff membership for user [${actorUserId}] in organization [${targetOrganizationId}] is deactivated.`
      );
    }

    // 4. Role & Least-Privilege Permission Check
    const defaultPerms = ROLE_DEFAULT_PERMISSIONS[membership.role] || [];
    const customPerms = membership.customPermissions || [];
    const allowedPermissions = options?.customGrantedPermissions || [...defaultPerms, ...customPerms];

    if (!allowedPermissions.includes(requiredPermission)) {
      throw new Error(
        `403 Forbidden: Missing required permission [${requiredPermission}] for staff role [${membership.role}] in organization [${targetOrganizationId}].`
      );
    }

    // 5. Doctor Resource-Level Tampering Guard (Doctors can only modify their own clinical consults/prescriptions)
    if (
      membership.role === StaffRole.DOCTOR &&
      options?.targetDoctorId &&
      options?.actorDoctorId &&
      options.targetDoctorId !== options.actorDoctorId &&
      (requiredPermission === 'MANAGE_APPOINTMENTS' || requiredPermission === 'CREATE_PRESCRIPTION')
    ) {
      throw new Error(
        `403 Forbidden: Doctor [${options.actorDoctorId}] is not authorized to modify clinical records of Doctor [${options.targetDoctorId}].`
      );
    }

    return true;
  }
}

export const OrgService = OrganizationService;

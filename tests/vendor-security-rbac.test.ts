import { describe, it, expect } from 'vitest';
import {
  OrgService,
  OrganizationService,
  StaffPermission,
  ROLE_DEFAULT_PERMISSIONS
} from '../src/server/services/organization.service';
import { StaffRole, OrganizationType } from '@prisma/client';

describe('Vendor Security & Cross-Organization RBAC Isolation Tests', () => {
  const orgHospitalA = 'org-apollo-hospital';
  const orgClinicB = 'org-dr-vivek-clinic';
  const orgPharmacyC = 'org-apollo-pharmacy';

  const userAdminHospitalA = 'auth-staff-apollo';
  const userDoctorHospitalA = 'auth-doc-1';
  const userDoctorClinicB = 'auth-doc-2';
  const userPharmacistC = 'auth-staff-pharmacy';

  it('1. should allow ORG_ADMIN full operational authorization within their own organization', () => {
    const adminPermissions: StaffPermission[] = [
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
    ];

    for (const permission of adminPermissions) {
      expect(
        OrgService.checkStaffPermission(userAdminHospitalA, orgHospitalA, permission)
      ).toBe(true);
    }
  });

  it('2. should enforce least-privilege defaults for DOCTOR role and block administrative/financial actions', () => {
    // Authorized Doctor Scopes
    expect(OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'VIEW_ORGANIZATION')).toBe(true);
    expect(OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'VIEW_APPOINTMENTS')).toBe(true);
    expect(OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'MANAGE_APPOINTMENTS')).toBe(true);
    expect(OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'CREATE_PRESCRIPTION')).toBe(true);

    // Blocked Unauthorized Scopes
    expect(() =>
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'MANAGE_STAFF')
    ).toThrow(/Missing required permission \[MANAGE_STAFF\] for staff role \[DOCTOR\]/i);

    expect(() =>
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'MANAGE_ORGANIZATION')
    ).toThrow(/Missing required permission \[MANAGE_ORGANIZATION\] for staff role \[DOCTOR\]/i);

    expect(() =>
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'MANAGE_INVENTORY')
    ).toThrow(/Missing required permission \[MANAGE_INVENTORY\] for staff role \[DOCTOR\]/i);

    expect(() =>
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'VIEW_FINANCIALS')
    ).toThrow(/Missing required permission \[VIEW_FINANCIALS\] for staff role \[DOCTOR\]/i);
  });

  it('3. should enforce least-privilege defaults for RECEPTIONIST role (read-only appointments by default)', async () => {
    const receptionistUserId = `user-receptionist-${Date.now()}`;
    await OrgService.addStaffMember({
      userId: receptionistUserId,
      organizationId: orgHospitalA,
      role: StaffRole.RECEPTIONIST,
      isActive: true
    });

    // Allowed
    expect(OrgService.checkStaffPermission(receptionistUserId, orgHospitalA, 'VIEW_ORGANIZATION')).toBe(true);
    expect(OrgService.checkStaffPermission(receptionistUserId, orgHospitalA, 'VIEW_APPOINTMENTS')).toBe(true);

    // Blocked
    expect(() =>
      OrgService.checkStaffPermission(receptionistUserId, orgHospitalA, 'CREATE_PRESCRIPTION')
    ).toThrow(/Missing required permission \[CREATE_PRESCRIPTION\] for staff role \[RECEPTIONIST\]/i);

    expect(() =>
      OrgService.checkStaffPermission(receptionistUserId, orgHospitalA, 'MANAGE_STAFF')
    ).toThrow(/Missing required permission \[MANAGE_STAFF\] for staff role \[RECEPTIONIST\]/i);

    expect(() =>
      OrgService.checkStaffPermission(receptionistUserId, orgHospitalA, 'MANAGE_INVENTORY')
    ).toThrow(/Missing required permission \[MANAGE_INVENTORY\] for staff role \[RECEPTIONIST\]/i);
  });

  it('4. should enforce least-privilege defaults for PHARMACIST role', () => {
    // Allowed
    expect(OrgService.checkStaffPermission(userPharmacistC, orgPharmacyC, 'VIEW_ORGANIZATION')).toBe(true);
    expect(OrgService.checkStaffPermission(userPharmacistC, orgPharmacyC, 'VIEW_ORDERS')).toBe(true);
    expect(OrgService.checkStaffPermission(userPharmacistC, orgPharmacyC, 'MANAGE_ORDERS')).toBe(true);
    expect(OrgService.checkStaffPermission(userPharmacistC, orgPharmacyC, 'MANAGE_INVENTORY')).toBe(true);

    // Blocked
    expect(() =>
      OrgService.checkStaffPermission(userPharmacistC, orgPharmacyC, 'CREATE_PRESCRIPTION')
    ).toThrow(/Missing required permission \[CREATE_PRESCRIPTION\] for staff role \[PHARMACIST\]/i);

    expect(() =>
      OrgService.checkStaffPermission(userPharmacistC, orgPharmacyC, 'MANAGE_STAFF')
    ).toThrow(/Missing required permission \[MANAGE_STAFF\] for staff role \[PHARMACIST\]/i);
  });

  it('5. CRITICAL: should prevent cross-organization horizontal privilege escalation (Organization A actor -> Organization B)', () => {
    const allPermissions: StaffPermission[] = [
      'VIEW_ORGANIZATION',
      'MANAGE_ORGANIZATION',
      'MANAGE_STAFF',
      'VIEW_APPOINTMENTS',
      'MANAGE_APPOINTMENTS',
      'CREATE_PRESCRIPTION',
      'VIEW_ORDERS',
      'MANAGE_ORDERS',
      'MANAGE_INVENTORY',
      'VIEW_FINANCIALS'
    ];

    // Hospital A Admin attempting access on Clinic B
    for (const permission of allPermissions) {
      expect(() =>
        OrgService.checkStaffPermission(userAdminHospitalA, orgClinicB, permission)
      ).toThrow(/Cross-organization horizontal privilege escalation prevented/i);
    }

    // Clinic B Doctor attempting access on Pharmacy C
    for (const permission of allPermissions) {
      expect(() =>
        OrgService.checkStaffPermission(userDoctorClinicB, orgPharmacyC, permission)
      ).toThrow(/Cross-organization horizontal privilege escalation prevented/i);
    }

    // Malicious external actor
    const hackerUserId = 'user-malicious-actor-999';
    for (const permission of allPermissions) {
      expect(() =>
        OrgService.checkStaffPermission(hackerUserId, orgHospitalA, permission)
      ).toThrow(/Cross-organization horizontal privilege escalation prevented/i);
    }
  });

  it('6. should immediately block deactivated staff members from acting on their organization', async () => {
    const deactivatedStaffId = `user-former-doctor-${Date.now()}`;
    await OrgService.addStaffMember({
      userId: deactivatedStaffId,
      organizationId: orgHospitalA,
      role: StaffRole.DOCTOR,
      isActive: false
    });

    expect(() =>
      OrgService.checkStaffPermission(deactivatedStaffId, orgHospitalA, 'VIEW_APPOINTMENTS')
    ).toThrow(/Staff membership .* is deactivated/i);

    expect(() =>
      OrgService.checkStaffPermission(deactivatedStaffId, orgHospitalA, 'CREATE_PRESCRIPTION')
    ).toThrow(/Staff membership .* is deactivated/i);
  });

  it('7. should prevent doctor resource tampering on another doctor clinical records within the same organization', () => {
    // Doctor 1 attempting to alter Doctor 2 appointment or prescription
    expect(() =>
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'MANAGE_APPOINTMENTS', {
        actorDoctorId: 'doc-1',
        targetDoctorId: 'doc-2'
      })
    ).toThrow(/Doctor \[doc-1\] is not authorized to modify clinical records of Doctor \[doc-2\]/i);

    expect(() =>
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'CREATE_PRESCRIPTION', {
        actorDoctorId: 'doc-1',
        targetDoctorId: 'doc-2'
      })
    ).toThrow(/Doctor \[doc-1\] is not authorized to modify clinical records of Doctor \[doc-2\]/i);

    // Doctor 1 accessing their OWN records is permitted
    expect(
      OrgService.checkStaffPermission(userDoctorHospitalA, orgHospitalA, 'MANAGE_APPOINTMENTS', {
        actorDoctorId: 'doc-1',
        targetDoctorId: 'doc-1'
      })
    ).toBe(true);
  });
});

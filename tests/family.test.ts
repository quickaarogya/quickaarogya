import { describe, it, expect } from 'vitest';
import { FamilyService, CAREGIVER_DEFAULT_PERMISSIONS, STANDARD_FAMILY_PERMISSIONS } from '../src/server/services/family.service';
import { FamilyPermission } from '../src/types';

describe('Phase 6 Family Health Management & Granular Permissions Security Tests', () => {
  it('should support creating family profiles for all required relationships (Parent, Child, Spouse, Relative, Caregiver)', async () => {
    // 1. Parent
    const parent = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Ramesh Sharma',
      relationship: 'parent',
      dateOfBirth: '1954-11-08',
      gender: 'male',
      bloodGroup: 'B+',
      chronicConditions: ['Type 2 Diabetes'],
    });
    expect(parent.relationship).toBe('parent');
    expect(parent.fullName).toBe('Ramesh Sharma');

    // 2. Spouse
    const spouse = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Priya Sharma',
      relationship: 'spouse',
      dateOfBirth: '1990-08-20',
      gender: 'female',
      bloodGroup: 'O+',
    });
    expect(spouse.relationship).toBe('spouse');

    // 3. Child
    const child = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Aarav Sharma',
      relationship: 'child',
      dateOfBirth: '2018-09-12',
      gender: 'male',
      bloodGroup: 'B+',
      vaccinationsDue: [
        { vaccineName: 'MMR Booster (Measles, Mumps, Rubella)', dueDate: '2026-09-15', status: 'due' }
      ]
    });
    expect(child.relationship).toBe('child');
    expect(child.vaccinationsDue?.length).toBe(1);

    // 4. Relative
    const relative = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Suresh Verma',
      relationship: 'relative',
      dateOfBirth: '1975-02-14',
      gender: 'male',
      bloodGroup: 'A+',
    });
    expect(relative.relationship).toBe('relative');

    // 5. Caregiver
    const caregiver = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Nurse Kavita Nair',
      relationship: 'caregiver',
      dateOfBirth: '1988-12-05',
      gender: 'female',
      bloodGroup: 'AB+',
    });
    expect(caregiver.relationship).toBe('caregiver');
  });

  it('should enforce least-privilege restricted access by default for Caregiver relationships', async () => {
    // Adding caregiver without explicit permissions array
    const caregiver = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Anita Caregiver',
      relationship: 'caregiver',
      dateOfBirth: '1992-06-18',
      gender: 'female',
      bloodGroup: 'O+',
    });

    // Caregivers must NOT have unrestricted access by default
    expect(caregiver.permissions).toEqual(CAREGIVER_DEFAULT_PERMISSIONS);
    expect(caregiver.permissions).toContain('VIEW_APPOINTMENTS');
    expect(caregiver.permissions).toContain('VIEW_MEDICATIONS');

    // Must NOT have sensitive records, booking, or financial permissions by default
    expect(caregiver.permissions).not.toContain('VIEW_RECORDS');
    expect(caregiver.permissions).not.toContain('UPLOAD_RECORDS');
    expect(caregiver.permissions).not.toContain('MANAGE_MEDICATIONS');
    expect(caregiver.permissions).not.toContain('VIEW_EXPENSES');
    expect(caregiver.permissions).not.toContain('EMERGENCY_ACCESS');
    expect(caregiver.permissionLevel).toBe('view_only');
  });

  it('should add a new family member with customized granular permissions', async () => {
    const member = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Vikram Sharma',
      relationship: 'sibling',
      dateOfBirth: '1992-04-10',
      gender: 'male',
      bloodGroup: 'B+',
      permissions: [
        'VIEW_APPOINTMENTS',
        'BOOK_APPOINTMENTS',
        'VIEW_MEDICATIONS',
        'VIEW_RECORDS',
      ],
      chronicConditions: ['Migraine'],
    });

    expect(member).toBeDefined();
    expect(member.id).toContain('fam-');
    expect(member.fullName).toBe('Vikram Sharma');
    expect(member.permissions).toContain('VIEW_RECORDS');
    expect(member.permissions).not.toContain('MANAGE_MEDICATIONS');
  });

  it('should update and revoke specific permission scopes dynamically', async () => {
    const members = await FamilyService.getFamilyMembers('usr-101');
    const member = members[0];

    // Grant only view appointments and records
    const restrictedPerms: FamilyPermission[] = ['VIEW_APPOINTMENTS', 'VIEW_RECORDS'];
    const updated = await FamilyService.updatePermissions(member.id, restrictedPerms);

    expect(updated.permissions).toEqual(restrictedPerms);
    expect(updated.permissions.includes('MANAGE_MEDICATIONS')).toBe(false);
    expect(updated.permissions.includes('VIEW_EXPENSES')).toBe(false);
  });

  it('should prevent horizontal privilege escalation across all 8 granular scopes when not granted', async () => {
    const member = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Restricted Dependent',
      relationship: 'relative',
      dateOfBirth: '1980-01-01',
      gender: 'male',
      bloodGroup: 'O+',
      permissions: ['VIEW_APPOINTMENTS'], // Only VIEW_APPOINTMENTS granted
    });

    // Allowed
    expect(FamilyService.checkPermission('usr-101', member.id, 'VIEW_APPOINTMENTS')).toBe(true);

    // Blocked: Horizontal Privilege Escalation on Appointments Booking
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'BOOK_APPOINTMENTS')
    ).toThrow(/Missing required permission \[BOOK_APPOINTMENTS\]/i);

    // Blocked: Horizontal Privilege Escalation on Medication Viewing
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'VIEW_MEDICATIONS')
    ).toThrow(/Missing required permission \[VIEW_MEDICATIONS\]/i);

    // Blocked: Horizontal Privilege Escalation on Medication Mutating
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'MANAGE_MEDICATIONS')
    ).toThrow(/Missing required permission \[MANAGE_MEDICATIONS\]/i);

    // Blocked: Horizontal Privilege Escalation on Medical Records Viewing
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'VIEW_RECORDS')
    ).toThrow(/Missing required permission \[VIEW_RECORDS\]/i);

    // Blocked: Horizontal Privilege Escalation on Medical Records Uploading
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'UPLOAD_RECORDS')
    ).toThrow(/Missing required permission \[UPLOAD_RECORDS\]/i);

    // Blocked: Horizontal Privilege Escalation on Expense Viewing
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'VIEW_EXPENSES')
    ).toThrow(/Missing required permission \[VIEW_EXPENSES\]/i);

    // Blocked: Horizontal Privilege Escalation on Emergency QR Access
    expect(() =>
      FamilyService.checkPermission('usr-101', member.id, 'EMERGENCY_ACCESS')
    ).toThrow(/Missing required permission \[EMERGENCY_ACCESS\]/i);
  });

  it('should prevent cross-family unauthorized profile access (prevent IDOR/BOLA)', async () => {
    const member = await FamilyService.addFamilyMember('usr-101', {
      fullName: 'Private Member',
      relationship: 'parent',
      dateOfBirth: '1960-01-01',
      gender: 'female',
      bloodGroup: 'A+',
    });

    // Unrelated actor 'usr-999' attempting access to usr-101's dependent
    expect(() =>
      FamilyService.checkPermission('usr-999', member.id, 'VIEW_RECORDS')
    ).toThrow(/Access denied. Horizontal privilege escalation prevented/i);

    expect(() =>
      FamilyService.checkPermission('usr-999', member.id, 'VIEW_APPOINTMENTS')
    ).toThrow(/Access denied. Horizontal privilege escalation prevented/i);
  });

  it('should aggregate unified family health overview feed with all key dashboard examples', async () => {
    const overview = await FamilyService.getFamilyHealthOverview('usr-101');

    expect(overview).toBeDefined();
    expect(overview.totalMembers).toBeGreaterThan(0);
    expect(overview.feedItems.length).toBeGreaterThan(0);

    // 1. Medicine refill reminder (e.g. Dad: Medicine refill in 3 days)
    const hasRefillAlert = overview.feedItems.some(f => f.type === 'refill_alert');
    expect(hasRefillAlert).toBe(true);

    // 2. Upcoming follow-up appointment (e.g. Mom: Follow-up tomorrow)
    const hasAppointment = overview.feedItems.some(f => f.type === 'appointment');
    expect(hasAppointment).toBe(true);

    // 3. Child vaccination reminder (e.g. Child: Vaccination reminder)
    const hasVaccination = overview.feedItems.some(f => f.type === 'vaccination');
    expect(hasVaccination).toBe(true);
  });
});


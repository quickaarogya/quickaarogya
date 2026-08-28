import { describe, it, expect } from 'vitest';
import { OrganizationService } from '../src/server/services/organization.service';
import { AppointmentService } from '../src/server/services/appointment.service';
import { PharmacyService } from '../src/server/services/pharmacy.service';
import { OrganizationType, VerificationStatus, StaffRole } from '@prisma/client';

describe('Vendor Verification Lifecycle & Patient Visibility Isolation Tests', () => {
  const timestamp = Date.now();
  const testDoctorOrgName = `Sunrise Heart Clinic ${timestamp}`;
  const testDoctorLicense = `MCI-2026-TEST-${timestamp}`;
  let doctorOrgId: string;

  const testPharmacyOrgName = `Metro 24x7 Meds ${timestamp}`;
  const testPharmacyLicense = `DL-20B-TEST-${timestamp}`;
  let pharmacyOrgId: string;

  it('1. should submit a new Doctor Partner application in PENDING verification status', async () => {
    const result = await OrganizationService.applyForPartnership({
      organizationName: testDoctorOrgName,
      organizationType: OrganizationType.INDEPENDENT_DOCTOR,
      adminFullName: 'Dr. Sameer Sen',
      adminEmail: `dr.sameer.${timestamp}@sunrise.health`,
      adminPhone: '+91 98111 22334',
      adminPasswordPlain: 'SecurePass@123',
      licenseNumber: testDoctorLicense,
      licenseDocumentUrl: 'https://documents.aarogya.health/verified/license_doc.pdf',
      specializationOrCategory: 'Cardiology'
    });

    expect(result.organization).toBeDefined();
    expect(result.organization.name).toBe(testDoctorOrgName);
    expect(result.organization.verificationStatus).toBe(VerificationStatus.PENDING);
    expect(result.organization.licenseNumber).toBe(testDoctorLicense);

    expect(result.staffMember).toBeDefined();
    expect(result.staffMember.role).toBe(StaffRole.DOCTOR);
    expect(result.staffMember.organizationId).toBe(result.organization.id);

    doctorOrgId = result.organization.id;
  });

  it('2. should NOT display unverified (PENDING) Doctor in patient-facing /doctors search', async () => {
    const patientVisibleDoctors = await AppointmentService.getDoctors({
      searchQuery: testDoctorOrgName
    });

    const unverifiedFound = patientVisibleDoctors.find(
      d => d.name.includes('Sameer') || d.hospitalName.includes(testDoctorOrgName)
    );

    expect(unverifiedFound).toBeUndefined();
  });

  it('3. should submit a new Pharmacy Partner application in PENDING verification status', async () => {
    const result = await OrganizationService.applyForPartnership({
      organizationName: testPharmacyOrgName,
      organizationType: OrganizationType.PHARMACY,
      adminFullName: 'Vikram Seth',
      adminEmail: `vikram.${timestamp}@metromeds.in`,
      adminPhone: '+91 98222 33445',
      adminPasswordPlain: 'PharmaPass@123',
      licenseNumber: testPharmacyLicense,
      licenseDocumentUrl: 'https://documents.aarogya.health/verified/drug_license.pdf',
      addressLine1: 'Shop 12, Commercial Complex',
      city: 'Gurugram'
    });

    expect(result.organization).toBeDefined();
    expect(result.organization.verificationStatus).toBe(VerificationStatus.PENDING);
    expect(result.staffMember.role).toBe(StaffRole.PHARMACIST);

    pharmacyOrgId = result.organization.id;
  });

  it('4. should NOT display unverified (PENDING) Pharmacy in patient-facing /pharmacies search', async () => {
    const patientVisiblePharmacies = await PharmacyService.getPharmacies({
      searchQuery: testPharmacyOrgName
    });

    const unverifiedFound = patientVisiblePharmacies.find(
      p => p.name.includes(testPharmacyOrgName)
    );

    expect(unverifiedFound).toBeUndefined();
  });

  it('5. should list pending partner applications in Admin review queue', async () => {
    const pendingList = await OrganizationService.getPendingApplications();
    expect(pendingList.length).toBeGreaterThanOrEqual(1);

    const docOrg = pendingList.find(o => o.id === doctorOrgId);
    expect(docOrg).toBeDefined();
    expect(docOrg?.verificationStatus).toBe(VerificationStatus.PENDING);
  });

  it('6. should approve and VERIFY Doctor organization, immediately exposing it to patient searches', async () => {
    const approvedOrg = await OrganizationService.reviewOrganization(doctorOrgId, 'VERIFIED');
    expect(approvedOrg.verificationStatus).toBe(VerificationStatus.VERIFIED);

    const patientVisibleDoctors = await AppointmentService.getDoctors({
      searchQuery: testDoctorOrgName
    });

    const verifiedDoctor = patientVisibleDoctors.find(
      d => d.hospitalName.includes(testDoctorOrgName) || d.name.includes('Sameer')
    );

    expect(verifiedDoctor).toBeDefined();
    expect(verifiedDoctor?.isVerified).toBe(true);
  });

  it('7. should handle REJECTION flow and properly record compliance rejection reason', async () => {
    const rejectionReason = 'State Pharmacy Council renewal certificate expired.';
    const rejectedOrg = await OrganizationService.reviewOrganization(
      pharmacyOrgId,
      'REJECTED',
      rejectionReason
    );

    expect(rejectedOrg.verificationStatus).toBe(VerificationStatus.REJECTED);
    expect(rejectedOrg.rejectionReason).toBe(rejectionReason);

    // Verify still invisible in patient search
    const patientVisiblePharmacies = await PharmacyService.getPharmacies({
      searchQuery: testPharmacyOrgName
    });

    const rejectedFound = patientVisiblePharmacies.find(
      p => p.name.includes(testPharmacyOrgName)
    );
    expect(rejectedFound).toBeUndefined();
  });
});

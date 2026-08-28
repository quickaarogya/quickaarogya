import { describe, it, expect, beforeEach } from 'vitest';
import { SettlementService } from '../src/server/services/settlement.service';
import { AppointmentService } from '../src/server/services/appointment.service';
import { PharmacyService } from '../src/server/services/pharmacy.service';
import { AarogyaStorage } from '../src/lib/storage';

describe('Vendor Financial Escrow Ledger & Platform Commission Engine Tests', () => {
  const orgHospital = 'org-apollo-hospital';
  const staffHospital = 'auth-staff-apollo';
  const doctorApollo = 'doc-1';

  const orgPharmacy = 'org-apollo-pharmacy';
  const staffPharmacy = 'auth-staff-pharmacy';
  const pharmacyApollo = 'pharma-1';

  const orgMedplus = 'org-medplus-pharmacy';
  const staffMedplus = 'auth-staff-medplus';

  beforeEach(() => {
    AarogyaStorage.clearEscrowLedger();
    AarogyaStorage.clearInbox();
  });

  it('1. should apply correct default platform commission rules per organization type', () => {
    expect(SettlementService.getCommissionRate(orgHospital)).toBe(10); // 10%
    expect(SettlementService.getCommissionRate(orgPharmacy)).toBe(8);   // 8%
    expect(SettlementService.getCommissionRate(orgMedplus)).toBe(8);    // 8%
    expect(SettlementService.getCommissionRate('org-unknown')).toBe(10); // 10% default
  });

  it('2. should automatically record an escrow ledger entry when an appointment consultation is completed', async () => {
    // 1. Book Appointment
    const apt = await AppointmentService.bookAppointment({
      doctorId: doctorApollo,
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: '2026-09-15',
      timeSlot: '10:00 AM',
      type: 'in_person',
      consultationFee: 800,
      symptoms: 'Cardiology consultation'
    });

    // 2. Doctor Marks Consultation Completed
    const completed = await AppointmentService.updateDoctorAppointmentStatus(
      'auth-doc-1',
      doctorApollo,
      orgHospital,
      apt.id,
      'completed',
      'Hypertension stage 1. Prescribed Telma 40mg.'
    );

    expect(completed.status).toBe('completed');

    // 3. Inspect Escrow Ledger
    const entries = AarogyaStorage.getEscrowLedgerEntries();
    const aptEntry = entries.find(e => e.referenceId === apt.id);

    expect(aptEntry).toBeDefined();
    expect(aptEntry?.organizationId).toBe(orgHospital);
    expect(aptEntry?.referenceType).toBe('appointment');
    expect(aptEntry?.grossAmount).toBe(800);
    expect(aptEntry?.platformCommissionRate).toBe(10);
    expect(aptEntry?.platformCommissionAmount).toBe(80); // 10% of 800
    expect(aptEntry?.netVendorPayable).toBe(720);         // 800 - 80
    expect(aptEntry?.status).toBe('in_escrow');
    expect(aptEntry?.transactionToken).toMatch(/^TXN-ESCROW-APT-/);
  });

  it('3. should automatically record an escrow ledger entry when a pharmacy order is marked delivered', async () => {
    // 1. Place Pharmacy Order
    const order = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      pharmacyId: pharmacyApollo,
      items: [
        { medicineId: 'med-1', quantity: 2 } // Dolo 650
      ],
      deliveryType: 'delivery',
      paymentMethod: 'upi'
    });

    // 2. Pharmacist Marks Delivered
    const delivered = await PharmacyService.updatePharmacyOrderStatus(
      staffPharmacy,
      pharmacyApollo,
      orgPharmacy,
      order.id,
      'delivered'
    );

    expect(delivered.status).toBe('delivered');

    // 3. Inspect Escrow Ledger
    const entries = AarogyaStorage.getEscrowLedgerEntries();
    const orderEntry = entries.find(e => e.referenceId === order.id);

    expect(orderEntry).toBeDefined();
    expect(orderEntry?.organizationId).toBe(orgPharmacy);
    expect(orderEntry?.referenceType).toBe('order');
    expect(orderEntry?.grossAmount).toBe(order.totalAmount);
    expect(orderEntry?.platformCommissionRate).toBe(8);
    expect(orderEntry?.platformCommissionAmount).toBe(Math.round(order.totalAmount * 0.08));
    expect(orderEntry?.netVendorPayable).toBe(order.totalAmount - Math.round(order.totalAmount * 0.08));
    expect(orderEntry?.status).toBe('in_escrow');
    expect(orderEntry?.transactionToken).toMatch(/^TXN-ESCROW-ORD-/);
  });

  it('4. should compute accurate vendor earnings summary strictly scoped to the tenant organization', async () => {
    // Manually record two escrow transactions for Apollo Hospital
    await SettlementService.recordAppointmentCompletionLedger({
      appointmentId: 'apt-101',
      doctorId: 'doc-1',
      organizationId: orgHospital,
      patientName: 'Patient 1',
      consultationFee: 1000,
      actorUserId: 'auth-doc-1'
    });

    await SettlementService.recordAppointmentCompletionLedger({
      appointmentId: 'apt-102',
      doctorId: 'doc-1',
      organizationId: orgHospital,
      patientName: 'Patient 2',
      consultationFee: 500,
      actorUserId: 'auth-doc-1'
    });

    // Hospital Staff queries earnings
    const hospitalEarnings = await SettlementService.getVendorEarningsSummary(
      staffHospital,
      orgHospital
    );

    expect(hospitalEarnings.organizationId).toBe(orgHospital);
    expect(hospitalEarnings.totalGrossRevenue).toBe(1500);
    expect(hospitalEarnings.totalPlatformCommission).toBe(150); // 10%
    expect(hospitalEarnings.totalNetEarnings).toBe(1350);
    expect(hospitalEarnings.pendingEscrowAmount).toBe(1350);
    expect(hospitalEarnings.settledAmount).toBe(0);
    expect(hospitalEarnings.ledgerEntries.length).toBe(2);
  });

  it('5. CRITICAL: should prevent cross-organization horizontal privilege escalation on earnings and ledgers', async () => {
    await SettlementService.recordAppointmentCompletionLedger({
      appointmentId: 'apt-confidential',
      doctorId: 'doc-1',
      organizationId: orgHospital,
      patientName: 'VIP Patient',
      consultationFee: 5000,
      actorUserId: 'auth-doc-1'
    });

    // Pharmacy staff attempting to access Hospital's financial ledger
    await expect(
      SettlementService.getVendorEarningsSummary(staffPharmacy, orgHospital)
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);

    // MedPlus staff attempting to access Apollo Pharmacy's financial ledger
    await expect(
      SettlementService.getVendorEarningsSummary(staffMedplus, orgPharmacy)
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);
  });

  it('6. should allow Platform Admin to aggregate multi-tenant commission and settle escrow disbursements', async () => {
    // 1. Hospital transaction (Gross 1000, Commission 100, Net 900)
    await SettlementService.recordAppointmentCompletionLedger({
      appointmentId: 'apt-201',
      doctorId: 'doc-1',
      organizationId: orgHospital,
      patientName: 'Patient A',
      consultationFee: 1000,
      actorUserId: 'auth-doc-1'
    });

    // 2. Pharmacy transaction (Gross 500, Commission 40, Net 460)
    await SettlementService.recordOrderDeliveredLedger({
      orderId: 'ord-201',
      orderNumber: 'QA-ORD-201',
      pharmacyId: pharmacyApollo,
      organizationId: orgPharmacy,
      patientName: 'Patient B',
      subtotal: 500,
      totalAmount: 500,
      actorUserId: staffPharmacy
    });

    // 3. Platform Admin Global Summary
    const adminSummary = await SettlementService.getAdminPlatformEarningsSummary('auth-admin');
    expect(adminSummary.totalPlatformGrossVolume).toBe(1500);
    expect(adminSummary.totalCommissionCollected).toBe(140);
    expect(adminSummary.totalVendorNetPayable).toBe(1360);
    expect(adminSummary.pendingEscrowHoldings).toBe(1360);

    // 4. Admin settles Hospital escrow payouts
    const payoutResult = await SettlementService.settleVendorPayout('auth-admin', orgHospital);
    expect(payoutResult.settledCount).toBe(1);
    expect(payoutResult.totalSettledAmount).toBe(900);

    // 5. Hospital earnings summary now reflects settled status
    const hospitalAfterPayout = await SettlementService.getVendorEarningsSummary(
      staffHospital,
      orgHospital
    );
    expect(hospitalAfterPayout.pendingEscrowAmount).toBe(0);
    expect(hospitalAfterPayout.settledAmount).toBe(900);

    // 6. Pharmacy pending escrow remains untouched
    const pharmacyAfter = await SettlementService.getVendorEarningsSummary(
      staffPharmacy,
      orgPharmacy
    );
    expect(pharmacyAfter.pendingEscrowAmount).toBe(460);
    expect(pharmacyAfter.settledAmount).toBe(0);
  });

  it('7. Security: should use tokenized transaction references and store zero raw payment credentials', async () => {
    const entry = await SettlementService.recordAppointmentCompletionLedger({
      appointmentId: 'apt-token-audit',
      doctorId: 'doc-1',
      organizationId: orgHospital,
      patientName: 'Token Test',
      consultationFee: 1200,
      actorUserId: 'auth-doc-1'
    });

    // Tokenized reference check
    expect(entry.transactionToken).toContain('TXN-ESCROW-APT-');
    expect(entry.transactionToken.length).toBeGreaterThan(16);

    // Strict credential protection check
    const entryString = JSON.stringify(entry);
    expect(entryString).not.toContain('cvv');
    expect(entryString).not.toContain('cardNumber');
    expect(entryString).not.toContain('pin');
  });
});

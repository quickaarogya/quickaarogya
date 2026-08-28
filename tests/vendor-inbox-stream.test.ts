import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationService } from '../src/server/services/notification.service';
import { AppointmentService } from '../src/server/services/appointment.service';
import { PharmacyService } from '../src/server/services/pharmacy.service';
import { AarogyaStorage } from '../src/lib/storage';
import { NotificationType, InboxPriority, InboxCategory } from '@/types';

describe('Vendor-Side Inbox & Deterministic Multi-Tenant Notification Stream Tests', () => {
  const orgHospitalA = 'org-apollo-hospital';
  const staffHospitalA = 'auth-staff-apollo';

  const orgPharmacyB = 'org-apollo-pharmacy';
  const staffPharmacyB = 'auth-staff-pharmacy';

  const orgClinicC = 'org-dr-vivek-clinic';
  const staffClinicC = 'auth-doc-2';

  beforeEach(() => {
    AarogyaStorage.clearInbox();
  });

  it('1. should resolve deterministic priority rules strictly for vendor event categories', () => {
    // 1. URGENT: Patient cancelled appointment (freed slot / disruption)
    const p1 = NotificationService.resolvePriority('vendor_appointment_cancelled');
    expect(p1).toBe('urgent');

    // 2. URGENT: Low platform settlement balance
    const p2 = NotificationService.resolvePriority('vendor_low_balance');
    expect(p2).toBe('urgent');

    // 3. IMPORTANT: Order pending prescription audit
    const p3 = NotificationService.resolvePriority('vendor_order_pending_rx');
    expect(p3).toBe('important');

    // 4. IMPORTANT: New appointment booking request
    const p4 = NotificationService.resolvePriority('vendor_new_appointment');
    expect(p4).toBe('important');

    // 5. IMPORTANT: New retail pharmacy order
    const p5 = NotificationService.resolvePriority('vendor_new_order');
    expect(p5).toBe('important');

    // 6. IMPORTANT: Vendor application compliance review decision
    const p6 = NotificationService.resolvePriority('vendor_application_reviewed');
    expect(p6).toBe('important');
  });

  it('2. should map vendor event categories accurately without AI classification', () => {
    expect(NotificationService.resolveCategory('vendor_new_appointment')).toBe('vendor_appointments');
    expect(NotificationService.resolveCategory('vendor_appointment_cancelled')).toBe('vendor_appointments');
    expect(NotificationService.resolveCategory('vendor_order_pending_rx')).toBe('vendor_orders');
    expect(NotificationService.resolveCategory('vendor_new_order')).toBe('vendor_orders');
    expect(NotificationService.resolveCategory('vendor_low_balance')).toBe('vendor_settlements');
    expect(NotificationService.resolveCategory('vendor_application_reviewed')).toBe('vendor_compliance');
  });

  it('3. should dispatch vendor notifications scoped strictly by organizationId', async () => {
    // Hospital Notification
    const hospNotif = await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_new_appointment',
      title: 'New Appointment: Arjun Sharma',
      message: 'Token #14 booked for 11:00 AM Cardiology OPD.',
      action: { label: 'View Queue', url: '/vendor/appointments' }
    });

    expect(hospNotif.priority).toBe('important');
    expect(hospNotif.category).toBe('vendor_appointments');
    expect(hospNotif.organizationId).toBe(orgHospitalA);

    // Pharmacy Notification
    const pharmaNotif = await NotificationService.createNotification({
      organizationId: orgPharmacyB,
      type: 'vendor_order_pending_rx',
      title: 'Rx Verification Needed: Order #QA-ORD-9021',
      message: 'Patient attached Rx-Cardiology-2026.pdf for Telma 40.',
      action: { label: 'Audit Rx', url: '/vendor/orders' }
    });

    expect(pharmaNotif.priority).toBe('important');
    expect(pharmaNotif.category).toBe('vendor_orders');
    expect(pharmaNotif.organizationId).toBe(orgPharmacyB);

    // Settlement Alert
    const balanceNotif = await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_low_balance',
      title: 'Settlement Account Alert',
      message: 'Platform commission balance is below ₹1,000 threshold.',
      action: { label: 'Top-up Balance', url: '/vendor/dashboard' }
    });

    expect(balanceNotif.priority).toBe('urgent');
    expect(balanceNotif.category).toBe('vendor_settlements');
  });

  it('4. should retrieve tenant-scoped inbox stream for authorized staff members', async () => {
    await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_new_appointment',
      title: 'New Appointment: Arjun Sharma',
      message: 'Token #14 booked for 11:00 AM Cardiology OPD.'
    });

    await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_appointment_cancelled',
      title: 'Appointment Cancelled: Rohan Verma',
      message: 'Patient cancelled 02:30 PM consultation.'
    });

    await NotificationService.createNotification({
      organizationId: orgPharmacyB,
      type: 'vendor_new_order',
      title: 'New Pharmacy Order: #QA-ORD-1120',
      message: 'Order placed for 3 items.'
    });

    // Hospital staff queries Hospital stream
    const hospitalItems = await NotificationService.getVendorInbox(staffHospitalA, orgHospitalA);
    expect(hospitalItems.length).toBe(2);
    expect(hospitalItems.every(i => i.organizationId === orgHospitalA)).toBe(true);

    // Pharmacy staff queries Pharmacy stream
    const pharmacyItems = await NotificationService.getVendorInbox(staffPharmacyB, orgPharmacyB);
    expect(pharmacyItems.length).toBe(1);
    expect(pharmacyItems[0].organizationId).toBe(orgPharmacyB);
  });

  it('5. CRITICAL: should prevent cross-organization horizontal privilege escalation on notification streams', async () => {
    await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_low_balance',
      title: 'Confidential Payout Alert',
      message: 'Monthly hospital net settlement payout processed.'
    });

    // Pharmacy staff attempting to access Hospital A's notification stream
    await expect(
      NotificationService.getVendorInbox(staffPharmacyB, orgHospitalA)
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);

    // Clinic staff attempting to access Pharmacy B's notification stream
    await expect(
      NotificationService.getVendorInbox(staffClinicC, orgPharmacyB)
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);
  });

  it('6. should trigger automated vendor stream notifications during real appointment and order booking', async () => {
    // 1. Patient books appointment -> triggers vendor_new_appointment
    await AppointmentService.bookAppointment({
      doctorId: 'doc-1',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: '2026-09-12',
      timeSlot: '04:00 PM',
      type: 'in_person',
      symptoms: 'Cardiology follow up'
    });

    const hospitalStream = await NotificationService.getVendorInbox(staffHospitalA, orgHospitalA);
    const appointmentAlert = hospitalStream.find(i => i.type === 'vendor_new_appointment');
    expect(appointmentAlert).toBeDefined();
    expect(appointmentAlert?.priority).toBe('important');
    expect(appointmentAlert?.title).toContain('New Appointment');

    // 2. Patient places pharmacy order with Rx -> triggers vendor_order_pending_rx
    await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      pharmacyId: 'pharma-1',
      items: [{ medicineId: 'med-4', quantity: 1 }],
      deliveryType: 'delivery',
      prescriptionDocumentId: 'doc-rx-101'
    });

    const pharmacyStream = await NotificationService.getVendorInbox(staffPharmacyB, orgPharmacyB);
    const rxAlert = pharmacyStream.find(i => i.type === 'vendor_order_pending_rx');
    expect(rxAlert).toBeDefined();
    expect(rxAlert?.priority).toBe('important');
    expect(rxAlert?.title).toContain('Rx Audit Required');
  });

  it('7. should handle read/unread transitions and category filtering on vendor stream', async () => {
    const n1 = await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_new_appointment',
      title: 'Appointment 1',
      message: 'Booking 1'
    });

    const n2 = await NotificationService.createNotification({
      organizationId: orgHospitalA,
      type: 'vendor_appointment_cancelled',
      title: 'Cancellation 1',
      message: 'Cancellation 1'
    });

    expect(await NotificationService.getVendorUnreadCount(staffHospitalA, orgHospitalA)).toBe(2);

    await NotificationService.markAsRead(n1.id);
    expect(await NotificationService.getVendorUnreadCount(staffHospitalA, orgHospitalA)).toBe(1);

    const filtered = await NotificationService.getVendorInbox(staffHospitalA, orgHospitalA, {
      category: 'vendor_appointments'
    });
    expect(filtered.length).toBe(2);
  });
});

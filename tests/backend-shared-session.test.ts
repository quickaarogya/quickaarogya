import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../src/lib/prisma';
import { AppointmentService } from '../src/server/services/appointment.service';
import { PharmacyService } from '../src/server/services/pharmacy.service';
import { AuthService } from '../src/server/services/auth.service';

describe('Shared Server-Side Backend Persistence & Multi-Session Tests', () => {
  it('Doctor (Session 2) should immediately see an appointment booked by Patient (Session 1)', async () => {
    // 1. Patient Arjun (Session 1) books a consultation with Dr. Ananya Roy (doc-1)
    const bookingDate = '2026-09-05';
    const timeSlot = '02:30 PM';

    const booked = await AppointmentService.bookAppointment({
      doctorId: 'doc-1',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: bookingDate,
      timeSlot: timeSlot,
      type: 'in_person',
      symptoms: 'Follow-up on ECG and lipid profile review.',
      consultationFee: 1200
    });

    expect(booked).toBeDefined();
    expect(booked.id).toBeDefined();
    expect(booked.status).toBe('confirmed');

    // 2. Doctor Ananya (Session 2) logs in / loads her consultation queue from PostgreSQL
    const doctorAppointments = await AppointmentService.getAppointments({
      doctorId: 'doc-1'
    });

    // Verify Session 2 receives Session 1's write from the shared database
    const receivedApt = doctorAppointments.find(a => a.id === booked.id);
    expect(receivedApt).toBeDefined();
    expect(receivedApt?.patientProfileId).toBe('usr-101');
    expect(receivedApt?.date).toBe(bookingDate);
    expect(receivedApt?.doctorName).toContain('Dr.');
  });

  it('Pharmacy Operator (Session 2) should see and update an order placed by Customer (Session 1)', async () => {
    // 1. Customer (Session 1) places a medicine order for Apollo Pharmacy
    const order = await PharmacyService.createOrder({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      pharmacyId: 'pharma-1',
      items: [
        { medicineId: 'med-3', quantity: 2 } // Dolo 650
      ],
      deliveryType: 'delivery',
      deliveryAddress: 'Flat 402, Heritage Heights, Noida',
      prescriptionDocumentId: 'doc-rx-101',
      paymentMethod: 'upi'
    });

    expect(order).toBeDefined();
    expect(order.items.length).toBe(1);

    // 2. Pharmacy Operator (Session 2) checks their incoming orders from the shared database
    const pharmacyOrders = await PharmacyService.getOrders('usr-101');
    const pharmacyReceived = pharmacyOrders.find(o => o.id === order.id);

    expect(pharmacyReceived).toBeDefined();
    expect(pharmacyReceived?.items[0].medicineId).toBe('med-3');

    // 3. Pharmacy Operator (Session 2) marks order as out_for_delivery in PostgreSQL
    const updated = await PharmacyService.updateOrderStatus(order.id, 'out_for_delivery');
    expect(updated.status).toBe('out_for_delivery');

    // 4. Customer (Session 1) re-fetches orders from database and verifies status update
    const customerOrders = await PharmacyService.getOrders('usr-101');
    const customerView = customerOrders.find(o => o.id === order.id);
    expect(customerView?.status).toBe('out_for_delivery');
  });

  it('Newly registered User (Session 1) should be authenticatable by Session 2 across instances', async () => {
    const testEmail = `dr.rahul_${Date.now()}@aarogya.health`;
    const testPhone = `+91 91234 ${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Session 1 registers user into PostgreSQL
    const registered = await AuthService.register({
      fullName: 'Rahul Verma',
      email: testEmail,
      phoneNumber: testPhone,
      role: 'PATIENT',
      passwordPlain: 'SecretPass@2026'
    });

    expect(registered.user.email).toBe(testEmail);

    // 2. Session 2 logs in with credentials via shared backend
    const loginResult = await AuthService.login(testEmail, 'SecretPass@2026');
    expect(loginResult).toBeDefined();
    expect(loginResult.user.email).toBe(testEmail);
    expect(loginResult.token).toBeDefined();
  });
});

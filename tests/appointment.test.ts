import { describe, it, expect } from 'vitest';
import { AppointmentService } from '../src/server/services/appointment.service';

describe('Phase 4 Doctors, Hospitals & Appointment Ecosystem Tests', () => {
  it('should list and filter doctors by specialization', async () => {
    const cardiologists = await AppointmentService.getDoctors({ specialty: 'Cardiology' });
    expect(cardiologists.length).toBeGreaterThan(0);
    expect(cardiologists[0].specialization).toBe('Cardiology');
  });

  it('should compute real-time available time slots for a doctor on a target date', async () => {
    const slots = await AppointmentService.getAvailableSlots('doc-1', '2026-09-01');
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0]).toHaveProperty('time');
    expect(slots[0]).toHaveProperty('period');
    expect(slots[0]).toHaveProperty('isAvailable');
  });

  it('should successfully book an appointment and allocate an OPD queue token', async () => {
    const apt = await AppointmentService.bookAppointment({
      doctorId: 'doc-1',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: '2026-09-02',
      timeSlot: '09:00 AM',
      type: 'in_person',
      symptoms: 'Annual cardiac wellness review',
    });

    expect(apt).toBeDefined();
    expect(apt.id).toContain('apt-');
    expect(apt.status).toBe('confirmed');
    expect(apt.tokenNumber).toBeGreaterThan(0);
    expect(apt.dateTime).toBe('2026-09-02 at 09:00 AM');
  });

  it('should strictly prevent double-booking collisions for the same doctor, date and slot', async () => {
    // Booking 1
    await AppointmentService.bookAppointment({
      doctorId: 'doc-2',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: '2026-09-03',
      timeSlot: '10:00 AM',
      type: 'in_person',
      symptoms: 'Thyroid evaluation',
    });

    // Booking 2 (Attempt duplicate slot)
    await expect(
      AppointmentService.bookAppointment({
        doctorId: 'doc-2',
        patientProfileId: 'fam-1',
        patientName: 'Savitri Sharma',
        date: '2026-09-03',
        timeSlot: '10:00 AM',
        type: 'in_person',
        symptoms: 'Diabetes consultation',
      })
    ).rejects.toThrow(/already been booked/i);
  });

  it('should reschedule an appointment to a new open slot and update timestamp', async () => {
    const apt = await AppointmentService.bookAppointment({
      doctorId: 'doc-3',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: '2026-09-04',
      timeSlot: '09:00 AM',
      type: 'in_person',
      symptoms: 'Pediatric checkup',
    });

    const rescheduled = await AppointmentService.rescheduleAppointment(apt.id, '2026-09-05', '10:30 AM');
    expect(rescheduled.dateTime).toBe('2026-09-05 at 10:30 AM');
    expect(rescheduled.status).toBe('confirmed');
  });

  it('should cancel an appointment and update status', async () => {
    const apt = await AppointmentService.bookAppointment({
      doctorId: 'doc-4',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      date: '2026-09-06',
      timeSlot: '10:30 AM',
      type: 'in_person',
      symptoms: 'Knee joint pain',
    });

    const success = await AppointmentService.cancelAppointment(apt.id);
    expect(success).toBe(true);

    const list = await AppointmentService.getAppointments({ patientProfileId: 'usr-101' });
    const cancelledApt = list.find(a => a.id === apt.id);
    expect(cancelledApt?.status).toBe('cancelled');
  });
});

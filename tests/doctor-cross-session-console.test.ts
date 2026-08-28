import { describe, it, expect } from 'vitest';
import { AppointmentService } from '../src/server/services/appointment.service';
import { OrgService } from '../src/server/services/organization.service';
import { AppointmentStatus, AppointmentType } from '@/types';

describe('Doctor Working Console & Cross-Session Visibility Tests', () => {
  const patientUserId = 'usr-101';
  const patientName = 'Arjun Sharma';

  const doctorIdHospitalA = 'doc-1';
  const doctorUserIdHospitalA = 'auth-doc-1';
  const orgHospitalA = 'org-apollo-hospital';

  const doctorIdClinicB = 'doc-2';
  const doctorUserIdClinicB = 'auth-doc-2';
  const orgClinicB = 'org-dr-vivek-clinic';

  let createdAppointmentId: string;
  let bookedTokenNumber: number;

  it('1. Patient Session A books an appointment with Dr. Ananya Roy at Apollo Hospital', async () => {
    const bookingDate = '2026-09-05';
    const bookingSlot = '11:00 AM';

    const appointment = await AppointmentService.bookAppointment({
      doctorId: doctorIdHospitalA,
      patientProfileId: patientUserId,
      patientName,
      date: bookingDate,
      timeSlot: bookingSlot,
      type: 'in_person',
      symptoms: 'Quarterly hypertension checkup and review of blood pressure records.'
    });

    expect(appointment).toBeDefined();
    expect(appointment.id).toBeDefined();
    expect(appointment.doctorId).toBe(doctorIdHospitalA);
    expect(appointment.patientName).toBe(patientName);
    expect(appointment.status).toBe('confirmed');
    expect(appointment.tokenNumber).toBeGreaterThan(0);

    createdAppointmentId = appointment.id;
    bookedTokenNumber = appointment.tokenNumber!;
  });

  it('2. Doctor Session B (Dr. Ananya) queries her queue and immediately sees the patient booked appointment', async () => {
    const doctorAppointments = await AppointmentService.getDoctorAppointments(
      doctorUserIdHospitalA,
      doctorIdHospitalA,
      orgHospitalA
    );

    expect(doctorAppointments).toBeDefined();
    expect(doctorAppointments.length).toBeGreaterThanOrEqual(1);

    const foundAppointment = doctorAppointments.find(a => a.id === createdAppointmentId);
    expect(foundAppointment).toBeDefined();
    expect(foundAppointment?.patientName).toBe(patientName);
    expect(foundAppointment?.status).toBe('confirmed');
    expect(foundAppointment?.tokenNumber).toBe(bookedTokenNumber);
  });

  it('3. Doctor Session B advances the live queue token and starts the consultation (in_consultation)', async () => {
    // 1. Advance queue token
    const newRunningToken = bookedTokenNumber;
    const tokenResult = await AppointmentService.advanceDoctorQueue(
      doctorUserIdHospitalA,
      doctorIdHospitalA,
      orgHospitalA,
      newRunningToken
    );
    expect(tokenResult).toBe(newRunningToken);

    // 2. Start consultation
    const updatedApt = await AppointmentService.updateDoctorAppointmentStatus(
      doctorUserIdHospitalA,
      doctorIdHospitalA,
      orgHospitalA,
      createdAppointmentId,
      'in_consultation'
    );

    expect(updatedApt.status).toBe('in_consultation');
    expect(updatedApt.currentQueueToken).toBe(newRunningToken);
  });

  it('4. Doctor Session B completes consultation and archives clinical diagnosis notes', async () => {
    const clinicalSummary = 'Blood pressure stabilized at 120/80 mmHg. Advised low salt diet and continue Telmisartan 40mg.';

    const completedApt = await AppointmentService.updateDoctorAppointmentStatus(
      doctorUserIdHospitalA,
      doctorIdHospitalA,
      orgHospitalA,
      createdAppointmentId,
      'completed',
      clinicalSummary
    );

    expect(completedApt.status).toBe('completed');
    expect(completedApt.notes).toBe(clinicalSummary);

    // Verify patient side also reflects the completed consultation and notes
    const patientViewApts = await AppointmentService.getAppointments({
      patientProfileId: patientUserId
    });
    const patientApt = patientViewApts.find(a => a.id === createdAppointmentId);
    expect(patientApt).toBeDefined();
    expect(patientApt?.status).toBe('completed');
  });

  it('5. Doctor Session B can update their recurring availability schedule & time slot templates', async () => {
    const newSlots = ['08:30 AM', '10:00 AM', '11:30 AM', '03:00 PM', '04:30 PM'];
    const newDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const updatedDoc = await AppointmentService.updateDoctorAvailability(
      doctorUserIdHospitalA,
      doctorIdHospitalA,
      orgHospitalA,
      newSlots,
      newDays
    );

    expect(updatedDoc.availableSlots).toEqual(newSlots);
    expect(updatedDoc.availableDays).toEqual(newDays);
  });

  it('6. Doctor Session C (Dr. Vivek from Clinic B) is STRICTLY BLOCKED from viewing or acting on Dr. Ananya queue', async () => {
    // Dr. Vivek attempting to query Dr. Ananya appointments in Hospital A
    await expect(
      AppointmentService.getDoctorAppointments(
        doctorUserIdClinicB,
        doctorIdHospitalA,
        orgHospitalA
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);

    // Dr. Vivek attempting to advance Dr. Ananya queue
    await expect(
      AppointmentService.advanceDoctorQueue(
        doctorUserIdClinicB,
        doctorIdHospitalA,
        orgHospitalA,
        10
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);

    // Dr. Vivek attempting to alter Dr. Ananya appointment status
    await expect(
      AppointmentService.updateDoctorAppointmentStatus(
        doctorUserIdClinicB,
        doctorIdHospitalA,
        orgHospitalA,
        createdAppointmentId,
        'cancelled'
      )
    ).rejects.toThrow(/Cross-organization horizontal privilege escalation prevented/i);
  });
});

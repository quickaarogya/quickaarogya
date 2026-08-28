import { describe, it, expect } from 'vitest';
import { MedicationService } from '../src/server/services/medication.service';
import { MedicationSchedule } from '../src/types';

describe('Phase 3 Medication Management & Adherence Edge Case Tests', () => {
  it('should create a medication schedule with multiple daily reminder times', async () => {
    const sched = await MedicationService.createSchedule({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'Augmentin 625 Duo',
      genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
      strength: '625mg',
      form: 'tablet',
      unit: 'tablets',
      dosage: '1 Tablet',
      doseQuantity: 1,
      frequency: 'Twice Daily',
      timing: 'after_food',
      timesOfDay: ['08:00', '20:00'],
      startDate: '2026-08-27',
      isChronic: false,
      initialQuantity: 14,
      refillThreshold: 4,
      instructions: 'Complete full 7-day course. Do not stop midway.',
    });

    expect(sched).toBeDefined();
    expect(sched.id).toContain('sched-');
    expect(sched.timesOfDay).toHaveLength(2);
    expect(sched.remainingQuantity).toBe(14);
    expect(sched.status).toBe('active');
  });

  it('should decrement remaining stock when marking a dose as taken', async () => {
    const sched = await MedicationService.createSchedule({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'Pan 40',
      strength: '40mg',
      dosage: '1 Tablet',
      doseQuantity: 1,
      frequency: 'Once Daily',
      timing: 'empty_stomach',
      timesOfDay: ['07:00'],
      startDate: '2026-08-27',
      initialQuantity: 10,
      remainingQuantity: 10,
      refillThreshold: 3,
    });

    const initialQty = sched.remainingQuantity;

    const log = await MedicationService.logDose(sched.id, '07:00', 'taken');
    expect(log.status).toBe('taken');
    expect(log.takenTime).toBeDefined();

    const updatedSched = await MedicationService.getScheduleById(sched.id);
    expect(updatedSched?.remainingQuantity).toBe(initialQty - 1);
  });

  it('should not decrement stock when a dose is skipped or missed', async () => {
    const sched = await MedicationService.createSchedule({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'Vitamin C 500',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      timing: 'after_food',
      timesOfDay: ['10:00'],
      startDate: '2026-08-27',
      initialQuantity: 30,
      remainingQuantity: 30,
      refillThreshold: 5,
    });

    await MedicationService.logDose(sched.id, '10:00', 'skipped');
    const updated = await MedicationService.getScheduleById(sched.id);
    expect(updated?.remainingQuantity).toBe(30);
  });

  it('should transition status to refill_required when remaining quantity hits threshold', async () => {
    const sched = await MedicationService.createSchedule({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'Thyronorm 50mcg',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      timing: 'empty_stomach',
      timesOfDay: ['06:30'],
      startDate: '2026-08-27',
      initialQuantity: 6,
      remainingQuantity: 6,
      refillThreshold: 5,
    });

    // 6 -> 5 (hits threshold)
    await MedicationService.logDose(sched.id, '06:30', 'taken');
    const updated = await MedicationService.getScheduleById(sched.id);
    expect(updated?.remainingQuantity).toBe(5);
    expect(updated?.status).toBe('refill_required');
  });

  it('should handle zero remaining quantity edge case without going negative', async () => {
    const sched = await MedicationService.createSchedule({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'SOS Paracetamol',
      dosage: '1 Tablet',
      frequency: 'As Needed',
      timing: 'after_food',
      timesOfDay: ['12:00'],
      startDate: '2026-08-27',
      initialQuantity: 1,
      remainingQuantity: 1,
      refillThreshold: 1,
    });

    await MedicationService.logDose(sched.id, '12:00', 'taken');
    const updated = await MedicationService.getScheduleById(sched.id);
    expect(updated?.remainingQuantity).toBe(0);

    // Additional take should not make it negative
    await MedicationService.logDose(sched.id, '12:00', 'taken');
    const updatedAgain = await MedicationService.getScheduleById(sched.id);
    expect(updatedAgain?.remainingQuantity).toBe(0);
  });

  it('should calculate estimated days runway accurately', () => {
    const sched: MedicationSchedule = {
      id: 'sched-runway',
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'Metformin 500mg',
      dosage: '1 Tablet',
      doseQuantity: 1,
      frequency: 'Twice Daily',
      timing: 'after_food',
      timesOfDay: ['08:00', '20:00'], // 2 doses / day
      startDate: '2026-08-27',
      isChronic: true,
      initialQuantity: 60,
      remainingQuantity: 14,
      refillThreshold: 10,
      instructions: '',
      colorTag: '#0d9488',
      isActive: true,
      status: 'active',
    };

    const dailyDoses = sched.timesOfDay.length * (sched.doseQuantity || 1); // 2
    const estimatedDaysRunway = Math.floor(sched.remainingQuantity / dailyDoses); // 14 / 2 = 7 days
    expect(estimatedDaysRunway).toBe(7);
  });

  it('should replenish stock and reset status to active upon refill', async () => {
    const sched = await MedicationService.createSchedule({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      medicineName: 'Ecosprin 75',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      timing: 'after_food',
      timesOfDay: ['14:00'],
      startDate: '2026-08-27',
      initialQuantity: 3,
      remainingQuantity: 3, // Low
      refillThreshold: 5,
    });

    expect(sched.status).toBe('refill_required');

    const refilled = await MedicationService.refillSchedule(sched.id, 30);
    expect(refilled.remainingQuantity).toBe(33);
    expect(refilled.status).toBe('active');
  });
});

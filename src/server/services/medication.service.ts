import {
  MedicationSchedule,
  MedicationLog,
  DoseLogStatus,
  MedicationStatus,
  DosageTiming,
  MedicineForm
} from '@/types';
import { AarogyaStorage } from '@/lib/storage';

export interface TodayDoseItem {
  id: string;
  scheduleId: string;
  patientProfileId: string;
  patientName: string;
  medicineName: string;
  genericName?: string;
  strength?: string;
  dosage: string;
  form?: MedicineForm;
  timing: DosageTiming;
  scheduledTime: string; // e.g. "08:30" or "08:30 AM"
  takenTime?: string;
  status: DoseLogStatus;
  instructions: string;
  remainingQuantity: number;
  refillThreshold: number;
  isRefillRequired: boolean;
  colorTag: string;
}

export interface AdherenceStats {
  totalDosesScheduled: number;
  totalTaken: number;
  totalSkipped: number;
  totalMissed: number;
  adherencePercentage: number;
}

export class MedicationService {
  static async getSchedules(filters?: {
    patientProfileId?: string;
    status?: MedicationStatus | 'all';
  }): Promise<MedicationSchedule[]> {
    let schedules = AarogyaStorage.getMedicationSchedules();

    if (filters?.patientProfileId && filters.patientProfileId !== 'all') {
      schedules = schedules.filter(s => s.patientProfileId === filters.patientProfileId);
    }

    if (filters?.status && filters.status !== 'all') {
      schedules = schedules.filter(s => s.status === filters.status);
    }

    return schedules;
  }

  static async getScheduleById(id: string): Promise<MedicationSchedule | null> {
    const schedules = AarogyaStorage.getMedicationSchedules();
    return schedules.find(s => s.id === id) || null;
  }

  static async createSchedule(data: {
    patientProfileId: string;
    patientName: string;
    medicineName: string;
    genericName?: string;
    strength?: string;
    form?: MedicineForm;
    unit?: string;
    dosage: string;
    doseQuantity?: number;
    frequency: string;
    timing: DosageTiming;
    timesOfDay: string[];
    startDate: string;
    endDate?: string;
    isChronic?: boolean;
    initialQuantity: number;
    remainingQuantity?: number;
    refillThreshold?: number;
    instructions?: string;
    colorTag?: string;
    prescribingDoctor?: string;
    prescriptionReference?: string;
    notes?: string;
  }): Promise<MedicationSchedule> {
    if (!data.medicineName.trim()) {
      throw new Error('Medicine name is required.');
    }
    if (!data.timesOfDay || data.timesOfDay.length === 0) {
      throw new Error('At least one daily reminder time is required.');
    }

    const initialQty = data.initialQuantity > 0 ? data.initialQuantity : 30;
    const remQty = data.remainingQuantity !== undefined ? data.remainingQuantity : initialQty;
    const threshold = data.refillThreshold !== undefined ? data.refillThreshold : 5;

    const newSchedule: Omit<MedicationSchedule, 'id'> = {
      patientProfileId: data.patientProfileId,
      patientName: data.patientName,
      medicineName: data.medicineName,
      genericName: data.genericName,
      strength: data.strength,
      form: data.form || 'tablet',
      unit: data.unit || 'tablets',
      dosage: data.dosage || '1 Tablet',
      doseQuantity: data.doseQuantity || 1,
      frequency: data.frequency || 'Once Daily',
      timing: data.timing || 'after_food',
      timesOfDay: data.timesOfDay,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate,
      isChronic: data.isChronic ?? true,
      initialQuantity: initialQty,
      remainingQuantity: remQty,
      refillThreshold: threshold,
      instructions: data.instructions || 'Take as prescribed by doctor.',
      colorTag: data.colorTag || '#0d9488',
      isActive: true,
      status: remQty <= threshold ? 'refill_required' : 'active',
      prescribingDoctor: data.prescribingDoctor,
      prescriptionReference: data.prescriptionReference,
      notes: data.notes,
      reminderEnabled: true,
    };

    return AarogyaStorage.addMedicationSchedule(newSchedule);
  }

  static async updateSchedule(id: string, updates: Partial<MedicationSchedule>): Promise<MedicationSchedule> {
    const existing = await this.getScheduleById(id);
    if (!existing) throw new Error('Medication schedule not found');

    const updated: MedicationSchedule = {
      ...existing,
      ...updates,
    };

    // Auto-update status if quantity changes
    if (updated.remainingQuantity !== undefined && updated.refillThreshold !== undefined) {
      if (updated.remainingQuantity <= updated.refillThreshold && updated.status === 'active') {
        updated.status = 'refill_required';
      } else if (updated.remainingQuantity > updated.refillThreshold && updated.status === 'refill_required') {
        updated.status = 'active';
      }
    }

    AarogyaStorage.updateMedicationSchedule(id, updated);
    return updated;
  }

  static async deleteSchedule(id: string): Promise<boolean> {
    const schedules = AarogyaStorage.getMedicationSchedules().filter(s => s.id !== id);
    AarogyaStorage.setMedicationSchedules(schedules);
    return true;
  }

  static async logDose(
    scheduleId: string,
    scheduledTime: string,
    action: 'taken' | 'skipped' | 'missed' | 'snoozed',
    notes?: string
  ): Promise<MedicationLog> {
    const schedule = await this.getScheduleById(scheduleId);
    if (!schedule) throw new Error('Medication schedule not found');

    const doseAmount = schedule.doseQuantity || 1;
    let newRemQty = schedule.remainingQuantity;

    if (action === 'taken') {
      newRemQty = Math.max(0, schedule.remainingQuantity - doseAmount);
      const isLow = newRemQty <= schedule.refillThreshold;
      const nextStatus: MedicationStatus = isLow ? 'refill_required' : schedule.status;

      await this.updateSchedule(scheduleId, {
        remainingQuantity: newRemQty,
        status: nextStatus,
      });

      if (isLow) {
        AarogyaStorage.addNotification({
          type: 'dose_reminder',
          title: `Refill Required: ${schedule.medicineName}`,
          message: `Only ${newRemQty} ${schedule.unit || 'tablets'} remaining for ${schedule.patientName}. Estimated to run out soon.`,
          urgency: 'high',
          actionUrl: '/medicines',
        });
      }
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];

    const log: MedicationLog = {
      id: `log-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      scheduleId,
      patientProfileId: schedule.patientProfileId,
      medicineName: schedule.medicineName,
      scheduledTime: scheduledTime || nowStr,
      scheduledDate: todayStr,
      takenTime: action === 'taken' ? nowStr : undefined,
      status: action,
      doseQuantity: doseAmount,
      notes: notes || undefined,
    };

    const logs = AarogyaStorage.getMedicationLogs();
    AarogyaStorage.setMedicationLogs([log, ...logs]);

    return log;
  }

  static async refillSchedule(scheduleId: string, quantityAdded = 30): Promise<MedicationSchedule> {
    const schedule = await this.getScheduleById(scheduleId);
    if (!schedule) throw new Error('Medication schedule not found');

    const newQty = schedule.remainingQuantity + quantityAdded;
    const updated = await this.updateSchedule(scheduleId, {
      remainingQuantity: newQty,
      status: 'active',
    });

    AarogyaStorage.addNotification({
      type: 'general',
      title: `Refill Confirmed: ${schedule.medicineName}`,
      message: `Added ${quantityAdded} ${schedule.unit || 'tablets'}. New balance: ${newQty} ${schedule.unit || 'tablets'}.`,
      urgency: 'low',
      actionUrl: '/medicines',
    });

    return updated;
  }

  static async getTodayDoses(patientProfileId?: string): Promise<TodayDoseItem[]> {
    const schedules = await this.getSchedules({
      patientProfileId,
      status: 'all',
    });

    const logs = AarogyaStorage.getMedicationLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    const todayDoses: TodayDoseItem[] = [];

    schedules
      .filter(s => s.isActive && s.status !== 'paused' && s.status !== 'completed' && s.status !== 'discontinued')
      .forEach(sched => {
        sched.timesOfDay.forEach(time => {
          // Check if there is already a log entry for this schedule today near this time
          const matchingLog = logs.find(
            l =>
              l.scheduleId === sched.id &&
              (l.scheduledTime.includes(time) || l.scheduledDate === todayStr)
          );

          const isRefill = sched.remainingQuantity <= sched.refillThreshold;

          todayDoses.push({
            id: `today-${sched.id}-${time}`,
            scheduleId: sched.id,
            patientProfileId: sched.patientProfileId,
            patientName: sched.patientName,
            medicineName: sched.medicineName,
            genericName: sched.genericName,
            strength: sched.strength,
            dosage: sched.dosage,
            form: sched.form,
            timing: sched.timing,
            scheduledTime: time,
            takenTime: matchingLog?.takenTime,
            status: matchingLog ? matchingLog.status : 'pending',
            instructions: sched.instructions,
            remainingQuantity: sched.remainingQuantity,
            refillThreshold: sched.refillThreshold,
            isRefillRequired: isRefill,
            colorTag: sched.colorTag,
          });
        });
      });

    // Sort chronologically by scheduledTime (e.g. 08:00 before 13:00)
    return todayDoses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }

  static async getAdherenceStats(patientProfileId?: string): Promise<AdherenceStats> {
    let logs = AarogyaStorage.getMedicationLogs();
    if (patientProfileId && patientProfileId !== 'all') {
      logs = logs.filter(l => l.patientProfileId === patientProfileId);
    }

    const totalTaken = logs.filter(l => l.status === 'taken').length;
    const totalSkipped = logs.filter(l => l.status === 'skipped').length;
    const totalMissed = logs.filter(l => l.status === 'missed').length;
    const totalDosesScheduled = totalTaken + totalSkipped + totalMissed;

    const adherencePercentage =
      totalDosesScheduled > 0 ? Math.round((totalTaken / totalDosesScheduled) * 100) : 100;

    return {
      totalDosesScheduled,
      totalTaken,
      totalSkipped,
      totalMissed,
      adherencePercentage,
    };
  }
}

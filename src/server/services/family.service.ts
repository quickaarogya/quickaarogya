import {
  FamilyMember,
  FamilyPermission,
  FamilyRelationship,
  Gender,
  BloodGroup,
  FamilyHealthFeedItem,
  FamilyHealthOverview
} from '@/types';
import { AarogyaStorage } from '@/lib/storage';

export const CAREGIVER_DEFAULT_PERMISSIONS: FamilyPermission[] = [
  'VIEW_APPOINTMENTS',
  'VIEW_MEDICATIONS',
];

export const STANDARD_FAMILY_PERMISSIONS: FamilyPermission[] = [
  'VIEW_APPOINTMENTS',
  'BOOK_APPOINTMENTS',
  'VIEW_MEDICATIONS',
  'MANAGE_MEDICATIONS',
  'VIEW_RECORDS',
  'UPLOAD_RECORDS',
  'VIEW_EXPENSES',
  'EMERGENCY_ACCESS',
];

export class FamilyService {
  static async getFamilyMembers(primaryUserId = 'usr-101'): Promise<FamilyMember[]> {
    const all = AarogyaStorage.getFamilyMembers();
    return all.filter(m => m.primaryUserProfileId === primaryUserId);
  }

  static async getFamilyMemberById(id: string): Promise<FamilyMember | null> {
    const all = AarogyaStorage.getFamilyMembers();
    return all.find(m => m.id === id) || null;
  }

  static async addFamilyMember(
    primaryUserId = 'usr-101',
    data: {
      fullName: string;
      relationship: FamilyRelationship;
      dateOfBirth: string;
      gender: Gender;
      bloodGroup: BloodGroup;
      abhaId?: string;
      avatarUrl?: string;
      permissions?: FamilyPermission[];
      chronicConditions?: string[];
      allergies?: string[];
      emergencyContact?: string;
      vaccinationsDue?: { vaccineName: string; dueDate: string; status: 'due' | 'overdue' | 'completed' }[];
      notes?: string;
    }
  ): Promise<FamilyMember> {
    if (!data.fullName || !data.fullName.trim()) {
      throw new Error('Full name is required.');
    }

    // Security requirement: Do not give caregivers unrestricted access by default.
    const defaultPermissions: FamilyPermission[] = data.permissions || (
      data.relationship === 'caregiver'
        ? [...CAREGIVER_DEFAULT_PERMISSIONS]
        : [...STANDARD_FAMILY_PERMISSIONS]
    );

    const defaultPermissionLevel = data.relationship === 'caregiver' ? 'view_only' : 'full_proxy';

    const newMember: Omit<FamilyMember, 'id'> = {
      primaryUserProfileId: primaryUserId,
      fullName: data.fullName.trim(),
      relationship: data.relationship,
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      gender: data.gender || 'male',
      bloodGroup: data.bloodGroup || 'B+',
      abhaId: data.abhaId,
      avatarUrl:
        data.avatarUrl ||
        (data.relationship === 'child'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
          : data.gender === 'female'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
      permissionLevel: defaultPermissionLevel,
      permissions: defaultPermissions,
      chronicConditions: data.chronicConditions,
      allergies: data.allergies,
      emergencyContact: data.emergencyContact,
      vaccinationsDue: data.vaccinationsDue,
      notes: data.notes,
    };

    return AarogyaStorage.addFamilyMember(newMember);
  }

  static async updateFamilyMember(
    id: string,
    updates: Partial<FamilyMember>
  ): Promise<FamilyMember> {
    return AarogyaStorage.updateFamilyMember(id, updates);
  }

  static async updatePermissions(
    id: string,
    permissions: FamilyPermission[]
  ): Promise<FamilyMember> {
    return this.updateFamilyMember(id, { permissions });
  }

  static async deleteFamilyMember(id: string): Promise<boolean> {
    const member = await this.getFamilyMemberById(id);
    if (!member) throw new Error('Family member not found.');

    AarogyaStorage.deleteFamilyMember(id);
    return true;
  }

  // Strict Authorization & Horizontal Privilege Escalation Guard
  static checkPermission(
    actorProfileId: string,
    targetProfileId: string,
    requiredPermission: FamilyPermission
  ): boolean {
    if (actorProfileId === targetProfileId) return true;

    const targetMember = AarogyaStorage.getFamilyMembers().find(m => m.id === targetProfileId);
    if (!targetMember) {
      throw new Error(`403 Forbidden: Target healthcare profile (${targetProfileId}) not found.`);
    }

    if (targetMember.primaryUserProfileId !== actorProfileId) {
      throw new Error(
        `403 Forbidden: Access denied. Horizontal privilege escalation prevented for profile ${targetProfileId}.`
      );
    }

    if (!targetMember.permissions.includes(requiredPermission)) {
      throw new Error(
        `403 Forbidden: Missing required permission [${requiredPermission}] for ${targetMember.fullName}.`
      );
    }

    return true;
  }

  // Unified Family Dashboard Health Overview Feed
  static async getFamilyHealthOverview(primaryUserId = 'usr-101'): Promise<FamilyHealthOverview> {
    const family = await this.getFamilyMembers(primaryUserId);
    const appointments = AarogyaStorage.getAppointments();
    const schedules = AarogyaStorage.getMedicationSchedules();
    const logs = AarogyaStorage.getMedicationLogs();
    const labBookings = AarogyaStorage.getLabBookings();

    const feedItems: FamilyHealthFeedItem[] = [];

    family.forEach(member => {
      // 1. Appointments check (Upcoming consultations, e.g. "Mom - Follow-up tomorrow")
      const memberAppts = appointments.filter(
        a => a.patientProfileId === member.id && a.status !== 'cancelled'
      );
      memberAppts.forEach(apt => {
        const isTomorrowOrToday = apt.dateTime.toLowerCase().includes('tomorrow') || apt.dateTime.toLowerCase().includes('today');
        feedItems.push({
          id: `feed-apt-${apt.id}`,
          familyMemberId: member.id,
          memberName: member.fullName,
          relationship: member.relationship,
          type: 'appointment',
          title: `Follow-up with ${apt.doctorName}`,
          description: `Scheduled on ${apt.dateTime} at ${apt.hospitalName}. Token #${apt.tokenNumber || '14'}.`,
          dueDate: apt.date || apt.dateTime,
          urgency: isTomorrowOrToday ? 'urgent' : 'high',
          actionUrl: '/appointments',
          actionLabel: 'View Appointment',
        });
      });

      // 2. Medication low refill checks (e.g. "Dad - Medicine refill in 3 days")
      const memberSchedules = schedules.filter(
        s => s.patientProfileId === member.id && s.isActive
      );
      memberSchedules.forEach(sched => {
        if (sched.remainingQuantity <= sched.refillThreshold) {
          const dosesPerDay = sched.timesOfDay.length || 1;
          const estDays = Math.max(1, Math.floor(sched.remainingQuantity / dosesPerDay));
          feedItems.push({
            id: `feed-refill-${sched.id}`,
            familyMemberId: member.id,
            memberName: member.fullName,
            relationship: member.relationship,
            type: 'refill_alert',
            title: `Medicine Refill: ${sched.medicineName}`,
            description: `Only ${sched.remainingQuantity} ${sched.unit || 'tablets'} remaining. Estimated to run out in ~${estDays} days.`,
            dueDate: `In ${estDays} days`,
            urgency: estDays <= 3 ? 'urgent' : 'high',
            actionUrl: '/medicines',
            actionLabel: '1-Click Refill',
          });
        }
      });

      // 3. Medication adherence / Pending Doses for today
      memberSchedules.forEach(sched => {
        sched.timesOfDay.forEach(time => {
          const isLogged = logs.some(
            l => l.scheduleId === sched.id && l.scheduledTime.includes(time) && l.status === 'taken'
          );
          if (!isLogged && sched.remainingQuantity > sched.refillThreshold) {
            feedItems.push({
              id: `feed-dose-${sched.id}-${time}`,
              familyMemberId: member.id,
              memberName: member.fullName,
              relationship: member.relationship,
              type: 'reminder',
              title: `Daily Dose: ${sched.medicineName} (${sched.dosage})`,
              description: `Scheduled at ${time} (${sched.timing.replace('_', ' ')}). Instructions: ${sched.instructions}`,
              dueDate: `Today at ${time}`,
              urgency: 'medium',
              actionUrl: '/medicines',
              actionLabel: 'Log Dose',
            });
          }
        });
      });

      // 4. Child Immunization & Vaccinations Due (e.g. "Child - Vaccination reminder")
      if (member.vaccinationsDue && member.vaccinationsDue.length > 0) {
        member.vaccinationsDue.forEach(v => {
          feedItems.push({
            id: `feed-vac-${member.id}-${v.vaccineName}`,
            familyMemberId: member.id,
            memberName: member.fullName,
            relationship: member.relationship,
            type: 'vaccination',
            title: `Vaccination Due: ${v.vaccineName}`,
            description: `Scheduled pediatric immunization due by ${v.dueDate}.`,
            dueDate: v.dueDate,
            urgency: 'high',
            actionUrl: '/records',
            actionLabel: 'View Certificate',
          });
        });
      }

      // 5. Pending Lab Reports & Diagnostics
      const memberLabs = labBookings.filter(
        l => l.patientProfileId === member.id && l.status !== 'completed'
      );
      memberLabs.forEach(lab => {
        feedItems.push({
          id: `feed-lab-${lab.id}`,
          familyMemberId: member.id,
          memberName: member.fullName,
          relationship: member.relationship,
          type: 'lab_report',
          title: `Diagnostic Test: ${lab.testNames.join(', ')}`,
          description: `Home collection on ${lab.scheduledDate}. Phlebotomist assigned.`,
          dueDate: lab.scheduledDate,
          urgency: 'medium',
          actionUrl: '/labs',
          actionLabel: 'Track Sample',
        });
      });

      // 6. Clinical Care Reminders from Notes
      if (member.notes && member.relationship === 'parent') {
        feedItems.push({
          id: `feed-note-${member.id}`,
          familyMemberId: member.id,
          memberName: member.fullName,
          relationship: member.relationship,
          type: 'reminder',
          title: `Health Monitoring: ${member.fullName}`,
          description: member.notes,
          urgency: 'low',
          actionUrl: '/family',
          actionLabel: 'Care Plan',
        });
      }
    });

    const upcomingAppointmentsCount = feedItems.filter(f => f.type === 'appointment').length;
    const lowRefillsCount = feedItems.filter(f => f.type === 'refill_alert').length;

    return {
      totalMembers: family.length,
      activeRemindersCount: feedItems.length,
      upcomingAppointmentsCount,
      lowRefillsCount,
      feedItems,
    };
  }
}


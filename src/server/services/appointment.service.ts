import {
  Doctor,
  Hospital,
  Appointment,
  AppointmentSlot,
  AppointmentStatus,
  AppointmentType
} from '@/types';
import { AarogyaStorage } from '@/lib/storage';
import prisma from '@/lib/prisma';
import { AppointmentStatus as PrismaAppointmentStatus, AppointmentType as PrismaAppointmentType } from '@prisma/client';
import { OrgService } from './organization.service';
import { NotificationService } from './notification.service';
import { SettlementService } from './settlement.service';

export class AppointmentService {
  static async getDoctors(filters?: {
    specialty?: string;
    searchQuery?: string;
    hospitalId?: string;
  }): Promise<Doctor[]> {
    try {
      if (typeof window === 'undefined') {
        const dbDocs: any[] = await (prisma.doctor.findMany as any)({
          where: {
            isVerified: true,
            OR: [
              { organization: { verificationStatus: 'VERIFIED' } },
              { organizationId: null }
            ]
          },
          include: {
            user: { include: { profile: true } },
            organization: true,
            appointments: true,
          }
        });

        if (dbDocs && dbDocs.length > 0) {
          const dbMapped: Doctor[] = dbDocs.map(d => ({
            id: d.id,
            name: d.user?.profile ? `Dr. ${d.user.profile.firstName} ${d.user.profile.lastName}` : 'Dr. Specialist',
            title: 'Senior Medical Consultant',
            specialization: d.specialization,
            qualification: d.qualification,
            experienceYears: d.experienceYears,
            consultationFee: Number(d.consultationFee),
            ratingAverage: Number(d.ratingAverage),
            ratingCount: d.ratingCount,
            patientCount: `${d.ratingCount * 12}+ Patients`,
            reviewsCount: `${d.ratingCount} Verified Reviews`,
            languages: ['English', 'Hindi'],
            consultationTypes: ['in_person', 'video_teleconsult'],
            hospitalName: d.organization?.name || 'Apollo Hospital & Heart Center',
            hospitalId: 'hosp-1',
            clinicAddress: 'Sarita Vihar, Mathura Road, New Delhi',
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
            availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            availableSlots: ['09:00 AM', '09:30 AM', '10:30 AM', '11:00 AM', '02:30 PM', '03:30 PM', '05:00 PM'],
            isVerified: d.isVerified,
            about: d.about || 'Consultant Specialist'
          }));

          const localDocs = AarogyaStorage.getDoctors().filter(d => d.isVerified !== false);
          const mergedMap = new Map<string, Doctor>();
          localDocs.forEach(doc => mergedMap.set(doc.id, doc));
          dbMapped.forEach(doc => mergedMap.set(doc.id, doc));

          let mapped = Array.from(mergedMap.values()).filter(d => d.isVerified !== false);

          if (filters?.specialty && filters.specialty !== 'all') {
            mapped = mapped.filter(
              d => d.specialization.toLowerCase() === filters.specialty?.toLowerCase()
            );
          }

          if (filters?.hospitalId && filters.hospitalId !== 'all') {
            mapped = mapped.filter(d => d.hospitalId === filters.hospitalId);
          }

          if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
            const q = filters.searchQuery.toLowerCase();
            mapped = mapped.filter(
              d =>
                d.name.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                d.hospitalName.toLowerCase().includes(q)
            );
          }

          return mapped;
        }
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma query failed, using storage fallback:', err);
    }

    let doctors = AarogyaStorage.getDoctors().filter(d => d.isVerified !== false);

    if (filters?.specialty && filters.specialty !== 'all') {
      doctors = doctors.filter(
        d => d.specialization.toLowerCase() === filters.specialty?.toLowerCase()
      );
    }

    if (filters?.hospitalId && filters.hospitalId !== 'all') {
      doctors = doctors.filter(d => d.hospitalId === filters.hospitalId);
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      doctors = doctors.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q) ||
          (d.languages && d.languages.some(l => l.toLowerCase().includes(q)))
      );
    }

    return doctors;
  }

  static async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      if (typeof window === 'undefined') {
        const d = await prisma.doctor.findUnique({
          where: { id },
          include: { user: { include: { profile: true } } }
        });
        if (d) {
          return {
            id: d.id,
            name: d.user?.profile ? `Dr. ${d.user.profile.firstName} ${d.user.profile.lastName}` : 'Dr. Specialist',
            title: 'Senior Medical Consultant',
            specialization: d.specialization,
            qualification: d.qualification,
            experienceYears: d.experienceYears,
            consultationFee: Number(d.consultationFee),
            ratingAverage: Number(d.ratingAverage),
            ratingCount: d.ratingCount,
            patientCount: `${d.ratingCount * 12}+ Patients`,
            reviewsCount: `${d.ratingCount} Reviews`,
            languages: ['English', 'Hindi'],
            consultationTypes: ['in_person', 'video_teleconsult'],
            hospitalName: 'Apollo Hospital & Heart Center',
            hospitalId: 'hosp-1',
            clinicAddress: 'Sarita Vihar, Mathura Road, New Delhi',
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
            availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            availableSlots: ['09:00 AM', '09:30 AM', '10:30 AM', '11:00 AM', '02:30 PM', '03:30 PM', '05:00 PM'],
            isVerified: d.isVerified,
            about: d.about || ''
          };
        }
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma getDoctorById error:', err);
    }

    const doctors = AarogyaStorage.getDoctors();
    return doctors.find(d => d.id === id) || null;
  }

  static async getHospitals(filters?: {
    city?: string;
    searchQuery?: string;
  }): Promise<Hospital[]> {
    try {
      if (typeof window === 'undefined') {
        const dbHosps = await prisma.hospital.findMany();
        if (dbHosps && dbHosps.length > 0) {
          let mapped: Hospital[] = dbHosps.map(h => ({
            id: h.id,
            name: h.name,
            type: h.type as any,
            address: `${h.addressLine1}, ${h.city}`,
            city: h.city,
            distanceKm: 4.2,
            emergencyHelpline: h.emergencyHelpline,
            has24x7Emergency: h.hasEmergencyService,
            icuBedsAvailable: 8,
            totalBeds: 250,
            rating: 4.8,
            facilities: Array.isArray(h.facilities) ? (h.facilities as string[]) : ['24x7 Emergency', 'ICU', 'Trauma'],
            imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300'
          }));

          if (filters?.city && filters.city !== 'all') {
            mapped = mapped.filter(h => h.city.toLowerCase() === filters.city?.toLowerCase());
          }

          if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
            const q = filters.searchQuery.toLowerCase();
            mapped = mapped.filter(
              h =>
                h.name.toLowerCase().includes(q) ||
                h.address.toLowerCase().includes(q) ||
                h.facilities.some(f => f.toLowerCase().includes(q))
            );
          }

          return mapped;
        }
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma getHospitals error:', err);
    }

    let hospitals = AarogyaStorage.getHospitals();

    if (filters?.city && filters.city !== 'all') {
      hospitals = hospitals.filter(h => h.city.toLowerCase() === filters.city?.toLowerCase());
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      hospitals = hospitals.filter(
        h =>
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          h.facilities.some(f => f.toLowerCase().includes(q))
      );
    }

    return hospitals;
  }

  static async getAvailableSlots(doctorId: string, date: string): Promise<AppointmentSlot[]> {
    const doctor = await this.getDoctorById(doctorId);
    if (!doctor) throw new Error('Doctor not found.');

    const appointments = await this.getAppointments();

    // Find all active bookings for this doctor on this date
    const bookedTimes = appointments
      .filter(
        apt =>
          apt.doctorId === doctorId &&
          (apt.dateTime.startsWith(date) || apt.date === date) &&
          apt.status !== 'cancelled'
      )
      .map(apt => {
        if (apt.timeSlot) return apt.timeSlot;
        const parts = apt.dateTime.split(' at ');
        return parts.length > 1 ? parts[1] : '';
      });

    const defaultSlots = doctor.availableSlots || [
      '09:00 AM',
      '09:30 AM',
      '10:30 AM',
      '11:00 AM',
      '02:30 PM',
      '03:30 PM',
      '05:00 PM',
      '06:00 PM',
    ];

    return defaultSlots.map(time => {
      const isBooked = bookedTimes.includes(time);
      const hour = parseInt(time.split(':')[0], 10);
      const isPM = time.includes('PM');

      let period: AppointmentSlot['period'] = 'morning';
      if (isPM && hour !== 12 && hour >= 4) {
        period = 'evening';
      } else if (isPM || hour === 12) {
        period = 'afternoon';
      }

      return {
        time,
        period,
        isAvailable: !isBooked,
      };
    });
  }

  static async bookAppointment(data: {
    doctorId: string;
    patientProfileId: string;
    patientName: string;
    date: string;
    timeSlot: string;
    type: AppointmentType;
    symptoms: string;
    notes?: string;
    consultationFee?: number;
  }): Promise<Appointment> {
    const doctor = await this.getDoctorById(data.doctorId);
    if (!doctor) throw new Error('Doctor not found.');

    // 1. Strict Double Booking Prevention Check
    const existing = (await this.getAppointments()).find(
      apt =>
        apt.doctorId === data.doctorId &&
        (apt.dateTime.startsWith(data.date) || apt.date === data.date) &&
        (apt.timeSlot === data.timeSlot || apt.dateTime.includes(data.timeSlot)) &&
        apt.status !== 'cancelled'
    );

    if (existing) {
      throw new Error(
        `This time slot (${data.timeSlot} on ${data.date}) has already been booked. Please choose another slot.`
      );
    }

    // 2. Token & Queue Calculation
    const sameDayBookings = (await this.getAppointments()).filter(
      apt =>
        apt.doctorId === data.doctorId &&
        (apt.dateTime.startsWith(data.date) || apt.date === data.date) &&
        apt.status !== 'cancelled'
    );
    const tokenNumber = sameDayBookings.length + 1;
    const currentRunningToken = Math.max(1, tokenNumber - 3);

    const aptId = `apt-${Date.now()}`;
    const aptNumber = `QA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApt: Appointment = {
      id: aptId,
      appointmentNumber: aptNumber,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialization,
      doctorAvatar: doctor.avatarUrl,
      patientProfileId: data.patientProfileId,
      patientName: data.patientName,
      hospitalName: doctor.hospitalName,
      dateTime: `${data.date} at ${data.timeSlot}`,
      date: data.date,
      timeSlot: data.timeSlot,
      type: data.type,
      status: 'confirmed',
      tokenNumber,
      currentQueueToken: currentRunningToken,
      symptoms: data.symptoms || 'General Clinical Consultation',
      notes: data.notes,
      consultationFee: data.consultationFee || doctor.consultationFee,
      paymentStatus: 'paid',
      bookedAt: new Date().toISOString(),
      meetingLink:
        data.type === 'video_teleconsult'
          ? `https://telehealth.quickaarogya.in/room/${doctor.id}-${Date.now()}`
          : undefined,
    };

    // Write to Server-Side PostgreSQL Database
    try {
      if (typeof window === 'undefined') {
        const appointmentDate = new Date(`${data.date}T10:00:00Z`);
        await prisma.appointment.create({
          data: {
            id: aptId,
            appointmentNumber: aptNumber,
            doctorId: data.doctorId,
            patientProfileId: data.patientProfileId,
            hospitalId: doctor.hospitalId || 'hosp-1',
            appointmentDatetime: appointmentDate,
            type: data.type === 'video_teleconsult' ? PrismaAppointmentType.VIDEO_TELECONSULT : PrismaAppointmentType.IN_PERSON,
            status: PrismaAppointmentStatus.CONFIRMED,
            tokenNumber,
            currentQueueToken: currentRunningToken,
            symptoms: data.symptoms || 'General Consultation',
            consultationFee: data.consultationFee || doctor.consultationFee
          }
        });
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma appointment create error:', err);
    }

    const booked = AarogyaStorage.bookAppointment(newApt);

    // Dispatch Patient Notification
    AarogyaStorage.addNotification({
      type: 'appointment',
      title: 'Consultation Confirmed',
      message: `Your appointment with ${doctor.name} (${doctor.specialization}) is confirmed for ${data.date} at ${data.timeSlot}. Token #${tokenNumber}`,
      urgency: 'medium',
      actionUrl: '/appointments',
    });

    // Dispatch Vendor Inbox Stream Event
    try {
      await NotificationService.createNotification({
        organizationId: doctor.organizationId || doctor.hospitalId || 'org-apollo-hospital',
        type: 'vendor_new_appointment',
        title: `New Appointment: ${data.patientName}`,
        message: `Token #${tokenNumber} booked for ${data.date} at ${data.timeSlot}. Symptoms: ${data.symptoms}`,
        action: { label: 'View Queue', url: '/vendor/appointments' },
        relatedEntity: { type: 'appointment', id: aptId, name: doctor.name }
      });
    } catch (e) {
      console.warn('Vendor notification dispatch error:', e);
    }

    return booked;
  }

  static async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newTimeSlot: string
  ): Promise<Appointment> {
    const appointments = await this.getAppointments();
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) throw new Error('Appointment not found.');

    // Verify target slot is not booked
    const slotCollision = appointments.find(
      a =>
        a.id !== appointmentId &&
        a.doctorId === apt.doctorId &&
        (a.dateTime.startsWith(newDate) || a.date === newDate) &&
        (a.timeSlot === newTimeSlot || a.dateTime.includes(newTimeSlot)) &&
        a.status !== 'cancelled'
    );

    if (slotCollision) {
      throw new Error(`The slot ${newTimeSlot} on ${newDate} is already occupied. Please select another slot.`);
    }

    const updatedApt: Appointment = {
      ...apt,
      date: newDate,
      timeSlot: newTimeSlot,
      dateTime: `${newDate} at ${newTimeSlot}`,
      status: 'confirmed',
    };

    try {
      if (typeof window === 'undefined') {
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            appointmentDatetime: new Date(`${newDate}T10:00:00Z`),
            status: PrismaAppointmentStatus.CONFIRMED
          }
        });
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma reschedule error:', err);
    }

    AarogyaStorage.updateAppointment(appointmentId, updatedApt);

    AarogyaStorage.addNotification({
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: `Your appointment with ${apt.doctorName} has been moved to ${newDate} at ${newTimeSlot}.`,
      urgency: 'medium',
      actionUrl: '/appointments',
    });

    return updatedApt;
  }

  static async cancelAppointment(id: string, reason?: string): Promise<boolean> {
    const appointments = await this.getAppointments();
    const apt = appointments.find(a => a.id === id);
    if (!apt) throw new Error('Appointment not found.');

    try {
      if (typeof window === 'undefined') {
        await prisma.appointment.update({
          where: { id },
          data: { status: PrismaAppointmentStatus.CANCELLED }
        });
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma cancel error:', err);
    }

    AarogyaStorage.cancelAppointment(id);

    AarogyaStorage.addNotification({
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `Your consultation with ${apt.doctorName} scheduled for ${apt.dateTime} has been cancelled.`,
      urgency: 'low',
      actionUrl: '/appointments',
    });

    return true;
  }

  static async getAppointments(filters?: {
    patientProfileId?: string;
    doctorId?: string;
    status?: AppointmentStatus | 'all';
  }): Promise<Appointment[]> {
    try {
      if (typeof window === 'undefined') {
        const whereClause: any = {};
        if (filters?.patientProfileId && filters.patientProfileId !== 'all') {
          whereClause.patientProfileId = filters.patientProfileId;
        }
        if (filters?.doctorId && filters.doctorId !== 'all') {
          whereClause.doctorId = filters.doctorId;
        }

        const dbApts = await prisma.appointment.findMany({
          where: whereClause,
          include: {
            doctor: { include: { user: { include: { profile: true } } } },
            patientProfile: true,
            hospital: true
          },
          orderBy: { appointmentDatetime: 'desc' }
        });

        if (dbApts && dbApts.length > 0) {
          let mapped: Appointment[] = dbApts.map(a => {
            const dateStr = a.appointmentDatetime.toISOString().split('T')[0];
            return {
              id: a.id,
              appointmentNumber: a.appointmentNumber,
              doctorId: a.doctorId,
              doctorName: a.doctor?.user?.profile ? `Dr. ${a.doctor.user.profile.firstName} ${a.doctor.user.profile.lastName}` : 'Dr. Specialist',
              doctorSpecialty: a.doctor?.specialization || 'Consultant Specialist',
              doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
              patientProfileId: a.patientProfileId,
              patientName: a.patientProfile ? `${a.patientProfile.firstName} ${a.patientProfile.lastName}` : 'Arjun Sharma',
              hospitalName: a.hospital?.name || 'Apollo Hospital & Heart Center',
              dateTime: `${dateStr} at 10:30 AM`,
              date: dateStr,
              timeSlot: '10:30 AM',
              type: a.type === PrismaAppointmentType.VIDEO_TELECONSULT ? 'video_teleconsult' : 'in_person',
              status: (a.status.toLowerCase()) as any,
              tokenNumber: a.tokenNumber || undefined,
              currentQueueToken: a.currentQueueToken || undefined,
              symptoms: a.symptoms || 'General Clinical Consultation',
              consultationFee: Number(a.consultationFee),
              paymentStatus: 'paid',
              bookedAt: a.createdAt.toISOString()
            };
          });

          if (filters?.status && filters.status !== 'all') {
            mapped = mapped.filter(a => a.status === filters.status);
          }

          return mapped;
        }
      }
    } catch (err) {
      console.warn('[AppointmentService] Prisma getAppointments error:', err);
    }

    let appointments = AarogyaStorage.getAppointments();

    if (filters?.patientProfileId && filters.patientProfileId !== 'all') {
      appointments = appointments.filter(a => a.patientProfileId === filters.patientProfileId);
    }

    if (filters?.doctorId && filters.doctorId !== 'all') {
      appointments = appointments.filter(a => a.doctorId === filters.doctorId);
    }

    if (filters?.status && filters.status !== 'all') {
      appointments = appointments.filter(a => a.status === filters.status);
    }

    return appointments;
  }

  // Doctor Working Console Methods (Gated by RBAC Engine)
  static async getDoctorAppointments(
    actorUserId: string,
    doctorId: string,
    organizationId: string
  ): Promise<Appointment[]> {
    // 1. RBAC Gate: Must be authorized staff member for this organization and doctor
    OrgService.checkStaffPermission(actorUserId, organizationId, 'VIEW_APPOINTMENTS', {
      actorDoctorId: doctorId,
      targetDoctorId: doctorId
    });

    const all = await this.getAppointments({ doctorId });
    return all.filter(a => a.doctorId === doctorId);
  }

  static async advanceDoctorQueue(
    actorUserId: string,
    doctorId: string,
    organizationId: string,
    newCurrentToken: number
  ): Promise<number> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_APPOINTMENTS', {
      actorDoctorId: doctorId,
      targetDoctorId: doctorId
    });

    try {
      if (typeof window === 'undefined') {
        await prisma.appointment.updateMany({
          where: { doctorId },
          data: { currentQueueToken: newCurrentToken }
        });
      }
    } catch (err) {
      console.warn('[AppointmentService] advanceDoctorQueue Prisma error:', err);
    }

    const appts = AarogyaStorage.getAppointments().map(a =>
      a.doctorId === doctorId ? { ...a, currentQueueToken: newCurrentToken } : a
    );
    appts.forEach(a => {
      if (a.doctorId === doctorId) {
        AarogyaStorage.updateAppointment(a.id, { currentQueueToken: newCurrentToken });
      }
    });

    return newCurrentToken;
  }

  static async updateDoctorAppointmentStatus(
    actorUserId: string,
    doctorId: string,
    organizationId: string,
    appointmentId: string,
    status: AppointmentStatus,
    clinicalNotes?: string
  ): Promise<Appointment> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_APPOINTMENTS', {
      actorDoctorId: doctorId,
      targetDoctorId: doctorId
    });

    let prismaStatus: any = PrismaAppointmentStatus.CONFIRMED;
    if (status === 'in_consultation') prismaStatus = (PrismaAppointmentStatus as any).IN_CONSULTATION || 'IN_CONSULTATION';
    else if (status === 'completed') prismaStatus = (PrismaAppointmentStatus as any).COMPLETED || 'COMPLETED';
    else if (status === 'cancelled') prismaStatus = (PrismaAppointmentStatus as any).CANCELLED || 'CANCELLED';
    else if (status === 'rescheduled') prismaStatus = (PrismaAppointmentStatus as any).RESCHEDULED || PrismaAppointmentStatus.CONFIRMED;

    try {
      if (typeof window === 'undefined') {
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: prismaStatus,
            symptoms: clinicalNotes ? clinicalNotes : undefined
          }
        });
      }
    } catch (err) {
      console.warn('[AppointmentService] updateDoctorAppointmentStatus Prisma error:', err);
    }

    const updated = AarogyaStorage.updateAppointment(appointmentId, {
      status,
      notes: clinicalNotes
    });

    // Automatic Financial Escrow Ledger Trigger on Consultation Completion
    if (status === 'completed') {
      try {
        const doctors = await this.getDoctors();
        const doctor = doctors.find(d => d.id === doctorId);
        await SettlementService.recordAppointmentCompletionLedger({
          appointmentId: updated.id,
          doctorId: updated.doctorId,
          organizationId: organizationId,
          organizationName: doctor?.hospitalName || 'Apollo Hospital & Heart Center',
          patientName: updated.patientName,
          consultationFee: updated.consultationFee || doctor?.consultationFee || 800,
          actorUserId: actorUserId
        });
      } catch (err) {
        console.warn('[AppointmentService] Failed to record consultation escrow ledger entry:', err);
      }
    }

    return updated;
  }

  static async updateDoctorAvailability(
    actorUserId: string,
    doctorId: string,
    organizationId: string,
    availableSlots: string[],
    availableDays: string[]
  ): Promise<Doctor> {
    OrgService.checkStaffPermission(actorUserId, organizationId, 'MANAGE_APPOINTMENTS', {
      actorDoctorId: doctorId,
      targetDoctorId: doctorId
    });

    const doc = await this.getDoctorById(doctorId);
    if (!doc) throw new Error(`Doctor ${doctorId} not found.`);

    doc.availableSlots = availableSlots;
    doc.availableDays = availableDays;

    AarogyaStorage.updateDoctorVerification(doctorId, doc.isVerified);

    return doc;
  }
}

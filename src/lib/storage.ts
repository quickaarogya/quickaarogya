'use client';

import {
  UserProfile,
  FamilyMember,
  EmergencyProfile,
  MedicationSchedule,
  MedicationLog,
  Appointment,
  MedicalDocument,
  BiomarkerReportItem,
  HealthcareExpense,
  PharmacyOrder,
  OrderStatus,
  HealthNotification,
  Doctor,
  Hospital,
  Medicine,
  Pharmacy,
  LabTest,
  LabBooking,
  HealthInboxItem,
  EscrowLedgerEntry
} from '../types';

import {
  initialUserProfile,
  initialFamilyMembers,
  initialEmergencyProfile,
  initialDoctors,
  initialHospitals,
  initialMedicines,
  initialPharmacies,
  initialMedicationSchedules,
  initialMedicationLogs,
  initialAppointments,
  initialMedicalDocuments,
  initialBiomarkers,
  initialLabTests,
  initialLabBookings,
  initialHealthcareExpenses,
  initialPharmacyOrders,
  initialNotifications,
  initialInboxItems
} from './mockData';

const STORAGE_KEYS = {
  ACTIVE_PROFILE_ID: 'qa_active_profile_id',
  THEME: 'qa_theme',
  USER_PROFILE: 'qa_user_profile',
  FAMILY_MEMBERS: 'qa_family_members',
  EMERGENCY_PROFILE: 'qa_emergency_profile',
  MEDICATION_SCHEDULES: 'qa_medication_schedules',
  MEDICATION_LOGS: 'qa_medication_logs',
  APPOINTMENTS: 'qa_appointments',
  MEDICAL_DOCUMENTS: 'qa_medical_documents',
  BIOMARKERS: 'qa_biomarkers',
  LAB_BOOKINGS: 'qa_lab_bookings',
  HEALTHCARE_EXPENSES: 'qa_healthcare_expenses',
  PHARMACY_ORDERS: 'qa_pharmacy_orders',
  NOTIFICATIONS: 'qa_notifications',
  INBOX_ITEMS: 'qa_inbox_items',
  DOCTORS: 'qa_doctors',
  HOSPITALS: 'qa_hospitals',
  MEDICINES: 'qa_medicines',
  PHARMACIES: 'qa_pharmacies',
  LAB_TESTS: 'qa_lab_tests',
  SOS_ACTIVE: 'qa_sos_active',
  ESCROW_LEDGER: 'qa_escrow_ledger',
  WISHLIST_DOCTORS: 'qa_wishlist_doctors',
  WISHLIST_HOSPITALS: 'qa_wishlist_hospitals',
  WISHLIST_MEDICINES: 'qa_wishlist_medicines'
};

const memoryStorage: { [key: string]: string } = {};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    const mem = memoryStorage[key];
    if (!mem) return fallback;
    try {
      return JSON.parse(mem);
    } catch {
      return mem as unknown as T;
    }
  }
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    try {
      return JSON.parse(item);
    } catch {
      return item as unknown as T;
    }
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  const json = JSON.stringify(value);
  if (typeof window === 'undefined') {
    memoryStorage[key] = json;
    return;
  }
  try {
    localStorage.setItem(key, json);
    window.dispatchEvent(new Event('storage-update'));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
}

export const AarogyaStorage = {
  // Theme
  getTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  },
  setTheme(theme: 'light' | 'dark') {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.dispatchEvent(new Event('theme-change'));
  },

  // Active Context Profile (Self or Family Member)
  getActiveProfileId(): string {
    return getItem<string>(STORAGE_KEYS.ACTIVE_PROFILE_ID, 'usr-101');
  },
  setActiveProfileId(id: string) {
    setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  },

  // SOS Mode
  isSosActive(): boolean {
    return getItem<boolean>(STORAGE_KEYS.SOS_ACTIVE, false);
  },
  setSosActive(active: boolean) {
    setItem(STORAGE_KEYS.SOS_ACTIVE, active);
  },

  // User Profile
  getUserProfile(): UserProfile {
    return getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE, initialUserProfile);
  },
  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    setItem(STORAGE_KEYS.USER_PROFILE, updated);
    return updated;
  },

  // Family Members
  getFamilyMembers(): FamilyMember[] {
    return getItem<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS, initialFamilyMembers);
  },
  setFamilyMembers(members: FamilyMember[]) {
    setItem(STORAGE_KEYS.FAMILY_MEMBERS, members);
  },
  addFamilyMember(member: Omit<FamilyMember, 'id' | 'primaryUserProfileId'> & { primaryUserProfileId?: string }): FamilyMember {
    const members = this.getFamilyMembers();
    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      primaryUserProfileId: member.primaryUserProfileId || 'usr-101'
    };
    const updated = [...members, newMember];
    setItem(STORAGE_KEYS.FAMILY_MEMBERS, updated);
    return newMember;
  },
  updateFamilyMember(id: string, updates: Partial<FamilyMember>): FamilyMember {
    const members = this.getFamilyMembers();
    const index = members.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error(`Family member with id ${id} not found.`);
    }
    const updatedMember = { ...members[index], ...updates };
    const updatedList = [...members];
    updatedList[index] = updatedMember;
    setItem(STORAGE_KEYS.FAMILY_MEMBERS, updatedList);
    return updatedMember;
  },
  deleteFamilyMember(id: string) {
    const members = this.getFamilyMembers().filter(m => m.id !== id);
    setItem(STORAGE_KEYS.FAMILY_MEMBERS, members);
  },

  // Emergency Profile
  getEmergencyProfile(): EmergencyProfile {
    return getItem<EmergencyProfile>(STORAGE_KEYS.EMERGENCY_PROFILE, initialEmergencyProfile);
  },
  updateEmergencyProfile(profile: Partial<EmergencyProfile>): EmergencyProfile {
    const current = this.getEmergencyProfile();
    const updated = { ...current, ...profile, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.EMERGENCY_PROFILE, updated);
    return updated;
  },

  // Medication Schedules
  getMedicationSchedules(): MedicationSchedule[] {
    return getItem<MedicationSchedule[]>(STORAGE_KEYS.MEDICATION_SCHEDULES, initialMedicationSchedules);
  },
  setMedicationSchedules(schedules: MedicationSchedule[]) {
    setItem(STORAGE_KEYS.MEDICATION_SCHEDULES, schedules);
  },
  addMedicationSchedule(schedule: Omit<MedicationSchedule, 'id'>): MedicationSchedule {
    const schedules = this.getMedicationSchedules();
    const newSched: MedicationSchedule = {
      ...schedule,
      id: `sched-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    setItem(STORAGE_KEYS.MEDICATION_SCHEDULES, [newSched, ...schedules]);
    return newSched;
  },
  updateMedicationSchedule(id: string, updates: Partial<MedicationSchedule>) {
    const schedules = this.getMedicationSchedules().map(s => (s.id === id ? { ...s, ...updates } : s));
    setItem(STORAGE_KEYS.MEDICATION_SCHEDULES, schedules);
  },

  // Medication Logs & Dose Actions
  getMedicationLogs(): MedicationLog[] {
    return getItem<MedicationLog[]>(STORAGE_KEYS.MEDICATION_LOGS, initialMedicationLogs);
  },
  setMedicationLogs(logs: MedicationLog[]) {
    setItem(STORAGE_KEYS.MEDICATION_LOGS, logs);
  },
  logDoseAction(scheduleId: string, action: 'taken' | 'skipped' | 'snoozed') {
    const schedules = this.getMedicationSchedules();
    const targetSched = schedules.find(s => s.id === scheduleId);
    if (!targetSched) return;

    // 1. Update remaining quantity if taken
    if (action === 'taken' && targetSched.remainingQuantity > 0) {
      this.updateMedicationSchedule(scheduleId, {
        remainingQuantity: targetSched.remainingQuantity - 1
      });

      // Check if low and generate alert if needed
      if (targetSched.remainingQuantity - 1 <= targetSched.refillThreshold) {
        this.addNotification({
          type: 'refill_alert',
          title: `Refill Reminder: ${targetSched.medicineName}`,
          message: `Only ${targetSched.remainingQuantity - 1} doses remaining for ${targetSched.patientName}. Order a refill now.`,
          urgency: 'high',
          actionUrl: '/medicines'
        });
      }
    }

    // 2. Add to logs
    const logs = this.getMedicationLogs();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: MedicationLog = {
      id: `log-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      scheduleId,
      medicineName: targetSched.medicineName,
      scheduledTime: `Today, ${nowStr}`,
      takenTime: action === 'taken' ? nowStr : undefined,
      status: action
    };
    setItem(STORAGE_KEYS.MEDICATION_LOGS, [newLog, ...logs]);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, initialAppointments);
  },
  setAppointments(appointments: Appointment[]) {
    setItem(STORAGE_KEYS.APPOINTMENTS, appointments);
  },
  bookAppointment(appointment: Omit<Appointment, 'id' | 'appointmentNumber' | 'status' | 'tokenNumber'> & { id?: string; appointmentNumber?: string; status?: Appointment['status']; tokenNumber?: number }): Appointment {
    const appts = this.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: appointment.id || `apt-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      appointmentNumber: appointment.appointmentNumber || `QA-APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: appointment.status || 'confirmed',
      tokenNumber: appointment.tokenNumber || Math.floor(5 + Math.random() * 15),
      currentQueueToken: 3
    };
    setItem(STORAGE_KEYS.APPOINTMENTS, [newApt, ...appts]);

    // Also add to expenses
    this.addHealthcareExpense({
      patientProfileId: newApt.patientProfileId,
      title: `Consultation with ${newApt.doctorName}`,
      category: 'doctor_consultation',
      amount: newApt.consultationFee,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      isInsuranceClaimed: false
    });

    // Notify user
    this.addNotification({
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: `Your appointment with ${newApt.doctorName} is confirmed for ${newApt.dateTime}. Token #${newApt.tokenNumber}`,
      urgency: 'medium',
      actionUrl: '/appointments'
    });

    return newApt;
  },
  updateAppointment(id: string, updates: Partial<Appointment>): Appointment {
    const appts = this.getAppointments();
    const index = appts.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Appointment with id ${id} not found.`);
    }
    const updatedApt = { ...appts[index], ...updates };
    const updatedList = [...appts];
    updatedList[index] = updatedApt;
    setItem(STORAGE_KEYS.APPOINTMENTS, updatedList);
    return updatedApt;
  },
  cancelAppointment(id: string) {
    const appts = this.getAppointments().map(a => (a.id === id ? { ...a, status: 'cancelled' as const } : a));
    setItem(STORAGE_KEYS.APPOINTMENTS, appts);
  },

  // Medical Documents & Vault
  getMedicalDocuments(): MedicalDocument[] {
    return getItem<MedicalDocument[]>(STORAGE_KEYS.MEDICAL_DOCUMENTS, initialMedicalDocuments);
  },
  addMedicalDocument(doc: Omit<MedicalDocument, 'id'>): MedicalDocument {
    const docs = this.getMedicalDocuments();
    const newDoc: MedicalDocument = {
      ...doc,
      id: `doc-rec-${Date.now()}`
    };
    setItem(STORAGE_KEYS.MEDICAL_DOCUMENTS, [newDoc, ...docs]);
    return newDoc;
  },
  deleteMedicalDocument(id: string): void {
    const docs = this.getMedicalDocuments().filter(d => d.id !== id);
    setItem(STORAGE_KEYS.MEDICAL_DOCUMENTS, docs);
  },
  updateMedicalDocumentNotes(id: string, notes: string): void {
    const docs = this.getMedicalDocuments().map(d => (d.id === id ? { ...d, notes } : d));
    setItem(STORAGE_KEYS.MEDICAL_DOCUMENTS, docs);
  },

  // Biomarkers
  getBiomarkers(): BiomarkerReportItem[] {
    return getItem<BiomarkerReportItem[]>(STORAGE_KEYS.BIOMARKERS, initialBiomarkers);
  },
  addBiomarker(bio: Omit<BiomarkerReportItem, 'id'>): BiomarkerReportItem {
    const items = this.getBiomarkers();
    const newItem: BiomarkerReportItem = {
      ...bio,
      id: `bio-${Date.now()}`
    };
    setItem(STORAGE_KEYS.BIOMARKERS, [newItem, ...items]);
    return newItem;
  },

  // Doctors & Hospitals
  getDoctors(): Doctor[] {
    const docs = getItem<Doctor[]>(STORAGE_KEYS.DOCTORS, initialDoctors);
    if (!docs || docs.length === 0 || (docs[0]?.id && !docs[0].id.startsWith('SAG-D'))) {
      this.setDoctors(initialDoctors);
      return initialDoctors;
    }
    return docs;
  },
  setDoctors(doctors: Doctor[]): void {
    setItem(STORAGE_KEYS.DOCTORS, doctors);
  },
  addDoctor(doctor: Doctor): void {
    const docs = this.getDoctors();
    setItem(STORAGE_KEYS.DOCTORS, [doctor, ...docs]);
  },
  updateDoctorVerification(idOrOrgId: string, isVerified: boolean): void {
    const docs = this.getDoctors().map(d =>
      d.id === idOrOrgId || d.organizationId === idOrOrgId || d.hospitalName.includes(idOrOrgId)
        ? { ...d, isVerified }
        : d
    );
    setItem(STORAGE_KEYS.DOCTORS, docs);
  },
  getHospitals(): Hospital[] {
    const hosps = getItem<Hospital[]>(STORAGE_KEYS.HOSPITALS, initialHospitals);
    if (!hosps || hosps.length === 0 || (hosps[0]?.id && !hosps[0].id.startsWith('SAG-F'))) {
      this.setHospitals(initialHospitals);
      return initialHospitals;
    }
    return hosps;
  },
  setHospitals(hospitals: Hospital[]): void {
    setItem(STORAGE_KEYS.HOSPITALS, hospitals);
  },
  getMedicines(): Medicine[] {
    return getItem<Medicine[]>(STORAGE_KEYS.MEDICINES, initialMedicines);
  },
  getPharmacies(): Pharmacy[] {
    return getItem<Pharmacy[]>(STORAGE_KEYS.PHARMACIES, initialPharmacies);
  },
  addPharmacy(pharmacy: Pharmacy): void {
    const pharmas = this.getPharmacies();
    setItem(STORAGE_KEYS.PHARMACIES, [pharmacy, ...pharmas]);
  },
  updatePharmacyVerification(idOrOrgId: string, isVerified: boolean): void {
    const pharmas = this.getPharmacies().map(p =>
      p.id === idOrOrgId || p.organizationId === idOrOrgId || p.name.includes(idOrOrgId)
        ? { ...p, isVerified }
        : p
    );
    setItem(STORAGE_KEYS.PHARMACIES, pharmas);
  },

  // Lab Tests & Bookings
  getLabTests(): LabTest[] {
    return getItem<LabTest[]>(STORAGE_KEYS.LAB_TESTS, initialLabTests);
  },
  getLabBookings(): LabBooking[] {
    return getItem<LabBooking[]>(STORAGE_KEYS.LAB_BOOKINGS, initialLabBookings);
  },
  bookLabTest(booking: Omit<LabBooking, 'id' | 'bookingNumber' | 'status'>): LabBooking {
    const bookings = this.getLabBookings();
    const newBooking: LabBooking = {
      ...booking,
      id: `lb-${Date.now()}`,
      bookingNumber: `QA-LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'collector_assigned',
      phlebotomistName: 'Ravi Verma (Certified Phlebotomist)',
      phlebotomistPhone: '+91 98100 23456'
    };
    setItem(STORAGE_KEYS.LAB_BOOKINGS, [newBooking, ...bookings]);

    this.addHealthcareExpense({
      patientProfileId: newBooking.patientProfileId,
      title: `Lab Test: ${newBooking.testNames.join(', ')}`,
      category: 'lab_diagnostics',
      amount: newBooking.totalPrice,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      isInsuranceClaimed: false
    });

    this.addNotification({
      type: 'lab_ready',
      title: 'Lab Test Booked Successfully',
      message: `Home sample collection confirmed for ${newBooking.scheduledDate} (${newBooking.scheduledTimeSlot}).`,
      urgency: 'medium',
      actionUrl: '/labs'
    });

    return newBooking;
  },

  // Pharmacy Orders
  getPharmacyOrders(): PharmacyOrder[] {
    return getItem<PharmacyOrder[]>(STORAGE_KEYS.PHARMACY_ORDERS, initialPharmacyOrders);
  },
  placePharmacyOrder(order: PharmacyOrder): PharmacyOrder {
    const orders = this.getPharmacyOrders();
    setItem(STORAGE_KEYS.PHARMACY_ORDERS, [order, ...orders]);

    this.addHealthcareExpense({
      patientProfileId: order.patientProfileId,
      title: `Medicine Order: ${order.pharmacyName}`,
      category: 'medicines',
      amount: order.totalAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      isInsuranceClaimed: false
    });

    return order;
  },
  updatePharmacyOrderStatus(id: string, status: OrderStatus, updates?: Partial<PharmacyOrder>): void {
    const orders = this.getPharmacyOrders().map(o => (o.id === id ? { ...o, ...updates, status } : o));
    setItem(STORAGE_KEYS.PHARMACY_ORDERS, orders);
  },
  cancelPharmacyOrder(id: string): void {
    const orders = this.getPharmacyOrders().map(o => (o.id === id ? { ...o, status: 'cancelled' as const } : o));
    setItem(STORAGE_KEYS.PHARMACY_ORDERS, orders);
  },

  // Healthcare Expenses
  getHealthcareExpenses(): HealthcareExpense[] {
    return getItem<HealthcareExpense[]>(STORAGE_KEYS.HEALTHCARE_EXPENSES, initialHealthcareExpenses);
  },
  addHealthcareExpense(expense: Omit<HealthcareExpense, 'id'>): HealthcareExpense {
    const expenses = this.getHealthcareExpenses();
    const newExp: HealthcareExpense = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setItem(STORAGE_KEYS.HEALTHCARE_EXPENSES, [newExp, ...expenses]);
    return newExp;
  },

  // Notifications (Legacy format compatibility)
  getNotifications(): HealthNotification[] {
    const inbox = this.getInboxItems();
    return inbox.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      time: item.timestamp,
      isRead: item.isRead,
      actionUrl: item.action?.url,
      urgency: item.priority === 'urgent' ? 'high' : item.priority === 'important' ? 'medium' : 'low',
      category: item.category,
      priority: item.priority,
      relatedEntity: item.relatedEntity,
      actionLabel: item.action?.label
    }));
  },
  addNotification(notif: Omit<HealthNotification, 'id' | 'time' | 'isRead'>): HealthNotification {
    const newInboxItem: HealthInboxItem = {
      id: `inbox-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: 'usr-101',
      category: notif.category || (
        notif.type === 'appointment' ? 'appointments' :
        notif.type === 'refill_alert' || notif.type === 'dose_reminder' ? 'medicines' :
        notif.type === 'lab_ready' ? 'tests' :
        notif.type === 'prescription_uploaded' ? 'records' :
        notif.type === 'family_attention' || notif.type === 'vaccination_due' ? 'family' :
        notif.type === 'order_delivered' ? 'orders' :
        notif.type === 'payment_completed' ? 'payments' : 'appointments'
      ),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      priority: notif.priority || (notif.urgency === 'high' || notif.urgency === 'emergency' ? 'urgent' : notif.urgency === 'medium' ? 'important' : 'normal'),
      isRead: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      action: notif.actionUrl ? { label: notif.actionLabel || 'Take Action', url: notif.actionUrl } : undefined,
      relatedEntity: notif.relatedEntity,
      deliveryChannels: [
        { channel: 'in_app', status: 'delivered', sentAt: new Date().toISOString() },
        { channel: 'push', status: 'delivered', provider: 'FCM Gateway', sentAt: new Date().toISOString() }
      ]
    };

    this.addInboxItem(newInboxItem);

    return {
      ...notif,
      id: newInboxItem.id,
      time: 'Just now',
      isRead: false
    };
  },
  markNotificationAsRead(id: string) {
    this.markInboxItemRead(id);
  },
  markAllNotificationsRead() {
    this.markAllInboxItemsRead();
  },
  clearNotifications() {
    this.clearInbox();
  },

  // Health Inbox (Unified Healthcare Activity Center)
  getInboxItems(): HealthInboxItem[] {
    return getItem<HealthInboxItem[]>(STORAGE_KEYS.INBOX_ITEMS, initialInboxItems);
  },
  setInboxItems(items: HealthInboxItem[]): void {
    setItem(STORAGE_KEYS.INBOX_ITEMS, items);
  },
  addInboxItem(item: Omit<HealthInboxItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): HealthInboxItem {
    const list = this.getInboxItems();
    const newItem: HealthInboxItem = {
      ...item,
      id: item.id || `inbox-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      timestamp: item.timestamp || 'Just now',
      isRead: item.isRead ?? false,
      deliveryChannels: item.deliveryChannels || [
        { channel: 'in_app', status: 'delivered', sentAt: new Date().toISOString() }
      ]
    };
    setItem(STORAGE_KEYS.INBOX_ITEMS, [newItem, ...list]);
    return newItem;
  },
  updateInboxItem(id: string, updates: Partial<HealthInboxItem>): HealthInboxItem {
    const list = this.getInboxItems();
    const index = list.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error(`Inbox item with id ${id} not found.`);
    }
    const updatedItem = { ...list[index], ...updates };
    const updatedList = [...list];
    updatedList[index] = updatedItem;
    setItem(STORAGE_KEYS.INBOX_ITEMS, updatedList);
    return updatedItem;
  },
  deleteInboxItem(id: string): void {
    const list = this.getInboxItems().filter(i => i.id !== id);
    setItem(STORAGE_KEYS.INBOX_ITEMS, list);
  },
  markInboxItemRead(id: string): void {
    const list = this.getInboxItems().map(i => (i.id === id ? { ...i, isRead: true } : i));
    setItem(STORAGE_KEYS.INBOX_ITEMS, list);
  },
  markInboxItemUnread(id: string): void {
    const list = this.getInboxItems().map(i => (i.id === id ? { ...i, isRead: false } : i));
    setItem(STORAGE_KEYS.INBOX_ITEMS, list);
  },
  markAllInboxItemsRead(category?: string): void {
    const list = this.getInboxItems().map(i => {
      if (!category || category === 'all' || i.category === category) {
        return { ...i, isRead: true };
      }
      return i;
    });
    setItem(STORAGE_KEYS.INBOX_ITEMS, list);
  },
  clearInbox(): void {
    setItem(STORAGE_KEYS.INBOX_ITEMS, []);
  },

  // Financial Escrow & Commission Ledger
  getEscrowLedgerEntries(): EscrowLedgerEntry[] {
    return getItem<EscrowLedgerEntry[]>(STORAGE_KEYS.ESCROW_LEDGER, []);
  },
  addEscrowLedgerEntry(entry: EscrowLedgerEntry): EscrowLedgerEntry {
    const list = this.getEscrowLedgerEntries();
    const updated = [entry, ...list];
    setItem(STORAGE_KEYS.ESCROW_LEDGER, updated);
    return entry;
  },
  updateEscrowLedgerEntry(id: string, updates: Partial<EscrowLedgerEntry>): EscrowLedgerEntry {
    const list = this.getEscrowLedgerEntries();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Escrow ledger entry with id ${id} not found.`);
    const updatedEntry = { ...list[index], ...updates };
    const updatedList = [...list];
    updatedList[index] = updatedEntry;
    setItem(STORAGE_KEYS.ESCROW_LEDGER, updatedList);
    return updatedEntry;
  },
  clearEscrowLedger(): void {
    setItem(STORAGE_KEYS.ESCROW_LEDGER, []);
  },

  // Wishlist / Saved Items
  getWishlistDoctors(): string[] {
    return getItem<string[]>(STORAGE_KEYS.WISHLIST_DOCTORS, ['doc-1', 'doc-3']);
  },
  toggleWishlistDoctor(id: string): string[] {
    const list = this.getWishlistDoctors();
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    setItem(STORAGE_KEYS.WISHLIST_DOCTORS, updated);
    return updated;
  },
  getWishlistHospitals(): string[] {
    return getItem<string[]>(STORAGE_KEYS.WISHLIST_HOSPITALS, ['hosp-bhagyodaya']);
  },
  toggleWishlistHospital(id: string): string[] {
    const list = this.getWishlistHospitals();
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    setItem(STORAGE_KEYS.WISHLIST_HOSPITALS, updated);
    return updated;
  },
  getWishlistMedicines(): string[] {
    return getItem<string[]>(STORAGE_KEYS.WISHLIST_MEDICINES, ['med-1', 'med-2']);
  },
  toggleWishlistMedicine(id: string): string[] {
    const list = this.getWishlistMedicines();
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    setItem(STORAGE_KEYS.WISHLIST_MEDICINES, updated);
    return updated;
  }
};

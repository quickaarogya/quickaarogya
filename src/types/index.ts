// ==========================================
// Quick Aarogya - Healthcare Platform Core Types
// ==========================================

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'pharmacy_admin' | 'lab_admin' | 'platform_admin';

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  abhaId?: string; // Ayushman Bharat Health Account ID
  avatarUrl?: string;
  heightCm?: number;
  weightKg?: number;
  emergencyPinHash?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  allergies?: string[];
  chronicConditions?: string[];
  createdAt: string;
}

export type FamilyRelationship = 'parent' | 'child' | 'spouse' | 'relative' | 'caregiver' | 'sibling' | 'grandparent' | 'other';

export type FamilyPermission =
  | 'VIEW_APPOINTMENTS'
  | 'BOOK_APPOINTMENTS'
  | 'VIEW_MEDICATIONS'
  | 'MANAGE_MEDICATIONS'
  | 'VIEW_RECORDS'
  | 'UPLOAD_RECORDS'
  | 'VIEW_EXPENSES'
  | 'EMERGENCY_ACCESS';

export type CaregiverPermissionLevel = 'view_only' | 'medication_manager' | 'appointment_manager' | 'full_proxy' | 'emergency_only';

export interface FamilyVaccinationDue {
  vaccineName: string;
  dueDate: string;
  status: 'due' | 'overdue' | 'completed';
}

export interface FamilyMember {
  id: string;
  primaryUserProfileId: string;
  fullName: string;
  relationship: FamilyRelationship;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  abhaId?: string;
  avatarUrl?: string;
  permissionLevel: CaregiverPermissionLevel;
  permissions: FamilyPermission[];
  chronicConditions?: string[];
  allergies?: string[];
  emergencyContact?: string;
  vaccinationsDue?: FamilyVaccinationDue[];
  notes?: string;
}

export interface FamilyHealthFeedItem {
  id: string;
  familyMemberId: string;
  memberName: string;
  relationship: FamilyRelationship;
  type: 'appointment' | 'refill_alert' | 'vaccination' | 'lab_report' | 'reminder';
  title: string;
  description: string;
  dueDate?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl: string;
  actionLabel?: string;
}

export interface FamilyHealthOverview {
  totalMembers: number;
  activeRemindersCount: number;
  upcomingAppointmentsCount: number;
  lowRefillsCount: number;
  feedItems: FamilyHealthFeedItem[];
}

// Emergency Health Profile
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface EmergencyProfile {
  id: string;
  userProfileId: string;
  fullName: string;
  bloodGroup: BloodGroup;
  dateOfBirth: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedicationsSummary: string[];
  implantedDevices: string[];
  organDonor: boolean;
  emergencyContacts: EmergencyContact[];
  publicEmergencyToken: string; // Used for QR code URL
  requiresPin: boolean;
  updatedAt: string;
}

// Doctor & Hospital
export interface Doctor {
  id: string;
  organizationId?: string;
  name: string;
  title: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  ratingAverage: number;
  ratingCount: number;
  patientCount?: string;
  reviewsCount?: string;
  languages?: string[];
  consultationTypes?: ('in_person' | 'video_teleconsult')[];
  hospitalName: string;
  hospitalId?: string;
  clinicAddress: string;
  phone?: string;
  avatarUrl: string;
  availableDays: string[];
  availableSlots: string[];
  isVerified: boolean;
  about: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  locality?: string;
  distanceKm: number;
  phone?: string;
  emergencyHelpline: string;
  has24x7Emergency: boolean;
  icuBedsAvailable: number;
  totalBeds: number;
  rating: number;
  facilities: string[];
  imageUrl: string;
}

// Appointment
export type AppointmentStatus =
  | 'requested'
  | 'booked'
  | 'confirmed'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type AppointmentType = 'in_person' | 'video_teleconsult';

export interface AppointmentSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  patientProfileId: string;
  patientName: string;
  hospitalName: string;
  dateTime: string;
  date?: string;
  timeSlot?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  tokenNumber?: number;
  currentQueueToken?: number;
  symptoms: string;
  notes?: string;
  meetingLink?: string;
  consultationFee: number;
  paymentStatus: 'paid' | 'pending';
  bookedAt?: string;
}

// Medicines & Inventory
export type DosageTiming = 'before_food' | 'after_food' | 'with_food' | 'empty_stomach' | 'bedtime';
export type MedicineForm = 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'inhaler' | 'drops' | 'lotion' | 'cleanser' | 'powder';
export type MedicineCategory = 'medicines' | 'must_haves' | 'skin_care' | 'otc_wellness' | 'chronic_care';

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  form: MedicineForm;
  strength: string; // e.g. "500mg", "473ml"
  category?: MedicineCategory;
  manufacturer: string;
  price: number;
  mrp: number;
  discountPercent?: number;
  prescriptionRequired: boolean;
  sideEffects?: string[];
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  rating?: number;
  ratingCount?: number;
  unit?: string;
  description?: string;
}

export interface Pharmacy {
  id: string;
  organizationId?: string;
  name: string;
  address: string;
  distanceKm: number;
  rating: number;
  isOpen24x7: boolean;
  phone: string;
  estimatedDeliveryMins: number;
  deliveryFee: number;
  operatingHours?: string;
  deliveryRadiusKm?: number;
  licenseNumber?: string;
  isVerified?: boolean;
}

export type OrderStatus =
  | 'cart'
  | 'pending'
  | 'placed'
  | 'prescription_verification'
  | 'confirmed'
  | 'preparing'
  | 'processing'
  | 'ready'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface PharmacyOrderItem {
  medicineId: string;
  medicineName: string;
  genericName?: string;
  strength?: string;
  form?: MedicineForm;
  quantity: number;
  unitPrice: number;
  mrp?: number;
  totalPrice: number;
  requiresPrescription: boolean;
  pharmacyId?: string;
  pharmacyName?: string;
}

export interface PharmacyOrder {
  id: string;
  orderNumber: string;
  patientProfileId: string;
  patientName: string;
  pharmacyId: string;
  pharmacyName: string;
  items: PharmacyOrderItem[];
  subtotal: number;
  discountAmount?: number;
  deliveryFee: number;
  totalAmount: number;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  status: OrderStatus;
  requiresPrescription: boolean;
  prescriptionDocumentId?: string;
  prescriptionFileName?: string;
  prescriptionVerified?: boolean;
  prescriptionReviewNotes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  paymentMethod: 'upi' | 'card_token' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed';
  // Multi-Vendor Cart Splitting Fields
  isParentOrder?: boolean;
  parentOrderId?: string;
  subOrders?: PharmacyOrder[];
  vendorCount?: number;
}

// Medication Schedule & Adherence Logs
export type DoseLogStatus = 'pending' | 'taken' | 'skipped' | 'snoozed' | 'missed';
export type MedicationStatus = 'upcoming' | 'active' | 'paused' | 'completed' | 'discontinued' | 'refill_required';

export interface MedicationSchedule {
  id: string;
  patientProfileId: string;
  patientName: string;
  medicineName: string;
  genericName?: string;
  strength?: string; // e.g. "40mg", "500mg"
  form?: MedicineForm;
  unit?: string; // e.g. "tablets", "capsules", "ml", "puffs"
  dosage: string; // e.g. "1 Tablet"
  doseQuantity?: number;
  frequency: string; // e.g. "Twice Daily (Morning, Night)"
  timing: DosageTiming;
  timesOfDay: string[]; // ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  isChronic: boolean;
  initialQuantity: number;
  remainingQuantity: number;
  refillThreshold: number;
  instructions: string;
  colorTag: string;
  isActive: boolean;
  status: MedicationStatus;
  prescribingDoctor?: string;
  prescriptionReference?: string;
  notes?: string;
  reminderEnabled?: boolean;
  customReminderTimes?: string[];
}

export interface MedicationLog {
  id: string;
  scheduleId: string;
  patientProfileId?: string;
  medicineName: string;
  scheduledTime: string;
  scheduledDate?: string;
  takenTime?: string;
  status: DoseLogStatus;
  doseQuantity?: number;
  notes?: string;
}

// Medical Documents & Smart Reports
export type DocumentCategory =
  | 'prescription'
  | 'lab_report'
  | 'discharge_summary'
  | 'radiology_scan'
  | 'vaccination_record'
  | 'invoice'
  | 'insurance_policy'
  | 'other';

export interface MedicalDocument {
  id: string;
  patientProfileId: string;
  patientName: string;
  category: DocumentCategory;
  title: string;
  doctorOrLabName: string;
  date: string;
  fileUrl: string;
  fileType?: 'pdf' | 'png' | 'jpeg' | 'dicom';
  fileSizeBytes: number;
  tags: string[];
  notes?: string;
  storageKey?: string;
  isEncrypted?: boolean;
  relatedAppointmentId?: string;
  isAiExtracted?: boolean;
  extractedSummary?: string;
}

export type MedicalEventType =
  | 'consultation'
  | 'prescription'
  | 'lab_test'
  | 'diagnostic_report'
  | 'discharge_summary'
  | 'vaccination'
  | 'medication_start';

export interface MedicalTimelineEvent {
  id: string;
  patientProfileId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: MedicalEventType;
  description: string;
  doctorOrFacility?: string;
  relatedDocumentId?: string;
  relatedDocument?: MedicalDocument;
  tags: string[];
}

export interface BiomarkerReportItem {
  id: string;
  documentId: string;
  biomarker: string; // e.g. "HbA1c", "Serum Creatinine", "Total Cholesterol"
  value: string;
  numericValue: number;
  unit: string;
  refMin: number;
  refMax: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  explanation: string;
}

// Lab Tests & Bookings
export interface LabTest {
  id: string;
  name: string;
  category: 'Blood Test' | 'Imaging' | 'Pathology' | 'Health Checkup Package';
  sampleType: string;
  fastingRequiredHours: number;
  reportTurnaroundHours: number;
  price: number;
  mrp: number;
  description: string;
  parametersCount: number;
}

export interface LabBooking {
  id: string;
  bookingNumber: string;
  patientProfileId: string;
  patientName: string;
  testNames: string[];
  totalPrice: number;
  collectionType: 'home_collection' | 'walk_in';
  scheduledDate: string;
  scheduledTimeSlot: string;
  status: 'booked' | 'collector_assigned' | 'sample_collected' | 'report_ready' | 'completed';
  phlebotomistName?: string;
  phlebotomistPhone?: string;
  reportDocumentId?: string;
}

// Healthcare Expenses
export type ExpenseCategory = 'doctor_consultation' | 'medicines' | 'lab_diagnostics' | 'hospitalization' | 'insurance_premium' | 'devices';

export interface HealthcareExpense {
  id: string;
  patientProfileId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: 'UPI' | 'Credit Card' | 'Cash' | 'Insurance Claim';
  receiptDocumentId?: string;
  isInsuranceClaimed: boolean;
  claimStatus?: 'not_claimed' | 'in_review' | 'approved' | 'settled';
}

// Notifications & Inbox (Unified Healthcare Activity Center)
export type NotificationType =
  | 'dose_reminder'
  | 'refill_alert'
  | 'appointment'
  | 'lab_ready'
  | 'emergency_alert'
  | 'general'
  | 'prescription_uploaded'
  | 'appointment_cancelled'
  | 'followup_due'
  | 'family_attention'
  | 'order_delivered'
  | 'payment_completed'
  | 'vaccination_due'
  | 'vendor_new_appointment'
  | 'vendor_appointment_cancelled'
  | 'vendor_order_pending_rx'
  | 'vendor_low_balance'
  | 'vendor_new_order'
  | 'vendor_application_reviewed';

export type InboxCategory =
  | 'appointments'
  | 'medicines'
  | 'records'
  | 'orders'
  | 'family'
  | 'tests'
  | 'payments'
  | 'vendor_appointments'
  | 'vendor_orders'
  | 'vendor_settlements'
  | 'vendor_compliance';

export type InboxPriority = 'normal' | 'important' | 'urgent';

export interface RelatedEntity {
  type: 'appointment' | 'medication' | 'document' | 'order' | 'family_member' | 'lab_booking' | 'payment';
  id: string;
  name?: string;
  meta?: Record<string, any>;
}

export interface DeliveryChannelLog {
  channel: 'in_app' | 'push' | 'sms' | 'email' | 'whatsapp';
  status: 'delivered' | 'sent' | 'pending' | 'failed';
  provider?: string;
  externalId?: string;
  sentAt?: string;
  error?: string;
}

export interface HealthInboxItem {
  id: string;
  userId?: string;
  organizationId?: string;
  category: InboxCategory;
  type: NotificationType;
  title: string;
  message: string;
  priority: InboxPriority;
  isRead: boolean;
  timestamp: string; // e.g. "10 mins ago" or "Today at 08:30 AM"
  createdAt: string; // ISO 8601 string
  imageUrl?: string;
  relatedEntity?: RelatedEntity;
  action?: {
    label: string;
    url: string;
  };
  deliveryChannels: DeliveryChannelLog[];
  familyMemberId?: string;
  familyMemberName?: string;
}

export interface HealthNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  imageUrl?: string;
  actionUrl?: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  category?: InboxCategory;
  priority?: InboxPriority;
  relatedEntity?: RelatedEntity;
  actionLabel?: string;
}

export interface NotificationProviderResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

export interface NotificationChannelProvider {
  channel: 'in_app' | 'push' | 'sms' | 'email' | 'whatsapp';
  name: string;
  send(notification: HealthInboxItem): Promise<NotificationProviderResult>;
}

export interface InboxFilterOptions {
  userId?: string;
  category?: InboxCategory | 'all';
  priority?: InboxPriority | 'all';
  isRead?: boolean | 'all';
  searchQuery?: string;
}

// Financial Escrow & Platform Commission Ledger Types
export type EscrowStatus = 'in_escrow' | 'settled' | 'refunded' | 'failed';
export type LedgerReferenceType = 'appointment' | 'order' | 'lab_booking';

export interface CommissionRule {
  organizationId: string;
  commissionRatePercent: number; // e.g. 10 for 10%
  description?: string;
  effectiveFrom: string;
}

export interface EscrowLedgerEntry {
  id: string;
  organizationId: string;
  organizationName: string;
  referenceType: LedgerReferenceType;
  referenceId: string;
  referenceNumber: string; // e.g. QA-ORD-1021 or QA-APT-8819
  patientName: string;
  grossAmount: number; // total paid by patient (INR)
  platformCommissionRate: number; // e.g. 10 for 10%
  platformCommissionAmount: number; // grossAmount * (rate / 100)
  netVendorPayable: number; // grossAmount - commissionAmount
  status: EscrowStatus;
  transactionToken: string; // tokenized mock reference (e.g. TXN-ESCROW-2026-9021, no raw card numbers)
  createdAt: string;
  settledAt?: string;
  notes?: string;
}

export interface VendorEarningsSummary {
  organizationId: string;
  organizationName: string;
  totalGrossRevenue: number;
  totalPlatformCommission: number;
  totalNetEarnings: number;
  pendingEscrowAmount: number;
  settledAmount: number;
  commissionRatePercent: number;
  ledgerEntries: EscrowLedgerEntry[];
}

export interface AdminPlatformEarningsSummary {
  totalPlatformGrossVolume: number;
  totalCommissionCollected: number;
  totalVendorNetPayable: number;
  pendingEscrowHoldings: number;
  totalSettledDisbursements: number;
  totalTransactionsCount: number;
  organizationBreakdown: Array<{
    organizationId: string;
    organizationName: string;
    grossVolume: number;
    commissionCollected: number;
    netPayable: number;
    pendingEscrow: number;
    settled: number;
    transactionCount: number;
  }>;
  recentLedgerEntries: EscrowLedgerEntry[];
}

// Diagnostics & Imaging Types (CT Scans, Pathologies, X-Rays, Price Comparisons)
export interface DiagnosticItem {
  id: string;
  name: string;
  type: 'ct_scan' | 'pathology' | 'x_ray' | 'mri' | 'ultrasound';
  centerName: string;
  centerAddress?: string;
  locality?: string;
  ratingAverage: number;
  reviewsCount?: number;
  preparation?: string; // e.g. "4 Hours Fasting" or "No Fasting"
  reportTurnaround: string; // e.g. "Digital Film in 2 Hours" or "Same Day 6 PM"
  mrp: number;
  price: number;
  discountPercentage?: number;
  phone?: string;
  badge?: string; // e.g. "128-Slice High Speed", "NABL Verified", "Digital HD Film"
  homeCollectionAvailable?: boolean;
  sampleType?: string;
  bodyPart?: string;
  imageUrl?: string;
}

export interface CenterPriceComparison {
  centerId: string;
  centerName: string;
  centerType: string;
  locality: string;
  distanceKm: number;
  rating: number;
  accreditation: string; // e.g. "NABH & NABL Accredited"
  mrp: number;
  price: number;
  savings: number;
  turnaroundTime: string;
  phone: string;
  availableSlot: string;
  isLowestPrice?: boolean;
  isFastestReport?: boolean;
}

export interface TestPriceComparisonGroup {
  testId: string;
  testName: string;
  category: 'ct_scan' | 'pathology' | 'x_ray';
  description: string;
  centers: CenterPriceComparison[];
}

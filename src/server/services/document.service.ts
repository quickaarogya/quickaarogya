import { MedicalDocument, DocumentCategory, MedicalTimelineEvent } from '@/types';
import { AarogyaStorage } from '@/lib/storage';

export class DocumentService {
  static async getDocuments(filters?: {
    patientProfileId?: string;
    category?: string;
    searchQuery?: string;
  }): Promise<MedicalDocument[]> {
    let docs = AarogyaStorage.getMedicalDocuments();

    if (filters?.patientProfileId && filters.patientProfileId !== 'all') {
      docs = docs.filter(d => d.patientProfileId === filters.patientProfileId);
    }

    if (filters?.category && filters.category !== 'all') {
      docs = docs.filter(d => d.category === filters.category);
    }

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      docs = docs.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.doctorOrLabName.toLowerCase().includes(q) ||
          (d.notes && d.notes.toLowerCase().includes(q)) ||
          d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return docs;
  }

  static async getDocumentById(id: string): Promise<MedicalDocument | null> {
    const docs = AarogyaStorage.getMedicalDocuments();
    return docs.find(d => d.id === id) || null;
  }

  static async uploadDocument(data: {
    patientProfileId: string;
    patientName: string;
    category: DocumentCategory;
    title: string;
    doctorOrLabName: string;
    date: string;
    fileUrl?: string;
    fileType?: 'pdf' | 'png' | 'jpeg' | 'dicom';
    fileSizeBytes?: number;
    notes?: string;
    tags?: string[];
    relatedAppointmentId?: string;
  }): Promise<MedicalDocument> {
    if (!data.title.trim()) {
      throw new Error('Document title is required.');
    }
    if (!data.doctorOrLabName.trim()) {
      throw new Error('Doctor, clinic, or diagnostic center name is required.');
    }

    const secureStorageKey = `sec_vault_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newDoc: Omit<MedicalDocument, 'id'> = {
      patientProfileId: data.patientProfileId,
      patientName: data.patientName,
      category: data.category,
      title: data.title,
      doctorOrLabName: data.doctorOrLabName,
      date: data.date || new Date().toISOString().split('T')[0],
      fileUrl: data.fileUrl || '/sample-medical-doc.pdf',
      fileType: data.fileType || 'pdf',
      fileSizeBytes: data.fileSizeBytes || 1450000,
      tags: data.tags || [data.category, 'Verified Document'],
      notes: data.notes || '',
      storageKey: secureStorageKey,
      isEncrypted: true,
      relatedAppointmentId: data.relatedAppointmentId,
      isAiExtracted: false,
    };

    return AarogyaStorage.addMedicalDocument(newDoc);
  }

  static async deleteDocument(id: string): Promise<boolean> {
    AarogyaStorage.deleteMedicalDocument(id);
    return true;
  }

  static async updateDocumentNotes(id: string, notes: string): Promise<void> {
    AarogyaStorage.updateMedicalDocumentNotes(id, notes);
  }

  static async getMedicalTimeline(patientProfileId?: string): Promise<MedicalTimelineEvent[]> {
    const docs = AarogyaStorage.getMedicalDocuments();
    const appts = AarogyaStorage.getAppointments();
    const meds = AarogyaStorage.getMedicationSchedules();

    const timeline: MedicalTimelineEvent[] = [];

    // 1. Add Medical Documents to Timeline
    docs.forEach(doc => {
      if (patientProfileId && patientProfileId !== 'all' && doc.patientProfileId !== patientProfileId) {
        return;
      }

      let type: MedicalTimelineEvent['type'] = 'diagnostic_report';
      if (doc.category === 'prescription') type = 'prescription';
      else if (doc.category === 'lab_report') type = 'lab_test';
      else if (doc.category === 'discharge_summary') type = 'discharge_summary';
      else if (doc.category === 'vaccination_record') type = 'vaccination';

      timeline.push({
        id: `tl-doc-${doc.id}`,
        patientProfileId: doc.patientProfileId,
        patientName: doc.patientName,
        date: doc.date,
        title: doc.title,
        type,
        description: doc.notes || `Clinical record issued by ${doc.doctorOrLabName}`,
        doctorOrFacility: doc.doctorOrLabName,
        relatedDocumentId: doc.id,
        relatedDocument: doc,
        tags: doc.tags,
      });
    });

    // 2. Add Appointments to Timeline
    appts.forEach(apt => {
      if (patientProfileId && patientProfileId !== 'all' && apt.patientProfileId !== patientProfileId) {
        return;
      }

      const dateStr = apt.dateTime.split('T')[0] || apt.dateTime.split(' ')[0] || '2026-08-26';
      timeline.push({
        id: `tl-apt-${apt.id}`,
        patientProfileId: apt.patientProfileId,
        patientName: apt.patientName,
        date: dateStr,
        title: `Consultation with ${apt.doctorName}`,
        type: 'consultation',
        description: `Consultation (${apt.doctorSpecialty}) at ${apt.hospitalName}. Symptoms: ${apt.symptoms}`,
        doctorOrFacility: `${apt.doctorName} • ${apt.hospitalName}`,
        tags: [apt.doctorSpecialty, apt.status.toUpperCase()],
      });
    });

    // 3. Add Medication Regimen Starts to Timeline
    meds.forEach(med => {
      if (patientProfileId && patientProfileId !== 'all' && med.patientProfileId !== patientProfileId) {
        return;
      }

      timeline.push({
        id: `tl-med-${med.id}`,
        patientProfileId: med.patientProfileId,
        patientName: med.patientName,
        date: med.startDate,
        title: `Prescription Started: ${med.medicineName}`,
        type: 'medication_start',
        description: `Dosage: ${med.dosage} (${med.frequency}). Instructions: ${med.instructions}`,
        doctorOrFacility: 'Primary Regimen',
        tags: ['Medication', med.isChronic ? 'Chronic Care' : 'Acute'],
      });
    });

    // Sort Chronologically Descending (Latest Date First)
    return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

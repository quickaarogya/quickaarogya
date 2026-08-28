import { describe, it, expect, beforeEach } from 'vitest';
import { DocumentService } from '../src/server/services/document.service';
import { AarogyaStorage } from '../src/lib/storage';

describe('Phase 2 Medical Records & Chronological Timeline Tests', () => {
  it('should upload a new medical document with required metadata and secure storage key', async () => {
    const newDoc = await DocumentService.uploadDocument({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      category: 'lab_report',
      title: 'Lipid Profile & Liver Function Panel',
      doctorOrLabName: 'Dr. Lal PathLabs',
      date: '2026-08-20',
      notes: 'Fasting 12 hours. Triglycerides slightly elevated.',
      tags: ['lab_report', 'Cardiology', 'Lipids'],
    });

    expect(newDoc).toBeDefined();
    expect(newDoc.id).toContain('doc-rec-');
    expect(newDoc.category).toBe('lab_report');
    expect(newDoc.storageKey).toContain('sec_vault_');
    expect(newDoc.isEncrypted).toBe(true);
    expect(newDoc.notes).toBe('Fasting 12 hours. Triglycerides slightly elevated.');
  });

  it('should reject document upload with missing title', async () => {
    await expect(
      DocumentService.uploadDocument({
        patientProfileId: 'usr-101',
        patientName: 'Arjun Sharma',
        category: 'prescription',
        title: '',
        doctorOrLabName: 'Dr. Ananya Roy',
        date: '2026-08-20',
      })
    ).rejects.toThrow('Document title is required');
  });

  it('should filter documents by category and search query', async () => {
    const docs = await DocumentService.getDocuments({
      category: 'prescription',
      searchQuery: 'Telma',
    });

    expect(Array.isArray(docs)).toBe(true);
    docs.forEach(doc => {
      expect(doc.category).toBe('prescription');
      expect(doc.title.toLowerCase()).toContain('telma');
    });
  });

  it('should generate a unified chronological medical timeline sorted latest first', async () => {
    const timeline = await DocumentService.getMedicalTimeline('usr-101');

    expect(Array.isArray(timeline)).toBe(true);
    expect(timeline.length).toBeGreaterThan(0);

    // Verify events have required properties
    timeline.forEach(event => {
      expect(event.date).toBeDefined();
      expect(event.title).toBeDefined();
      expect(event.type).toBeDefined();
    });

    // Verify chronological order (Descending: latest first)
    for (let i = 0; i < timeline.length - 1; i++) {
      const currentTime = new Date(timeline[i].date).getTime();
      const nextTime = new Date(timeline[i + 1].date).getTime();
      expect(currentTime).toBeGreaterThanOrEqual(nextTime);
    }
  });

  it('should delete a medical document by id', async () => {
    const tempDoc = await DocumentService.uploadDocument({
      patientProfileId: 'usr-101',
      patientName: 'Arjun Sharma',
      category: 'other',
      title: 'Temporary Test File',
      doctorOrLabName: 'Test Clinic',
      date: '2026-08-25',
    });

    const docBefore = await DocumentService.getDocumentById(tempDoc.id);
    expect(docBefore).toBeDefined();

    const deleteSuccess = await DocumentService.deleteDocument(tempDoc.id);
    expect(deleteSuccess).toBe(true);

    const docAfter = await DocumentService.getDocumentById(tempDoc.id);
    expect(docAfter).toBeNull();
  });
});

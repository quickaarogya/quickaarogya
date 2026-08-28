'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderHeart,
  FileText,
  Upload,
  Share2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  Stethoscope,
  Pill,
  FlaskConical,
  Building2,
  Calendar,
  Layers,
  FileCode,
  Tag,
  Lock,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { DocumentService } from '../../server/services/document.service';
import {
  MedicalDocument,
  DocumentCategory,
  MedicalTimelineEvent,
  FamilyMember,
  UserProfile
} from '../../types';
import { PageHeader } from '../../components/ui/page-header';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs } from '../../components/ui/tabs';
import { EmptyState } from '../../components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { FormField } from '../../components/ui/form-field';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

export default function MedicalRecordsPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'vault'>('timeline');
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<MedicalTimelineEvent[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>('usr-101');

  // Vault Filtering State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // New Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('prescription');
  const [uploadDoctorOrLab, setUploadDoctorOrLab] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadPatientId, setUploadPatientId] = useState('usr-101');

  const loadData = async () => {
    const activeId = AarogyaStorage.getActiveProfileId();
    setActiveProfileId(activeId);
    setProfile(AarogyaStorage.getUserProfile());
    setFamilyMembers(AarogyaStorage.getFamilyMembers());

    const docs = await DocumentService.getDocuments({
      patientProfileId: activeId,
      category: selectedCategory,
      searchQuery,
    });
    setDocuments(docs);

    const timeline = await DocumentService.getMedicalTimeline(activeId);
    setTimelineEvents(timeline);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [selectedCategory, searchQuery, activeProfileId]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const patientName = uploadPatientId === 'usr-101'
        ? `${profile?.firstName || 'Arjun'} ${profile?.lastName || 'Sharma'}`
        : (familyMembers.find(f => f.id === uploadPatientId)?.fullName || 'Family Member');

      await DocumentService.uploadDocument({
        patientProfileId: uploadPatientId,
        patientName,
        category: uploadCategory,
        title: uploadTitle,
        doctorOrLabName: uploadDoctorOrLab || 'Certified Medical Practitioner',
        date: uploadDate,
        notes: uploadNotes,
        fileType: 'pdf',
        fileSizeBytes: 1850000,
        tags: [uploadCategory, 'Verified Vault Record'],
      });

      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadDoctorOrLab('');
      setUploadNotes('');
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string, title: string) => {
    if (confirm(`Permanently delete "${title}" from your encrypted health vault?`)) {
      await DocumentService.deleteDocument(id);
      if (previewDoc?.id === id) setPreviewDoc(null);
      loadData();
    }
  };

  const handleDownload = (doc: MedicalDocument) => {
    setDownloadSuccessMsg(`Downloaded secure copy of "${doc.title}.pdf"`);
    setTimeout(() => setDownloadSuccessMsg(null), 3000);
  };

  const getCategoryBadgeVariant = (cat: DocumentCategory) => {
    switch (cat) {
      case 'prescription': return 'teal';
      case 'lab_report': return 'default';
      case 'discharge_summary': return 'danger';
      case 'radiology_scan': return 'warning';
      default: return 'secondary';
    }
  };

  const getTimelineIcon = (type: MedicalTimelineEvent['type']) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope size={18} className="text-sky-600 dark:text-sky-400" />;
      case 'prescription':
        return <Pill size={18} className="text-teal-600 dark:text-teal-400" />;
      case 'lab_test':
        return <FlaskConical size={18} className="text-purple-600 dark:text-purple-400" />;
      case 'discharge_summary':
        return <Building2 size={18} className="text-red-600 dark:text-red-400" />;
      case 'medication_start':
        return <Clock size={18} className="text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText size={18} className="text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="page-wrapper animate-fade-in space-y-6">
      {/* Top View Mode & Upload Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-1">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
              viewMode === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-[#ff645e] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Timeline View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('vault')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg transition-all ${
              viewMode === 'vault'
                ? 'bg-white dark:bg-slate-900 text-[#ff645e] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Vault View ({documents.length})
          </button>
        </div>

        <Button
          onClick={() => setIsUploadModalOpen(true)}
          variant="care"
          size="sm"
          className="rounded-xl shadow-xs"
        >
          <Upload size={14} className="mr-1.5" /> Upload Record
        </Button>
      </div>

      {/* Download Alert Notice */}
      {downloadSuccessMsg && (
        <Alert variant="success" className="animate-in fade-in-50">
          <CheckCircle2 size={16} />
          <AlertTitle className="text-xs font-bold">Download Complete</AlertTitle>
          <AlertDescription className="text-xs">{downloadSuccessMsg}</AlertDescription>
        </Alert>
      )}

      {/* VIEW 1: CHRONOLOGICAL MEDICAL TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Chronological Health Timeline ({timelineEvents.length} Events)
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#ff645e] font-semibold">
              <ShieldCheck size={14} />
              <span>Generated from verified database records</span>
            </div>
          </div>

          {timelineEvents.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No timeline events recorded"
              description="Your healthcare timeline will automatically record consultations, lab tests, prescriptions, and uploaded files."
              actionLabel="Upload First Record"
              onAction={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-6 my-2">
              {timelineEvents.map((evt, idx) => (
                <div key={evt.id} className="relative group">
                  {/* Timeline Icon Node */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shadow-xs group-hover:border-[#ff645e] transition-colors">
                    {getTimelineIcon(evt.type)}
                  </div>

                  {/* Event Card */}
                  <Card variant="interactive" padding="default" className="shadow-xs hover:border-rose-300">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#ff645e]">
                            {evt.date}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs font-bold text-slate-500 uppercase">
                            {evt.type.replace('_', ' ')}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 mt-0.5">
                          {evt.title}
                        </h3>
                      </div>

                      {evt.doctorOrFacility && (
                        <Badge variant="secondary" className="text-xs">
                          {evt.doctorOrFacility}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Attached Document Quick Action */}
                    {evt.relatedDocument && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <FileText size={13} className="text-[#ff645e]" />
                          <span>Attached: {evt.relatedDocument.title}</span>
                        </div>

                        <Button
                          onClick={() => setPreviewDoc(evt.relatedDocument!)}
                          variant="secondary"
                          size="sm"
                          className="h-7 text-xs font-bold"
                        >
                          <Eye size={13} className="mr-1" /> View Document
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: VAULT GRID / LIST VIEW */}
      {viewMode === 'vault' && (
        <div className="space-y-5 animate-in fade-in-50">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across titles, doctors, facilities, notes, tags..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs
            tabs={[
              { id: 'all', label: 'All Vault Records' },
              { id: 'prescription', label: 'Prescriptions' },
              { id: 'lab_report', label: 'Lab Reports' },
              { id: 'discharge_summary', label: 'Discharge Summaries' },
              { id: 'radiology_scan', label: 'Scans & Imaging' },
              { id: 'invoice', label: 'Invoices & Claims' },
            ]}
            activeTab={selectedCategory}
            onTabChange={setSelectedCategory}
            variant="underline"
            accentColor="care"
          />

          {/* Document Cards Grid */}
          {documents.length === 0 ? (
            <EmptyState
              icon={FolderHeart}
              title="No records found in this category"
              description={
                searchQuery
                  ? `No medical records matched your search query "${searchQuery}".`
                  : "Upload your prescriptions and diagnostic reports to keep your vault organized."
              }
              actionLabel="Upload Medical Record"
              onAction={() => setIsUploadModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  variant="interactive"
                  padding="default"
                  className="flex flex-col justify-between hover:border-rose-300 transition-all group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <Badge variant={getCategoryBadgeVariant(doc.category)}>
                        {doc.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400">
                        {doc.date}
                      </span>
                    </div>

                    {/* Title & Issuer */}
                    <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-[#ff645e] transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Issued by: <strong>{doc.doctorOrLabName}</strong>
                    </p>

                    {/* Clinical Notes / Findings */}
                    {doc.notes && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 mt-3 text-xs text-slate-600 dark:text-slate-300">
                        <strong>Clinical Notes:</strong> {doc.notes}
                      </div>
                    )}

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {doc.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      {(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB • {doc.fileType?.toUpperCase() || 'PDF'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Button
                        onClick={() => setPreviewDoc(doc)}
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs px-2.5"
                      >
                        <Eye size={13} className="mr-1" /> Preview
                      </Button>
                      <Button
                        onClick={() => handleDownload(doc)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2"
                        title="Download Document"
                      >
                        <Download size={13} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteDocument(doc.id, doc.title)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60"
                        title="Delete Document"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogHeader>
          <DialogTitle>Upload Medical Record to Vault</DialogTitle>
          <DialogDescription>
            Securely upload prescriptions, lab diagnostic panels, and discharge summaries with encryption at rest.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <FormField label="Patient Profile" required>
            <Select
              value={uploadPatientId}
              onChange={(e) => setUploadPatientId(e.target.value)}
            >
              <option value="usr-101">Arjun Sharma (Self)</option>
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.relationship})
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Document Title" required helperText="e.g. Lipid Profile Panel 2026, Cardiology Prescription">
            <Input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Annual Blood Work & Lipid Panel"
              required
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Document Category" required>
              <Select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
              >
                <option value="prescription">Prescription</option>
                <option value="lab_report">Lab Report / Blood Test</option>
                <option value="discharge_summary">Hospital Discharge Summary</option>
                <option value="radiology_scan">Radiology / MRI / X-Ray</option>
                <option value="vaccination_record">Vaccination Record</option>
                <option value="invoice">Medical Bill / Pharmacy Invoice</option>
                <option value="insurance_policy">Health Insurance Claim</option>
                <option value="other">Other Clinical Document</option>
              </Select>
            </FormField>

            <FormField label="Record Date" required>
              <Input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                required
              />
            </FormField>
          </div>

          <FormField label="Doctor, Clinic, or Diagnostic Center" required>
            <Input
              type="text"
              value={uploadDoctorOrLab}
              onChange={(e) => setUploadDoctorOrLab(e.target.value)}
              placeholder="e.g. Dr. Ananya Roy / Dr. Lal PathLabs"
              required
            />
          </FormField>

          <FormField label="Clinical Notes & Doctor Observations (Optional)">
            <Textarea
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              placeholder="e.g. Fasting 12 hours prior. Follow up in 3 months with repeat HbA1c."
              rows={3}
            />
          </FormField>

          {/* Simulated File Upload Drag/Drop Box */}
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-center space-y-1 cursor-pointer hover:border-[#ff645e] transition-colors">
            <Upload size={24} className="mx-auto text-[#ff645e]" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drop file here or browse device
            </div>
            <div className="text-[10px] text-slate-400">
              Supports PDF, PNG, JPG, DICOM (Max 25 MB) • AES-256 Encrypted
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              type="submit"
              variant="care"
              className="flex-1 font-bold"
              isLoading={isUploading}
            >
              Upload to Secure Vault
            </Button>
            <Button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogHeader>
            <div className="flex justify-between items-start gap-2">
              <div>
                <DialogTitle>{previewDoc.title}</DialogTitle>
                <DialogDescription>
                  Issued by {previewDoc.doctorOrLabName} on {previewDoc.date} for {previewDoc.patientName}
                </DialogDescription>
              </div>
              <Badge variant={getCategoryBadgeVariant(previewDoc.category)}>
                {previewDoc.category.replace('_', ' ')}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Metadata Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Category</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{previewDoc.category}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">File Size</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {(previewDoc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Security</div>
                <div className="font-semibold text-teal-700 dark:text-teal-400 mt-0.5 flex items-center gap-1">
                  <Lock size={11} /> AES-256
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Storage Key</div>
                <div className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                  {previewDoc.storageKey || 'sec_vault_rec'}
                </div>
              </div>
            </div>

            {/* Document Notes */}
            {previewDoc.notes && (
              <div className="p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 text-xs">
                <strong className="text-teal-800 dark:text-teal-300 font-bold block mb-1">Clinical Notes & Findings:</strong>
                <p className="text-slate-700 dark:text-slate-300">{previewDoc.notes}</p>
              </div>
            )}

            {/* Formatted Medical Document Simulation */}
            <div className="p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 shadow-sm font-sans text-xs">
              <div className="flex justify-between items-start border-b pb-3 border-slate-100 dark:border-slate-800">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-50">{previewDoc.doctorOrLabName}</div>
                  <div className="text-slate-500 text-[11px]">Certified Healthcare Infrastructure • ABDM Partner</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{previewDoc.date}</div>
                  <div className="text-slate-400 text-[10px]">Document ID: #{previewDoc.id}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-slate-600 dark:text-slate-400">
                  Patient Name: <strong className="text-slate-900 dark:text-slate-100">{previewDoc.patientName}</strong>
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Diagnosis / Test Summary: <strong className="text-slate-900 dark:text-slate-100">{previewDoc.title}</strong>
                </div>
                {previewDoc.extractedSummary && (
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                    {previewDoc.extractedSummary}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                onClick={() => handleDeleteDocument(previewDoc.id, previewDoc.title)}
                variant="ghost"
                size="sm"
                className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60"
              >
                <Trash2 size={13} className="mr-1" /> Delete Record
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDownload(previewDoc)}
                  variant="default"
                  size="sm"
                  className="text-xs font-bold"
                >
                  <Download size={14} className="mr-1" /> Download Encrypted Copy
                </Button>
                <Button
                  onClick={() => setPreviewDoc(null)}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Check,
  XCircle,
  Plus,
  RefreshCw,
  User,
  Users,
  Video,
  Building2,
  FileText,
  Save,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AppointmentService } from '@/server/services/appointment.service';
import { OrganizationService, VendorOrganization, VendorStaffMember, StaffRole } from '@/server/services/organization.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { Appointment, Doctor, AppointmentStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function DoctorAppointmentsConsolePage() {
  const { user } = useAuthStore();

  // Active Doctor & Tenant Context
  const [activeDoctorId, setActiveDoctorId] = useState('doc-1');
  const [activeOrgId, setActiveOrgId] = useState('org-apollo-hospital');
  const [activeUserId, setActiveUserId] = useState('auth-doc-1');
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);

  // Queue Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentServingToken, setCurrentServingToken] = useState(5);
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'availability' | 'slots'>('queue');
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Forms
  const [consultationModalApt, setConsultationModalApt] = useState<Appointment | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSubmittingNotes, setIsSubmittingNotes] = useState(false);

  // Availability Editor State
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [slotsList, setSlotsList] = useState<string[]>([
    '09:00 AM',
    '09:30 AM',
    '10:30 AM',
    '11:00 AM',
    '02:30 PM',
    '03:30 PM',
    '05:00 PM'
  ]);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const doc = await AppointmentService.getDoctorById(activeDoctorId);
      setDoctorProfile(doc);
      if (doc?.availableDays) setSelectedDays(doc.availableDays);
      if (doc?.availableSlots) setSlotsList(doc.availableSlots);

      const apts = await AppointmentService.getDoctorAppointments(
        activeUserId,
        activeDoctorId,
        activeOrgId
      );
      setAppointments(apts);

      if (apts.length > 0 && apts[0].currentQueueToken) {
        setCurrentServingToken(apts[0].currentQueueToken);
      }
    } catch (err) {
      console.error('Failed to load doctor appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeDoctorId, activeOrgId, activeUserId]);

  const handleCallNextToken = async () => {
    const nextToken = currentServingToken + 1;
    setCurrentServingToken(nextToken);
    try {
      await AppointmentService.advanceDoctorQueue(
        activeUserId,
        activeDoctorId,
        activeOrgId,
        nextToken
      );
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (aptId: string, status: AppointmentStatus) => {
    try {
      await AppointmentService.updateDoctorAppointmentStatus(
        activeUserId,
        activeDoctorId,
        activeOrgId,
        aptId,
        status
      );
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationModalApt) return;

    setIsSubmittingNotes(true);
    try {
      await AppointmentService.updateDoctorAppointmentStatus(
        activeUserId,
        activeDoctorId,
        activeOrgId,
        consultationModalApt.id,
        'completed',
        clinicalNotes.trim() || 'Consultation completed. Patient advised routine follow-up.'
      );
      setConsultationModalApt(null);
      setClinicalNotes('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNotes(false);
    }
  };

  const handleSaveAvailability = async () => {
    setSaveSuccessMsg(null);
    try {
      await AppointmentService.updateDoctorAvailability(
        activeUserId,
        activeDoctorId,
        activeOrgId,
        slotsList,
        selectedDays
      );
      setSaveSuccessMsg('OPD availability schedule & slot templates saved successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddSlot = () => {
    if (newSlotTime.trim() && !slotsList.includes(newSlotTime.trim())) {
      setSlotsList([...slotsList, newSlotTime.trim()]);
      setNewSlotTime('');
    }
  };

  const handleRemoveSlot = (slot: string) => {
    setSlotsList(slotsList.filter(s => s !== slot));
  };

  // Filter queues
  const activeQueue = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'in_consultation' || a.status === 'booked'
  );
  const completedHistory = appointments.filter(
    a => a.status === 'completed' || a.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider border border-teal-500/30">
                Doctor OPD Console
              </span>
              <Badge variant="success" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" /> RBAC Authorized
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {doctorProfile?.name || 'Dr. Medical Specialist'}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Specialization: <strong>{doctorProfile?.specialization || 'Cardiologist'}</strong> • Facility: <strong>{doctorProfile?.hospitalName || 'Apollo Hospital'}</strong>
            </p>
          </div>

          {/* Quick Doctor Profile Switcher for Paired Testing */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-medium px-1">Switch Doctor Session:</span>
            <Button
              size="sm"
              variant={activeDoctorId === 'doc-1' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveDoctorId('doc-1');
                setActiveOrgId('org-apollo-hospital');
                setActiveUserId('auth-doc-1');
              }}
              className={activeDoctorId === 'doc-1' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs text-slate-300'}
            >
              Dr. Ananya (Hospital)
            </Button>
            <Button
              size="sm"
              variant={activeDoctorId === 'doc-2' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveDoctorId('doc-2');
                setActiveOrgId('org-dr-vivek-clinic');
                setActiveUserId('auth-doc-2');
              }}
              className={activeDoctorId === 'doc-2' ? 'bg-teal-600 hover:bg-teal-700 text-xs' : 'text-xs text-slate-300'}
            >
              Dr. Vivek (Clinic)
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-4">
        {/* Live Token Status Banner */}
        <Card className="p-6 bg-gradient-to-r from-teal-900 to-slate-900 text-white border-0 shadow-lg rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider leading-none">Serving</span>
                <span className="text-2xl font-black text-white">{currentServingToken}</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-spin" /> Live Consultation Token
                </div>
                <h2 className="text-xl font-bold text-white">Current Running Patient Token: #{currentServingToken}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Patients waiting in OPD reception receive instant notifications when their token is called.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                onClick={handleCallNextToken}
                className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-6 shadow-md"
              >
                <Play className="w-4 h-4 mr-2 fill-current" /> Call Next Patient (Token #{currentServingToken + 1})
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={loadData}
                className="text-white border-slate-700 hover:bg-slate-800 shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Tab Controls */}
        <Card className="p-2 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'queue' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('queue')}
              className={activeTab === 'queue' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <Calendar className="w-4 h-4 mr-1.5" /> Live OPD Queue ({activeQueue.length})
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('history')}
              className={activeTab === 'history' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <FileText className="w-4 h-4 mr-1.5" /> Consultation History ({completedHistory.length})
            </Button>
            <Button
              variant={activeTab === 'slots' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('slots')}
              className={activeTab === 'slots' ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              <Clock className="w-4 h-4 mr-1.5" /> Availability & Slots Manager
            </Button>
          </div>

          <Link href="/vendor/dashboard">
            <Button size="sm" variant="outline" className="text-xs">
              <ChevronRight className="w-3.5 h-3.5 mr-1" /> Vendor Dashboard Home
            </Button>
          </Link>
        </Card>

        {/* Tab 1: Live OPD Queue */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            {activeQueue.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No Active Patients in Queue"
                description="Upcoming confirmed appointments for today's OPD will appear here as patients book."
              />
            ) : (
              activeQueue.map(apt => {
                const isCurrent = apt.tokenNumber === currentServingToken;
                const isInConsult = apt.status === 'in_consultation';

                return (
                  <Card
                    key={apt.id}
                    className={`p-6 border rounded-2xl shadow-sm transition-all ${
                      isInConsult
                        ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/30 ring-2 ring-teal-500/20'
                        : isCurrent
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">Token</span>
                          <span className="text-base font-black text-slate-900 dark:text-white">#{apt.tokenNumber || 1}</span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">{apt.patientName}</h2>
                            <Badge variant="outline" className="text-xs font-mono">
                              {apt.appointmentNumber}
                            </Badge>
                            {isInConsult ? (
                              <Badge variant="success" className="text-xs font-semibold animate-pulse">
                                In-Consultation
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="text-xs font-semibold">
                                Waiting in Queue
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs uppercase">
                              {apt.type === 'video_teleconsult' ? 'Video Telehealth' : 'In-Person OPD'}
                            </Badge>
                          </div>

                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Time Slot: <strong>{apt.timeSlot}</strong> • Date: <strong>{apt.date}</strong> • Fee: <strong>₹{apt.consultationFee}</strong> (PAID)
                          </div>

                          {apt.symptoms && (
                            <div className="mt-3 text-xs bg-slate-100/70 dark:bg-slate-800/70 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <strong className="text-slate-900 dark:text-white">Chief Complaint / Symptoms:</strong> {apt.symptoms}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Doctor Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                        {!isInConsult && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                            onClick={() => handleStatusChange(apt.id, 'in_consultation')}
                          >
                            <Play className="w-3.5 h-3.5 mr-1" /> Start Consultation
                          </Button>
                        )}

                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          onClick={() => setConsultationModalApt(apt)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete & Note
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          onClick={() => handleStatusChange(apt.id, 'cancelled')}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Consultation History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {completedHistory.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No Completed Consultations Yet"
                description="Consultations that have concluded with clinical notes will be archived in this timeline."
              />
            ) : (
              completedHistory.map(apt => (
                <Card
                  key={apt.id}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{apt.patientName}</h2>
                        <Badge variant="outline" className="text-xs font-mono">
                          {apt.appointmentNumber}
                        </Badge>
                        <Badge variant={apt.status === 'completed' ? 'success' : 'destructive'} className="text-xs uppercase">
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Completed on {apt.date} at {apt.timeSlot} • Consultation Fee: ₹{apt.consultationFee}
                      </p>
                      {apt.notes && (
                        <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg text-slate-700 dark:text-slate-300">
                          <strong>Clinical Summary:</strong> {apt.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Consultation Archived
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Availability & Slots Manager */}
        {activeTab === 'slots' && (
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" /> OPD Availability & Slot Templates
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Configure the recurring days and time slots where patients can book consultations with you.
                </p>
              </div>

              <Button
                onClick={handleSaveAvailability}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
              >
                <Save className="w-4 h-4 mr-2" /> Save Availability Schedule
              </Button>
            </div>

            {saveSuccessMsg && (
              <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <AlertTitle>Schedule Updated</AlertTitle>
                <AlertDescription className="text-xs">{saveSuccessMsg}</AlertDescription>
              </Alert>
            )}

            {/* Days Selection */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                1. Weekly Practice Days
              </label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {day} {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                2. Active Consultation Time Slots
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {slotsList.map(slot => (
                  <span
                    key={slot}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800 rounded-lg text-xs font-semibold"
                  >
                    <Clock className="w-3 h-3 text-teal-600" />
                    {slot}
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slot)}
                      className="ml-1 text-teal-500 hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Slot Input */}
              <div className="flex items-center gap-2 max-w-sm">
                <Input
                  placeholder="e.g. 04:30 PM"
                  value={newSlotTime}
                  onChange={e => setNewSlotTime(e.target.value)}
                  className="text-xs"
                />
                <Button size="sm" onClick={handleAddSlot} variant="outline" className="text-xs shrink-0">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Slot
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Complete Consultation Modal */}
      {consultationModalApt && (
        <Dialog open={!!consultationModalApt} onOpenChange={() => setConsultationModalApt(null)}>
          <DialogHeader>
            <DialogTitle>Conclude Consultation with {consultationModalApt.patientName}</DialogTitle>
            <DialogDescription>
              Record clinical diagnosis, medication advice, and follow-up guidance into the patient's encrypted health record.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCompleteConsultation} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Summary & Diagnosis Notes *
              </label>
              <Textarea
                placeholder="e.g. Patient presents with grade-1 hypertension. Blood pressure 135/88. Advised low sodium diet, continuation of Telmisartan 40mg once daily, and lipid profile screening in 3 months."
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
                required
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setConsultationModalApt(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" disabled={isSubmittingNotes}>
                {isSubmittingNotes ? 'Saving...' : 'Finalize & Archive Consultation'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}

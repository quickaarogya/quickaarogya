'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  History,
  Calendar,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  Bell,
  Stethoscope,
  FileText,
  AlertCircle,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { MedicationService, TodayDoseItem, AdherenceStats } from '../../server/services/medication.service';
import {
  MedicationSchedule,
  MedicationLog,
  FamilyMember,
  UserProfile,
  DosageTiming,
  MedicineForm,
  MedicationStatus
} from '../../types';
import { PageHeader } from '../../components/ui/page-header';
import { SectionHeader } from '../../components/ui/section-header';
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
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';

export default function MedicinesPage() {
  const [activeTab, setActiveTab] = useState('today');
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [todayDoses, setTodayDoses] = useState<TodayDoseItem[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [adherenceStats, setAdherenceStats] = useState<AdherenceStats | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string>('usr-101');

  // Modals & Action Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refillModalSchedule, setRefillModalSchedule] = useState<MedicationSchedule | null>(null);
  const [refillQuantity, setRefillQuantity] = useState(30);
  const [refillSuccessMsg, setRefillSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Schedule Form State
  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('500mg');
  const [form, setForm] = useState<MedicineForm>('tablet');
  const [unit, setUnit] = useState('tablets');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Once Daily (Morning)');
  const [timing, setTiming] = useState<DosageTiming>('after_food');
  const [timeOfDay1, setTimeOfDay1] = useState('08:30');
  const [timeOfDay2, setTimeOfDay2] = useState('20:30');
  const [hasSecondDose, setHasSecondDose] = useState(false);
  const [patientId, setPatientId] = useState('usr-101');
  const [initialQty, setInitialQty] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(5);
  const [instructions, setInstructions] = useState('');
  const [prescribingDoctor, setPrescribingDoctor] = useState('Dr. Ananya Roy');
  const [prescriptionRef, setPrescriptionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isChronic, setIsChronic] = useState(true);

  const loadData = async () => {
    const activeId = AarogyaStorage.getActiveProfileId();
    setActiveProfileId(activeId);
    setProfile(AarogyaStorage.getUserProfile());
    setFamilyMembers(AarogyaStorage.getFamilyMembers());

    const allSchedules = await MedicationService.getSchedules({
      patientProfileId: activeId,
      status: 'all',
    });
    setSchedules(allSchedules);

    const doses = await MedicationService.getTodayDoses(activeId);
    setTodayDoses(doses);

    const allLogs = AarogyaStorage.getMedicationLogs();
    setLogs(allLogs);

    const stats = await MedicationService.getAdherenceStats(activeId);
    setAdherenceStats(stats);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, [activeProfileId]);

  const handleTakeDose = async (scheduleId: string, scheduledTime: string) => {
    await MedicationService.logDose(scheduleId, scheduledTime, 'taken');
    loadData();
  };

  const handleSkipDose = async (scheduleId: string, scheduledTime: string) => {
    await MedicationService.logDose(scheduleId, scheduledTime, 'skipped');
    loadData();
  };

  const handleSnoozeDose = async (scheduleId: string, scheduledTime: string) => {
    await MedicationService.logDose(scheduleId, scheduledTime, 'snoozed');
    loadData();
  };

  const handleExecuteRefill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillModalSchedule) return;

    await MedicationService.refillSchedule(refillModalSchedule.id, refillQuantity);
    setRefillSuccessMsg(`Successfully refilled ${refillQuantity} ${refillModalSchedule.unit || 'tablets'} for ${refillModalSchedule.medicineName}.`);
    setRefillModalSchedule(null);
    loadData();
    setTimeout(() => setRefillSuccessMsg(null), 3500);
  };

  const handle1ClickRefillQuick = async (sched: MedicationSchedule) => {
    await MedicationService.refillSchedule(sched.id, 30);
    setRefillSuccessMsg(`1-Click Refill: Added 30 ${sched.unit || 'tablets'} of ${sched.medicineName} to your inventory.`);
    loadData();
    setTimeout(() => setRefillSuccessMsg(null), 3500);
  };

  const handleAddScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const patientName = patientId === 'usr-101'
        ? `${profile?.firstName || 'Arjun'} ${profile?.lastName || 'Sharma'}`
        : (familyMembers.find(f => f.id === patientId)?.fullName || 'Family Member');

      const timesOfDay = [timeOfDay1];
      if (hasSecondDose && timeOfDay2) timesOfDay.push(timeOfDay2);

      await MedicationService.createSchedule({
        patientProfileId: patientId,
        patientName,
        medicineName,
        genericName: genericName || undefined,
        strength,
        form,
        unit,
        dosage,
        frequency,
        timing,
        timesOfDay,
        startDate: new Date().toISOString().split('T')[0],
        isChronic,
        initialQuantity: initialQty,
        refillThreshold,
        instructions: instructions || 'Take with water as directed.',
        prescribingDoctor: prescribingDoctor || undefined,
        prescriptionReference: prescriptionRef || undefined,
        notes: notes || undefined,
      });

      setIsAddModalOpen(false);
      setMedicineName('');
      setGenericName('');
      setInstructions('');
      setNotes('');
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const lowStockSchedules = schedules.filter(
    s => s.isActive && s.remainingQuantity <= s.refillThreshold
  );

  const calculateDaysRemaining = (sched: MedicationSchedule) => {
    const dailyDoses = Math.max(1, sched.timesOfDay.length);
    const dosePerTake = sched.doseQuantity || 1;
    const dailyConsumption = dailyDoses * dosePerTake;
    return Math.floor(sched.remainingQuantity / dailyConsumption);
  };

  return (
    <div className="page-wrapper animate-fade-in space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 pb-1">
        {adherenceStats ? (
          <Badge variant="care" className="font-bold text-xs">
            {adherenceStats.adherencePercentage}% Monthly Adherence
          </Badge>
        ) : <div />}
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="care"
          size="sm"
          className="rounded-xl shadow-xs"
        >
          <Plus size={15} className="mr-1" /> Add Medication
        </Button>
      </div>

      {/* Refill Success Notice */}
      {refillSuccessMsg && (
        <Alert variant="success" className="animate-in fade-in-50">
          <CheckCircle2 size={16} />
          <AlertTitle className="text-xs font-bold">Refill Confirmed</AlertTitle>
          <AlertDescription className="text-xs">{refillSuccessMsg}</AlertDescription>
        </Alert>
      )}

      {/* Low Stock Warning Banner */}
      {lowStockSchedules.length > 0 && (
        <Card variant="alert" padding="default" className="border-red-300 dark:border-red-900 bg-red-50/70 dark:bg-red-950/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-display font-bold text-sm text-red-950 dark:text-red-200">
                  Your medicine may be running low ({lowStockSchedules.length} {lowStockSchedules.length === 1 ? 'prescription' : 'prescriptions'})
                </h3>
                <p className="text-xs text-red-800 dark:text-red-300 mt-0.5">
                  {lowStockSchedules.map(s => `${s.medicineName} (${s.remainingQuantity} ${s.unit || 'tablets'} left • est. ${calculateDaysRemaining(s)} days)`).join(' • ')}
                </p>
              </div>
            </div>

            <Button
              onClick={() => handle1ClickRefillQuick(lowStockSchedules[0])}
              variant="emergency"
              size="sm"
              className="text-xs font-bold flex-shrink-0"
            >
              <ShoppingBag size={13} className="mr-1" /> 1-Click Refill ({lowStockSchedules[0].medicineName})
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs Filter */}
      <Tabs
        tabs={[
          { id: 'today', label: "Today's Schedule", count: todayDoses.length },
          { id: 'active', label: 'Active Medicines', count: schedules.filter(s => s.isActive && s.status !== 'paused').length },
          { id: 'low_stock', label: 'Low Stock & Refills', count: lowStockSchedules.length },
          { id: 'completed', label: 'Completed & Paused', count: schedules.filter(s => !s.isActive || s.status === 'paused' || s.status === 'completed').length },
          { id: 'history', label: 'Adherence Logs', count: logs.length },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="underline"
        accentColor="care"
      />

      {/* TAB 1: TODAY'S SCHEDULE */}
      {activeTab === 'today' && (
        <div className="space-y-4 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Doses ({todayDoses.filter(d => d.status === 'taken').length} of {todayDoses.length} Completed)
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Time Zone: Asia/Kolkata (IST)
            </div>
          </div>

          {todayDoses.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No doses scheduled for today"
              description="Add your daily prescription medications to begin receiving dose reminders."
              actionLabel="Add Medication Schedule"
              onAction={() => setIsAddModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {todayDoses.map((dose) => {
                const isTaken = dose.status === 'taken';
                const isSkipped = dose.status === 'skipped';

                return (
                  <Card
                    key={dose.id}
                    variant={isTaken ? "default" : dose.isRefillRequired ? "alert" : "highlight"}
                    padding="default"
                    className={`transition-all ${
                      isTaken ? "opacity-90 bg-slate-50/80 dark:bg-slate-900/60" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* Left: Time + Medicine Info */}
                      <div className="flex items-start gap-3.5">
                        {/* Time Slot Node */}
                        <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-center font-mono ${
                          isTaken
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : isSkipped
                            ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-rose-50 text-[#ff645e] dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        }`}>
                          <Clock size={13} className="mb-0.5" />
                          <span className="text-xs font-bold leading-tight">{dose.scheduledTime}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                              {dose.medicineName}
                            </h3>
                            {dose.strength && (
                              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-mono">
                                {dose.strength}
                              </Badge>
                            )}
                            {isTaken && (
                              <Badge variant="success" className="text-[10px]">
                                ✓ Taken {dose.takenTime ? `at ${dose.takenTime}` : ''}
                              </Badge>
                            )}
                            {isSkipped && (
                              <Badge variant="danger" className="text-[10px]">
                                Skipped
                              </Badge>
                            )}
                          </div>

                          {dose.genericName && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              Generic: {dose.genericName}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1 flex-wrap">
                            <span>Dose: <strong>{dose.dosage}</strong></span>
                            <span>•</span>
                            <span className="capitalize">{dose.timing.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className={dose.isRefillRequired ? "text-red-600 font-bold" : "text-slate-500"}>
                              {dose.remainingQuantity} left
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Dose Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                        {!isTaken ? (
                          <>
                            <Button
                              onClick={() => handleTakeDose(dose.scheduleId, dose.scheduledTime)}
                              variant="care"
                              size="sm"
                              className="font-bold text-xs flex-1 sm:flex-initial rounded-xl shadow-xs"
                            >
                              <Check size={14} className="mr-1" /> Take Dose
                            </Button>
                            <Button
                              onClick={() => handleSkipDose(dose.scheduleId, dose.scheduledTime)}
                              variant="outline"
                              size="sm"
                              className="text-xs text-slate-600 hover:text-red-600"
                            >
                              Skip
                            </Button>
                            <Button
                              onClick={() => handleSnoozeDose(dose.scheduleId, dose.scheduledTime)}
                              variant="ghost"
                              size="sm"
                              className="text-xs text-slate-500"
                            >
                              Snooze
                            </Button>
                          </>
                        ) : (
                          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={15} /> Completed for Today
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACTIVE MEDICINES (With Stock Runways) */}
      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50">
          {schedules.filter(s => s.isActive && s.status !== 'paused').map((sched) => {
            const daysLeft = calculateDaysRemaining(sched);
            const isLow = sched.remainingQuantity <= sched.refillThreshold;

            return (
              <Card
                key={sched.id}
                variant={isLow ? "alert" : "interactive"}
                padding="default"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                        {sched.medicineName}
                      </h3>
                      {sched.genericName && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {sched.genericName}
                        </p>
                      )}
                    </div>

                    <Badge variant={isLow ? "danger" : "care"}>
                      {isLow ? "Refill Required" : "Active Regimen"}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <strong>Dosage:</strong> {sched.dosage} • {sched.frequency} ({sched.timing.replace('_', ' ')})
                    </div>
                    <div>
                      <strong>Daily Reminder Times:</strong> {sched.timesOfDay.join(', ')}
                    </div>
                    {sched.prescribingDoctor && (
                      <div>
                        <strong>Doctor:</strong> {sched.prescribingDoctor}
                      </div>
                    )}
                    {sched.instructions && (
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded border border-slate-200/60 dark:border-slate-800 text-[11px]">
                        {sched.instructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stock Runway Footer */}
                <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {sched.remainingQuantity} {sched.unit || 'tablets'} remaining
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Estimated to finish in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setRefillModalSchedule(sched);
                      setRefillQuantity(30);
                    }}
                    variant={isLow ? "destructive" : "secondary"}
                    size="sm"
                    className="text-xs font-bold"
                  >
                    <RotateCcw size={13} className="mr-1" /> Refill Stock
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* TAB 3: LOW STOCK & REFILLS */}
      {activeTab === 'low_stock' && (
        <div className="space-y-4 animate-in fade-in-50">
          {lowStockSchedules.length === 0 ? (
            <EmptyState
              icon={Package}
              title="All medications have sufficient stock"
              description="No prescriptions are currently below their configured refill thresholds."
            />
          ) : (
            <div className="space-y-3">
              {lowStockSchedules.map((sched) => (
                <Card key={sched.id} variant="alert" padding="default" className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                      {sched.medicineName} ({sched.strength || sched.dosage})
                    </h3>
                    <p className="text-xs text-red-700 dark:text-red-400 font-semibold mt-0.5">
                      Only {sched.remainingQuantity} {sched.unit || 'tablets'} left • Finish in ~{calculateDaysRemaining(sched)} days
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Threshold set to {sched.refillThreshold} {sched.unit || 'tablets'}
                    </p>
                  </div>

                  <Button
                    onClick={() => handle1ClickRefillQuick(sched)}
                    variant="emergency"
                    size="sm"
                    className="font-bold text-xs"
                  >
                    <ShoppingBag size={14} className="mr-1" /> 1-Click Refill (+30 Tablets)
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COMPLETED & PAUSED */}
      {activeTab === 'completed' && (
        <div className="space-y-3 animate-in fade-in-50">
          {schedules.filter(s => !s.isActive || s.status === 'paused' || s.status === 'completed').length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No paused or completed medication courses"
              description="All ongoing prescriptions are actively running in your daily schedule."
            />
          ) : (
            schedules.filter(s => !s.isActive || s.status === 'paused' || s.status === 'completed').map((sched) => (
              <Card key={sched.id} variant="default" padding="default" className="opacity-75">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">
                      {sched.medicineName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Course finished on {sched.endDate || 'Scheduled period'}
                    </p>
                  </div>
                  <Badge variant="secondary">{sched.status}</Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 5: ADHERENCE LOGS */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-in fade-in-50">
          {adherenceStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card variant="summary" padding="default">
                <div className="text-xs text-slate-500 font-bold uppercase">Adherence Rate</div>
                <div className="text-2xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">
                  {adherenceStats.adherencePercentage}%
                </div>
              </Card>
              <Card variant="summary" padding="default">
                <div className="text-xs text-slate-500 font-bold uppercase">Doses Taken</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {adherenceStats.totalTaken}
                </div>
              </Card>
              <Card variant="summary" padding="default">
                <div className="text-xs text-slate-500 font-bold uppercase">Doses Skipped</div>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">
                  {adherenceStats.totalSkipped}
                </div>
              </Card>
              <Card variant="summary" padding="default">
                <div className="text-xs text-slate-500 font-bold uppercase">Total Tracked</div>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                  {adherenceStats.totalDosesScheduled}
                </div>
              </Card>
            </div>
          )}

          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {log.medicineName}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {log.scheduledTime} {log.takenTime ? `• Taken at ${log.takenTime}` : ''}
                  </div>
                </div>

                <Badge variant={log.status === 'taken' ? 'teal' : log.status === 'skipped' ? 'danger' : 'secondary'}>
                  {log.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD MEDICATION MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader>
          <DialogTitle>Add Medication Regimen</DialogTitle>
          <DialogDescription>
            Configure daily reminders, before/after food timing, and stock tracking for your prescription.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddScheduleSubmit} className="space-y-3.5">
          <FormField label="Patient Profile" required>
            <Select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="usr-101">Arjun Sharma (Self)</option>
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.relationship})
                </option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Brand Medicine Name" required>
              <Input
                type="text"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="e.g. Telma 40"
                required
              />
            </FormField>

            <FormField label="Generic Composition (Optional)">
              <Input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Telmisartan"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FormField label="Strength" required>
              <Input
                type="text"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="e.g. 40mg"
                required
              />
            </FormField>

            <FormField label="Medicine Form" required>
              <Select value={form} onChange={(e) => setForm(e.target.value as any)}>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="inhaler">Inhaler</option>
                <option value="injection">Injection</option>
                <option value="drops">Drops</option>
              </Select>
            </FormField>

            <FormField label="Dose Amount" required>
              <Input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Daily Frequency" required>
              <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="Once Daily (Morning)">Once Daily (Morning)</option>
                <option value="Once Daily (Night)">Once Daily (Night)</option>
                <option value="Twice Daily (Morning, Night)">Twice Daily (Morning, Night)</option>
                <option value="Thrice Daily (TID)">Thrice Daily</option>
                <option value="As Needed (SOS)">As Needed (SOS)</option>
              </Select>
            </FormField>

            <FormField label="Food Timing" required>
              <Select value={timing} onChange={(e) => setTiming(e.target.value as any)}>
                <option value="after_food">After Food</option>
                <option value="before_food">Before Food (Empty Stomach)</option>
                <option value="with_food">With Food</option>
                <option value="bedtime">At Bedtime</option>
              </Select>
            </FormField>
          </div>

          {/* Time Pickers */}
          <div className="space-y-2">
            <FormField label="First Daily Dose Time" required>
              <Input
                type="time"
                value={timeOfDay1}
                onChange={(e) => setTimeOfDay1(e.target.value)}
                required
              />
            </FormField>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="secondDoseToggle"
                checked={hasSecondDose}
                onCheckedChange={setHasSecondDose}
              />
              <label htmlFor="secondDoseToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Add 2nd Evening/Night Dose Time
              </label>
            </div>

            {hasSecondDose && (
              <FormField label="Second Daily Dose Time" required>
                <Input
                  type="time"
                  value={timeOfDay2}
                  onChange={(e) => setTimeOfDay2(e.target.value)}
                  required
                />
              </FormField>
            )}
          </div>

          {/* Stock Tracking */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <FormField label="Initial Quantity in Pack" required>
              <Input
                type="number"
                value={initialQty}
                onChange={(e) => setInitialQty(parseInt(e.target.value) || 30)}
                required
                min={1}
              />
            </FormField>

            <FormField label="Low Refill Threshold" required helperText="Trigger refill alert when balance hits this number">
              <Input
                type="number"
                value={refillThreshold}
                onChange={(e) => setRefillThreshold(parseInt(e.target.value) || 5)}
                required
                min={1}
              />
            </FormField>
          </div>

          <FormField label="Special Doctor Instructions (Optional)">
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Check BP weekly. Take with a full glass of water."
              rows={2}
            />
          </FormField>

          <div className="flex gap-2.5 pt-2">
            <Button type="submit" variant="care" className="flex-1 font-bold" isLoading={isSubmitting}>
              Save Medication Schedule
            </Button>
            <Button type="button" onClick={() => setIsAddModalOpen(false)} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>

      {/* REFILL MODAL */}
      {refillModalSchedule && (
        <Dialog open={!!refillModalSchedule} onOpenChange={() => setRefillModalSchedule(null)}>
          <DialogHeader>
            <DialogTitle>Refill {refillModalSchedule.medicineName}</DialogTitle>
            <DialogDescription>
              Add newly purchased quantities to reset inventory and extend your estimated days runway.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExecuteRefill} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div>Current Balance: <strong>{refillModalSchedule.remainingQuantity} {refillModalSchedule.unit || 'tablets'}</strong></div>
              <div>Estimated Runway: ~{calculateDaysRemaining(refillModalSchedule)} days remaining</div>
            </div>

            <FormField label="Quantity Added to Pack" required>
              <Input
                type="number"
                value={refillQuantity}
                onChange={(e) => setRefillQuantity(parseInt(e.target.value) || 30)}
                required
                min={1}
              />
            </FormField>

            <div className="flex gap-2.5 pt-2">
              <Button type="submit" variant="care" className="flex-1 font-bold">
                Confirm Refill (+{refillQuantity} Units)
              </Button>
              <Button type="button" onClick={() => setRefillModalSchedule(null)} variant="secondary">
                Cancel
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}

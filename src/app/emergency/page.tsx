'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  Heart,
  PhoneCall,
  QrCode,
  ShieldAlert,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Printer,
  XCircle,
  Share2
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { EmergencyProfile, EmergencyContact } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { PageHeader } from '../../components/ui/page-header';
import { SectionHeader } from '../../components/ui/section-header';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { FormField } from '../../components/ui/form-field';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';

export default function EmergencyPage() {
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showResponderView, setShowResponderView] = useState(false);

  // Edit Form State
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [allergies, setAllergies] = useState('Penicillin, Sulfa Drugs');
  const [chronicConditions, setChronicConditions] = useState('Mild Asthma, Allergic Rhinitis');
  const [medsSummary, setMedsSummary] = useState('Montelukast 10mg (Night), Levocetirizine 5mg (SOS)');
  const [organDonor, setOrganDonor] = useState(true);

  const loadData = () => {
    const p = AarogyaStorage.getEmergencyProfile();
    setProfile(p);
    setIsSosActive(AarogyaStorage.isSosActive());
    if (p) {
      setBloodGroup(p.bloodGroup);
      setAllergies(p.allergies.join(', '));
      setChronicConditions(p.chronicConditions.join(', '));
      setMedsSummary(p.currentMedicationsSummary.join(', '));
      setOrganDonor(p.organDonor);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const handleToggleSos = () => {
    const nextState = !isSosActive;
    setIsSosActive(nextState);
    AarogyaStorage.setSosActive(nextState);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AarogyaStorage.updateEmergencyProfile({
      bloodGroup: bloodGroup as any,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      currentMedicationsSummary: medsSummary.split(',').map(s => s.trim()).filter(Boolean),
      organDonor
    });
    setIsEditModalOpen(false);
  };

  if (!profile) return null;

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-end gap-2 pb-1">
        <Button
          onClick={() => setIsEditModalOpen(true)}
          variant="secondary"
          size="sm"
          className="rounded-xl border border-slate-200 text-xs font-bold"
        >
          <Edit size={14} className="mr-1" /> Edit Info
        </Button>
        <Button
          onClick={handleToggleSos}
          variant={isSosActive ? "emergency" : "destructive"}
          size="sm"
          className={`rounded-xl text-xs font-bold ${isSosActive ? "animate-pulse-glow" : ""}`}
        >
          <ShieldAlert size={15} className="mr-1" /> {isSosActive ? 'SOS BROADCAST ACTIVE (Stop)' : 'Trigger SOS Broadcast'}
        </Button>
      </div>

      {/* Main Grid: Card & QR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Life-Saving Medical Card */}
        <Card variant="alert" padding="lg" className="border-red-300 dark:border-red-900/80 bg-gradient-to-br from-red-50/60 to-white dark:from-red-950/20 dark:to-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-400">
                IN CASE OF EMERGENCY (ICE)
              </span>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-slate-50 mt-0.5">
                {profile.fullName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                DOB: {profile.dateOfBirth} (38 yrs)
              </p>
            </div>

            {/* Blood Group Badge */}
            <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-center shadow-md">
              <div className="text-[10px] font-bold uppercase tracking-wider">Blood</div>
              <div className="text-2xl font-extrabold leading-none">{profile.bloodGroup}</div>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {/* Critical Allergies */}
            <div className="bg-white dark:bg-slate-900/90 p-3 rounded-lg border border-red-200 dark:border-red-900/60 shadow-2xs">
              <div className="text-xs font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> CRITICAL DRUG & FOOD ALLERGIES
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                {profile.allergies.join(', ')}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="bg-white dark:bg-slate-900/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Heart size={14} className="text-teal-600" /> CHRONIC MEDICAL CONDITIONS
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {profile.chronicConditions.join(', ')}
              </div>
            </div>

            {/* Current Medications */}
            <div className="bg-white dark:bg-slate-900/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                CURRENT ONGOING MEDICATIONS
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {profile.currentMedicationsSummary.join(' • ')}
              </div>
            </div>

            {/* Organ Donor */}
            <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ✓ Registered Organ Donor
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                Consent Verified
              </span>
            </div>
          </div>
        </Card>

        {/* Right: QR Code for First Responders */}
        <Card variant="default" padding="lg" className="text-center flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-bold text-base flex items-center gap-2 text-slate-900 dark:text-slate-50">
                <QrCode size={19} className="text-teal-600" />
                First-Responder QR Code
              </h3>
              <Badge variant="teal">Scan with any Phone</Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Paramedics or bystanders can scan this to view blood type, allergies, and tap emergency phone numbers.
            </p>

            {/* Generated QR Card Graphic */}
            <div className="w-44 h-44 mx-auto p-2 bg-white rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="5" y="5" width="30" height="30" rx="4" fill="#0f172a" />
                <rect x="10" y="10" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="15" y="15" width="10" height="10" rx="1" fill="#0d9488" />

                <rect x="65" y="5" width="30" height="30" rx="4" fill="#0f172a" />
                <rect x="70" y="10" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="75" y="15" width="10" height="10" rx="1" fill="#0d9488" />

                <rect x="5" y="65" width="30" height="30" rx="4" fill="#0f172a" />
                <rect x="10" y="70" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="15" y="75" width="10" height="10" rx="1" fill="#0d9488" />

                <rect x="42" y="15" width="16" height="6" fill="#0f172a" />
                <rect x="42" y="28" width="8" height="12" fill="#0f172a" />
                <rect x="54" y="28" width="6" height="20" fill="#0f172a" />
                <rect x="15" y="42" width="20" height="8" fill="#0f172a" />
                <rect x="42" y="42" width="16" height="16" rx="2" fill="#dc2626" />
                <rect x="65" y="42" width="20" height="8" fill="#0f172a" />
                <rect x="42" y="65" width="8" height="20" fill="#0f172a" />
                <rect x="54" y="75" width="16" height="10" fill="#0f172a" />
                <rect x="75" y="65" width="15" height="15" fill="#0f172a" />
              </svg>
            </div>

            <div className="text-[11px] font-mono text-slate-400 mt-3">
              Token: <code>{profile.publicEmergencyToken}</code>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5">
            <Button
              onClick={() => setShowResponderView(!showResponderView)}
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
            >
              {showResponderView ? 'Hide Simulated Scan' : 'Preview Responder View'}
            </Button>
            <Button
              onClick={() => window.print()}
              variant="default"
              size="sm"
              className="text-xs"
            >
              <Printer size={14} /> Print Wallet Card
            </Button>
          </div>
        </Card>
      </div>

      {/* Simulated Responder Triage Screen */}
      {showResponderView && (
        <Card variant="alert" padding="default" className="bg-slate-900 text-white border-2 border-red-500 animate-in fade-in-50">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-500" />
              <h3 className="font-display font-extrabold text-sm sm:text-base text-white">
                FIRST RESPONDER PUBLIC TRIAGE VIEW
              </h3>
            </div>
            <Badge variant="danger">Unauthenticated Emergency Access</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PATIENT NAME</div>
              <div className="text-base font-bold mt-0.5">{profile.fullName}</div>
            </div>
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">BLOOD GROUP</div>
              <div className="text-lg font-extrabold text-red-400 mt-0.5">{profile.bloodGroup}</div>
            </div>
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PRIMARY CONTACT</div>
              <a href="tel:+919876588990" className="text-xs font-bold text-sky-400 hover:underline mt-0.5 block">
                📞 Call Spouse (+91 98765 88990)
              </a>
            </div>
          </div>
        </Card>
      )}

      {/* Emergency Contacts List */}
      <Card variant="default" padding="default">
        <SectionHeader
          title="Primary Emergency Next-of-Kin Contacts"
          subtitle="Paramedics and emergency responders will dial these contacts in sequence."
        />

        <div className="space-y-2.5">
          {profile.emergencyContacts.map(contact => (
            <div
              key={contact.id}
              className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {contact.name}
                  </span>
                  {contact.isPrimary && (
                    <Badge variant="danger">Primary Contact</Badge>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Relationship: {contact.relationship}
                </div>
              </div>

              <Button asChild variant="destructive" size="sm" className="font-bold text-xs">
                <a href={`tel:${contact.phone}`}>
                  <PhoneCall size={13} /> Call {contact.phone}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Emergency Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogHeader>
          <DialogTitle>Edit Emergency Information</DialogTitle>
          <DialogDescription>
            Update critical medical information printed on your ICE emergency profile and QR card.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <FormField label="Blood Group" required>
            <Select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
          </FormField>

          <FormField label="Critical Allergies (comma separated)" required>
            <Input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts, Sulfa"
              required
            />
          </FormField>

          <FormField label="Chronic Conditions (comma separated)">
            <Input
              type="text"
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              placeholder="e.g. Type-2 Diabetes, Hypertension, Asthma"
            />
          </FormField>

          <FormField label="Current Medications Summary">
            <Textarea
              value={medsSummary}
              onChange={(e) => setMedsSummary(e.target.value)}
              rows={2}
            />
          </FormField>

          <div className="flex items-center gap-2.5 pt-1">
            <Checkbox
              id="donorToggle"
              checked={organDonor}
              onCheckedChange={setOrganDonor}
            />
            <label htmlFor="donorToggle" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              I am a registered Organ Donor
            </label>
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button type="submit" variant="default" className="flex-1">
              Save Emergency Card
            </Button>
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

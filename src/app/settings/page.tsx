'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  ShieldCheck,
  Lock,
  Eye,
  Key,
  History,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  UserCheck,
  LogOut,
  Bell,
  Fingerprint,
  KeyRound
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: 'allowed' | 'alert';
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: 'aud-1',
    actor: 'Dr. Ananya Roy (Cardiologist)',
    action: 'READ_PHI',
    resource: 'Prescription & Lipid Profile Reports',
    ip: '103.22.45.12',
    timestamp: '2026-08-26 18:42:10',
    status: 'allowed'
  },
  {
    id: 'aud-2',
    actor: 'Arjun Sharma (Patient)',
    action: 'WRITE_MEDICATION',
    resource: 'Medication Schedule: Montair LC',
    ip: '122.161.50.88',
    timestamp: '2026-08-26 14:15:02',
    status: 'allowed'
  },
  {
    id: 'aud-3',
    actor: 'Emergency First Responder (Anonymous)',
    action: 'VIEW_EMERGENCY_QR',
    resource: 'Emergency Triage Card (Blood Group, Allergies)',
    ip: '49.36.120.14',
    timestamp: '2026-08-20 14:30:22',
    status: 'allowed'
  },
  {
    id: 'aud-4',
    actor: 'Apollo 24|7 Pharmacy System',
    action: 'READ_PRESCRIPTION',
    resource: 'Rx #QA-2026-901 for Medicine Fulfillment',
    ip: '103.11.89.200',
    timestamp: '2026-08-18 11:20:00',
    status: 'allowed'
  }
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [biometricLock, setBiometricLock] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [notifMedication, setNotifMedication] = useState(true);
  const [notifAppointments, setNotifAppointments] = useState(true);
  const [notifEmergency, setNotifEmergency] = useState(true);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [activeConsents, setActiveConsents] = useState([
    { id: 'con-1', provider: 'Dr. Ananya Roy (Apollo Hospital)', access: 'Medical Records & Prescriptions', expires: 'In 18 days' },
    { id: 'con-2', provider: 'Dr. Lal PathLabs Diagnostic Wing', access: 'Lab Booking Records', expires: 'In 3 days' }
  ]);

  const handleRevokeConsent = (id: string, name: string) => {
    if (confirm(`Revoke health data access consent for ${name}?`)) {
      setActiveConsents(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="page-wrapper animate-fade-in space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-end pb-1">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/60 rounded-xl font-bold text-xs"
        >
          <LogOut size={14} className="mr-1.5" /> Sign Out
        </Button>
      </div>

      {/* Account Info Card */}
      <Card variant="default" padding="default">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-bold flex items-center justify-center text-base">
              {(user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {user?.email || 'arjun@aarogya.health'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Role: <strong className="text-teal-700 dark:text-teal-400 font-semibold">{user?.role || 'PATIENT'}</strong></span>
                <span>•</span>
                <span>Phone: {user?.phoneNumber || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsPasswordModalOpen(true)}
            variant="secondary"
            size="sm"
            className="text-xs"
          >
            <KeyRound size={14} className="mr-1.5" /> Change Password
          </Button>
        </div>
      </Card>

      {/* Security & Access Controls */}
      <Card variant="default" padding="default">
        <SectionHeader
          title="Zero-Trust Security & App Authentication"
          subtitle="Biometric locks and Multi-Factor security guarantees."
        />

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* Biometric Toggle */}
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Fingerprint size={16} className="text-teal-600" />
                Biometric App Lock (FaceID / Fingerprint)
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Require biometric authorization before opening medical vault and prescription history.
              </div>
            </div>
            <Switch
              checked={biometricLock}
              onCheckedChange={setBiometricLock}
            />
          </div>

          {/* MFA Toggle */}
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-600" />
                Two-Factor Authentication (SMS / WhatsApp OTP)
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mandatory OTP verification when delegating family proxy permissions or exporting health data.
              </div>
            </div>
            <Switch
              checked={mfaEnabled}
              onCheckedChange={setMfaEnabled}
            />
          </div>

          {/* Anonymous Research Toggle */}
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Contribute De-Identified Data to Medical AI Research
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Stripped of all personal identifiers (ABHA, Name, Phone). Helps train preventive cardiac models.
              </div>
            </div>
            <Switch
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card variant="default" padding="default">
        <SectionHeader
          title="Notification Channels & Health Alarms"
          subtitle="Configure how and when you receive medication and consultation alarms."
        />

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Medication Due Reminders & Low-Stock Refill Alarms
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                High-priority sound alerts when scheduled dosages are due.
              </div>
            </div>
            <Switch checked={notifMedication} onCheckedChange={setNotifMedication} />
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Doctor OPD Queue & Consultation Live Updates
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live notifications when your token number is next in line at clinic.
              </div>
            </div>
            <Switch checked={notifAppointments} onCheckedChange={setNotifAppointments} />
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Emergency First-Responder SOS Broadcast Notifications
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immediate next-of-kin alert triggers if an emergency profile is scanned.
              </div>
            </div>
            <Switch checked={notifEmergency} onCheckedChange={setNotifEmergency} />
          </div>
        </div>
      </Card>

      {/* Active Provider Consents (Revocation Dashboard) */}
      <Card variant="default" padding="default">
        <SectionHeader
          title={`Active Doctor & Healthcare Provider Consents (${activeConsents.length})`}
          subtitle="ABDM-compliant consent management. You can revoke access at any time."
        />

        {activeConsents.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 py-3">
            No external healthcare providers currently have active access to your records.
          </p>
        ) : (
          <div className="space-y-2.5">
            {activeConsents.map(consent => (
              <div
                key={consent.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {consent.provider}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Access: <strong className="text-slate-700 dark:text-slate-300">{consent.access}</strong> • Expires: {consent.expires}
                  </div>
                </div>

                <Button
                  onClick={() => handleRevokeConsent(consent.id, consent.provider)}
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/60"
                >
                  <Trash2 size={13} className="mr-1" /> Revoke Consent
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tamper-Evident Immutable Audit Log Viewer */}
      <Card variant="default" padding="default">
        <SectionHeader
          title="Tamper-Evident Health Data Audit Log (HIPAA / ABDM)"
          subtitle="Cryptographically verified read/write ledger for all PHI document accesses."
        />

        <div className="space-y-2">
          {mockAuditLogs.map(log => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {log.actor}
                </span>
                <Badge variant="teal" className="text-[10px] py-0 px-1.5 h-4">
                  {log.action}
                </Badge>
              </div>
              <div className="text-slate-600 dark:text-slate-300 mt-1">
                Resource: {log.resource}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1.5">
                🕒 {log.timestamp} • IP: <code>{log.ip}</code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Change Password Dialog Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogHeader>
          <DialogTitle>Update Secure Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new 8+ character password.
          </DialogDescription>
        </DialogHeader>

        {passwordSuccess ? (
          <Alert variant="success">
            <AlertTitle className="text-xs font-bold">Password Updated</AlertTitle>
            <AlertDescription className="text-xs">Your password has been changed successfully.</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <FormField label="Current Password" required>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </FormField>

            <FormField label="New Password" required>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters, 1 uppercase, 1 number"
                required
              />
            </FormField>

            <FormField label="Confirm New Password" required>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </FormField>

            <div className="flex gap-2.5 pt-2">
              <Button type="submit" variant="default" className="flex-1">
                Update Password
              </Button>
              <Button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}

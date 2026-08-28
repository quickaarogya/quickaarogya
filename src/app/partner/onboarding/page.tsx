'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Stethoscope,
  Pill,
  FlaskConical,
  ShieldCheck,
  Upload,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { OrganizationService } from '@/server/services/organization.service';
import { AuthService } from '@/server/services/auth.service';
import { OrganizationType } from '@prisma/client';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function PartnerOnboardingPage() {
  const router = useRouter();

  // Form State
  const [orgType, setOrgType] = useState<OrganizationType>(OrganizationType.INDEPENDENT_DOCTOR);
  const [orgName, setOrgName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('New Delhi');

  // Primary Staff Admin Account State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('+91 ');
  const [adminPassword, setAdminPassword] = useState('');

  // Document Upload Simulation
  const [licenseDocName, setLicenseDocName] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingDoc(true);
      setTimeout(() => {
        setLicenseDocName(file.name);
        setIsUploadingDoc(false);
      }, 600);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!orgName.trim() || !licenseNumber.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setErrorMsg('Please fill in all required organization and administrator fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await OrganizationService.applyForPartnership({
        organizationName: orgName.trim(),
        organizationType: orgType,
        adminFullName: adminName.trim() || 'Medical Director',
        adminEmail: adminEmail.trim(),
        adminPhone: adminPhone.trim() || '+91 98765 00099',
        adminPasswordPlain: adminPassword,
        licenseNumber: licenseNumber.trim(),
        licenseDocumentUrl: licenseDocName ? `https://documents.aarogya.health/verified/${licenseDocName}` : undefined,
        specializationOrCategory: specialization,
        addressLine1: address.trim(),
        city: city.trim()
      });

      // Auto-authenticate into session with newly created staff credentials
      try {
        await AuthService.login(adminEmail.trim(), adminPassword);
      } catch (authErr) {
        console.warn('Auto-login notice:', authErr);
      }

      setSuccessResult(result);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit partner application. Please verify details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successResult) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-xl w-full p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800/60">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <Badge variant="warning" className="mb-3 px-3 py-1 text-sm font-semibold uppercase tracking-wider">
            Verification Pending Review
          </Badge>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Application Submitted Successfully!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            Your organization <strong className="text-slate-900 dark:text-slate-100">{successResult.organization.name}</strong> has been registered with ID <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-teal-600 dark:text-teal-400 font-mono">{successResult.organization.id}</code>.
            Our clinical verification team is reviewing your regulatory credentials ({successResult.organization.licenseNumber}).
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Organization Type:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{successResult.organization.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Primary Administrator:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{adminEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Under Clinical Audit</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-md"
              onClick={() => router.push('/vendor/dashboard')}
            >
              Enter Vendor Workspace <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/admin/vendors')}
            >
              Simulate Admin Review <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-b border-teal-800/40 py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Healthcare Partner Network
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Join Quick Aarogya Healthcare Marketplace
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            Register your hospital, private clinic, retail pharmacy, or diagnostic laboratory. Provide authorized clinical services, manage patient queues, and expand your practice.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-6">
        <form onSubmit={handleSubmitApplication} className="space-y-6">
          {errorMsg && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Provider Category Selection */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              1. Select Healthcare Organization Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Choose the primary clinical classification for regulatory verification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  type: OrganizationType.INDEPENDENT_DOCTOR,
                  title: 'Private Doctor / Clinic',
                  desc: 'Individual practitioner or polyclinic',
                  icon: Stethoscope
                },
                {
                  type: OrganizationType.HOSPITAL,
                  title: 'Hospital / Center',
                  desc: 'Multi-specialty hospital or institute',
                  icon: Building2
                },
                {
                  type: OrganizationType.PHARMACY,
                  title: 'Retail Pharmacy',
                  desc: 'Licensed pharmacy & medicine retailer',
                  icon: Pill
                },
                {
                  type: OrganizationType.LAB,
                  title: 'Diagnostic Lab',
                  desc: 'Pathology & radiology center',
                  icon: FlaskConical
                }
              ].map(item => {
                const isSelected = orgType === item.type;
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.type}
                    onClick={() => setOrgType(item.type)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{item.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="mt-3 text-xs font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Step 2: Organization Profile & Regulatory Credentials */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              2. Organization Details & Medical License
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              All healthcare providers undergo verification against state and national medical registries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Official Organization / Practice Name *">
                <Input
                  placeholder={
                    orgType === OrganizationType.INDEPENDENT_DOCTOR
                      ? 'e.g. Dr. Sunita Mehra Lifestyle Clinic'
                      : orgType === OrganizationType.PHARMACY
                      ? 'e.g. MedPlus Express Pharmacy Sector 4'
                      : 'e.g. Max Care Super Specialty Hospital'
                  }
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  required
                />
              </FormField>

              <FormField
                label={
                  orgType === OrganizationType.PHARMACY
                    ? 'State Drug License Number (Form 20B/21B) *'
                    : 'Medical Registration / Council Number *'
                }
              >
                <Input
                  placeholder={
                    orgType === OrganizationType.PHARMACY ? 'e.g. DL-20B-99881' : 'e.g. MCI-2018-99482 / DMC-55421'
                  }
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  required
                />
              </FormField>

              {orgType === OrganizationType.INDEPENDENT_DOCTOR && (
                <FormField label="Primary Specialization">
                  <Input
                    placeholder="e.g. Cardiologist, Dermatologist, Pediatrician"
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                  />
                </FormField>
              )}

              <FormField label="City / Region *">
                <Input
                  placeholder="e.g. New Delhi, Noida, Mumbai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                />
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Facility / Practice Address">
                  <Input
                    placeholder="e.g. Suite 401, MedCenter Plaza, Greater Kailash 1"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </FormField>
              </div>

              {/* Document Upload Section */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Upload License Document / Registration Certificate (PDF, JPG, PNG) *
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-xl p-5 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                  <input
                    type="file"
                    id="licenseDocInput"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentFileChange}
                  />
                  {licenseDocName ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                      <div className="text-left">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">{licenseDocName}</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Document attached & verified</div>
                      </div>
                      <label
                        htmlFor="licenseDocInput"
                        className="ml-4 text-xs text-teal-600 hover:underline cursor-pointer font-semibold"
                      >
                        Replace
                      </label>
                    </div>
                  ) : (
                    <label htmlFor="licenseDocInput" className="cursor-pointer block">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {isUploadingDoc ? 'Uploading...' : 'Click to select certificate from device'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Council Registration Certificate, Pharmacy Drug License, or Clinical Establishment Act Permit
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3: Administrator Credentials */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              3. Organization Administrator & Login Credentials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              This account will receive initial ORG_ADMIN privileges to manage queues, staff members, and payouts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Administrator Full Name *">
                <Input
                  placeholder="e.g. Dr. Sunita Mehra"
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Official Email ID *">
                <Input
                  type="email"
                  placeholder="e.g. dr.sunita@carewell.in"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Official Mobile / Phone Number *">
                <Input
                  placeholder="e.g. +91 98765 11223"
                  value={adminPhone}
                  onChange={e => setAdminPhone(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Create Workspace Password *">
                <Input
                  type="password"
                  placeholder="At least 8 characters"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required
                />
              </FormField>
            </div>
          </Card>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              By applying, you certify that all uploaded licenses and practice registrations are genuine and compliant with the National Medical Commission / Pharmacy Council of India guidelines.
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 shadow-md"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Partner Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

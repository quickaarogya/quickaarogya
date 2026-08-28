'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, completeOnboarding } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal Demographics
  const [firstName, setFirstName] = useState(profile?.firstName || 'Priya');
  const [lastName, setLastName] = useState(profile?.lastName || 'Verma');
  const [dateOfBirth, setDateOfBirth] = useState('1994-06-20');
  const [gender, setGender] = useState<any>('FEMALE');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+91 98765 11223');

  // Step 2: Address & Emergency Contact
  const [addressLine1, setAddressLine1] = useState('Flat 204, Lotus Enclave, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560038');
  const [emergencyContactName, setEmergencyContactName] = useState('Rohan Verma');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98765 99887');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('Brother');

  // Step 3: Optional Clinical Preferences
  const [bloodGroup, setBloodGroup] = useState<any>('O+');
  const [allergies, setAllergies] = useState('None reported');
  const [chronicConditions, setChronicConditions] = useState('');
  const [abhaId, setAbhaId] = useState('priya.verma@abdm');
  const [organDonor, setOrganDonor] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else handleFinishOnboarding();
  };

  const handleFinishOnboarding = () => {
    setIsLoading(true);

    completeOnboarding({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      addressLine1,
      city,
      state,
      postalCode,
      emergencyContactName: `${emergencyContactName} (${emergencyContactRelation})`,
      emergencyContactPhone,
      bloodGroup,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: chronicConditions.split(',').map(s => s.trim()).filter(Boolean),
      abhaId,
    });

    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header with Step Progress */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
            <Sparkles size={13} />
            <span>Step {step} of 3 • Health Profile Setup</span>
          </div>

          <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">
            {step === 1 && "Personal Demographics"}
            {step === 2 && "Address & Emergency Contact"}
            {step === 3 && "Clinical Profile & Blood Group"}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {step === 1 && "Basic information to personalize your care regimen and consultation notes."}
            {step === 2 && "Required for express prescription delivery and life-saving first responders."}
            {step === 3 && "Optional medical vitals to assist doctors during acute triage and consultations."}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-teal-600 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Cards */}
        <Card variant="default" padding="lg" className="shadow-lg border-slate-200/80 dark:border-slate-800">
          <form onSubmit={handleNextStep} className="space-y-4">
            {/* Step 1: Personal Demographics */}
            {step === 1 && (
              <div className="space-y-3.5 animate-in fade-in-50">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="First Name" required>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Last Name" required>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Date of Birth" required>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Gender" required>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Primary Phone Number" required>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </FormField>
              </div>
            )}

            {/* Step 2: Address & Emergency Contact */}
            {step === 2 && (
              <div className="space-y-3.5 animate-in fade-in-50">
                <FormField label="Street Address" required>
                  <Input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Flat / Street"
                    required
                  />
                </FormField>

                <div className="grid grid-cols-3 gap-2">
                  <FormField label="City" required>
                    <Input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="State" required>
                    <Input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="PIN Code" required>
                    <Input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Emergency Next-of-Kin Contact
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Contact Name" required>
                      <Input
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="e.g. Rohan Verma"
                        required
                      />
                    </FormField>

                    <FormField label="Relationship" required>
                      <Input
                        type="text"
                        value={emergencyContactRelation}
                        onChange={(e) => setEmergencyContactRelation(e.target.value)}
                        placeholder="e.g. Brother, Spouse"
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Emergency Phone" required>
                    <Input
                      type="tel"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      placeholder="+91..."
                      required
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Step 3: Optional Clinical Preferences */}
            {step === 3 && (
              <div className="space-y-3.5 animate-in fade-in-50">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Blood Group (Optional)">
                    <Select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as any)}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="UNKNOWN">I don't know</option>
                    </Select>
                  </FormField>

                  <FormField label="Ayushman ABHA ID (Optional)">
                    <Input
                      type="text"
                      value={abhaId}
                      onChange={(e) => setAbhaId(e.target.value)}
                      placeholder="e.g. user@abdm"
                    />
                  </FormField>
                </div>

                <FormField label="Known Drug/Food Allergies (Optional)">
                  <Input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts (leave blank if none)"
                  />
                </FormField>

                <FormField label="Chronic Medical Conditions (Optional)">
                  <Input
                    type="text"
                    value={chronicConditions}
                    onChange={(e) => setChronicConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes, Asthma"
                  />
                </FormField>

                <div className="flex items-center gap-2.5 pt-1">
                  <Checkbox
                    id="onboardOrganDonor"
                    checked={organDonor}
                    onCheckedChange={setOrganDonor}
                  />
                  <label htmlFor="onboardOrganDonor" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    I would like to register as an Organ Donor in ABDM registry
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {step > 1 ? (
                <Button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  variant="secondary"
                  size="sm"
                >
                  <ArrowLeft size={14} /> Previous
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                {step === 3 && (
                  <Button
                    type="button"
                    onClick={handleFinishOnboarding}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500"
                  >
                    Skip Optional Step
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  className="font-bold"
                  isLoading={isLoading}
                >
                  {step === 3 ? "Complete & Open Cockpit" : "Next Step"} <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck size={14} className="text-teal-600" />
          <span>Information is encrypted at rest using AES-256 standard</span>
        </div>
      </div>
    </div>
  );
}

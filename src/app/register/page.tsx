'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'CARE_PROXY' | 'DOCTOR'>('PATIENT');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters with at least one uppercase letter and one number.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the healthcare terms of service and HIPAA compliance.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        fullName,
        email,
        phoneNumber,
        role,
        passwordPlain: password,
      });
      // Redirect to multi-step onboarding
      router.push('/onboarding');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md mx-auto">
            <Heart size={26} fill="currentColor" />
          </div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">
            Create Your Health Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Join Quick Aarogya to manage family medications, book consultations, and maintain a secure health vault.
          </p>
        </div>

        {/* Form Card */}
        <Card variant="default" padding="lg" className="shadow-lg border-slate-200/80 dark:border-slate-800">
          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="text-xs font-bold">Registration Error</AlertTitle>
              <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Legal Name" required>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Verma"
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  required
                />
              </FormField>

              <FormField label="Phone Number" required>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 00000"
                  required
                />
              </FormField>
            </div>

            <FormField label="Account Role" required helperText="Choose whether this account is for yourself, a family caregiver, or a healthcare doctor.">
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="PATIENT">Individual Patient (Self)</option>
                <option value="CARE_PROXY">Family Caregiver (Proxy for Elderly Parents / Children)</option>
                <option value="DOCTOR">Licensed Healthcare Doctor / Practitioner</option>
              </Select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Password" required>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                />
              </FormField>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onCheckedChange={setAgreeTerms}
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-tight">
                I agree to the <span className="font-semibold text-teal-600 dark:text-teal-400">HIPAA & ABDM Health Data Consents</span> and authorize encryption of my clinical timeline.
              </label>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full font-bold mt-2"
              isLoading={isLoading}
            >
              Continue to Health Onboarding <ArrowRight size={16} />
            </Button>
          </form>
        </Card>

        {/* Sign In Link */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

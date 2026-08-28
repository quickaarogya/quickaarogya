'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { AuthService } from '@/server/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('arjun@aarogya.health');
  const [otp, setOtp] = useState('849201');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await AuthService.generateResetOtp(identifier);
      setMessage(res.message);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset code. Please check your email or phone.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters with at least one uppercase letter and one number.');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.resetPassword(identifier, otp, newPassword);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. Please check your OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center shadow-xs mx-auto border border-amber-200 dark:border-amber-900">
            <KeyRound size={24} />
          </div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {step === 1
              ? 'Enter your registered email or phone to receive a 6-digit clinical verification code.'
              : 'Enter the 6-digit OTP code and choose your new secure password.'}
          </p>
        </div>

        {/* Reset Card */}
        <Card variant="default" padding="lg" className="shadow-lg border-slate-200/80 dark:border-slate-800">
          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle className="text-xs font-bold">Error</AlertTitle>
              <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
            </Alert>
          )}

          {message && !errorMsg && !isSuccess && (
            <Alert variant="info" className="mb-4">
              <AlertTitle className="text-xs font-bold">Verification Code Sent</AlertTitle>
              <AlertDescription className="text-xs">{message}</AlertDescription>
            </Alert>
          )}

          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                Password Successfully Reset!
              </h3>
              <p className="text-xs text-slate-500">
                Your login credentials have been securely updated. Redirecting you to sign in...
              </p>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <FormField label="Registered Email or Phone" required>
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. arjun@aarogya.health"
                  required
                />
              </FormField>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-bold mt-2"
                isLoading={isLoading}
              >
                Send 6-Digit Code <ArrowRight size={16} />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <FormField label="6-Digit Verification OTP" required helperText="Enter the OTP code received on your email/phone.">
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 849201"
                  required
                  maxLength={6}
                  className="font-mono text-center tracking-widest text-lg font-bold"
                />
              </FormField>

              <FormField label="New Secure Password" required>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
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

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="secondary"
                  className="w-1/3 text-xs"
                >
                  <ArrowLeft size={14} /> Back
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="flex-1 font-bold"
                  isLoading={isLoading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </Card>

        {/* Back to Login */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link href="/login" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  User,
  Stethoscope,
  Users
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/';

  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState('arjun@aarogya.health');
  const [password, setPassword] = useState('Aarogya@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      // If staff member / doctor / admin, route to vendor dashboard
      const isStaffOrDoctor =
        identifier.toLowerCase().includes('doc') ||
        identifier.toLowerCase().includes('admin') ||
        identifier.toLowerCase().includes('pharma') ||
        identifier.toLowerCase().includes('apollo');

      if (redirectPath && redirectPath !== '/') {
        router.push(redirectPath);
      } else if (isStaffOrDoctor) {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mx-auto mb-2">
          <img src="/logo.png" alt="Quick Aarogya Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
        </div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-50">
          Welcome to Quick <span className="text-teal-600 dark:text-teal-400">Aarogya</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Sign in to access your prescriptions, live OPD queue, and family healthcare cockpit.
        </p>
      </div>

      {/* Login Card */}
      <Card variant="default" padding="lg" className="shadow-lg border-slate-200/80 dark:border-slate-800">
        {errorMsg && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle className="text-xs font-bold">Authentication Error</AlertTitle>
            <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Email Address or Phone Number" required>
            <Input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@example.com or +91..."
              required
              autoComplete="username"
            />
          </FormField>

          <FormField label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </FormField>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                Keep me signed in
              </label>
            </div>

            <Link
              href="/forgot-password"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full font-bold mt-2"
            isLoading={isLoading}
          >
            Sign In to Health Portal <ArrowRight size={16} />
          </Button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick One-Tap Demo Profiles
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('arjun@aarogya.health', 'Aarogya@123')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-teal-400 text-center transition-all cursor-pointer"
            >
              <User size={15} className="mx-auto text-teal-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Patient</div>
              <div className="text-[9px] text-slate-400 truncate">Arjun</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('dr.ananya@aarogya.health', 'Doctor@123')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-sky-400 text-center transition-all cursor-pointer"
            >
              <Stethoscope size={15} className="mx-auto text-sky-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Doctor</div>
              <div className="text-[9px] text-slate-400 truncate">Dr. Ananya</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('savitri@aarogya.health', 'Mother@123')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-amber-400 text-center transition-all cursor-pointer"
            >
              <Users size={15} className="mx-auto text-amber-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Proxy</div>
              <div className="text-[9px] text-slate-400 truncate">Savitri</div>
            </button>
          </div>
        </div>
      </Card>

      {/* Register & Partner Links */}
      <div className="space-y-2 text-center text-xs text-slate-500 dark:text-slate-400">
        <div>
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
            Create an Account
          </Link>
        </div>
        <div className="pt-1">
          Are you a Doctor, Hospital, or Pharmacy?{' '}
          <Link href="/partner/onboarding" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Apply for Partner Onboarding
          </Link>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <ShieldCheck size={14} className="text-teal-600" />
        <span>ABDM Encrypted & HIPAA Compliant Healthcare Session</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <Suspense fallback={
        <div className="w-full max-w-md p-8 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading healthcare portal...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

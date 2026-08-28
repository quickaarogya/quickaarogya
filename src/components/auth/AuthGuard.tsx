'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('PATIENT' | 'CARE_PROXY' | 'DOCTOR' | 'ADMIN')[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, isOnboarded, isLoading, user, initSession } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (!isOnboarded && pathname !== '/onboarding') {
        router.push('/onboarding');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isOnboarded, isLoading, user, pathname, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="page-wrapper min-h-[60vh] flex flex-col justify-center items-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Securing clinical session...</p>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/login' && pathname !== '/register' && pathname !== '/forgot-password') {
    return null;
  }

  return <>{children}</>;
}

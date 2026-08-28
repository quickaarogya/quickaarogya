'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Stethoscope, ShoppingBag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AarogyaStorage } from '@/lib/storage';
import { useAppModeStore, AppMode } from '@/stores/useAppModeStore';
import { useCartStore } from '@/stores/useCartStore';

export default function AppModeFloatingSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const { appMode, setAppMode } = useAppModeStore();
  const cartCount = useCartStore(state => state.getTotalCount());

  // Automatic mode sync on dedicated sub-pages
  useEffect(() => {
    if (
      pathname.startsWith('/doctors') ||
      pathname.startsWith('/appointments') ||
      pathname.startsWith('/hospitals')
    ) {
      if (appMode !== 'doctors') {
        setAppMode('doctors');
      }
    } else if (
      pathname.startsWith('/pharmacies') ||
      pathname.startsWith('/cart')
    ) {
      if (appMode !== 'pharma') {
        setAppMode('pharma');
      }
    } else if (
      pathname.startsWith('/medicines') ||
      pathname.startsWith('/records') ||
      pathname.startsWith('/vitals') ||
      pathname.startsWith('/family') ||
      pathname.startsWith('/emergency')
    ) {
      if (appMode !== 'care') {
        setAppMode('care');
      }
    }
  }, [pathname]);

  // Dynamic status badges
  const schedules = typeof window !== 'undefined' ? AarogyaStorage.getMedicationSchedules() : [];
  const appointments = typeof window !== 'undefined' ? AarogyaStorage.getAppointments() : [];
  const lowMedsCount = schedules.filter(s => s.remainingQuantity <= s.refillThreshold).length;
  const activeApptsCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'booked').length;

  const handleSwitchMode = (mode: AppMode) => {
    setAppMode(mode);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const isDoctorsActive = appMode === 'doctors';
  const isPharmaActive = appMode === 'pharma';
  const isCareActive = appMode === 'care';

  return (
    <div
      role="region"
      aria-label="App Mode Switcher"
      className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-40 lg:hidden pointer-events-auto select-none"
    >
      <div className="flex items-center gap-1 p-1 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all">
        {/* 1. DOCTORS */}
        <button
          onClick={() => handleSwitchMode('doctors')}
          aria-pressed={isDoctorsActive}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer",
            isDoctorsActive
              ? "bg-[#026dd9] text-white font-black shadow-[0_4px_16px_rgba(2,109,217,0.35)]"
              : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/50"
          )}
        >
          {activeApptsCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs",
              isDoctorsActive ? "bg-white text-[#026dd9]" : "bg-[#026dd9] text-white"
            )}>
              {activeApptsCount}
            </span>
          )}

          <Stethoscope size={15} className={cn("transition-transform", isDoctorsActive && "scale-110")} />
          <span className="text-xs tracking-tight leading-none">
            Doctors
          </span>
        </button>

        {/* 2. PHARMA */}
        <button
          onClick={() => handleSwitchMode('pharma')}
          aria-pressed={isPharmaActive}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer",
            isPharmaActive
              ? "bg-[#0F766E] text-white font-black shadow-[0_4px_16px_rgba(15,118,110,0.35)]"
              : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/50"
          )}
        >
          {cartCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs",
              isPharmaActive ? "bg-[#2DD4BF] text-[#0F766E]" : "bg-[#E11D48] text-white"
            )}>
              {cartCount}
            </span>
          )}

          <ShoppingBag size={15} className={cn("transition-transform", isPharmaActive && "scale-110")} />
          <span className="text-xs tracking-tight leading-none">
            Pharma
          </span>
        </button>

        {/* 3. CARE */}
        <button
          onClick={() => handleSwitchMode('care')}
          aria-pressed={isCareActive}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer",
            isCareActive
              ? "bg-[#ff645e] text-white font-black shadow-[0_4px_16px_rgba(255,100,94,0.35)]"
              : "text-slate-600 hover:text-slate-900 font-bold hover:bg-white/50"
          )}
        >
          {lowMedsCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs",
              isCareActive ? "bg-white text-[#ff645e]" : "bg-[#ff645e] text-white animate-pulse"
            )}>
              {lowMedsCount}
            </span>
          )}

          <Heart size={15} className={cn("transition-transform", isCareActive && "scale-110 fill-current text-white")} />
          <span className="text-xs tracking-tight leading-none">
            Care
          </span>
        </button>
      </div>
    </div>
  );
}

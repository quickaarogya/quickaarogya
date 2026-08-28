'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { doctorsMobileNavItems, pharmaMobileNavItems, careMobileNavItems } from '@/config/navigation';
import { useAppModeStore } from '@/stores/useAppModeStore';
import { useCartStore } from '@/stores/useCartStore';
import { cn } from '@/lib/utils';
import { AarogyaStorage } from '@/lib/storage';

export default function MobileNav() {
  const pathname = usePathname();
  const { appMode } = useAppModeStore();
  const cartItemsCount = useCartStore((state) => state.getTotalCount());

  // Dynamic badges
  const schedules = typeof window !== 'undefined' ? AarogyaStorage.getMedicationSchedules() : [];
  const appointments = typeof window !== 'undefined' ? AarogyaStorage.getAppointments() : [];
  const lowMedsCount = schedules.filter(s => s.remainingQuantity <= s.refillThreshold).length;
  const activeApptsCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'booked').length;

  const currentNavItems =
    appMode === 'pharma'
      ? pharmaMobileNavItems
      : appMode === 'care'
      ? careMobileNavItems
      : doctorsMobileNavItems;

  const getBadgeForTab = (id: string) => {
    if (id === 'cart' && cartItemsCount > 0) return { text: `${cartItemsCount}`, isAlert: false };
    if (id === 'shop' && lowMedsCount > 0) return { text: `${lowMedsCount}`, isAlert: true };
    if (id === 'new_appointment' && activeApptsCount > 0) return { text: `${activeApptsCount}`, isAlert: false };
    return null;
  };

  const isDoctorsMode = appMode === 'doctors';
  const isCareMode = appMode === 'care';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/75 backdrop-blur-2xl border-t border-white/60 dark:bg-slate-900/75 dark:border-white/10 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.06)] transition-transform pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

          const badge = getBadgeForTab(item.id);

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full min-h-[48px] min-w-[48px] px-1 transition-all rounded-lg select-none",
                isActive
                  ? isDoctorsMode
                    ? "text-[#026dd9] font-bold"
                    : isCareMode
                    ? "text-[#ff645e] font-bold"
                    : "text-teal-600 dark:text-teal-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
              )}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className={cn(
                  "absolute top-1 w-8 h-1 rounded-full animate-in fade-in zoom-in-75 duration-150",
                  isDoctorsMode ? "bg-[#026dd9]" : isCareMode ? "bg-[#ff645e]" : "bg-teal-600 dark:bg-teal-400"
                )} />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center mt-1">
                <Icon
                  size={21}
                  className={cn(
                    "transition-transform duration-150",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />

                {badge && (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-900",
                      badge.isAlert ? "bg-red-600 animate-pulse" : isDoctorsMode ? "bg-[#026dd9]" : "bg-teal-600"
                    )}
                  >
                    {badge.text}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span className="text-[11px] tracking-tight mt-0.5 leading-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

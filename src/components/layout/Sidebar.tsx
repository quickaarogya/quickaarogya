'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { desktopSidebarSections } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AarogyaStorage } from '@/lib/storage';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('qa_sidebar_collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('qa_sidebar_collapsed', String(next));
  };

  // Dynamic Badges
  const schedules = typeof window !== 'undefined' ? AarogyaStorage.getMedicationSchedules() : [];
  const appointments = typeof window !== 'undefined' ? AarogyaStorage.getAppointments() : [];
  const lowMedsCount = schedules.filter(s => s.remainingQuantity <= s.refillThreshold).length;
  const activeApptsCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'booked').length;

  const getDynamicBadge = (id: string) => {
    if (id === 'medicines' && lowMedsCount > 0) return { text: `${lowMedsCount} Refill`, variant: 'danger' as const };
    if (id === 'appointments' && activeApptsCount > 0) return { text: `${activeApptsCount} Active`, variant: 'teal' as const };
    return null;
  };

  return (
    <aside
      aria-label="Desktop Sidebar Navigation"
      className={cn(
        "hidden lg:flex flex-col border-r border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 h-screen sticky top-0 transition-all duration-250 z-30 select-none",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Heart size={20} fill="currentColor" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                Quick <span className="text-teal-600 dark:text-teal-400">Aarogya</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Healthcare Platform
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={handleToggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {desktopSidebarSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 dark:text-slate-500">
                {section.groupTitle}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

                const dynamicBadge = getDynamicBadge(item.id);

                return (
                  <div key={item.id} className="relative group">
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all relative font-medium",
                        isActive
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                        isCollapsed && "justify-center px-0 py-2.5"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-teal-600 dark:bg-teal-400" />
                      )}

                      <Icon
                        size={19}
                        className={cn(
                          "flex-shrink-0 transition-colors",
                          isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                        )}
                      />

                      {!isCollapsed && (
                        <span className="truncate flex-1">
                          {item.name}
                        </span>
                      )}

                      {!isCollapsed && (dynamicBadge || item.badge) && (
                        <Badge
                          variant={dynamicBadge ? (dynamicBadge.variant === 'danger' ? 'danger' : 'teal') : item.badgeType === 'danger' ? 'danger' : 'teal'}
                          className="text-[10px] px-1.5 py-0 h-4"
                        >
                          {dynamicBadge ? dynamicBadge.text : item.badge}
                        </Badge>
                      )}
                    </Link>

                    {/* Tooltip on Collapsed State */}
                    {isCollapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap dark:bg-slate-800">
                        {item.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Caregiver Status */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div className="overflow-hidden">
              <div className="text-[11px] font-bold text-teal-800 dark:text-teal-300 truncate">
                ABDM & HIPAA Secured
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Zero-Trust Encrypted
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <ShieldCheck size={20} className="text-teal-600 mx-auto" />
        </div>
      )}
    </aside>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Search,
  Plus,
  ShoppingBag,
  Bell,
  SlidersHorizontal,
  FileText,
  Clock,
  ShieldAlert,
  Stethoscope,
  Pill,
  FolderOpen
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { useCartStore } from '@/stores/useCartStore';

export default function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalCount } = useCartStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  // Smart Hide on Scroll Down / Show on Scroll Up
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const loadData = () => {
      if (typeof window !== 'undefined') {
        setNotifications(AarogyaStorage.getNotifications());
      }
    };
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // If on Home page, Pharmacies, or Wishlist (which have their own dedicated integrated headers), skip rendering standard header
  if (pathname === '/' || pathname === '/pharmacies' || pathname === '/wishlist') {
    return null;
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const cartCount = getTotalCount();

  // Dynamic Page Configurations (Matching the Reference UI)
  const getPageHeaderConfig = () => {
    switch (pathname) {
      case '/doctors':
        return {
          title: 'Find & Book Doctors',
          subtitle: 'Verified Specialists & Clinics',
          rightAction: (
            <Link
              href="/appointments"
              className="px-3 py-1.5 rounded-full text-xs font-black bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 transition-all flex items-center gap-1 shadow-2xs"
            >
              <Clock size={13} />
              <span>My Queue</span>
            </Link>
          )
        };
      case '/appointments':
        return {
          title: 'Doctor Appointments',
          subtitle: 'Live OPD Queues & Tokens',
          rightAction: (
            <Link
              href="/doctors"
              className="px-3 py-1.5 rounded-full text-xs font-black bg-[#0F766E] hover:bg-[#115E59] text-white transition-all flex items-center gap-1 shadow-2xs"
            >
              <Plus size={13} />
              <span>Book Doctor</span>
            </Link>
          )
        };
      case '/medicines':
        return {
          title: 'Medication Regimen',
          subtitle: 'Daily Pill & Dose Tracker',
          rightAction: (
            <Link
              href="/pharmacies"
              className="px-3 py-1.5 rounded-full text-xs font-black bg-rose-50 hover:bg-rose-100 text-[#ff645e] border border-rose-200 transition-all flex items-center gap-1 shadow-2xs"
            >
              <ShoppingBag size={13} />
              <span>10-Min Refill</span>
            </Link>
          )
        };
      case '/records':
        return {
          title: 'Medical Records Vault',
          subtitle: 'Encrypted ABHA Documents',
          rightAction: (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff645e] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <span>ABHA Linked</span>
            </div>
          )
        };
      case '/cart':
        return {
          title: 'My Cart & Checkout',
          subtitle: '⚡ 10-min doorstep delivery',
          rightAction: (
            <Link
              href="/pharmacies"
              className="text-xs font-bold text-[#0F766E] hover:underline px-2 py-1"
            >
              + Add More
            </Link>
          )
        };
      case '/inbox':
        return {
          title: 'Health Inbox & Alerts',
          subtitle: 'Clinical & Delivery Updates',
          rightAction: unreadCount > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-[#E11D48] text-white text-[10px] font-black">
              {unreadCount} Unread
            </span>
          ) : null
        };
      case '/hospitals':
        return {
          title: 'Hospitals & 24/7 ER',
          subtitle: 'Emergency Trauma Directory',
          rightAction: (
            <Link
              href="/emergency"
              className="px-2.5 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-200 flex items-center gap-1"
            >
              <ShieldAlert size={13} />
              <span>SOS Profile</span>
            </Link>
          )
        };
      case '/labs':
        return {
          title: 'Diagnostic Lab Tests',
          subtitle: 'Home Sample Collection',
          rightAction: (
            <Link
              href="/records"
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Past Reports
            </Link>
          )
        };
      case '/family':
        return {
          title: 'Family Caregiver Hub',
          subtitle: 'Proxy Profiles & Consents',
          rightAction: null
        };
      case '/emergency':
        return {
          title: 'Emergency Health QR',
          subtitle: 'Paramedic & First Responder Info',
          rightAction: null
        };
      case '/expenses':
        return {
          title: 'Healthcare Expenses',
          subtitle: 'Tax 80D Deduction Tracker',
          rightAction: null
        };
      case '/settings':
        return {
          title: 'Privacy & Consents',
          subtitle: 'ABHA Data Governance',
          rightAction: null
        };
      case '/profile':
        return {
          title: 'Patient Profile',
          subtitle: 'Personal Details & ABHA ID',
          rightAction: null
        };
      default:
        return {
          title: 'Quick Aarogya',
          subtitle: 'Unified Healthcare Ecosystem',
          rightAction: null
        };
    }
  };

  const config = getPageHeaderConfig();

  return (
    <header
      className={`sticky top-0 z-40 lg:hidden bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left Side: Back Button & Page Title + Subtitle */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => router.back()}
            aria-label="Go Back"
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-800 transition-colors border border-white/70 shadow-2xs shrink-0 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={22} className="text-slate-800" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
              {config.title}
            </h1>
            {config.subtitle && (
              <span className="text-[10px] text-slate-400 font-semibold block leading-none mt-0.5 truncate">
                {config.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Contextual Actions Only (Search, Filter, Actions) */}
        <div className="flex items-center gap-2 shrink-0">
          {config.rightAction}
        </div>
      </div>
    </header>
  );
}

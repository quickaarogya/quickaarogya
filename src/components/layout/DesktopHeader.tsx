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
  Clock,
  ShieldAlert,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { useCareContextStore } from '@/stores/useCareContextStore';
import { useCartStore } from '@/stores/useCartStore';
import LocationModal from './LocationModal';

export default function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalCount } = useCartStore();
  const { isSosActive, toggleSos } = useCareContextStore();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('Flat 402, Heritage Heights, Green Park, New Delhi');

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
      } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // If on Home or Quick Meds, the header is fully integrated natively into the page
  if (pathname === '/' || pathname === '/pharmacies') {
    return null;
  }

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const getPageHeaderConfig = () => {
    switch (pathname) {
      case '/doctors':
        return {
          title: 'Find & Book Doctors',
          subtitle: 'Verified Medical Specialists & OPD Clinics',
          rightAction: (
            <Link
              href="/appointments"
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Clock size={13} />
              <span>My Queue</span>
            </Link>
          )
        };
      case '/appointments':
        return {
          title: 'Doctor Appointments',
          subtitle: 'Live OPD Queues & Consultation Tokens',
          rightAction: (
            <Link
              href="/doctors"
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#0F766E] hover:bg-[#115E59] text-white transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Plus size={13} />
              <span>Book Consultation</span>
            </Link>
          )
        };
      case '/medicines':
        return {
          title: 'Medication Regimen',
          subtitle: 'Daily Pill Adherence & Dose Logging',
          rightAction: (
            <Link
              href="/pharmacies"
              className="px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-50 hover:bg-rose-100 text-[#ff645e] border border-rose-200 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag size={13} />
              <span>10-Min Pharmacy</span>
            </Link>
          )
        };
      case '/records':
        return {
          title: 'Medical Records Vault',
          subtitle: 'Encrypted Diagnostic & ABHA Documents',
          rightAction: (
            <div className="flex items-center gap-1 text-xs font-bold text-[#ff645e] bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              <span>ABHA Vault Active</span>
            </div>
          )
        };
      case '/cart':
        return {
          title: 'My Cart & Checkout',
          subtitle: '⚡ 10-minute doorstep medicine dispatch',
          rightAction: (
            <Link
              href="/pharmacies"
              className="text-xs font-black text-[#0F766E] hover:underline px-2 py-1"
            >
              + Add More Medicines
            </Link>
          )
        };
      case '/inbox':
        return {
          title: 'Health Inbox & Alerts',
          subtitle: 'Clinical, Dispensation & Appointment Streams',
          rightAction: unreadCount > 0 ? (
            <span className="px-3 py-1 rounded-full bg-[#E11D48] text-white text-xs font-black">
              {unreadCount} Unread Alerts
            </span>
          ) : null
        };
      case '/hospitals':
        return {
          title: 'Hospitals & 24/7 ER Directory',
          subtitle: 'Emergency Trauma & Multi-Specialty Facilities',
          rightAction: (
            <button
              onClick={toggleSos}
              className="px-3 py-1.5 rounded-full text-xs font-black bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1.5"
            >
              <ShieldAlert size={14} />
              <span>SOS Emergency</span>
            </button>
          )
        };
      case '/labs':
        return {
          title: 'Diagnostic Lab Tests',
          subtitle: 'Home Sample Collection & Digital Reports',
          rightAction: (
            <Link
              href="/records"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Past Test Reports
            </Link>
          )
        };
      default:
        return {
          title: 'Quick Aarogya Platform',
          subtitle: 'Unified Healthcare Ecosystem',
          rightAction: null
        };
    }
  };

  const config = getPageHeaderConfig();

  return (
    <>
      <header
        className={`hidden lg:flex items-center justify-between h-16 px-8 bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Left Side: Back Button & Page Title + Subtitle */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={() => router.back()}
            aria-label="Go Back"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors border border-slate-200/80 shrink-0 active:scale-95"
          >
            <ChevronLeft size={22} className="text-slate-800" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight truncate">
              {config.title}
            </h1>
            {config.subtitle && (
              <span className="text-xs text-slate-400 font-medium block leading-none mt-0.5 truncate">
                {config.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Contextual Actions Only (No duplicate search/care buttons) */}
        <div className="flex items-center gap-3">
          {config.rightAction}

          {/* Quick Location Trigger */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            <MapPin size={13} className="text-[#0F766E]" />
            <span className="truncate max-w-[130px] text-[11px]">Green Park</span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>
        </div>
      </header>

      {/* Interactive Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(addr) => setCurrentAddress(addr)}
      />
    </>
  );
}

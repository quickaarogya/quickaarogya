'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Heart,
  Search,
  ShoppingBag,
  ShoppingCart,
  Bell,
  Clock,
  MapPin,
  ChevronDown,
  Stethoscope,
  Activity,
  Zap,
  ShieldCheck,
  User,
  Settings,
  FolderHeart,
  Users,
  Receipt,
  AlertOctagon,
  LogOut,
  X,
  Mic,
  Plus
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { useAppModeStore, AppMode } from '@/stores/useAppModeStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCareContextStore } from '@/stores/useCareContextStore';
import { cn } from '@/lib/utils';
import LocationModal from './LocationModal';

export default function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { appMode, setAppMode } = useAppModeStore();
  const { getTotalCount, getTotalPrice } = useCartStore();
  const { isSosActive, toggleSos } = useCareContextStore();

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [wishlistDocIds, setWishlistDocIds] = useState<string[]>([]);
  const [wishlistMedIds, setWishlistMedIds] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('Flat 402, Heritage Heights, Green Park, New Delhi');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync mode with dedicated subpages
  useEffect(() => {
    setMounted(true);
    if (
      pathname.startsWith('/doctors') ||
      pathname.startsWith('/appointments') ||
      pathname.startsWith('/hospitals')
    ) {
      if (appMode !== 'doctors') setAppMode('doctors');
    } else if (
      pathname.startsWith('/pharmacies') ||
      pathname.startsWith('/cart') ||
      (pathname.startsWith('/medicines/') && pathname !== '/medicines')
    ) {
      if (appMode !== 'pharma') setAppMode('pharma');
    } else if (
      pathname === '/medicines' ||
      pathname.startsWith('/records') ||
      pathname.startsWith('/vitals') ||
      pathname.startsWith('/family') ||
      pathname.startsWith('/emergency') ||
      pathname.startsWith('/expenses')
    ) {
      if (appMode !== 'care') setAppMode('care');
    }
  }, [pathname]);

  const loadData = () => {
    if (typeof window !== 'undefined') {
      setProfile(AarogyaStorage.getUserProfile());
      setNotifications(AarogyaStorage.getNotifications());
      setWishlistDocIds(AarogyaStorage.getWishlistDoctors());
      setWishlistMedIds(AarogyaStorage.getWishlistMedicines());
      setAppointments(AarogyaStorage.getAppointments());
      setSchedules(AarogyaStorage.getMedicationSchedules());
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const cartCount = mounted ? getTotalCount() : 0;
  const cartTotal = mounted ? getTotalPrice() : 0;
  const totalCartCount = cartCount;
  const totalCartPrice = cartTotal;
  const unreadNotificationsCount = unreadCount;
  const totalWishlistCount = appMode === 'care' ? schedules.length : appMode === 'doctors' ? wishlistDocIds.length : wishlistMedIds.length;

  // Dynamic appointment & schedules count
  const activeApptsCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'booked').length;
  const lowMedsCount = schedules.filter(s => s.remainingQuantity <= s.refillThreshold).length;

  const handleSwitchMode = (mode: AppMode) => {
    setAppMode(mode);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (appMode === 'doctors') {
      router.push(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    } else if (appMode === 'pharma') {
      router.push(`/pharmacies?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/records?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isDoctors = appMode === 'doctors';
  const isPharma = appMode === 'pharma';
  const isCare = appMode === 'care';

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.04)] select-none">
        {/* ROW 1: PRIMARY E-COMMERCE TOP BAR */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-18 flex items-center justify-between gap-4">
          {/* 1. BRAND LOGO + LOCATION SELECTOR */}
          <div className="flex items-center gap-5 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Quick Aarogya Logo"
                className="h-[34px] w-auto max-w-[58px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-105 drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-slate-50 leading-none">
                  Quick <span suppressHydrationWarning className={cn(
                    "transition-colors",
                    isDoctors && "text-[#026dd9]",
                    isPharma && "text-[#0F766E]",
                    isCare && "text-[#ff645e]"
                  )}>Aarogya</span>
                </span>
                <span suppressHydrationWarning className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  {isDoctors ? 'Doctors & Hospital OPD' : isCare ? 'Family Care & Vitals Hub' : '10-Min Pharmacy Store'}
                </span>
              </div>
            </Link>

            {/* Location & Instant Delivery Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 text-left transition-all cursor-pointer group"
            >
              <MapPin size={16} className={cn(
                "shrink-0 transition-colors",
                isDoctors && "text-[#026dd9]",
                isPharma && "text-[#0F766E]",
                isCare && "text-[#ff645e]"
              )} />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Deliver To</span>
                  <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60">
                    ⚡ 10 Mins
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800 truncate max-w-[130px] leading-tight mt-0.5">
                  Green Park, New Delhi
                </span>
              </div>
              <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-700 transition-colors ml-0.5" />
            </button>
          </div>

          {/* 2. MODE SWITCHER CAPSULE DOCK */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-full border border-slate-200/80 dark:border-slate-700/80 shadow-2xs shrink-0">
            {/* DOCTORS */}
            <button
              onClick={() => handleSwitchMode('doctors')}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer",
                isDoctors
                  ? "bg-[#026dd9] text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              <Stethoscope size={14} className={isDoctors ? "scale-110" : ""} />
              <span>Doctors</span>
              {activeApptsCount > 0 && (
                <span className={cn(
                  "min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center",
                  isDoctors ? "bg-white text-[#026dd9]" : "bg-[#026dd9] text-white"
                )}>
                  {activeApptsCount}
                </span>
              )}
            </button>

            {/* PHARMA */}
            <button
              onClick={() => handleSwitchMode('pharma')}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer",
                isPharma
                  ? "bg-[#0F766E] text-white shadow-md shadow-teal-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              <ShoppingBag size={14} className={isPharma ? "scale-110" : ""} />
              <span>Pharma</span>
              <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1 py-0.2 rounded-full">
                10m
              </span>
            </button>

            {/* CARE */}
            <button
              onClick={() => handleSwitchMode('care')}
              className={cn(
                "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer",
                isCare
                  ? "bg-[#ff645e] text-white shadow-md shadow-rose-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              )}
            >
              <Heart size={14} className={isCare ? "scale-110 fill-white" : ""} />
              <span>Care Hub</span>
              {lowMedsCount > 0 && (
                <span className={cn(
                  "min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center",
                  isCare ? "bg-white text-[#ff645e]" : "bg-[#ff645e] text-white"
                )}>
                  {lowMedsCount}
                </span>
              )}
            </button>
          </div>

          {/* 3. CENTER SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl xl:max-w-3xl relative mx-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  isDoctors
                    ? 'Search doctors, surgeons, hospitals, "cardiologist"...'
                    : isPharma
                    ? 'Search "paracetamol", "vicks", "dolo 650", "inhalers"...'
                    : 'Search vitals, records, family members, prescriptions...'
                }
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 dark:bg-slate-800/90 focus:bg-white border border-slate-200/90 dark:border-slate-700/90 focus:border-teal-500 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none shadow-2xs focus:shadow-md"
              />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3.5 text-slate-400 hover:text-slate-600">
                  <X size={15} />
                </button>
              ) : (
                <Mic className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              )}
            </div>
          </form>

          {/* 4. RIGHT ACTION BUTTONS: WISHLIST, INBOX, CART, USER PROFILE */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700 transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
              title="Saved Wishlist"
            >
              <Heart size={16} className={totalWishlistCount > 0 ? "fill-rose-500 text-rose-500" : "text-slate-600"} />
              <span className="text-xs font-extrabold hidden xl:inline">Wishlist</span>
              {totalWishlistCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D48] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Health Inbox */}
            <Link
              href="/inbox"
              aria-label="Notifications"
              className="relative p-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700 transition-all shadow-2xs active:scale-95 flex items-center justify-center"
              title="Health Inbox & Alerts"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D48] text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* E-Commerce Cart Pill */}
            <Link
              href="/cart"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer",
                cartCount > 0
                  ? "bg-[#0F766E] text-white hover:bg-[#115E59] shadow-teal-600/20"
                  : "bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/90"
              )}
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white text-[11px] font-extrabold">
                  ₹{cartTotal} ({cartCount})
                </span>
              )}
            </Link>

            {/* User Profile Menu Pill */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 transition-all cursor-pointer group"
              >
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Profile"
                  className="w-7 h-7 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                />
                <span className="text-xs font-extrabold text-slate-800 truncate max-w-[90px]">
                  Hi, {profile?.firstName || 'Arjun'}
                </span>
                <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.12)] p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 mb-1">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                      {profile?.firstName} {profile?.lastName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ABHA: {profile?.abhaId || '91-8834-2910-1823'}
                    </div>
                  </div>

                  <Link
                    href="/cart"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <ShoppingBag size={15} />
                    <span>My Pharmacy Orders</span>
                  </Link>

                  <Link
                    href="/appointments"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Clock size={15} />
                    <span>Doctor Appointments & Queue</span>
                  </Link>

                  <Link
                    href="/family"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <Users size={15} />
                    <span>Family Caregiver Circle</span>
                  </Link>

                  <Link
                    href="/records"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <FolderHeart size={15} />
                    <span>ABHA Medical Records Vault</span>
                  </Link>

                  <Link
                    href="/expenses"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <Receipt size={15} />
                    <span>Medical Expenses (80D Tax)</span>
                  </Link>

                  <Link
                    href="/emergency"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <AlertOctagon size={15} />
                    <span>Emergency QR Profile (ICE)</span>
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <Link
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <Settings size={15} />
                    <span>Settings & Consents</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: MODE-AWARE E-COMMERCE CATEGORY & QUICK NAVIGATION STRIP */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            {/* 1. PHARMA MODE SUB-NAV */}
            {isPharma && (
              <div className="flex items-center gap-2 text-xs font-extrabold whitespace-nowrap">
                <span className="text-[11px] font-black text-[#0F766E] uppercase tracking-wider flex items-center gap-1 mr-2">
                  <Zap size={13} className="fill-[#0F766E]" /> Instant 10-Min Store
                </span>
                <Link href="/pharmacies" className="px-3 py-1 rounded-xl bg-teal-50 text-[#0F766E] hover:bg-teal-100 border border-teal-200/80 transition-colors">
                  All Medicines
                </Link>
                <Link href="/pharmacies?category=pain_fever" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  💊 Pain & Fever
                </Link>
                <Link href="/pharmacies?category=cold_cough" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🤧 Cold & Cough
                </Link>
                <Link href="/pharmacies?category=first_aid" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🩹 First Aid Kits
                </Link>
                <Link href="/pharmacies?category=vitamins" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  ✨ Daily Vitamins
                </Link>
                <Link href="/pharmacies?category=skincare" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🧴 Skin Care
                </Link>
                <Link href="/pharmacies?category=digestion" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🍃 Stomach Care
                </Link>
                <Link href="/pharmacies?category=chronic" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  📋 Rx Chronic
                </Link>
              </div>
            )}

            {/* 2. DOCTOR MODE SUB-NAV */}
            {isDoctors && (
              <div className="flex items-center gap-2 text-xs font-extrabold whitespace-nowrap">
                <span className="text-[11px] font-black text-[#026dd9] uppercase tracking-wider flex items-center gap-1 mr-2">
                  <Stethoscope size={13} /> Verified OPD Clinics
                </span>
                <Link href="/doctors" className="px-3 py-1 rounded-xl bg-blue-50 text-[#026dd9] hover:bg-blue-100 border border-blue-200/80 transition-colors">
                  All Specialists
                </Link>
                <Link href="/doctors?specialty=Cardiologist" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  ❤️ Cardiology
                </Link>
                <Link href="/doctors?specialty=Pediatrician" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  👶 Pediatrics
                </Link>
                <Link href="/doctors?specialty=Dermatologist" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  ✨ Dermatology
                </Link>
                <Link href="/doctors?specialty=Orthopedic" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🦴 Orthopedics
                </Link>
                <Link href="/hospitals" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🏥 Top Hospitals & ER
                </Link>
                <Link href="/appointments" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  📅 Live OPD Queue Tokens
                </Link>
              </div>
            )}

            {/* 3. CARE MODE SUB-NAV */}
            {isCare && (
              <div className="flex items-center gap-2 text-xs font-extrabold whitespace-nowrap">
                <span className="text-[11px] font-black text-[#ff645e] uppercase tracking-wider flex items-center gap-1 mr-2">
                  <Heart size={13} className="fill-[#ff645e]" /> Family Health Circle
                </span>
                <Link href="/family" className="px-3 py-1 rounded-xl bg-rose-50 text-[#ff645e] hover:bg-rose-100 border border-rose-200/80 transition-colors">
                  👨‍👩‍👧‍👦 Family Members
                </Link>
                <Link href="/medicines" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  💊 Daily Medication Regimen
                </Link>
                <Link href="/records" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  📁 ABHA Document Vault
                </Link>
                <Link href="/emergency" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  🆘 Emergency ICE QR
                </Link>
                <Link href="/expenses" className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70 transition-colors">
                  💰 80D Tax Ledger
                </Link>
              </div>
            )}

            {/* Right Tagline */}
            <div className="hidden 2xl:flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>100% Genuine Direct Supply • ABDM Integrated</span>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(addr) => setCurrentAddress(addr)}
      />
    </>
  );
}

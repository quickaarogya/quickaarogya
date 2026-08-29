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

  const themeConfig = isDoctors
    ? {
        headerBg: 'bg-gradient-to-r from-[#01356b] via-[#0256ab] to-[#026dd9] text-white border-b border-blue-400/30 shadow-[0_10px_30px_rgba(2,109,217,0.25)]',
        row2Bg: 'bg-gradient-to-r from-[#012247]/95 via-[#013b78]/95 to-[#024f9e]/95 backdrop-blur-xl border-t border-white/15 text-white',
        logoAccent: 'text-[#60a5fa]',
        subtitle: 'text-blue-200/90',
        capsuleBg: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        deliverToLabel: 'text-blue-200',
        deliverToBadge: 'bg-blue-400/30 text-white border-blue-300/40',
        dockBg: 'bg-black/25 border-white/20',
        dockActive: 'bg-white text-[#026dd9] font-black shadow-md border border-white',
        dockInactive: 'text-white/80 hover:text-white hover:bg-white/15',
        actionBtn: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        cartBtn: 'bg-white text-[#026dd9] hover:bg-blue-50 shadow-md',
        profileBtn: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        subnavTag: 'bg-white/20 text-white border-white/25',
        subnavActive: 'bg-white text-[#026dd9] font-black border-white shadow-md',
        subnavInactive: 'bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md',
        guarantee: 'text-blue-100',
        guaranteeIcon: 'text-sky-300',
      }
    : isCare
    ? {
        headerBg: 'bg-gradient-to-r from-[#9F1239] via-[#E11D48] to-[#FF5E62] text-white border-b border-rose-300/30 shadow-[0_10px_30px_rgba(225,29,72,0.25)]',
        row2Bg: 'bg-gradient-to-r from-[#881337]/95 via-[#BE123C]/95 to-[#E11D48]/95 backdrop-blur-xl border-t border-white/15 text-white',
        logoAccent: 'text-white drop-shadow-xs',
        subtitle: 'text-rose-100/90',
        capsuleBg: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        deliverToLabel: 'text-rose-200',
        deliverToBadge: 'bg-white/30 text-white border-white/40',
        dockBg: 'bg-black/25 border-white/20',
        dockActive: 'bg-white text-[#E11D48] font-black shadow-md border border-white',
        dockInactive: 'text-white/80 hover:text-white hover:bg-white/15',
        actionBtn: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        cartBtn: 'bg-white text-[#E11D48] hover:bg-rose-50 shadow-md',
        profileBtn: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        subnavTag: 'bg-white/20 text-white border-white/25',
        subnavActive: 'bg-white text-[#E11D48] font-black border-white shadow-md',
        subnavInactive: 'bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md',
        guarantee: 'text-rose-100',
        guaranteeIcon: 'text-amber-200',
      }
    : {
        // Pharma
        headerBg: 'bg-gradient-to-r from-[#04332e] via-[#09574f] to-[#0F766E] text-white border-b border-teal-400/30 shadow-[0_10px_30px_rgba(15,118,110,0.25)]',
        row2Bg: 'bg-gradient-to-r from-[#032420]/95 via-[#06423b]/95 to-[#09574f]/95 backdrop-blur-xl border-t border-white/15 text-white',
        logoAccent: 'text-[#2DD4BF]',
        subtitle: 'text-teal-200/90',
        capsuleBg: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        deliverToLabel: 'text-teal-200',
        deliverToBadge: 'bg-teal-400/30 text-white border-teal-300/40',
        dockBg: 'bg-black/25 border-white/20',
        dockActive: 'bg-white text-[#0F766E] font-black shadow-md border border-white',
        dockInactive: 'text-white/80 hover:text-white hover:bg-white/15',
        actionBtn: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        cartBtn: 'bg-white text-[#0F766E] hover:bg-teal-50 shadow-md',
        profileBtn: 'bg-white/15 hover:bg-white/25 border-white/20 text-white',
        subnavTag: 'bg-white/20 text-white border-white/25',
        subnavActive: 'bg-white text-[#0F766E] font-black border-white shadow-md',
        subnavInactive: 'bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md',
        guarantee: 'text-teal-100',
        guaranteeIcon: 'text-emerald-300',
      };

  return (
    <>
      <header className={cn("hidden lg:block sticky top-0 z-50 backdrop-blur-2xl transition-colors duration-300 select-none", themeConfig.headerBg)}>
        {/* ROW 1: PRIMARY E-COMMERCE TOP BAR (SPACIOUS & LUXURIOUS HEIGHT & PADDING) */}
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-20 min-h-[80px] flex items-center justify-between gap-5">
          {/* 1. BRAND LOGO + LOCATION SELECTOR */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md p-1 flex items-center justify-center shadow-md shrink-0 border border-white/80 transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Quick Aarogya Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-white leading-none drop-shadow-xs">
                  Quick <span suppressHydrationWarning className={cn("transition-colors", themeConfig.logoAccent)}>Aarogya</span>
                </span>
                <span suppressHydrationWarning className={cn("text-[10px] font-bold uppercase tracking-wider mt-1", themeConfig.subtitle)}>
                  {isDoctors ? 'Doctors & Hospital OPD' : isCare ? 'Family Care & Vitals Hub' : '10-Min Pharmacy Store'}
                </span>
              </div>
            </Link>

            {/* Location & Instant Delivery Selector (Generously Padded Address Capsule) */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className={cn("flex items-center gap-3 px-4 py-2 rounded-2xl border text-left transition-all cursor-pointer group shadow-xs backdrop-blur-md", themeConfig.capsuleBg)}
            >
              <MapPin size={18} className="shrink-0 text-white" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className={cn("text-[10px] font-black uppercase tracking-wider", themeConfig.deliverToLabel)}>Deliver To</span>
                  <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded border leading-none backdrop-blur-xs", themeConfig.deliverToBadge)}>
                    ⚡ 10 Mins
                  </span>
                </div>
                <span className="text-xs font-black text-white truncate max-w-[140px] leading-tight mt-1">
                  Green Park, New Delhi
                </span>
              </div>
              <ChevronDown size={14} className="text-white/70 group-hover:text-white transition-colors ml-0.5" />
            </button>
          </div>

          {/* 2. MODE SWITCHER CAPSULE DOCK */}
          <div className={cn("flex items-center gap-1.5 p-1.5 rounded-full border shadow-inner backdrop-blur-xl shrink-0", themeConfig.dockBg)}>
            {/* DOCTORS */}
            <button
              onClick={() => handleSwitchMode('doctors')}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer",
                isDoctors
                  ? themeConfig.dockActive
                  : themeConfig.dockInactive
              )}
            >
              <Stethoscope size={14} className={isDoctors ? "scale-110" : ""} />
              <span>Doctors</span>
              {activeApptsCount > 0 && (
                <span className={cn(
                  "min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center",
                  isDoctors ? "bg-[#026dd9] text-white" : "bg-white text-[#026dd9]"
                )}>
                  {activeApptsCount}
                </span>
              )}
            </button>

            {/* PHARMA */}
            <button
              onClick={() => handleSwitchMode('pharma')}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer",
                isPharma
                  ? themeConfig.dockActive
                  : themeConfig.dockInactive
              )}
            >
              <ShoppingBag size={14} className={isPharma ? "scale-110" : ""} />
              <span>Pharma</span>
              <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                10m
              </span>
            </button>

            {/* CARE */}
            <button
              onClick={() => handleSwitchMode('care')}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer",
                isCare
                  ? themeConfig.dockActive
                  : themeConfig.dockInactive
              )}
            >
              <Heart size={14} className={isCare ? "scale-110 fill-current" : ""} />
              <span>Care Hub</span>
              {lowMedsCount > 0 && (
                <span className={cn(
                  "min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center",
                  isCare ? "bg-[#E11D48] text-white" : "bg-white text-[#E11D48]"
                )}>
                  {lowMedsCount}
                </span>
              )}
            </button>
          </div>

          {/* 3. CENTER SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl xl:max-w-3xl relative mx-3">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
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
                className="w-full pl-11 pr-11 py-3 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white rounded-2xl text-xs font-medium border-0 outline-none shadow-md focus:ring-2 focus:ring-white/80 transition-all"
              />
              {searchQuery ? (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-4 text-slate-400 hover:text-slate-600">
                  <X size={15} />
                </button>
              ) : (
                <Mic className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
              )}
            </div>
          </form>

          {/* 4. RIGHT ACTION BUTTONS: WISHLIST, INBOX, CART, USER PROFILE (HARMONIOUS FROSTED GLASS) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={cn("relative p-3 rounded-2xl border transition-all shadow-xs active:scale-95 flex items-center gap-1.5 backdrop-blur-md", themeConfig.actionBtn)}
              title="Saved Wishlist"
            >
              <Heart size={17} className={totalWishlistCount > 0 ? "fill-rose-400 text-rose-400" : "text-white"} />
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
              className={cn("relative p-3 rounded-2xl border transition-all shadow-xs active:scale-95 flex items-center justify-center backdrop-blur-md", themeConfig.actionBtn)}
              title="Health Inbox & Alerts"
            >
              <Bell size={17} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D48] text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* E-Commerce Cart Pill (Harmonized Frosted Glass Styling) */}
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className={cn(
                "relative p-3 px-3.5 rounded-2xl border transition-all shadow-xs active:scale-95 flex items-center gap-1.5 backdrop-blur-md text-white font-extrabold text-xs cursor-pointer",
                themeConfig.actionBtn
              )}
              title="Shopping Cart"
            >
              <ShoppingCart size={17} className="text-white" />
              <span className="text-xs font-extrabold hidden xl:inline text-white">Cart</span>
              {cartCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile Menu Pill */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={cn("flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl border transition-all cursor-pointer group shadow-xs backdrop-blur-md", themeConfig.profileBtn)}
              >
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Profile"
                  className="w-7 h-7 rounded-xl object-cover border border-white/80 shadow-2xs shrink-0"
                />
                <span className="text-xs font-extrabold text-white truncate max-w-[90px]">
                  Hi, {profile?.firstName || 'Arjun'}
                </span>
                <ChevronDown size={13} className="text-white/70 group-hover:text-white transition-colors" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.2)] p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
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
        <div className={cn("border-t transition-colors duration-300", themeConfig.row2Bg)}>
          <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar scrollbar-none">
            {/* 1. PHARMA MODE SUB-NAV */}
            {isPharma && (
              <div className="flex items-center gap-2.5 text-xs font-extrabold whitespace-nowrap">
                <Link
                  href="/pharmacies"
                  className="px-4 py-1.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95 bg-white text-[#0F766E] border border-white hover:bg-teal-50 shrink-0"
                >
                  <ShoppingBag size={14} className="fill-current" />
                  <span>Pharmacy Shop</span>
                </Link>
                <span className={cn("text-[11px] font-black uppercase tracking-wider flex items-center gap-1 mr-1 px-2.5 py-1 rounded-lg border", themeConfig.subnavTag)}>
                  <Zap size={13} className="fill-current" /> 10-Min Delivery
                </span>
                <Link href="/pharmacies?category=pain_fever" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  💊 Pain & Fever
                </Link>
                <Link href="/pharmacies?category=cold_cough" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🤧 Cold & Cough
                </Link>
                <Link href="/pharmacies?category=first_aid" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🩹 First Aid Kits
                </Link>
                <Link href="/pharmacies?category=vitamins" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  ✨ Daily Vitamins
                </Link>
                <Link href="/pharmacies?category=skincare" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🧴 Skin Care
                </Link>
                <Link href="/pharmacies?category=digestion" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🍃 Stomach Care
                </Link>
                <Link href="/pharmacies?category=chronic" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  📋 Rx Chronic
                </Link>
              </div>
            )}

            {/* 2. DOCTOR MODE SUB-NAV */}
            {isDoctors && (
              <div className="flex items-center gap-2 text-xs font-extrabold whitespace-nowrap">
                <Link
                  href="/doctors"
                  className="px-4 py-1.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95 bg-white text-[#026dd9] border border-white hover:bg-blue-50 shrink-0"
                >
                  <Stethoscope size={14} />
                  <span>Doctors Directory</span>
                </Link>
                <Link href="/doctors?mode=ct_scan" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🔬 CT Scans
                </Link>
                <Link href="/doctors?mode=pathology" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🧪 Pathology Labs
                </Link>
                <Link href="/doctors?mode=x_ray" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  ⚡ Digital X-Rays
                </Link>
                <Link href="/doctors?mode=compare_prices" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  ⚖️ Compare Prices
                </Link>
                <Link href="/hospitals" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🏥 Top Hospitals & ER
                </Link>
                <Link href="/appointments" className={cn("px-3 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  📅 Live OPD Queue
                </Link>
              </div>
            )}

            {/* 3. CARE MODE SUB-NAV */}
            {isCare && (
              <div className="flex items-center gap-2.5 text-xs font-extrabold whitespace-nowrap">
                <span className={cn("text-[11px] font-black uppercase tracking-wider flex items-center gap-1 mr-2.5 px-2.5 py-1 rounded-lg border", themeConfig.subnavTag)}>
                  <Heart size={13} className="fill-current" /> Family Health Circle
                </span>
                <Link href="/family" className={cn("px-3.5 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavActive)}>
                  👨‍👩‍👧‍👦 Family Members
                </Link>
                <Link href="/medicines" className={cn("px-3.5 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  💊 Daily Medication Regimen
                </Link>
                <Link href="/records" className={cn("px-3.5 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  📁 ABHA Document Vault
                </Link>
                <Link href="/emergency" className={cn("px-3.5 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  🆘 Emergency ICE QR
                </Link>
                <Link href="/expenses" className={cn("px-3.5 py-1.5 rounded-xl border transition-colors shadow-2xs", themeConfig.subnavInactive)}>
                  💰 80D Tax Ledger
                </Link>
              </div>
            )}

            {/* Right Tagline */}
            <div className={cn("hidden 2xl:flex items-center gap-1.5 text-[11px] font-bold", themeConfig.guarantee)}>
              <ShieldCheck size={14} className={themeConfig.guaranteeIcon} />
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

'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Heart,
  Trash2,
  Stethoscope,
  Pill,
  ShoppingBag,
  Clock,
  Check,
  Search,
  Users,
  AlertTriangle,
  RefreshCw,
  HeartHandshake,
  Repeat,
  CheckCircle2
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { Doctor, Medicine, MedicationSchedule, FamilyMember } from '@/types';
import {
  initialDoctors,
  initialMedicines,
  initialMedicationSchedules,
  initialFamilyMembers
} from '@/lib/mockData';
import { useCartStore } from '@/stores/useCartStore';
import { useAppModeStore } from '@/stores/useAppModeStore';
import { Button } from '@/components/ui/button';
import { DoctorPortraitCard } from '@/components/doctor/DoctorPortraitCard';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function WishlistContent() {
  const router = useRouter();
  const { appMode } = useAppModeStore();
  const isCareMode = appMode === 'care';
  const isDoctorsMode = appMode === 'doctors';
  const isPharmaMode = appMode === 'pharma' || (!isCareMode && !isDoctorsMode);

  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states initialized with rich defaults for SSR and hydrated with storage
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(initialDoctors);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>(initialMedicines);
  const [medSchedules, setMedSchedules] = useState<MedicationSchedule[]>(initialMedicationSchedules);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [wishlistDoctorIds, setWishlistDoctorIds] = useState<string[]>(['doc-bt-1', 'doc-bt-2', 'doc-bt-3', 'doc-bt-4']);
  const [wishlistMedicineIds, setWishlistMedicineIds] = useState<string[]>(['med-1', 'med-4', 'med-12', 'med-18', 'med-21']);

  const [addedMedsMap, setAddedMedsMap] = useState<{ [id: string]: boolean }>({});
  const [isRefillAllLoading, setIsRefillAllLoading] = useState(false);
  const [refillAllSuccess, setRefillAllSuccess] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const { addItem } = useCartStore();

  const loadData = () => {
    if (typeof window !== 'undefined') {
      setAllDoctors(AarogyaStorage.getDoctors());
      setAllMedicines(AarogyaStorage.getMedicines());
      setMedSchedules(AarogyaStorage.getMedicationSchedules());
      setFamilyMembers(AarogyaStorage.getFamilyMembers());
      setWishlistDoctorIds(AarogyaStorage.getWishlistDoctors());
      setWishlistMedicineIds(AarogyaStorage.getWishlistMedicines());
    }
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('storage-update', handleStorageChange);
    return () => window.removeEventListener('storage-update', handleStorageChange);
  }, []);

  // Family profile map for lookup in Care Mode
  const familyProfileMap = useMemo(() => {
    const map: { [id: string]: { name: string; relation: string; avatar: string } } = {
      'usr-101': {
        name: 'Arjun Sharma',
        relation: 'Self',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      'fam-1': {
        name: 'Savitri Sharma',
        relation: 'Mother',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      },
      'fam-2': {
        name: 'Ramesh Sharma',
        relation: 'Father',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      'fam-3': {
        name: 'Ananya Sharma',
        relation: 'Daughter',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      }
    };
    return map;
  }, []);

  // Filtered Care Regimen Meds (Care Mode)
  const filteredCareMeds = useMemo(() => {
    return medSchedules
      .filter(s => {
        if (selectedFamilyMember === 'all') return true;
        return s.patientProfileId === selectedFamilyMember;
      })
      .filter(s => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.medicineName.toLowerCase().includes(q) ||
          s.genericName.toLowerCase().includes(q) ||
          s.patientName.toLowerCase().includes(q) ||
          (s.prescribingDoctor && s.prescribingDoctor.toLowerCase().includes(q))
        );
      });
  }, [medSchedules, selectedFamilyMember, searchQuery]);

  // Low supply due count
  const dueRefills = useMemo(() => {
    return medSchedules.filter(s => s.remainingQuantity <= s.refillThreshold);
  }, [medSchedules]);

  // Filtered Doctors (Doctors Mode)
  const wishlistedDoctors = useMemo(() => {
    return allDoctors
      .filter(d => wishlistDoctorIds.includes(d.id))
      .filter(d =>
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [allDoctors, wishlistDoctorIds, searchQuery]);

  // Filtered Medicines (Pharma Mode)
  const wishlistedMedicines = useMemo(() => {
    return allMedicines
      .filter(m => wishlistMedicineIds.includes(m.id))
      .filter(m =>
        !searchQuery ||
        m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [allMedicines, wishlistMedicineIds, searchQuery]);

  // Action Handlers
  const handleRemoveDoctor = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistDoctor(docId);
    setWishlistDoctorIds(updated);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleRemoveMedicine = (medId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistMedicine(medId);
    setWishlistMedicineIds(updated);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleRemoveCareRegimen = (schedId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = medSchedules.filter(s => s.id !== schedId);
    setMedSchedules(updated);
    AarogyaStorage.setMedicationSchedules(updated);
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleAddToCart = (med: Medicine, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(med, 1);
    setAddedMedsMap(prev => ({ ...prev, [med.id]: true }));
    setTimeout(() => {
      setAddedMedsMap(prev => ({ ...prev, [med.id]: false }));
    }, 2000);
  };

  const handleRefillSchedule = (sched: MedicationSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    const matchedMed = allMedicines.find(
      m => m.brandName.toLowerCase().includes(sched.medicineName.toLowerCase()) ||
           sched.medicineName.toLowerCase().includes(m.brandName.toLowerCase())
    ) || {
      id: `med-custom-${sched.id}`,
      brandName: sched.medicineName,
      genericName: sched.genericName,
      price: 145,
      mrp: 165,
      discountPercent: 12,
      form: sched.form,
      strength: sched.strength,
      prescriptionRequired: sched.isChronic,
      rating: 4.9,
      ratingCount: 850,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      inStock: true,
      stockQuantity: 100,
      description: sched.instructions
    } as Medicine;

    addItem(matchedMed, 1);
    setAddedMedsMap(prev => ({ ...prev, [sched.id]: true }));
    setTimeout(() => {
      setAddedMedsMap(prev => ({ ...prev, [sched.id]: false }));
    }, 2000);
  };

  const handleRefillAllDue = () => {
    setIsRefillAllLoading(true);
    dueRefills.forEach(sched => {
      const matchedMed = allMedicines.find(
        m => m.brandName.toLowerCase().includes(sched.medicineName.toLowerCase()) ||
             sched.medicineName.toLowerCase().includes(m.brandName.toLowerCase())
      ) || {
        id: `med-custom-${sched.id}`,
        brandName: sched.medicineName,
        genericName: sched.genericName,
        price: 145,
        mrp: 165,
        discountPercent: 12,
        form: sched.form,
        strength: sched.strength,
        prescriptionRequired: sched.isChronic,
        rating: 4.9,
        ratingCount: 850,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
        inStock: true,
        stockQuantity: 100,
        description: sched.instructions
      } as Medicine;

      addItem(matchedMed, 1);
    });

    setTimeout(() => {
      setIsRefillAllLoading(false);
      setRefillAllSuccess(true);
      setTimeout(() => setRefillAllSuccess(false), 3000);
    }, 600);
  };

  const currentCount = isCareMode
    ? medSchedules.length
    : isDoctorsMode
    ? wishlistDoctorIds.length
    : wishlistMedicineIds.length;

  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      {/* 1. STICKY HEADER - DEDICATED TO CURRENT PANEL */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 py-3">
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-3 sm:px-2 lg:px-4">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="text-center min-w-0 flex-1">
            <div className="flex items-center justify-center gap-1.5">
              <Heart
                size={18}
                fill={isCareMode ? '#ff645e' : isDoctorsMode ? '#026dd9' : '#0F766E'}
                className={isCareMode ? 'text-[#ff645e]' : isDoctorsMode ? 'text-[#026dd9]' : 'text-[#0F766E]'}
              />
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-50 truncate">
                {isCareMode
                  ? 'Family Medication Regimen & Wishlist'
                  : isDoctorsMode
                  ? 'Saved Doctors & Specialists Wishlist'
                  : 'Saved Medicines & Pharmacy Wishlist'}
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
              {isCareMode
                ? `${medSchedules.length} Active Prescriptions across 4 Family Profiles`
                : isDoctorsMode
                ? `${wishlistedDoctors.length} Saved Specialists for Instant Consultation`
                : `${wishlistedMedicines.length} Saved Medicines for Express Reorder`}
            </p>
          </div>

          {/* Mode-Accented Count Badge */}
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-2xs border ${
            isCareMode
              ? 'bg-rose-50 text-[#ff645e] border-rose-200/80 dark:bg-rose-950 dark:text-rose-300'
              : isDoctorsMode
              ? 'bg-blue-50 text-[#026dd9] border-blue-200/80 dark:bg-blue-950 dark:text-sky-300'
              : 'bg-teal-50 text-[#0F766E] border-teal-200/80 dark:bg-teal-950 dark:text-teal-300'
          }`}>
            {currentCount}
          </div>
        </div>

        {/* 2. DEDICATED SEARCH BAR */}
        <div className="w-full max-w-[1720px] mx-auto mt-2.5 sm:px-2 lg:px-4">
          <div className="relative flex items-center max-w-xl mx-auto">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={
                isCareMode
                  ? 'Search family medicines, patient name, doctor, or condition...'
                  : isDoctorsMode
                  ? 'Search saved doctors by name, specialty, or hospital...'
                  : 'Search saved medicines by brand or generic name...'
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-slate-900 dark:text-slate-100 rounded-2xl text-xs font-medium placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* 3. DEDICATED CONTENT AREA PER PANEL */}
      <main className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">

        {/* ========================================================= */}
        {/* CARE PANEL: FAMILY MEDICATION REGIMEN & WISHLIST COCKPIT */}
        {/* ========================================================= */}
        {isCareMode && (
          <div className="space-y-6">
            {/* Top Care Strip: Refill Due CTA + Auto-Refill Plan */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-orange-500/10 border border-rose-200/80 dark:border-rose-900/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ff645e] text-white shadow-2xs">
                    Care Hub Active Regimen
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    4 Managed Family Profiles
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-50">
                  Family Prescriptions & Daily Refill Cockpit
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Track ongoing chronic dosages for parents and kids. Instant 1-click reordering ensures zero missed doses.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
                {/* 1-Click Refill All Button */}
                <Button
                  onClick={handleRefillAllDue}
                  disabled={isRefillAllLoading || dueRefills.length === 0}
                  className="w-full sm:w-auto bg-[#ff645e] hover:bg-[#e04f4a] text-white font-black text-xs h-10 px-4 rounded-2xl shadow-sm shadow-rose-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <RefreshCw size={14} className={isRefillAllLoading ? 'animate-spin' : ''} />
                  <span>
                    {refillAllSuccess
                      ? '✓ Added Due Refills to Cart!'
                      : `Refill Due Meds (${dueRefills.length} Low)`}
                  </span>
                </Button>

                {/* Auto-Refill Subscription Modal Trigger */}
                <Button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-bold rounded-2xl border-rose-300 dark:border-rose-800 text-slate-800 dark:text-slate-200 h-10 px-4 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Repeat size={14} className="mr-1 text-[#ff645e]" />
                  <span>Auto-Refill Plan</span>
                </Button>
              </div>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card p-3.5 rounded-2xl border-rose-100 dark:border-rose-900/40 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Active Prescriptions</span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100">{medSchedules.length} Medicines</span>
                <p className="text-[10px] text-slate-500">Across 4 Family Profiles</p>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border-amber-100 dark:border-amber-900/40 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Supply Alerts</span>
                <span className="text-xl font-black text-amber-600">{dueRefills.length} Due Soon</span>
                <p className="text-[10px] text-slate-500">&lt; 5 Days remaining</p>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border-emerald-100 dark:border-emerald-900/40 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Adherence</span>
                <span className="text-xl font-black text-emerald-600">96.4%</span>
                <p className="text-[10px] text-slate-500">32 of 34 logged doses</p>
              </div>

              <div className="glass-card p-3.5 rounded-2xl border-sky-100 dark:border-sky-900/40 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Care Family Circle</span>
                <span className="text-xl font-black text-[#026dd9]">4 Members</span>
                <p className="text-[10px] text-slate-500">Full Proxy Health Vault</p>
              </div>
            </div>

            {/* Family Member Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users size={14} className="text-[#ff645e]" />
                  <span>Filter by Family Member</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Showing {filteredCareMeds.length} prescriptions
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {/* All Family */}
                <button
                  onClick={() => setSelectedFamilyMember('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                    selectedFamilyMember === 'all'
                      ? 'bg-[#ff645e] text-white border-[#ff645e] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  <span>👨‍👩‍👧‍👦 All Family</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFamilyMember === 'all' ? 'bg-white/30 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {medSchedules.length}
                  </span>
                </button>

                {/* Savitri Sharma (Mother) */}
                <button
                  onClick={() => setSelectedFamilyMember('fam-1')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    selectedFamilyMember === 'fam-1'
                      ? 'bg-[#ff645e] text-white border-[#ff645e] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  <img src={familyProfileMap['fam-1'].avatar} alt="Mother" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  <span>Savitri Sharma (Mother)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFamilyMember === 'fam-1' ? 'bg-white/30 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {medSchedules.filter(s => s.patientProfileId === 'fam-1').length}
                  </span>
                </button>

                {/* Ramesh Sharma (Father) */}
                <button
                  onClick={() => setSelectedFamilyMember('fam-2')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    selectedFamilyMember === 'fam-2'
                      ? 'bg-[#ff645e] text-white border-[#ff645e] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  <img src={familyProfileMap['fam-2'].avatar} alt="Father" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  <span>Ramesh Sharma (Father)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFamilyMember === 'fam-2' ? 'bg-white/30 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {medSchedules.filter(s => s.patientProfileId === 'fam-2').length}
                  </span>
                </button>

                {/* Ananya Sharma (Daughter) */}
                <button
                  onClick={() => setSelectedFamilyMember('fam-3')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    selectedFamilyMember === 'fam-3'
                      ? 'bg-[#ff645e] text-white border-[#ff645e] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  <img src={familyProfileMap['fam-3'].avatar} alt="Daughter" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  <span>Ananya Sharma (Daughter)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFamilyMember === 'fam-3' ? 'bg-white/30 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {medSchedules.filter(s => s.patientProfileId === 'fam-3').length}
                  </span>
                </button>

                {/* Arjun Sharma (Self) */}
                <button
                  onClick={() => setSelectedFamilyMember('usr-101')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                    selectedFamilyMember === 'usr-101'
                      ? 'bg-[#ff645e] text-white border-[#ff645e] shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  <img src={familyProfileMap['usr-101'].avatar} alt="Self" className="w-5 h-5 rounded-full object-cover border border-white/40" />
                  <span>Arjun Sharma (Self)</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedFamilyMember === 'usr-101' ? 'bg-white/30 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {medSchedules.filter(s => s.patientProfileId === 'usr-101').length}
                  </span>
                </button>
              </div>
            </div>

            {/* List of Active Prescriptions / Care Regimens */}
            {filteredCareMeds.length === 0 ? (
              <div className="glass-card p-10 text-center space-y-3 my-6 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-[#ff645e] flex items-center justify-center mx-auto shadow-inner border border-rose-100">
                  <HeartHandshake size={30} />
                </div>
                <h3 className="text-base font-black text-slate-800">
                  {searchQuery ? 'No Matching Medications Found' : 'No Care Regimen Recorded Yet'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {searchQuery
                    ? `No prescription matches "${searchQuery}". Try a different keyword.`
                    : 'Add your family members active chronic medications for automated refill reminders and adherence tracking.'}
                </p>
                <Button asChild className="bg-[#ff645e] hover:bg-[#e04f4a] text-white text-xs font-black rounded-xl shadow-xs px-5 h-9">
                  <Link href="/family">Open Family Care Hub</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCareMeds.map(sched => {
                  const isLow = sched.remainingQuantity <= sched.refillThreshold;
                  const profile = familyProfileMap[sched.patientProfileId] || {
                    name: sched.patientName,
                    relation: 'Family',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  };
                  const isAdded = !!addedMedsMap[sched.id];

                  return (
                    <div
                      key={sched.id}
                      className={`glass-card p-4 rounded-3xl flex flex-col justify-between gap-4 transition-all hover:shadow-md border ${
                        isLow
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20'
                          : 'border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-800/90'
                      }`}
                    >
                      {/* Top Header: Family Member Badge + Remaining Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100 block leading-tight">
                              {profile.name}
                            </span>
                            <span className="text-[10px] font-bold text-[#ff645e]">
                              {profile.relation} • {sched.isChronic ? 'Chronic Care' : 'Acute Course'}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse">
                            <AlertTriangle size={11} /> {sched.remainingQuantity} Days Supply
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/70">
                            <CheckCircle2 size={11} /> {sched.remainingQuantity} Days Supply
                          </span>
                        )}
                      </div>

                      {/* Middle: Medicine Details & Dosage */}
                      <div className="space-y-2 border-t border-slate-100 dark:border-slate-700/80 pt-3">
                        <div>
                          <h3 className="text-base font-black text-slate-900 dark:text-slate-50 leading-tight">
                            {sched.medicineName}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {sched.genericName}
                          </p>
                        </div>

                        {/* Dosage Timing Pill & Condition */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                            <Clock size={12} className="text-[#ff645e]" />
                            <span>{sched.frequency} • {sched.dosage}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-sky-300 border border-blue-200/60">
                            <span>{sched.notes || 'Routine Care'}</span>
                          </span>
                        </div>

                        {/* Supply Remaining Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>Supply Remaining</span>
                            <span>{sched.remainingQuantity} of {sched.initialQuantity} doses</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isLow ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (sched.remainingQuantity / sched.initialQuantity) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Prescribing Doctor Tag */}
                        {sched.prescribingDoctor && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-1.5">
                            <Stethoscope size={13} className="text-[#026dd9] shrink-0" />
                            <span className="truncate">Prescribed by {sched.prescribingDoctor}</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Actions: 1-Click Refill & Options */}
                      <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700/80 pt-3">
                        <Button
                          onClick={(e) => handleRefillSchedule(sched, e)}
                          className={`flex-1 text-xs font-black h-9 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#ff645e] hover:bg-[#e04f4a] text-white shadow-rose-500/20'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} /> Added to Cart!
                            </>
                          ) : (
                            <>
                              <RefreshCw size={13} /> 1-Click Refill • ₹145
                            </>
                          )}
                        </Button>

                        <button
                          onClick={(e) => handleRemoveCareRegimen(sched.id, e)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="Remove from active family regimen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* DOCTORS PANEL: SAVED DOCTORS & SPECIALISTS WISHLIST */}
        {/* ========================================================= */}
        {isDoctorsMode && (
          wishlistedDoctors.length === 0 ? (
            <div className="glass-card p-10 text-center space-y-3 my-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#026dd9] flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                <Stethoscope size={30} />
              </div>
              <h3 className="text-base font-black text-slate-800">
                {searchQuery ? 'No Matching Doctors Found' : 'No Saved Doctors Yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `No saved specialist matches "${searchQuery}". Try a different keyword.`
                  : 'Bookmark your preferred family doctors and specialists for instant 1-tap appointments.'}
              </p>
              <Button asChild className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs px-5 h-9">
                <Link href="/doctors">Explore Top Specialists</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {wishlistedDoctors.map(doc => (
                <DoctorPortraitCard
                  key={doc.id}
                  doctor={doc}
                  onSelect={(d) => {
                    window.location.href = `/doctors?book=${d.id}`;
                  }}
                />
              ))}
            </div>
          )
        )}

        {/* ========================================================= */}
        {/* PHARMACY PANEL: SAVED MEDICINES & OTC PRODUCTS WISHLIST */}
        {/* ========================================================= */}
        {isPharmaMode && (
          wishlistedMedicines.length === 0 ? (
            <div className="glass-card p-10 text-center space-y-3 my-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto shadow-inner border border-teal-100">
                <Pill size={30} />
              </div>
              <h3 className="text-base font-black text-slate-800">
                {searchQuery ? 'No Matching Medicines Found' : 'No Saved Medicines Yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `No wishlisted medication matches "${searchQuery}". Try a different keyword.`
                  : 'Save your daily chronic prescriptions and first-aid kits for express 10-minute reordering anytime.'}
              </p>
              <Button asChild className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-black rounded-xl shadow-xs px-5 h-9">
                <Link href="/pharmacies">Browse Pharmacy Store</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {wishlistedMedicines.map(med => {
                const isAdded = !!addedMedsMap[med.id];

                return (
                  <div
                    key={med.id}
                    className="glass-card p-4 flex flex-col justify-between gap-3 group hover:shadow-md transition-all rounded-3xl"
                  >
                    <Link href={`/pharmacies/${med.id}`} className="flex items-start gap-3.5 group/link cursor-pointer">
                      <div className="w-16 h-16 min-w-[64px] max-w-[64px] rounded-2xl bg-slate-100 shrink-0 border border-slate-200/70 shadow-2xs overflow-hidden">
                        <img
                          src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'}
                          alt={med.brandName}
                          className="w-full h-full object-cover group-hover/link:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          {med.category ? med.category.replace('_', ' ') : 'Medicine'}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 group-hover/link:text-[#0F766E] transition-colors truncate mt-1">
                          {med.brandName}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {med.genericName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-slate-900">
                            ₹{med.price}
                          </span>
                          {med.mrp > med.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{med.mrp}
                            </span>
                          )}
                          {med.discountPercent && (
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                              {med.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <Button
                        onClick={(e) => handleAddToCart(med, e)}
                        className={`flex-1 text-xs font-black h-9 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-teal-500/20'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} /> Added to Cart!
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} /> Add to Cart
                          </>
                        )}
                      </Button>

                      <button
                        onClick={(e) => handleRemoveMedicine(med.id, e)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove from saved wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>

      {/* AUTO-REFILL 30-DAY SUBSCRIPTION MODAL (Care Mode) */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={() => setIsSubscriptionModalOpen(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Repeat size={20} className="text-[#ff645e]" />
            <span>Set Up Care Auto-Refill Subscription</span>
          </DialogTitle>
          <DialogDescription>
            Never run out of essential chronic medications for your parents and family.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/40 text-xs space-y-2">
            <div className="flex items-center justify-between font-black text-slate-900 dark:text-slate-100">
              <span>Selected Care Prescriptions:</span>
              <span className="text-[#ff645e]">{medSchedules.length} Medicines</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Includes Telma 40, Glycomet-GP 1, Shelcal 500, Ecosprin 75, Thyronorm 50mcg, and Atorva 20.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Auto-Refill Cycle Frequency:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button className="p-2.5 rounded-xl border border-[#ff645e] bg-rose-50 text-[#ff645e] font-black text-center text-xs cursor-pointer">
                Every 30 Days (Recommended)
              </button>
              <button className="p-2.5 rounded-xl border border-slate-200 text-slate-700 text-center text-xs font-semibold hover:border-slate-300 cursor-pointer">
                Every 45 Days
              </button>
              <button className="p-2.5 rounded-xl border border-slate-200 text-slate-700 text-center text-xs font-semibold hover:border-slate-300 cursor-pointer">
                Every 60 Days
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Delivery Address & Schedule:
            </label>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Home • Green Park, New Delhi</span>
                <span className="text-[11px] text-slate-400">Scheduled next: 1st of every month</span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Free Delivery
              </span>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsSubscriptionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSubscriptionSuccess(true);
                setTimeout(() => {
                  setSubscriptionSuccess(false);
                  setIsSubscriptionModalOpen(false);
                }, 2000);
              }}
              className="bg-[#ff645e] hover:bg-[#e04f4a] text-white font-black text-xs h-9 px-4 rounded-xl shadow-xs"
            >
              {subscriptionSuccess ? '✓ Subscription Active!' : 'Confirm Auto-Refill Subscription'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Loading your health wishlist...</div>}>
      <WishlistContent />
    </Suspense>
  );
}

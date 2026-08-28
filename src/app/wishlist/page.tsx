'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Heart,
  Star,
  Trash2,
  Stethoscope,
  Pill,
  ShoppingBag,
  ArrowRight,
  Clock,
  Check,
  Search,
  Building2,
  MapPin,
  Sparkles,
  Share2
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { Doctor, Medicine } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';
import { DoctorPortraitCard } from '@/components/doctor/DoctorPortraitCard';

function WishlistContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'medicines' ? 'medicines' : 'doctors';

  const [activeTab, setActiveTab] = useState<'doctors' | 'medicines'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [wishlistDoctorIds, setWishlistDoctorIds] = useState<string[]>([]);
  const [wishlistMedicineIds, setWishlistMedicineIds] = useState<string[]>([]);
  const [addedMedsMap, setAddedMedsMap] = useState<{ [id: string]: boolean }>({});

  const { addItem } = useCartStore();

  const loadData = () => {
    if (typeof window !== 'undefined') {
      setAllDoctors(AarogyaStorage.getDoctors());
      setAllMedicines(AarogyaStorage.getMedicines());
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

  const handleRemoveDoctor = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistDoctor(docId);
    setWishlistDoctorIds(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const handleRemoveMedicine = (medId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistMedicine(medId);
    setWishlistMedicineIds(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const handleAddToCart = (med: Medicine, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(med, 1);
    setAddedMedsMap(prev => ({ ...prev, [med.id]: true }));
    setTimeout(() => {
      setAddedMedsMap(prev => ({ ...prev, [med.id]: false }));
    }, 2000);
  };

  // Filtered lists
  const wishlistedDoctors = allDoctors
    .filter(d => wishlistDoctorIds.includes(d.id))
    .filter(d =>
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const wishlistedMedicines = allMedicines
    .filter(m => wishlistMedicineIds.includes(m.id))
    .filter(m =>
      !searchQuery ||
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const totalSavedCount = wishlistDoctorIds.length + wishlistMedicineIds.length;

  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      {/* 1. TOP STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="text-center min-w-0 flex-1">
            <div className="flex items-center justify-center gap-1.5">
              <Heart size={16} fill="#E11D48" className="text-[#E11D48]" />
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                Saved Wishlist
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
              {totalSavedCount} Saved Healthcare Items
            </p>
          </div>

          <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center text-[#E11D48] text-xs font-black border border-rose-100 shrink-0 shadow-2xs">
            {totalSavedCount}
          </div>
        </div>

        {/* 2. DUAL TAB SWITCHER (SAVED DOCTORS | SAVED MEDS) */}
        <div className="max-w-5xl mx-auto mt-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 backdrop-blur-md border border-slate-200/60 rounded-2xl">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-[#026dd9] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={14} />
              <span>Saved Doctors ({wishlistDoctorIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'medicines'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill size={14} />
              <span>Saved Meds ({wishlistMedicineIds.length})</span>
            </button>
          </div>
        </div>

        {/* 3. SEARCH BAR WITHIN WISHLIST */}
        <div className="max-w-5xl mx-auto mt-2.5">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === 'doctors'
                  ? 'Search saved doctors by name, specialty, or hospital...'
                  : 'Search saved medicines by brand or generic name...'
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-slate-900 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* 4. MAIN WISHLIST LISTINGS */}
      <main className="max-w-5xl mx-auto px-4 py-4 space-y-3">
        {activeTab === 'doctors' ? (
          wishlistedDoctors.length === 0 ? (
            <div className="glass-card p-8 text-center space-y-3 my-6">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
        ) : wishlistedMedicines.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-3 my-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wishlistedMedicines.map(med => {
              const isAdded = !!addedMedsMap[med.id];

              return (
                <div
                  key={med.id}
                  className="glass-card p-4 flex flex-col justify-between gap-3 group hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 min-w-[64px] max-w-[64px] rounded-2xl bg-slate-100 shrink-0 border border-slate-200/70 shadow-2xs overflow-hidden">
                      <img
                        src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'}
                        alt={med.brandName}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                            target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80';
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h2 className="font-extrabold text-sm text-slate-900 truncate">
                          {med.brandName}
                        </h2>
                        {med.discountPercent && (
                          <span className="text-[10px] font-black text-[#E11D48] bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200/60 shrink-0">
                            {med.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 truncate">
                        {med.strength || med.genericName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 flex items-center gap-0.5">
                          <Clock size={10} /> 10 Mins Dispatch
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {med.unit || '1 Strip'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Row: Pricing & Actions */}
                  <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-slate-900">₹{med.price}</span>
                      {med.mrp && med.mrp > med.price && (
                        <span className="text-xs text-slate-400 line-through">₹{med.mrp}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => handleRemoveMedicine(med.id, e)}
                        aria-label={`Remove ${med.brandName} from wishlist`}
                        className="w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200/60 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>

                      <Button
                        onClick={e => handleAddToCart(med, e)}
                        size="sm"
                        className={`h-9 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 px-4 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                            : 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-teal-500/20'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>+ Add to Cart</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-400">Loading Saved Wishlist...</div>}>
      <WishlistContent />
    </Suspense>
  );
}

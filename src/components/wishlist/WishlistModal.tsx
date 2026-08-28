'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  X,
  Star,
  Trash2,
  Stethoscope,
  Pill,
  ShoppingBag,
  ArrowRight,
  Clock,
  Plus,
  Check
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { Doctor, Medicine } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'doctors' | 'medicines';
}

export default function WishlistModal({
  isOpen,
  onClose,
  defaultTab = 'doctors'
}: WishlistModalProps) {
  const [activeTab, setActiveTab] = useState<'doctors' | 'medicines'>(defaultTab);
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
    if (isOpen) {
      setActiveTab(defaultTab);
      loadData();
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    const handler = () => loadData();
    window.addEventListener('storage-update', handler);
    return () => window.removeEventListener('storage-update', handler);
  }, []);

  if (!isOpen) return null;

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

  const wishlistedDoctors = allDoctors.filter(d => wishlistDoctorIds.includes(d.id));
  const wishlistedMedicines = allMedicines.filter(m => wishlistMedicineIds.includes(m.id));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/80 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-white/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center border border-rose-200/50 shadow-2xs">
              <Heart size={18} fill="#E11D48" className="text-[#E11D48]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                My Saved Wishlist
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Quick access to your favorite doctors & essential meds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Wishlist"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={17} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl shadow-2xs">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-[#026dd9] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={14} />
              <span>Saved Doctors ({wishlistedDoctors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'medicines'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill size={14} />
              <span>Saved Meds ({wishlistedMedicines.length})</span>
            </button>
          </div>
        </div>

        {/* Wishlist Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'doctors' ? (
            wishlistedDoctors.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#026dd9] flex items-center justify-center mx-auto shadow-inner">
                  <Stethoscope size={26} />
                </div>
                <h3 className="text-sm font-black text-slate-800">No Saved Doctors Yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click the heart icon on any doctor card or carousel to save them for quick 1-tap bookings.
                </p>
                <Button
                  onClick={onClose}
                  asChild
                  className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-bold rounded-xl"
                >
                  <Link href="/doctors">Explore Specialists</Link>
                </Button>
              </div>
            ) : (
              wishlistedDoctors.map(doc => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-14 h-14 min-w-[56px] max-w-[56px] rounded-2xl object-cover border border-white/80 shadow-2xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {doc.name}
                        </h4>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                          <Star size={10} fill="currentColor" /> {doc.ratingAverage}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#026dd9] truncate">
                        {doc.specialization}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {doc.hospitalName} • ₹{doc.consultationFee} Fee
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => handleRemoveDoctor(doc.id, e)}
                      aria-label="Remove from wishlist"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>

                    <Link
                      href={`/doctors?book=${doc.id}`}
                      onClick={onClose}
                      className="px-3.5 py-1.5 rounded-xl bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black shadow-xs flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <span>Book</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))
            )
          ) : wishlistedMedicines.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto shadow-inner">
                <Pill size={26} />
              </div>
              <h3 className="text-sm font-black text-slate-800">No Saved Medicines</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Save your regular prescriptions and first-aid supplies to reorder in 10 minutes anytime.
              </p>
              <Button
                onClick={onClose}
                asChild
                className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold rounded-xl"
              >
                <Link href="/pharmacies">Browse Pharmacy</Link>
              </Button>
            </div>
          ) : (
            wishlistedMedicines.map(med => {
              const isAdded = !!addedMedsMap[med.id];

              return (
                <div
                  key={med.id}
                  className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 min-w-[56px] max-w-[56px] rounded-2xl bg-white p-1 shrink-0 border border-slate-100 flex items-center justify-center shadow-2xs overflow-hidden">
                      <img
                        src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'}
                        alt={med.brandName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {med.brandName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {med.strength || med.genericName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-black text-xs text-slate-900">₹{med.price}</span>
                        <span className="text-[9px] font-bold text-[#0F766E] flex items-center gap-0.5">
                          <Clock size={10} /> 10 Mins
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => handleRemoveMedicine(med.id, e)}
                      aria-label="Remove from wishlist"
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>

                    <button
                      onClick={e => handleAddToCart(med, e)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0F766E] hover:bg-[#115E59] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={13} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>+ Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Summary */}
        <div className="p-3 border-t border-slate-100 bg-white/60 backdrop-blur-md flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">
            Total {wishlistedDoctors.length + wishlistedMedicines.length} saved items
          </span>
          <button
            onClick={onClose}
            className="font-bold text-[#026dd9] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

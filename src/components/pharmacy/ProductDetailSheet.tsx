'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Search,
  Zap,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  Check,
  Info,
  Clock,
  ArrowRight,
  AlertCircle,
  Tag
} from 'lucide-react';
import { Medicine } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';
import { AarogyaStorage } from '@/lib/storage';

interface ProductDetailSheetProps {
  medicine: Medicine | null;
  allMedicines: Medicine[];
  onClose: () => void;
}

export default function ProductDetailSheet({
  medicine,
  allMedicines,
  onClose
}: ProductDetailSheetProps) {
  const { addItem, updateQuantity, removeItem, items } = useCartStore();
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  React.useEffect(() => {
    if (medicine && typeof window !== 'undefined') {
      const savedMeds = AarogyaStorage.getWishlistMedicines();
      setIsWishlisted(savedMeds.includes(medicine.id));
    }
  }, [medicine]);

  if (!medicine) return null;

  // Cart quantity check
  const cartItem = items.find(i => i.medicine.id === medicine.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Pack size configurations
  const packOptions = [
    {
      label: `1 Strip (${medicine.unit || '15 Tablets'})`,
      price: medicine.price,
      mrp: medicine.mrp || Math.round(medicine.price * 1.15),
      discount: medicine.discountPercent || 10,
      badge: `${medicine.discountPercent || 10}% OFF`
    },
    {
      label: `Pack of 2 (${parseInt(medicine.unit || '15') * 2 || '30'} Tablets)`,
      price: Math.round(medicine.price * 1.9),
      mrp: Math.round((medicine.mrp || medicine.price * 1.15) * 2),
      discount: Math.min((medicine.discountPercent || 10) + 8, 30),
      badge: `${Math.min((medicine.discountPercent || 10) + 8, 30)}% OFF`
    },
    {
      label: `Pack of 3 (${parseInt(medicine.unit || '15') * 3 || '45'} Tablets)`,
      price: Math.round(medicine.price * 2.7),
      mrp: Math.round((medicine.mrp || medicine.price * 1.15) * 3),
      discount: Math.min((medicine.discountPercent || 10) + 15, 45),
      badge: `${Math.min((medicine.discountPercent || 10) + 15, 45)}% OFF`
    }
  ];

  const selectedPack = packOptions[selectedPackIndex];

  // Dynamic generic substitute calculation (same generic active salt at lower price)
  const genericSubstitute = allMedicines.find(
    m =>
      m.id !== medicine.id &&
      (m.genericName.toLowerCase().includes(medicine.genericName.toLowerCase().split(' ')[0]) ||
       medicine.genericName.toLowerCase().includes(m.genericName.toLowerCase().split(' ')[0])) &&
      m.price < medicine.price
  ) || {
    id: `gen-sub-${medicine.id}`,
    brandName: `Generic ${medicine.genericName.split(' ')[0]} 650mg`,
    genericName: medicine.genericName,
    manufacturer: 'Jan Aushadhi / Cipla Generics',
    form: medicine.form,
    strength: medicine.strength,
    price: Math.round(medicine.price * 0.58),
    mrp: medicine.mrp || medicine.price,
    discountPercent: 42,
    prescriptionRequired: medicine.prescriptionRequired,
    inStock: true,
    unit: medicine.unit,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
    description: `Government-certified generic equivalent with identical active pharmaceutical ingredient (${medicine.genericName}).`
  };

  const savingsAmount = medicine.price - genericSubstitute.price;

  // Related products in the same category
  const relatedProducts = allMedicines
    .filter(m => m.id !== medicine.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(medicine, 1);
  };

  const handleIncrement = () => {
    updateQuantity(medicine.id, currentQuantity + 1);
  };

  const handleDecrement = () => {
    if (currentQuantity <= 1) {
      removeItem(medicine.id);
    } else {
      updateQuantity(medicine.id, currentQuantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col max-w-lg mx-auto shadow-2xl animate-in slide-in-from-bottom duration-250 select-none overflow-hidden">
      {/* 1. TOP FLOATING ACTION BAR (Back/Down, Wishlist, Share) */}
      <header className="absolute top-0 left-0 right-0 z-20 p-3.5 flex items-center justify-between pointer-events-none">
        <button
          onClick={onClose}
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200/70 pointer-events-auto active:scale-95 transition-transform"
        >
          <ChevronDown size={24} className="text-slate-800" />
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              const updated = AarogyaStorage.toggleWishlistMedicine(medicine.id);
              setIsWishlisted(updated.includes(medicine.id));
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('storage-update'));
              }
            }}
            aria-label="Wishlist"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-200/70 active:scale-95 transition-all cursor-pointer"
          >
            <Heart
              size={19}
              className={isWishlisted ? 'fill-[#E11D48] text-[#E11D48]' : 'text-slate-700'}
            />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: medicine.brandName,
                  text: `Order ${medicine.brandName} (${medicine.genericName}) on Quick Aarogya in 10 minutes!`,
                  url: window.location.href
                }).catch(() => {});
              }
            }}
            aria-label="Share"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-200/70 active:scale-95 transition-transform"
          >
            <Share2 size={18} />
          </button>
        </div>
      </header>

      {/* 2. SCROLLABLE PRODUCT DETAILS BODY */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* HERO IMAGE CAROUSEL WITH 10 MINS BADGE */}
        <div className="relative w-full h-72 sm:h-80 bg-slate-900 overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <img
            src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
            alt={medicine.brandName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

          {/* 10 MINS DELIVERY PILL */}
          <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md text-[#0F766E] text-xs font-black px-3 py-1 rounded-full shadow-md border border-teal-100 flex items-center gap-1.5 z-10">
            <Zap size={14} className="fill-[#0F766E]" />
            <span>10 MINS</span>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* TITLE & CHEMICAL EQUATION INFO */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                  {medicine.brandName}
                </h1>
                <p className="text-xs font-bold text-[#0F766E] mt-0.5">
                  Generic Salt: {medicine.genericName} • {medicine.strength}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Manufactured by {medicine.manufacturer || 'Certified Pharma Lab'}
                </p>
              </div>

              <div className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 shrink-0">
                <ShieldCheck size={13} />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>

          {/* SELECT UNIT / PACK SIZE OPTIONS */}
          <div>
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2">
              Select Pack Size
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {packOptions.map((pack, idx) => {
                const isSelected = selectedPackIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'border-[#0F766E] bg-teal-50/40 shadow-xs ring-1 ring-[#0F766E]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Discount Pill */}
                    <div className="text-[9px] font-black text-[#E11D48] bg-rose-50 px-1.5 py-0.5 rounded w-fit uppercase mb-1">
                      {pack.badge}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">
                        {pack.label}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-black text-sm text-slate-900">₹{pack.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{pack.mrp}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center absolute top-2 right-2">
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SMART GENERIC SUBSTITUTE RECOMMENDATION */}
          {savingsAmount > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/60 border border-emerald-200/80 shadow-2xs space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                      Save ₹{savingsAmount} with Same Active Chemical Salt
                    </span>
                    <h3 className="font-black text-xs text-slate-900 leading-tight">
                      {genericSubstitute.brandName}
                    </h3>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
                  Save {Math.round((savingsAmount / medicine.price) * 100)}%
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                Same composition (<strong>{medicine.genericName}</strong>) & therapeutic effect. Approved by certified generic pharmacopeia.
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">₹{genericSubstitute.price}</span>
                  <span className="text-[10px] text-slate-400 line-through">₹{medicine.price}</span>
                </div>

                <button
                  onClick={() => {
                    addItem(genericSubstitute as any, 1);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>Switch & Add to Cart (₹{genericSubstitute.price})</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* EXPANDABLE PRODUCT DETAILS */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[#0F766E]" />
                <span className="text-xs font-black text-slate-900">View Product Details & Dosage</span>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {isDetailsExpanded && (
              <div className="p-4 pt-0 border-t border-slate-100 text-xs text-slate-600 space-y-2.5 bg-slate-50/50">
                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Description & Uses:</strong>
                  <p className="leading-relaxed">
                    {medicine.description || 'Fast-acting authentic formulation for symptomatic relief and clinical maintenance. Suitable for daily prescribed regimens.'}
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Chemical Composition:</strong>
                  <p className="leading-relaxed font-mono text-[11px] text-slate-700">
                    {medicine.genericName} IP ({medicine.strength})
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900 font-bold block mb-0.5">Storage Instructions:</strong>
                  <p className="leading-relaxed">
                    Store below 30°C in a dry place. Protect from direct sunlight and keep out of reach of children.
                  </p>
                </div>

                {medicine.prescriptionRequired && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-700 shrink-0" />
                    <span>Valid Doctor Prescription required at the time of doorstep delivery.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TOP PRODUCTS IN THIS CATEGORY / FREQUENTLY BOUGHT */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Top Products in This Category
              </h3>
              <span className="text-[10px] text-[#0F766E] font-bold">10-Min Dispatch</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {relatedProducts.map(rel => {
                const relCartItem = items.find(i => i.medicine.id === rel.id);
                const relQty = relCartItem ? relCartItem.quantity : 0;

                return (
                  <div
                    key={rel.id}
                    className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div className="w-full aspect-square bg-slate-50 rounded-xl p-1.5 mb-1.5 flex items-center justify-center">
                      <img src={rel.imageUrl} alt={rel.brandName} className="w-full h-full object-contain" />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-[11px] text-slate-900 truncate">{rel.brandName}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{rel.strength || rel.unit}</p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-black text-xs text-slate-900">₹{rel.price}</span>

                      {relQty === 0 ? (
                        <button
                          onClick={() => addItem(rel, 1)}
                          className="px-2 py-0.5 rounded-lg border border-[#0F766E] text-[#0F766E] text-[10px] font-black hover:bg-[#0F766E] hover:text-white transition-all"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center bg-[#0F766E] text-white rounded-md p-0.5 text-[10px]">
                          <button onClick={() => updateQuantity(rel.id, relQty - 1)} className="px-1 font-bold">-</button>
                          <span className="px-1 font-black">{relQty}</span>
                          <button onClick={() => updateQuantity(rel.id, relQty + 1)} className="px-1 font-bold">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FIXED BOTTOM STICKY ACTION BAR */}
      <footer className="p-3.5 border-t border-slate-200 bg-white/95 backdrop-blur-md shrink-0 shadow-lg flex items-center justify-between gap-3">
        {/* Selected Price & Unit Details */}
        <div className="min-w-0">
          <span className="text-[11px] text-slate-500 font-bold block truncate">
            {selectedPack.label}
          </span>
          <div className="flex items-center gap-1.5 leading-none mt-0.5">
            <span className="font-black text-base sm:text-lg text-slate-900">₹{selectedPack.price}</span>
            <span className="text-xs text-slate-400 line-through">MRP ₹{selectedPack.mrp}</span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {selectedPack.badge}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
            Inclusive of all taxes
          </span>
        </div>

        {/* Add to Cart CTA / Quantity Stepper */}
        <div className="shrink-0">
          {currentQuantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-black px-6 py-3.5 rounded-2xl shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Add to cart</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <div className="flex items-center bg-[#0F766E] text-white rounded-2xl p-1 shadow-md">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl font-black text-base active:scale-95"
              >
                <Minus size={15} />
              </button>
              <span className="px-3 text-sm font-black">{currentQuantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl font-black text-base active:scale-95"
              >
                <Plus size={15} />
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

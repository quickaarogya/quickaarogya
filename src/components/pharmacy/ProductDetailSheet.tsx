'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronDown,
  Heart,
  Share2,
  Zap,
  ShieldCheck,
  Sparkles,
  Info,
  AlertCircle,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Clock,
  Truck,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { Medicine } from '@/types';
import { useCartStore } from '@/stores/useCartStore';
import { AarogyaStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';

interface ProductDetailSheetProps {
  medicine: Medicine | null;
  isOpen?: boolean;
  onClose: () => void;
  allMedicines?: Medicine[];
}

export default function ProductDetailSheet({
  medicine,
  isOpen,
  onClose,
  allMedicines: propAllMedicines
}: ProductDetailSheetProps) {
  const isSheetOpen = isOpen !== undefined ? isOpen : !!medicine;
  if (!isSheetOpen || !medicine) return null;

  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>(propAllMedicines || []);

  useEffect(() => {
    if (typeof window !== 'undefined' && medicine) {
      const wishlisted = AarogyaStorage.getWishlistMedicines();
      setIsWishlisted(wishlisted.includes(medicine.id));
      if (!propAllMedicines || propAllMedicines.length === 0) {
        setAllMedicines(AarogyaStorage.getMedicines());
      }
    }
  }, [medicine, propAllMedicines]);

  // Current item in cart
  const cartItem = items.find(item => item.medicine.id === medicine.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Multi-pack size options simulation
  const packOptions = [
    {
      label: medicine.strength || '1 Strip (15 Tablets)',
      count: 1,
      price: medicine.price,
      mrp: medicine.mrp,
      badge: `${medicine.discountPercent || 8}% OFF`
    },
    {
      label: `Pack of 2 (${medicine.strength ? '30 Tablets' : '2 Units'})`,
      count: 2,
      price: Math.round(medicine.price * 1.9),
      mrp: medicine.mrp * 2,
      badge: `${(medicine.discountPercent || 8) + 4}% OFF`
    },
    {
      label: `Pack of 3 (${medicine.strength ? '45 Tablets' : '3 Units'})`,
      count: 3,
      price: Math.round(medicine.price * 2.7),
      mrp: medicine.mrp * 3,
      badge: `${(medicine.discountPercent || 8) + 11}% OFF`
    }
  ];

  const selectedPack = packOptions[selectedPackIndex];

  // Generic substitute recommendation
  const genericSubstitute = allMedicines.find(
    m => m.genericName.toLowerCase() === medicine.genericName.toLowerCase() && m.id !== medicine.id
  ) || {
    id: 'med-dolo-sub',
    brandName: 'Dolo 650 Tablet',
    genericName: medicine.genericName,
    price: Math.max(15, medicine.price - 10),
    mrp: medicine.mrp,
    discountPercent: 24,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    description: 'Same therapeutic formulation and clinical efficacy.',
    inStock: true
  };

  const savingsAmount = medicine.price > genericSubstitute.price ? medicine.price - genericSubstitute.price : 0;

  // Frequently bought together / related
  const relatedProducts = allMedicines
    .filter(m => m.id !== medicine.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(medicine, selectedPack.count);
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6 overflow-hidden animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* MODAL CARD (Full-Width Responsive Dual-Column on Desktop, Bottom Sheet on Mobile) */}
      <div
        className="w-full lg:max-w-5xl h-[92vh] lg:h-[82vh] max-h-[850px] bg-white dark:bg-slate-900 rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200/80 dark:border-slate-800 animate-in slide-in-from-bottom duration-250"
        onClick={e => e.stopPropagation()}
      >
        {/* 1. TOP HEADER ROW (Floating Close / Down, Wishlist, Share) */}
        <header className="absolute top-0 left-0 right-0 z-30 p-3.5 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-white text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-slate-700 pointer-events-auto active:scale-95 transition-transform cursor-pointer"
          >
            <X size={20} className="hidden lg:block" />
            <ChevronDown size={24} className="lg:hidden" />
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
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-white text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <Heart
                size={19}
                className={isWishlisted ? 'fill-[#E11D48] text-[#E11D48]' : 'text-slate-700 dark:text-slate-200'}
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
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-white text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md border border-slate-200/70 dark:border-slate-700 active:scale-95 transition-transform cursor-pointer"
            >
              <Share2 size={18} />
            </button>
          </div>
        </header>

        {/* 2. DUAL-COLUMN LAYOUT ON DESKTOP / STACKED ON MOBILE */}
        <div className="flex-1 overflow-y-auto lg:overflow-hidden lg:grid lg:grid-cols-12">
          {/* LEFT COLUMN: HERO PRODUCT IMAGE & TRUST BADGES (Desktop 5 Cols / Mobile Top) */}
          <div className="lg:col-span-5 bg-slate-100 dark:bg-slate-800/50 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800">
            {/* Image Box */}
            <div className="relative w-full h-72 sm:h-80 lg:h-full min-h-[280px] overflow-hidden flex items-center justify-center p-4">
              <img
                src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'}
                alt={medicine.brandName}
                className="w-full h-full object-cover rounded-2xl lg:rounded-none"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                    target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

              {/* 10 MINS DELIVERY PILL */}
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#0F766E] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md border border-teal-100 dark:border-teal-900 flex items-center gap-1.5 z-10">
                <Zap size={15} className="fill-[#0F766E]" />
                <span>10 MINS DISPATCH</span>
              </div>

              {/* Genuine Pill */}
              <div className="absolute bottom-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 z-10">
                <ShieldCheck size={14} />
                <span>100% Genuine</span>
              </div>
            </div>

            {/* Desktop Trust Strip */}
            <div className="hidden lg:flex items-center justify-around p-3 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#0F766E]" />
                <span>Cold-Chain Safety</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw size={14} className="text-[#0F766E]" />
                <span>Easy Refill</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT DETAILS, PACK SIZES, ACCORDIONS & CTA (Desktop 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between lg:overflow-hidden bg-white dark:bg-slate-900">
            {/* Scrollable Right Details Body */}
            <div className="flex-1 lg:overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-5 pb-28 lg:pb-6">
              {/* TITLE & CHEMICAL COMPOSITION */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 id="product-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                      {medicine.brandName}
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-[#0F766E] mt-1">
                      Generic Salt: {medicine.genericName} • {medicine.strength}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Manufactured by {medicine.manufacturer || 'Certified Indian Pharmacopeia Manufacturer'}
                    </p>
                  </div>
                </div>
              </div>

              {/* PACK SIZE SELECTOR TILES */}
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider block mb-2.5">
                  Select Pack Size
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {packOptions.map((pack, idx) => {
                    const isSelected = selectedPackIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedPackIndex(idx)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'border-[#0F766E] bg-teal-50/50 dark:bg-teal-950/30 shadow-xs ring-2 ring-[#0F766E]/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-[10px] font-black text-[#E11D48] bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md w-fit uppercase mb-1.5">
                          {pack.badge}
                        </div>

                        <div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {pack.label}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="font-black text-base text-slate-900 dark:text-slate-50">₹{pack.price}</span>
                            <span className="text-xs text-slate-400 line-through">₹{pack.mrp}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center absolute top-2.5 right-2.5">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SMART GENERIC SUBSTITUTE RECOMMENDATION */}
              {savingsAmount > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/60 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                          Save ₹{savingsAmount} with Same Active Chemical Salt
                        </span>
                        <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-tight">
                          {genericSubstitute.brandName}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                      Save {Math.round((savingsAmount / medicine.price) * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    Same composition (<strong>{medicine.genericName}</strong>) & therapeutic effect. Approved by certified generic pharmacopeia.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-slate-50">₹{genericSubstitute.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{medicine.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        addItem(genericSubstitute as any, 1);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Switch & Add (₹{genericSubstitute.price})</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* EXPANDABLE PRODUCT DETAILS & DOSAGE */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/60 shadow-2xs">
                <button
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Info size={18} className="text-[#0F766E]" />
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
                      View Product Details, Composition & Dosage
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${isDetailsExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDetailsExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5">Description & Uses:</strong>
                      <p className="leading-relaxed">
                        {medicine.description || 'Fast-acting authentic formulation for symptomatic relief and clinical maintenance. Suitable for daily prescribed regimens.'}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5">Chemical Composition:</strong>
                      <p className="leading-relaxed font-mono text-[11px] text-slate-700 dark:text-slate-200">
                        {medicine.genericName} IP ({medicine.strength})
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5">Storage Instructions:</strong>
                      <p className="leading-relaxed">
                        Store below 30°C in a dry place. Protect from direct sunlight and keep out of reach of children.
                      </p>
                    </div>

                    {medicine.prescriptionRequired && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-700 shrink-0" />
                        <span>Valid Doctor Prescription required at the time of doorstep delivery.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* TOP PRODUCTS IN THIS CATEGORY */}
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Frequently Bought Together
                  </h3>
                  <span className="text-xs text-[#0F766E] font-bold flex items-center gap-1">
                    <Zap size={12} className="fill-[#0F766E]" /> 10-Min Dispatch
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {relatedProducts.map(rel => {
                    const relCartItem = items.find(i => i.medicine.id === rel.id);
                    const relQty = relCartItem ? relCartItem.quantity : 0;

                    return (
                      <div
                        key={rel.id}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="w-full aspect-square bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-1.5">
                          <img src={rel.imageUrl} alt={rel.brandName} className="w-full h-full object-cover" />
                        </div>

                        <div>
                          <h4 className="font-extrabold text-[11px] text-slate-900 dark:text-slate-100 truncate">{rel.brandName}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{rel.strength || rel.unit}</p>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <span className="font-black text-xs text-slate-900 dark:text-slate-100">₹{rel.price}</span>

                          {relQty === 0 ? (
                            <button
                              onClick={() => addItem(rel, 1)}
                              className="px-2.5 py-1 rounded-lg border-2 border-[#0F766E] text-[#0F766E] text-[10px] font-black hover:bg-[#0F766E] hover:text-white transition-all cursor-pointer"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#0F766E] text-white rounded-lg p-0.5 text-xs">
                              <button onClick={() => updateQuantity(rel.id, relQty - 1)} className="px-1.5 font-bold">-</button>
                              <span className="px-1.5 font-black">{relQty}</span>
                              <button onClick={() => updateQuantity(rel.id, relQty + 1)} className="px-1.5 font-bold">+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM ACTION FOOTER (FLIPKART / AMAZON STYLE) */}
            <footer className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shrink-0 shadow-lg flex items-center justify-between gap-4">
              {/* Selected Price & Unit Details */}
              <div className="min-w-0">
                <span className="text-xs text-slate-500 font-bold block truncate">
                  {selectedPack.label}
                </span>
                <div className="flex items-center gap-2 leading-none mt-1">
                  <span className="font-black text-lg sm:text-2xl text-slate-900 dark:text-slate-50">₹{selectedPack.price}</span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through">MRP ₹{selectedPack.mrp}</span>
                  <span className="text-[10px] sm:text-xs font-black text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    {selectedPack.badge}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  Inclusive of all taxes • 10-Minute Doorstep Delivery
                </span>
              </div>

              {/* Add to Cart CTA / Quantity Stepper */}
              <div className="flex items-center gap-2.5 shrink-0">
                {currentQuantity === 0 ? (
                  <Button
                    onClick={handleAddToCart}
                    className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs sm:text-sm font-black px-6 sm:px-8 py-3 sm:py-4 h-auto rounded-2xl shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Add to cart</span>
                    <ChevronRight size={18} />
                  </Button>
                ) : (
                  <div className="flex items-center bg-[#0F766E] text-white rounded-2xl p-1.5 shadow-md">
                    <button
                      onClick={handleDecrement}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl font-black text-base active:scale-95 cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3.5 text-sm font-black">{currentQuantity}</span>
                    <button
                      onClick={handleIncrement}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl font-black text-base active:scale-95 cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

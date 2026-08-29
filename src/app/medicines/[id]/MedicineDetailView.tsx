'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
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
  Star,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  FileText,
  Thermometer,
  Pill,
  CheckCircle2,
  Stethoscope,
  Building2,
  Tag
} from 'lucide-react';
import { Medicine } from '@/types';
import { initialMedicines } from '@/lib/mockData';
import { useCartStore } from '@/stores/useCartStore';
import { AarogyaStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  initialMedicine: Medicine | null;
  medicineId: string;
}

export default function MedicineDetailView({ initialMedicine, medicineId }: Props) {
  const router = useRouter();

  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  
  const [allMedicines, setAllMedicines] = useState<Medicine[]>(initialMedicines);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('benefits');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = AarogyaStorage.getMedicines();
      if (stored && stored.length > 0) {
        setAllMedicines(stored);
      }
      if (medicineId) {
        const wish = AarogyaStorage.getWishlistMedicines();
        setIsWishlisted(wish.includes(medicineId));
      }
    }
  }, [medicineId]);

  const medicine = initialMedicine
    || allMedicines.find(m => m.id.toLowerCase() === medicineId?.toLowerCase())
    || initialMedicines.find(m => m.id.toLowerCase() === medicineId?.toLowerCase())
    || null;

  if (!medicine) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm">
          <Pill size={32} />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2">Medicine Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          The requested healthcare item ({medicineId}) could not be located in our verified pharmacy inventory.
        </p>
        <Button asChild className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-black px-6 h-10 rounded-xl shadow-md">
          <Link href="/pharmacies">Browse 10-Min Pharmacy Store</Link>
        </Button>
      </div>
    );
  }

  // Cart item count
  const cartItem = items.find(item => item.medicine.id === medicine.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Generic alternative calculation
  const genericAlt = allMedicines.find(
    m => m.id !== medicine.id && m.price < medicine.price
  ) || allMedicines.find(m => m.id !== medicine.id);

  const genericSavings = genericAlt ? Math.max(10, medicine.price - genericAlt.price) : 15;

  // Multi-pack options
  const packOptions = [
    {
      title: medicine.strength || '1 Unit',
      price: medicine.price,
      mrp: medicine.mrp || Math.round(medicine.price * 1.18),
      discount: medicine.discountPercent || 15,
      qty: 1
    },
    {
      title: `Pack of 2 (${medicine.form === 'tablet' ? '30 Tablets' : '2 Units'})`,
      price: Math.round(medicine.price * 1.9),
      mrp: Math.round((medicine.mrp || medicine.price * 1.18) * 2),
      discount: (medicine.discountPercent || 15) + 5,
      qty: 2
    },
    {
      title: `Pack of 3 (${medicine.form === 'tablet' ? '45 Tablets' : '3 Units'})`,
      price: Math.round(medicine.price * 2.7),
      mrp: Math.round((medicine.mrp || medicine.price * 1.18) * 3),
      discount: (medicine.discountPercent || 15) + 10,
      qty: 3
    }
  ];

  const currentPack = packOptions[selectedPackIndex] || packOptions[0];

  // Frequently bought together items
  const frequentlyBought = allMedicines
    .filter(m => m.id !== medicine.id && (genericAlt ? m.id !== genericAlt.id : true))
    .slice(0, 4);

  // Gallery image simulation
  const galleryImages = [
    medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&auto=format&fit=crop&q=80'
  ];

  const toggleWishlist = () => {
    AarogyaStorage.toggleWishlistMedicine(medicine.id);
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${medicine.brandName} on Quick Aarogya`,
        text: `Check out ${medicine.brandName} (${medicine.strength}) delivered in 10 mins!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    }
  };

  const handleAddToCart = () => {
    addItem(medicine);
  };

  const handleBuyNow = () => {
    if (currentQuantity === 0) {
      addItem(medicine);
    }
    router.push('/cart');
  };

  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {/* 1. TOP BREADCRUMB & STORE NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto scrollbar-none">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            <Link href="/pharmacies" className="hover:text-slate-900 transition-colors">Pharmacy Store</Link>
            <ChevronRight size={13} className="text-slate-400 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-[320px]">{medicine.brandName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <button
              onClick={toggleWishlist}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-rose-500 border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={16} className={isWishlisted ? "fill-[#E11D48] text-[#E11D48]" : ""} />
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Share medicine"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Share Copied Toast Alert */}
        {showCopiedToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-sm animate-in fade-in-50">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Product link copied to clipboard!</span>
          </div>
        )}

        {/* 2. DUAL-COLUMN FULL E-COMMERCE PRODUCT DETAILS */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start space-y-8 lg:space-y-0">
          {/* LEFT 5 COLUMNS: IMAGE GALLERY & TRUST BADGES */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Featured Product Image */}
            <div className="glass-card p-4 space-y-4">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 shadow-inner flex items-center justify-center group">
                {/* Discount Badge */}
                {currentPack.discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-[#E11D48] text-white text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                    {currentPack.discount}% OFF
                  </div>
                )}

                {/* 10-Minute Express Dispatch Badge */}
                <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-teal-200 text-[11px] font-black text-[#0F766E] flex items-center gap-1 shadow-sm">
                  <Clock size={13} />
                  <span>10 MINS</span>
                </div>

                <img
                  src={galleryImages[selectedImageIndex] || galleryImages[0]}
                  alt={medicine.brandName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Bottom Trust Stamp */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="bg-black/65 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Zap size={12} className="text-amber-400 fill-amber-400" />
                    <span>Instant 10-Min Dispatch</span>
                  </div>
                  <div className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={12} />
                    <span>100% Genuine</span>
                  </div>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#0F766E] shadow-md scale-105 bg-white'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quality & Safety Assurance Strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 border border-teal-100">
                  <Thermometer size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Cold-Chain Safety</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Stored at 2°C - 8°C</p>
                </div>
              </div>

              <div className="glass-card p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#026dd9] flex items-center justify-center shrink-0 border border-blue-100">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Easy Returns</h4>
                  <p className="text-[10px] text-slate-500 font-medium">7 Days Doorstep Policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLUMNS: PRODUCT DATA, PACK SIZES, SAVINGS, AND BUY CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Brand Header */}
            <div className="glass-card p-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-100">
                  {medicine.form.toUpperCase()}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-100">
                  <Star size={13} fill="currentColor" />
                  <span>{medicine.rating || 4.8}</span>
                  <span className="text-slate-400 font-medium">({medicine.ratingCount || 1200}+ ratings)</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {medicine.brandName}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                  Generic Salt: <span className="text-slate-900">{medicine.genericName}</span>
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Manufactured by: <strong className="text-slate-700">{medicine.manufacturer}</strong>
                </p>
              </div>

              {/* Price Display */}
              <div className="pt-3 border-t border-slate-100 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">₹{currentPack.price}</span>
                {currentPack.mrp && (
                  <span className="text-sm text-slate-400 line-through">MRP ₹{currentPack.mrp}</span>
                )}
                {currentPack.discount > 0 && (
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Save ₹{currentPack.mrp - currentPack.price} ({currentPack.discount}% OFF)
                  </span>
                )}
              </div>
            </div>

            {/* 3-Tier Multi-Pack Size Selector */}
            <div className="glass-card p-6 space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Select Pack Size
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packOptions.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[#0F766E] bg-teal-50/60 shadow-sm ring-2 ring-[#0F766E]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {pack.discount > 0 && (
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100 mb-1 inline-block">
                          {pack.discount}% OFF
                        </span>
                      )}

                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{pack.title}</h4>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="font-black text-sm text-slate-900">₹{pack.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{pack.mrp}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generic Substitute Recommendation Card */}
            {genericAlt && (
              <div className="glass-card p-5 border-emerald-200/80 bg-emerald-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">
                        Cost-Saver Generic Recommendation
                      </span>
                      <h4 className="font-black text-xs text-slate-900">
                        Save ₹{genericSavings} with {genericAlt.brandName}
                      </h4>
                    </div>
                  </div>

                  <Badge className="bg-emerald-600 text-white text-[10px] font-black shrink-0">
                    SAVE {Math.round((genericSavings / medicine.price) * 100)}%
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-600 font-medium leading-relaxed pl-10">
                  Same active pharmaceutical salt ({medicine.genericName}). Approved by certified generic pharmacopeia.
                </p>

                <div className="pt-2 pl-10 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900">₹{genericAlt.price} <span className="text-[10px] text-slate-400 line-through">₹{genericAlt.mrp}</span></span>
                  <button
                    onClick={() => {
                      addItem(genericAlt);
                      router.push(`/pharmacies/${genericAlt.id}`);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Switch to {genericAlt.brandName}
                  </button>
                </div>
              </div>
            )}

            {/* Prescription Requirement Alert */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              medicine.prescriptionRequired
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-teal-50/80 border-teal-200 text-teal-900'
            }`}>
              {medicine.prescriptionRequired ? (
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs font-semibold leading-relaxed">
                {medicine.prescriptionRequired ? (
                  <>
                    <strong className="font-black text-amber-950">Valid Doctor Prescription Required:</strong> You can upload an image or link an ABHA prescription directly at checkout.
                  </>
                ) : (
                  <>
                    <strong className="font-black text-teal-950">Over-the-Counter (OTC) Essential:</strong> No doctor prescription required for 10-minute doorstep delivery.
                  </>
                )}
              </div>
            </div>

            {/* Primary Action Buttons (Add to Cart & 10-Min Buy Now) */}
            <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border-teal-200/80">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentQuantity === 0 ? (
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 sm:flex-initial px-8 h-13 bg-[#0F766E] hover:bg-[#115E59] text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </Button>
                ) : (
                  <div className="flex items-center bg-[#0F766E] text-white rounded-2xl p-1.5 shadow-md">
                    <button
                      onClick={() => {
                        if (currentQuantity <= 1) removeItem(medicine.id);
                        else updateQuantity(medicine.id, currentQuantity - 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl font-bold cursor-pointer"
                    >
                      <Minus size={16} className="text-white" />
                    </button>
                    <span className="px-4 text-base font-black">{currentQuantity}</span>
                    <button
                      onClick={() => updateQuantity(medicine.id, currentQuantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-xl font-bold cursor-pointer"
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                )}

                <Button
                  onClick={handleBuyNow}
                  className="flex-1 sm:flex-initial px-8 h-13 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap size={18} className="fill-slate-950" />
                  <span>Buy Now (10 Mins)</span>
                </Button>
              </div>

              <div className="text-right w-full sm:w-auto">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Doorstep Fulfillment</span>
                <span className="text-xs font-black text-[#0F766E] flex items-center justify-end gap-1">
                  <Clock size={12} /> Within 10 Minutes
                </span>
              </div>
            </div>

            {/* Expandable Product Information Accordions */}
            <div className="glass-card divide-y divide-slate-100 overflow-hidden">
              {/* Benefits & Medical Uses */}
              <div className="p-5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'benefits' ? null : 'benefits')}
                  className="w-full flex items-center justify-between text-left font-black text-sm text-slate-900 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#0F766E]" />
                    Key Medical Benefits & Uses
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${activeAccordion === 'benefits' ? 'rotate-180 text-[#0F766E]' : 'text-slate-400'}`}
                  />
                </button>

                {activeAccordion === 'benefits' && (
                  <div className="mt-3 pt-3 text-xs text-slate-600 leading-relaxed font-medium space-y-2 border-t border-slate-100 animate-in fade-in-50">
                    <p>{medicine.description || 'Fast acting therapeutic formulation designed for rapid symptomatic relief.'}</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      <li>Provides targeted relief from acute pain, fever, inflammation, or seasonal congestion.</li>
                      <li>High bioavailability profile for rapid absorption within 15 minutes of administration.</li>
                      <li>Standardized batch formulation manufactured under strict Good Manufacturing Practices (GMP).</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Salt Composition & Mechanism */}
              <div className="p-5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'composition' ? null : 'composition')}
                  className="w-full flex items-center justify-between text-left font-black text-sm text-slate-900 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-[#0F766E]" />
                    Salt Composition & Mechanism of Action
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${activeAccordion === 'composition' ? 'rotate-180 text-[#0F766E]' : 'text-slate-400'}`}
                  />
                </button>

                {activeAccordion === 'composition' && (
                  <div className="mt-3 pt-3 text-xs text-slate-600 leading-relaxed font-medium space-y-2 border-t border-slate-100 animate-in fade-in-50">
                    <p><strong>Active Ingredient:</strong> {medicine.genericName}</p>
                    <p><strong>Strength:</strong> {medicine.strength}</p>
                    <p>
                      Inhibits cyclooxygenase (COX) synthesis and blocks chemical neurotransmitters responsible for fever elevation and inflammatory pain signaling pathways.
                    </p>
                  </div>
                )}
              </div>

              {/* Directions for Use & Storage */}
              <div className="p-5">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'directions' ? null : 'directions')}
                  className="w-full flex items-center justify-between text-left font-black text-sm text-slate-900 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Info size={16} className="text-[#0F766E]" />
                    Directions for Use & Storage Instructions
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${activeAccordion === 'directions' ? 'rotate-180 text-[#0F766E]' : 'text-slate-400'}`}
                  />
                </button>

                {activeAccordion === 'directions' && (
                  <div className="mt-3 pt-3 text-xs text-slate-600 leading-relaxed font-medium space-y-2 border-t border-slate-100 animate-in fade-in-50">
                    <p>Take as advised by your registered physician or as indicated on the manufacturer label.</p>
                    <p>Store in a cool, dry place away from direct sunlight. Keep out of reach of children.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. FREQUENTLY BOUGHT TOGETHER SECTION */}
        {frequentlyBought.length > 0 && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Frequently Bought Together</h3>
                <p className="text-xs text-slate-500 font-medium">Customers who bought {medicine.brandName} also ordered these essentials</p>
              </div>
              <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                ⚡ 10 Min Dispatch
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {frequentlyBought.map(item => (
                <Link
                  key={item.id}
                  href={`/pharmacies/${item.id}`}
                  className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="w-full aspect-square rounded-xl bg-slate-100 mb-2.5 overflow-hidden border border-slate-100">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'}
                      alt={item.brandName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate group-hover:text-[#0F766E] transition-colors">
                      {item.brandName}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">{item.strength || item.genericName}</p>
                    <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className="font-black text-xs text-slate-900">₹{item.price}</span>
                      <span className="text-[10px] font-bold text-[#0F766E]">+ View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

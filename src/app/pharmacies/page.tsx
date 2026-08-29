'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Search,
  MapPin,
  Clock,
  Zap,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Star,
  FileText,
  AlertCircle,
  X,
  Truck,
  RotateCcw,
  Sparkles,
  Filter,
  ArrowRight,
  Heart,
  Info,
  CheckCircle2,
  Mic,
  Tag,
  Stethoscope,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { AarogyaStorage } from '@/lib/storage';
import { PharmacyService } from '@/server/services/pharmacy.service';
import { useCartStore } from '@/stores/useCartStore';
import {
  Pharmacy,
  Medicine,
  PharmacyOrder,
  UserProfile,
  MedicalDocument,
  MedicineCategory
} from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductDetailSheet from '@/components/pharmacy/ProductDetailSheet';
import { Dialog } from '@/components/ui/dialog';
import LocationModal from '@/components/layout/LocationModal';

// Quick Meds Category Taxonomy with Images & Icons
interface QuickMedsCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  tag: string;
  image: string;
  bannerTitle: string;
  bannerSubtitle: string;
  filterKey?: MedicineCategory | 'all';
}

const QUICK_MEDS_CATEGORIES: QuickMedsCategory[] = [
  {
    id: 'all',
    name: 'All Medicines & Essentials',
    shortName: 'All',
    icon: '⚡',
    tag: 'Top Picks',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Special Healthcare Essentials',
    bannerSubtitle: 'Get fever relief, inhalers, first aid & daily vitamins delivered in 10 mins',
    filterKey: 'all'
  },
  {
    id: 'pain_fever',
    name: 'Pain & Fever Relief',
    shortName: 'Pain & Fever',
    icon: '💊',
    tag: 'Fast Relief',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Fast-Acting Fever & Pain Relief',
    bannerSubtitle: 'Paracetamol, Dolo 650, Combiflam, Moov & Volini pain sprays',
    filterKey: 'otc_wellness'
  },
  {
    id: 'cold_cough',
    name: 'Cold, Cough & Flu',
    shortName: 'Cold & Cough',
    icon: '🧣',
    tag: 'Monsoon Care',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Cold & Cough Emergency Relief',
    bannerSubtitle: 'Vicks, Otrivin nasal spray, Strepsils, Inhalers & cough syrups',
    filterKey: 'must_haves'
  },
  {
    id: 'first_aid',
    name: 'First Aid & Wound Care',
    shortName: 'First Aid',
    icon: '🩹',
    tag: 'Emergency',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Emergency First Aid & Wound Kits',
    bannerSubtitle: 'Dettol, Betadine, waterproof bandages, cotton & crepe rolls',
    filterKey: 'must_haves'
  },
  {
    id: 'digestion',
    name: 'Stomach Care & ORS',
    shortName: 'Stomach Care',
    icon: '🍋',
    tag: 'Instant Ease',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Stomach Relief & Rehydration',
    bannerSubtitle: 'Eno, Digene, Gelusil, Electral ORS & probiotics',
    filterKey: 'otc_wellness'
  },
  {
    id: 'vitamins',
    name: 'Daily Vitamins & Immunity',
    shortName: 'Vitamins',
    icon: '✨',
    tag: 'Immunity',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Daily Immunity & Vitality Boosters',
    bannerSubtitle: 'Limcee Vitamin C, Shelcal Calcium, Becosules Zinc & Multivitamins',
    filterKey: 'must_haves'
  },
  {
    id: 'skincare',
    name: 'Skin Care & Antiseptics',
    shortName: 'Skincare',
    icon: '🧴',
    tag: 'Derm Care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Dermatologist-Approved Skincare',
    bannerSubtitle: 'Moisturizers, anti-fungal powders, sunscreens & healing lotions',
    filterKey: 'skin_care'
  },
  {
    id: 'chronic_care',
    name: 'Rx Chronic Care Medicines',
    shortName: 'Chronic Care',
    icon: '🩺',
    tag: 'Prescription',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
    bannerTitle: 'Verified Prescription Refills',
    bannerSubtitle: 'Cardiac, blood pressure, diabetes & thyroid maintenance meds',
    filterKey: 'chronic_care'
  }
];

function PharmacyShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pastOrders, setPastOrders] = useState<PharmacyOrder[]>([]);
  const [prescriptions, setPrescriptions] = useState<MedicalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');
  const [activeFilter, setActiveFilter] = useState<'all' | '10min' | 'rx_free' | 'discount'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');

  // Location selector modal state
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Heritage Heights, Green Park, New Delhi');

  // Cart & Drawer State
  const {
    items: cartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalCount,
    getTotalPrice
  } = useCartStore();

  const [quickViewMed, setQuickViewMed] = useState<Medicine | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>('');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PharmacyOrder | null>(null);
  const [likedMeds, setLikedMeds] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && QUICK_MEDS_CATEGORIES.some(c => c.id === cat)) {
      setSelectedCategory(cat);
    }
    const search = searchParams.get('search') || searchParams.get('brand') || searchParams.get('q');
    if (search) {
      setSearchQuery(search);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pharmas, meds] = await Promise.all([
        PharmacyService.getPharmacies(),
        PharmacyService.getMedicines()
      ]);
      setPharmacies(pharmas);
      setMedicines(meds);

      const docs = AarogyaStorage.getMedicalDocuments();
      const rxDocs = docs.filter(d => d.category === 'prescription');
      setPrescriptions(rxDocs);
      if (rxDocs.length > 0) {
        setSelectedPrescriptionId(rxDocs[0].id);
      }

      const orders = AarogyaStorage.getPharmacyOrders();
      setPastOrders(orders);
    } catch (err) {
      console.error('Failed to load pharmacy data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartItemQty = (medId: string): number => {
    const found = cartItems.find(item => item.medicine.id === medId);
    return found ? found.quantity : 0;
  };

  const handleAddToCart = (med: Medicine, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(med);
  };

  const handleIncrement = (med: Medicine, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = getCartItemQty(med.id);
    updateQuantity(med.id, current + 1);
  };

  const handleDecrement = (medId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = getCartItemQty(medId);
    if (current <= 1) {
      removeItem(medId);
    } else {
      updateQuantity(medId, current - 1);
    }
  };

  const toggleLike = (medId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedMeds(prev => ({ ...prev, [medId]: !prev[medId] }));
  };

  const activeCategoryObj = useMemo(() => {
    return QUICK_MEDS_CATEGORIES.find(c => c.id === selectedCategory) || QUICK_MEDS_CATEGORIES[0];
  }, [selectedCategory]);

  // Filter and Sort Medicines
  const filteredMedicines = useMemo(() => {
    let result = [...medicines];

    // Category Filter
    if (selectedCategory === 'pain_fever') {
      result = result.filter(m =>
        m.category === 'otc_wellness' ||
        m.brandName.toLowerCase().includes('dolo') ||
        m.brandName.toLowerCase().includes('combiflam') ||
        m.brandName.toLowerCase().includes('paracetamol') ||
        m.brandName.toLowerCase().includes('moov') ||
        m.brandName.toLowerCase().includes('volini')
      );
    } else if (selectedCategory === 'cold_cough') {
      result = result.filter(m =>
        m.brandName.toLowerCase().includes('vicks') ||
        m.brandName.toLowerCase().includes('otrivin') ||
        m.brandName.toLowerCase().includes('strepsils') ||
        m.brandName.toLowerCase().includes('inhaler') ||
        m.brandName.toLowerCase().includes('syrup')
      );
    } else if (selectedCategory === 'first_aid') {
      result = result.filter(m =>
        m.brandName.toLowerCase().includes('dettol') ||
        m.brandName.toLowerCase().includes('betadine') ||
        m.brandName.toLowerCase().includes('bandage') ||
        m.brandName.toLowerCase().includes('band-aid') ||
        m.brandName.toLowerCase().includes('cotton') ||
        m.brandName.toLowerCase().includes('savlon')
      );
    } else if (selectedCategory === 'digestion') {
      result = result.filter(m =>
        m.brandName.toLowerCase().includes('eno') ||
        m.brandName.toLowerCase().includes('digene') ||
        m.brandName.toLowerCase().includes('electral') ||
        m.brandName.toLowerCase().includes('ors') ||
        m.brandName.toLowerCase().includes('pudina')
      );
    } else if (selectedCategory === 'vitamins') {
      result = result.filter(m =>
        m.brandName.toLowerCase().includes('limcee') ||
        m.brandName.toLowerCase().includes('shelcal') ||
        m.brandName.toLowerCase().includes('becosules') ||
        m.brandName.toLowerCase().includes('zinc') ||
        m.brandName.toLowerCase().includes('vitamin')
      );
    } else if (selectedCategory === 'skincare') {
      result = result.filter(m =>
        m.category === 'skin_care' ||
        m.brandName.toLowerCase().includes('boroline') ||
        m.brandName.toLowerCase().includes('caladryl') ||
        m.brandName.toLowerCase().includes('cream')
      );
    } else if (selectedCategory === 'chronic_care') {
      result = result.filter(m => m.prescriptionRequired || m.category === 'chronic_care');
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.brandName.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        (m.manufacturer && m.manufacturer.toLowerCase().includes(q))
      );
    }

    // Filter Chips
    if (activeFilter === 'rx_free') {
      result = result.filter(m => !m.prescriptionRequired);
    } else if (activeFilter === 'discount') {
      result = result.filter(m => (m.discountPercent || 0) >= 15);
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [medicines, selectedCategory, searchQuery, activeFilter, sortBy]);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    const hasRx = cartItems.some(i => i.medicine.prescriptionRequired);
    if (hasRx && !selectedPrescriptionId) {
      alert('Prescription required for some items in your cart. Please link one.');
      return;
    }

    try {
      const order = await PharmacyService.createOrder({
        patientProfileId: AarogyaStorage.getActiveProfileId() || 'usr-101',
        patientName: `${AarogyaStorage.getUserProfile()?.firstName || 'Arjun'} ${AarogyaStorage.getUserProfile()?.lastName || 'Sharma'}`,
        items: cartItems.map(i => ({
          medicineId: i.medicine.id,
          quantity: i.quantity,
          pharmacyId: 'pharma-1'
        })),
        deliveryType: 'delivery',
        deliveryAddress: deliveryAddress,
        prescriptionDocumentId: hasRx ? (selectedPrescriptionId || 'doc-rx-101') : undefined,
        prescriptionFileName: hasRx ? 'Linked_Medical_Prescription.pdf' : undefined,
        paymentMethod: 'upi'
      });

      setPlacedOrder(order);
      clearCart();
      setIsCartDrawerOpen(false);
      setIsCheckoutSuccess(true);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to place order.');
    }
  };

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();
  const totalMRP = cartItems.reduce((acc, item) => acc + (item.medicine.mrp || item.medicine.price * 1.15) * item.quantity, 0);
  const totalSavings = Math.max(0, Math.round(totalMRP - totalPrice));
  const deliveryFee = totalPrice >= 99 ? 0 : 25;
  const handlingFee = 4;
  const grandTotal = totalPrice + deliveryFee + handlingFee;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#0F172A] pb-28">
      {/* 1. CLEAN TOP STORE HEADER (1:1 with Blinkit Subcategory Screen) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 flex items-center justify-between gap-3">
          {/* Back Button & Category Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => router.push('/')}
              aria-label="Go Back to Home"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors border border-slate-200/70 shrink-0 active:scale-95"
            >
              <ChevronLeft size={22} className="text-slate-800" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                {activeCategoryObj.name}
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>10-min delivery to <strong className="text-slate-700">Green Park</strong></span>
              </span>
            </div>
          </div>

          {/* Right: Search Toggle & Orders Shortcut */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border ${
                isSearchOpen
                  ? 'bg-teal-50 text-[#0F766E] border-teal-300'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title="Search medicines"
            >
              <Search size={17} />
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'shop' ? 'orders' : 'shop')}
              className="px-3 py-1.5 rounded-full text-xs font-black bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ShoppingBag size={14} />
              <span>{activeTab === 'shop' ? `Orders (${pastOrders.length})` : 'Catalog'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {isSearchOpen && (
          <div className="px-3 pb-2.5 pt-1 bg-slate-50 border-t border-slate-100 max-w-6xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder={`Search in ${activeCategoryObj.shortName}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-white text-slate-900 rounded-xl text-xs font-medium placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 p-1 text-slate-400">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. FILTER & SORT CHIPS BAR */}
        <div className="bg-white border-t border-slate-100 px-4 sm:px-6 lg:px-8 xl:px-10 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 w-full max-w-[1720px] mx-auto">
          {/* Filters Dropdown */}
          <button
            onClick={() => setActiveFilter(activeFilter === 'all' ? '10min' : 'all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
              activeFilter !== 'all'
                ? 'bg-[#0F766E] text-white border-[#0F766E]'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <SlidersHorizontal size={12} />
            <span>Filters</span>
            <ChevronDown size={11} />
          </button>

          {/* Sort Dropdown */}
          <button
            onClick={() => setSortBy(sortBy === 'popular' ? 'price_asc' : sortBy === 'price_asc' ? 'price_desc' : 'popular')}
            className="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <ArrowUpDown size={12} />
            <span>
              {sortBy === 'popular' ? 'Sort' : sortBy === 'price_asc' ? 'Price: Low' : 'Price: High'}
            </span>
            <ChevronDown size={11} />
          </button>

          {/* Quick Subcategory Pills */}
          {[
            { id: 'all', label: 'All Picks' },
            { id: 'rx_free', label: 'OTC (No Rx)' },
            { id: 'discount', label: '15%+ OFF' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
                activeFilter === f.id
                  ? 'bg-teal-50 text-[#0F766E] border-teal-300 ring-1 ring-[#0F766E]/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'orders' ? (
        /* ORDERS LIST VIEW */
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-slate-900">Your Medicine Orders</h1>
            <Badge variant="outline" className="font-bold text-xs text-[#0F766E] border-[#0F766E]/40 bg-teal-50">
              ⚡ 10-Minute Guaranteed Delivery
            </Badge>
          </div>

          {pastOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm">
              <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-3" />
              <h2 className="text-base font-black text-slate-800">No Past Orders Found</h2>
              <p className="text-xs text-slate-500 mt-1 mb-5">You haven&apos;t ordered any medicines yet.</p>
              <Button onClick={() => setActiveTab('shop')} className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-sm">
                Start 10-Min Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {pastOrders.map(order => (
                <Card key={order.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-slate-900">#{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.medicineName}</span>
                        <span className="font-semibold text-slate-800">₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{order.pharmacyName}</span>
                    <span className="font-black text-sm text-[#0F766E]">Total: ₹{order.totalAmount}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 3. AUTHENTIC 2-COLUMN STORE LAYOUT (1:1 with Blinkit Screen) */
        <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-10 flex items-start">
          {/* Left Vertical Category Rail */}
          <aside
            className="w-[88px] sm:w-[110px] shrink-0 bg-white border-r border-slate-200/80 sticky top-[96px] max-h-[calc(100vh-96px)] overflow-y-auto overscroll-contain touch-pan-y py-2 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <div className="flex flex-col space-y-1 pb-36">
              {QUICK_MEDS_CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`w-full py-2.5 px-1 flex flex-col items-center justify-center text-center relative transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-teal-50/70 text-[#0F766E] font-black'
                        : 'text-slate-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    {/* Active Indicator Left Vertical Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#0F766E] rounded-r" />
                    )}

                    {/* Modern Squircle Category Card */}
                    <div className={`w-12 h-12 rounded-2xl overflow-hidden mb-1.5 p-0.5 border flex items-center justify-center transition-transform ${
                      isSelected ? 'border-[#0F766E] shadow-2xs scale-105 bg-white' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                    </div>

                    <span className="text-[10px] leading-tight line-clamp-2 px-0.5 font-bold">
                      {cat.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="flex-1 min-w-0 p-2.5 sm:p-4 lg:p-6 space-y-4">
            {/* Category Promo / Seasonal Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/70 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <h2 className="text-sm sm:text-lg font-black text-slate-900 leading-tight">
                  {activeCategoryObj.bannerTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 font-medium leading-snug">
                  {activeCategoryObj.bannerSubtitle}
                </p>
              </div>

              <div className="shrink-0 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-teal-200/80 text-xs font-black text-[#0F766E] flex items-center gap-1.5 shadow-2xs">
                <Clock size={14} />
                <span>10 MINS</span>
              </div>
            </div>

            {/* Product Grid */}
            {filteredMedicines.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No medicines found in this category</h3>
                <p className="text-xs text-slate-500 mt-1">Try switching categories or clearing your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredMedicines.map(med => {
                  const qty = getCartItemQty(med.id);
                  const discount = med.discountPercent || 15;
                  const isLiked = likedMeds[med.id];

                  return (
                    <Link
                      key={med.id}
                      href={`/pharmacies/${med.id}`}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-2.5 sm:p-3 flex flex-col justify-between group cursor-pointer relative"
                    >
                      {/* Product Image Container */}
                      <div className="relative w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 mb-2 overflow-hidden border border-slate-100 shadow-2xs">
                        {/* Discount Pill */}
                        {discount > 0 && (
                          <div className="absolute top-2 left-2 z-10 bg-[#E11D48] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                            {discount}% OFF
                          </div>
                        )}

                        {/* Heart Wishlist Trigger */}
                        <button
                          onClick={e => toggleLike(med.id, e)}
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/85 backdrop-blur-md shadow-xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors border border-white/80"
                        >
                          <Heart size={13} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                        </button>

                        <img
                          src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'}
                          alt={med.brandName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                              target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                            }
                          }}
                        />

                        {/* ADD / QTY STEPPER ON BOTTOM RIGHT OF IMAGE (1:1 with Reference) */}
                        <div className="absolute bottom-1.5 right-1.5 z-10" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                          {qty === 0 ? (
                            <button
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(med, e);
                              }}
                              className="px-3.5 py-1 bg-white text-[#0F766E] border-2 border-[#0F766E] rounded-lg text-xs font-black hover:bg-[#0F766E] hover:text-white transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#0F766E] text-white rounded-lg p-0.5 shadow-md">
                              <button
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDecrement(med.id, e);
                                }}
                                className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded font-bold cursor-pointer"
                              >
                                <Minus size={11} className="text-white" />
                              </button>
                              <span className="px-1.5 text-xs font-black">{qty}</span>
                              <button
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleIncrement(med, e);
                                }}
                                className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded font-bold cursor-pointer"
                              >
                                <Plus size={11} className="text-white" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Weight / Pack Size Pill */}
                      <div className="mb-1">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {med.strength || '10 Tablets'}
                        </span>
                      </div>

                      {/* Title & Generic Name */}
                      <div className="min-w-0">
                        <h3 className="font-black text-xs text-slate-900 line-clamp-1 group-hover:text-[#0F766E] transition-colors">
                          {med.brandName}
                        </h3>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                          {med.genericName}
                        </p>
                      </div>

                      {/* 10 MINS Delivery Tag */}
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] mt-1.5">
                        <Clock size={10} className="text-[#0F766E]" />
                        <span>10 MINS</span>
                      </div>

                      {/* Price & MRP Row */}
                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="font-black text-sm text-slate-900">₹{med.price}</span>
                          {med.mrp && (
                            <span className="text-[10px] text-slate-400 line-through block -mt-1">
                              MRP ₹{med.mrp}
                            </span>
                          )}
                        </div>

                        {med.prescriptionRequired && (
                          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                            Rx
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      )}



      {/* FULL-SIZE PRODUCT DETAIL SCREEN WITH GENERIC SUBSTITUTES & OFFERS */}
      <ProductDetailSheet
        medicine={quickViewMed}
        allMedicines={medicines}
        onClose={() => setQuickViewMed(null)}
      />

      {/* Interactive Location Selector Modal */}
      <LocationModal
        isOpen={isLocationSelectorOpen}
        onClose={() => setIsLocationSelectorOpen(false)}
        currentAddress={deliveryAddress}
        onSelectAddress={(addr) => setDeliveryAddress(addr)}
      />
    </div>
  );
}

export default function PharmacyShopPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs font-bold text-slate-400">Loading Quick Meds Store...</div>}>
      <PharmacyShopContent />
    </Suspense>
  );
}

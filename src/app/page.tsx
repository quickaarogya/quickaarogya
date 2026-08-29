'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Activity,
  Calendar,
  Pill,
  FileText,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  Plus,
  Minus,
  Sparkles,
  Users,
  Check,
  Store,
  Truck,
  CalendarPlus,
  Stethoscope,
  Building2,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  TrendingUp,
  Search,
  MapPin,
  Bell,
  Mic,
  ChevronDown,
  ShoppingBag,
  Tag,
  ShieldAlert,
  X,
  PhoneCall,
  Phone,
  Video,
  Droplet,
  Thermometer,
  Weight,
  QrCode,
  FolderHeart,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { AarogyaStorage } from '../lib/storage';
import {
  MedicationSchedule,
  Appointment,
  MedicalDocument,
  Medicine,
  Doctor,
  UserProfile,
  FamilyMember,
  EmergencyProfile,
  BiomarkerReportItem,
  Hospital
} from '../types';
import { useCareContextStore } from '../stores/useCareContextStore';
import { useCartStore } from '../stores/useCartStore';
import { useAppModeStore } from '../stores/useAppModeStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import LocationModal from '../components/layout/LocationModal';
import ProductDetailSheet from '../components/pharmacy/ProductDetailSheet';
import BrandLogo from '../components/common/BrandLogo';
import TopDoctorCarousel from '../components/doctors/TopDoctorCarousel';
import { DoctorPortraitCard } from '../components/doctor/DoctorPortraitCard';
import { TopCTScansSection } from '../components/diagnostics/TopCTScansSection';
import { TopPathologySection } from '../components/diagnostics/TopPathologySection';
import { TopXRaysSection } from '../components/diagnostics/TopXRaysSection';
import { ComparePricesSection } from '../components/diagnostics/ComparePricesSection';
import {
  PromoCarouselBanner,
  OPDExpressPromoBanner,
  FullBodyCheckupPromoBanner,
  DiagnosticFilmPromoBanner
} from '../components/promotions/PromoBanners';

// Category Carousel Chips for Pharma
const PHARMA_TOP_CATEGORIES = [
  { id: 'all', name: 'All Essentials', icon: '⚡' },
  { id: 'pain_fever', name: 'Pain & Fever', icon: '💊' },
  { id: 'cold_cough', name: 'Cold & Cough', icon: '🧣' },
  { id: 'first_aid', name: 'First Aid', icon: '🩹' },
  { id: 'vitamins', name: 'Daily Vitamins', icon: '✨' },
  { id: 'skincare', name: 'Skincare', icon: '🧴' },
  { id: 'digestion', name: 'Stomach Care', icon: '🍋' },
  { id: 'chronic_care', name: 'Rx Chronic', icon: '🩺' },
];

const TRUSTED_BRAND_PARTNERS = [
  { id: 'apollo', name: 'Apollo 24|7', query: 'Apollo' },
  { id: 'cipla', name: 'Cipla', query: 'Cipla' },
  { id: 'gsk', name: 'GSK Health', query: 'GSK' },
  { id: 'sun_pharma', name: 'Sun Pharma', query: 'Sun Pharma' },
  { id: 'dr_reddy', name: "Dr. Reddy's", query: 'Dr. Reddy' },
  { id: 'abbott', name: 'Abbott', query: 'Abbott' },
  { id: 'himalaya', name: 'Himalaya', query: 'Himalaya' },
  { id: 'mankind', name: 'Mankind', query: 'Mankind' }
];

const HOME_BROWSE_CATEGORIES = [
  {
    id: 'pain_fever',
    name: 'Pain & Fever',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    tag: '10 MINS'
  },
  {
    id: 'cold_cough',
    name: 'Cold & Cough',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&auto=format&fit=crop&q=80',
    tag: '10 MINS'
  },
  {
    id: 'first_aid',
    name: 'First Aid',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&auto=format&fit=crop&q=80',
    tag: '10 MINS'
  },
  {
    id: 'digestion',
    name: 'Stomach Care',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80',
    tag: '10 MINS'
  },
  {
    id: 'vitamins',
    name: 'Daily Vitamins',
    image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=400&auto=format&fit=crop&q=80',
    tag: '10 MINS'
  },
  {
    id: 'skincare',
    name: 'Skin Care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    tag: '10 MINS'
  },
  {
    id: 'chronic_care',
    name: 'Rx Chronic',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80',
    tag: 'Rx Delivery'
  },
  {
    id: 'all',
    name: 'All Essentials',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&auto=format&fit=crop&q=80',
    tag: 'View All'
  }
];

// Specialties for Doctor Mode
const DOCTOR_SPECIALTIES = [
  { id: 'cardiology', name: 'Cardiologist', icon: '❤️', count: '12 Doctors', tag: 'Heart & BP' },
  { id: 'pediatrics', name: 'Pediatrician', icon: '👶', count: '18 Doctors', tag: 'Child Care' },
  { id: 'dermatology', name: 'Dermatologist', icon: '🧴', count: '14 Doctors', tag: 'Skin & Hair' },
  { id: 'orthopedics', name: 'Orthopedic', icon: '🦴', count: '9 Doctors', tag: 'Joints & Bones' },
  { id: 'neurology', name: 'Neurologist', icon: '🧠', count: '8 Doctors', tag: 'Brain & Spine' },
  { id: 'general', name: 'General Physician', icon: '🩺', count: '24 Doctors', tag: 'Fever & Health' },
  { id: 'gynecology', name: 'Gynecologist', icon: '🌸', count: '15 Doctors', tag: 'Women Health' },
  { id: 'dental', name: 'Dentist', icon: '🦷', count: '11 Doctors', tag: 'Teeth Care' }
];

export default function HomeCockpit() {
  const { appMode } = useAppModeStore();
  const { activeProfileId, isSosActive, toggleSos, setActiveProfileId } = useCareContextStore();
  const { items: cartItems, addItem: addToCart, updateQuantity, removeItem, getTotalCount, getTotalPrice } = useCartStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyProfile | null>(null);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [biomarkers, setBiomarkers] = useState<BiomarkerReportItem[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Doctors Single Line Scroll Ref
  const doctorsScrollRef = useRef<HTMLDivElement>(null);
  const scrollDoctors = (direction: 'left' | 'right') => {
    if (doctorsScrollRef.current) {
      const scrollAmount = doctorsScrollRef.current.clientWidth * 0.8;
      doctorsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Search & Location
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Heritage Heights, Green Park, New Delhi');
  const [justTakenMap, setJustTakenMap] = useState<{ [key: string]: boolean }>({});
  const [selectedMedicineForDetail, setSelectedMedicineForDetail] = useState<Medicine | null>(null);
  const [doctorCategoryType, setDoctorCategoryType] = useState<'all' | 'hospital' | 'clinic'>('all');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Wishlist State
  const [wishlistDoctorIds, setWishlistDoctorIds] = useState<string[]>([]);
  const [wishlistMedicineIds, setWishlistMedicineIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('storage-update', handleStorageChange);
    return () => window.removeEventListener('storage-update', handleStorageChange);
  }, [activeProfileId]);

  const loadData = () => {
    const usr = AarogyaStorage.getUserProfile();
    const fam = AarogyaStorage.getFamilyMembers();
    const emg = AarogyaStorage.getEmergencyProfile();
    const allScheds = AarogyaStorage.getMedicationSchedules();
    const allAppts = AarogyaStorage.getAppointments();
    const allDocs = AarogyaStorage.getMedicalDocuments();
    const allBio = AarogyaStorage.getBiomarkers();
    const allMeds = AarogyaStorage.getMedicines();
    const allDocsList = AarogyaStorage.getDoctors();
    const allNotifs = AarogyaStorage.getNotifications();
    const allHosps = AarogyaStorage.getHospitals();
    const wishDocs = AarogyaStorage.getWishlistDoctors();
    const wishMeds = AarogyaStorage.getWishlistMedicines();

    setProfile(usr);
    setFamilyMembers(fam);
    setEmergencyProfile(emg);
    setMedicines(allMeds);
    setDoctors(allDocsList);
    setNotifications(allNotifs);
    setBiomarkers(allBio);
    setHospitals(allHosps);
    setWishlistDoctorIds(wishDocs);
    setWishlistMedicineIds(wishMeds);

    if (activeProfileId === 'usr-101') {
      setSchedules(allScheds);
      setAppointments(allAppts);
      setDocuments(allDocs);
    } else {
      setSchedules(allScheds.filter(s => s.patientProfileId === activeProfileId));
      setAppointments(allAppts.filter(a => a.patientProfileId === activeProfileId));
      setDocuments(allDocs.filter(d => d.patientProfileId === activeProfileId));
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleTakeDose = (id: string) => {
    AarogyaStorage.logDoseAction(id, 'taken');
    setJustTakenMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setJustTakenMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
    loadData();
  };

  const getCartItemQty = (medId: string): number => {
    const found = cartItems.find(item => item.medicine.id === medId);
    return found ? found.quantity : 0;
  };

  const handleAddToCart = (med: Medicine, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(med);
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

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();
  const upcomingAppointment = appointments.find(a => a.status === 'confirmed' || a.status === 'booked');

  // Filtered medicines
  const filteredMeds = useMemo(() => {
    if (!searchQuery) return medicines;
    return medicines.filter(m =>
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    if (!searchQuery) return doctors;
    return doctors.filter(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [doctors, searchQuery]);

  // Active Profile Details for Care Mode
  const activeMember = familyMembers.find(f => f.id === activeProfileId);
  const userName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Arjun Sharma';
  const activePatientName = activeMember ? activeMember.fullName : userName;
  const activeBloodGroup = activeMember?.bloodGroup || profile?.bloodGroup || 'O+';
  const activeAbhaId = activeMember?.abhaId || profile?.abhaId || '91-8834-2910-1823';
  const activeGender = activeMember?.gender || profile?.gender || 'male';

  /* =========================================================================
   * 1. PHARMA MODE COCKPIT (10-MINUTE QUICK MEDS ONLY)
   * ========================================================================= */
  if (appMode === 'pharma') {
    return (
      <div className="min-h-screen pb-28 text-slate-900 select-none">
        {/* TOP SIGNATURE TEAL HEADER FOR PHARMA WITH FROSTED GLASS ACCENTS (MOBILE ONLY) */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#134E4A] via-[#0F766E] to-[#0D9488] text-white pt-3.5 pb-5 px-4 shadow-[0_10px_30px_rgba(15,118,110,0.18)] border-b border-teal-500/30 lg:hidden">
          {/* Ambient lighting accents */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-teal-300/25 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Top Row: User Greeting & Actions */}
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Profile Avatar"
                  className="w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] rounded-xl object-cover border border-white/40 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-sm font-black text-white leading-tight whitespace-nowrap truncate">
                    Hi, {profile?.firstName || 'Arjun'}!
                  </h1>
                  <p className="text-[9px] sm:text-[10px] text-teal-100 font-medium truncate max-w-[85px] sm:max-w-none leading-tight">⚡ 10 mins delivery</p>
                </div>
              </div>

              {/* Actions: Location + Wishlist + Notification Bell */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-1.5 sm:px-2 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <MapPin size={11} className="text-[#2DD4BF] shrink-0 sm:w-3 sm:h-3" />
                  <span className="max-w-[55px] sm:max-w-[110px] truncate">New Delhi</span>
                </button>

                {/* Wishlist Link for Pharma */}
                <Link
                  href="/wishlist?tab=medicines"
                  aria-label="Medicine Wishlist"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                  title="Saved Medicines Wishlist"
                >
                  <Heart size={14} className={wishlistMedicineIds.length > 0 ? "fill-white text-white sm:w-4 sm:h-4" : "text-white sm:w-4 sm:h-4"} />
                  {wishlistMedicineIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                      {wishlistMedicineIds.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/inbox"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Bell size={14} className="sm:w-4 sm:h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Medicine Search Bar */}
            <div className="relative mt-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder='Search "paracetamol", "vicks", "dolo 650", "inhalers", "band-aids"...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 glass-input text-slate-900 rounded-xl text-xs sm:text-sm font-medium placeholder:text-slate-400 shadow-sm focus:outline-none"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 p-1 text-slate-400">
                    <X size={15} />
                  </button>
                ) : (
                  <Mic className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-3">
              <Link
                href="/pharmacies"
                className="px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 bg-white text-[#0F766E] shadow-md border border-white hover:bg-teal-50 active:scale-95"
              >
                <ShoppingBag size={13} className="fill-current" />
                <span>Pharmacy Shop</span>
              </Link>
              {PHARMA_TOP_CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={cat.id === 'all' ? '/pharmacies' : `/pharmacies?category=${cat.id}`}
                  className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 bg-white/20 text-teal-50 hover:bg-white/30 backdrop-blur-md border border-white/20 shadow-2xs"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-8">
          {/* TRUSTED BRAND PARTNERS STRIP (CLICKABLE BRANDS WITH LOGOS) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
              <span>Trusted Healthcare Brands</span>
              <span className="text-[#0F766E] font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> 100% Genuine Direct Supply
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {TRUSTED_BRAND_PARTNERS.map((brand, i) => (
                <Link
                  key={i}
                  href={`/pharmacies?search=${encodeURIComponent(brand.query)}`}
                  className="h-9 px-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-teal-400 transition-all shrink-0 flex items-center gap-2 group active:scale-95 cursor-pointer"
                >
                  <BrandLogo brandId={brand.id} className="w-5 h-5 rounded-md shrink-0 shadow-2xs group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#0F766E] transition-colors whitespace-nowrap">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* BROWSE MEDICINE CATEGORIES (PHOTO TILES) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1 gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                  Browse Medicine Categories
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">Instant 10-minute dispatch across all healthcare needs</p>
              </div>
              <Link href="/pharmacies" className="text-xs font-black text-[#0F766E] hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                <span>View Store</span>
                <ChevronRight size={14} className="shrink-0" />
              </Link>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
              {HOME_BROWSE_CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={cat.id === 'all' ? '/pharmacies' : `/pharmacies?category=${cat.id}`}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all group-hover:scale-105 duration-200">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                          target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                        }
                      }}
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight mt-1.5 group-hover:text-[#0F766E] transition-colors w-full">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CURATED OFFERS & SEASONAL CARE 2X2 GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Featured Left Card */}
            <Link
              href="/pharmacies"
              className="md:col-span-1 p-5 rounded-3xl bg-gradient-to-br from-[#0F766E] to-[#134E4A] text-white flex flex-col justify-between shadow-[0_8px_30px_rgba(15,118,110,0.2)] hover:shadow-[0_12px_36px_rgba(15,118,110,0.28)] transition-all relative overflow-hidden group cursor-pointer border border-white/20"
            >
              <div className="relative z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[#2DD4BF] text-[10px] font-black uppercase tracking-wider inline-block mb-2 border border-white/10">
                  Monsoon Care
                </span>
                <h3 className="text-xl font-black leading-tight">
                  Emergency & First Aid Kits
                </h3>
                <p className="text-xs text-teal-100 mt-1 font-medium">
                  Bandages, Inhalers, Burn Creams & Ointments with Flat 35% OFF
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between relative z-10">
                <span className="text-xs font-black text-[#2DD4BF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Kits <ArrowRight size={14} />
                </span>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">⚡ 10 Mins</span>
              </div>
            </Link>

            {/* 2x2 Offer Tiles */}
            <div className="md:col-span-2 grid grid-cols-2 gap-2.5 sm:gap-3">
              {[
                {
                  title: 'Pain & Fever Relief',
                  subtitle: 'Dolo, Combiflam, Moov',
                  tag: 'Up to 25% OFF',
                  image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
                  href: '/pharmacies?category=pain_fever'
                },
                {
                  title: 'Cold, Cough & Flu',
                  subtitle: 'Vicks, Otrivin, Strepsils',
                  tag: 'Flat 20% OFF',
                  image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&auto=format&fit=crop&q=80',
                  href: '/pharmacies?category=cold_cough'
                },
                {
                  title: 'Daily Vitamins & Zinc',
                  subtitle: 'Shelcal, Limcee, Becosules',
                  tag: 'Save up to 30%',
                  image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80',
                  href: '/pharmacies?category=vitamins'
                },
                {
                  title: 'Stomach Ease & ORS',
                  subtitle: 'Eno, Digene, Electral',
                  tag: 'Works in 6s',
                  image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80',
                  href: '/pharmacies?category=digestion'
                },
              ].map((offer, idx) => (
                <Link
                  key={idx}
                  href={offer.href}
                  className="p-3.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-teal-300 transition-all flex items-center justify-between gap-2 group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black text-[#E11D48] bg-rose-50/80 px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit mb-1 border border-rose-100">
                      {offer.tag}
                    </span>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate group-hover:text-[#0F766E] transition-colors">
                      {offer.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{offer.subtitle}</p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200/70 shadow-2xs">
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* FAST 10-MINUTE DOORSTEP MEDICINES */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1 gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                  ⚡ 10-Minute Doorstep Medicines
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">Top prescribed medications with instant fulfillment</p>
              </div>
              <Link href="/pharmacies" className="text-xs font-black text-[#0F766E] hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                <span>View All ({medicines.length})</span>
                <ChevronRight size={14} className="shrink-0" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredMeds.slice(0, 12).map((med) => {
                const qty = getCartItemQty(med.id);
                const discount = med.discountPercent || 10;

                return (
                  <Link
                    key={med.id}
                    href={`/pharmacies/${med.id}`}
                    className="glass-card p-3 flex flex-col justify-between group relative cursor-pointer"
                  >
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-[#E11D48] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                        {discount}% OFF
                      </div>
                    )}

                    <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 mb-2.5 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 border border-white/60 shadow-2xs">
                      <img
                        src={med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'}
                        alt={med.brandName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('photo-1584308666744-24d5c474f2ae')) {
                            target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80';
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#0F766E] mb-1">
                      <Clock size={11} className="text-[#0F766E]" />
                      <span>10 MINS</span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-[#0F766E] transition-colors">
                        {med.brandName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">{med.strength || med.genericName}</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between gap-1">
                      <div>
                        <span className="font-black text-sm text-slate-900">₹{med.price}</span>
                        {med.mrp && (
                          <span className="text-[10px] text-slate-400 line-through block -mt-1">₹{med.mrp}</span>
                        )}
                      </div>

                      <div onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                        {qty === 0 ? (
                          <button
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(med, e);
                            }}
                            className="px-3 py-1 rounded-lg border border-[#0F766E] bg-white/90 text-[#0F766E] text-xs font-black hover:bg-[#0F766E] hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            ADD
                          </button>
                        ) : (
                          <div className="flex items-center bg-[#0F766E] text-white rounded-lg p-0.5 shadow-xs">
                            <button
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDecrement(med.id, e);
                              }}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded font-bold cursor-pointer"
                            >
                              <Minus size={12} className="text-white" />
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
                              <Plus size={12} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full-Size Product Detail Screen with Generic Substitutes & Offers */}
        <ProductDetailSheet
          medicine={selectedMedicineForDetail}
          allMedicines={medicines}
          onClose={() => setSelectedMedicineForDetail(null)}
        />

        {/* Interactive Location Selector Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentAddress={deliveryAddress}
          onSelectAddress={(addr) => setDeliveryAddress(addr)}
        />
      </div>
    );
  }

  /* =========================================================================
   * 2. DOCTORS MODE COCKPIT (DOCTOR DISCOVERY, HOSPITALS, CLINICS & OPD QUEUES)
   * ========================================================================= */
  if (appMode === 'doctors') {
    return (
      <div className="min-h-screen pb-28 text-slate-900 select-none">
        {/* TOP GREETING HEADER FOR DOCTORS (#026dd9 ROYAL BLUE THEME) */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#01478f] via-[#025bb5] to-[#026dd9] text-white pt-3.5 pb-5 px-4 shadow-[0_10px_30px_rgba(2,109,217,0.18)] border-b border-blue-400/30 lg:hidden">
          {/* Ambient lighting accents */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-sky-300/25 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-5xl mx-auto space-y-3.5 relative z-10">
            {/* Top Row: User Greeting & Actions */}
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <img
                  src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Profile Avatar"
                  className="w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] rounded-xl object-cover border border-white/40 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-sm font-black text-white leading-tight whitespace-nowrap truncate">
                    Hi, {profile?.firstName || 'Arjun'}!
                  </h1>
                  <p className="text-[9px] sm:text-[10px] text-blue-100 font-medium truncate max-w-[85px] sm:max-w-none leading-tight">Good Morning • Top Doctors</p>
                </div>
              </div>

              {/* Actions: Location + Wishlist + Notification Bell */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-1.5 sm:px-2 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <MapPin size={11} className="text-[#93c5fd] shrink-0 sm:w-3 sm:h-3" />
                  <span className="max-w-[55px] sm:max-w-[110px] truncate">New Delhi</span>
                </button>

                {/* Wishlist Link for Doctors */}
                <Link
                  href="/wishlist?tab=doctors"
                  aria-label="Doctor Wishlist"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                  title="Saved Doctors Wishlist"
                >
                  <Heart size={14} className={wishlistDoctorIds.length > 0 ? "fill-white text-white sm:w-4 sm:h-4" : "text-white sm:w-4 sm:h-4"} />
                  {wishlistDoctorIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                      {wishlistDoctorIds.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/inbox"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Bell size={14} className="sm:w-4 sm:h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E11D48] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Doctor & Hospital Search Bar */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder='Search "Cardiologist", "Apollo Hospital", "Dr. Roy", "Clinic"...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 glass-input text-slate-900 rounded-2xl text-xs sm:text-sm font-medium placeholder:text-slate-400 shadow-sm focus:outline-none"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 p-1 text-slate-400">
                    <X size={15} />
                  </button>
                ) : (
                  <Mic className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                )}
              </div>
            </div>

            {/* HORIZONTAL SPECIALTY CAROUSEL CHIPS */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
              <Link
                href="/doctors"
                className="px-3.5 py-1.5 rounded-xl bg-white text-[#026dd9] shadow-md border border-white hover:bg-blue-50 text-xs font-black whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                <Stethoscope size={13} />
                <span>Doctor & Diagnostic Directory</span>
              </Link>
              {DOCTOR_SPECIALTIES.map(spec => (
                <Link
                  key={spec.id}
                  href={`/doctors?specialty=${spec.id}`}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-2xs"
                >
                  <span>{spec.icon}</span>
                  <span>{spec.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-8">
          {/* TOP HOSPITALS & MULTI-DOCTOR SHOWCASE CAROUSEL */}
          <TopDoctorCarousel
            doctors={doctors}
            hospitals={hospitals}
            title="Top Hospitals & Specialist Doctors"
            autoPlayInterval={18000}
          />

          {/* LIVE OPD QUEUE / UPCOMING APPOINTMENT BANNER (COMPACT CONSTRAINED) */}
          {upcomingAppointment && (
            <div className="max-w-xl p-3.5 sm:p-4 rounded-3xl bg-blue-50/90 dark:bg-blue-950/40 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(2,109,217,0.06)]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#026dd9] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[0_4px_12px_rgba(2,109,217,0.3)]">
                  #{upcomingAppointment.tokenNumber || '12'}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-[#026dd9] uppercase tracking-wider block">
                    Active Consultation Queue
                  </span>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                    {upcomingAppointment.doctorName} • {upcomingAppointment.doctorSpecialty || 'Specialist'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    {upcomingAppointment.dateTime} • {upcomingAppointment.hospitalName}
                  </p>
                </div>
              </div>

              <Button asChild size="sm" className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs shrink-0 px-4 h-9">
                <Link href="/appointments">Live Token</Link>
              </Button>
            </div>
          )}

          {/* 3-WAY CATEGORY HIERARCHY SELECTOR: [ ALL DOCTORS | BY HOSPITAL | BY CLINIC ] (COMPACT CONSTRAINED) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-50 leading-tight">
                  Choose By Category
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select doctors directly, or explore by hospital and clinic</p>
              </div>

              {/* Compact segmented control + Direct Directory Link */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/60 p-1 rounded-2xl max-w-md w-full sm:w-auto shadow-2xs">
                  <button
                    onClick={() => setDoctorCategoryType('all')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      doctorCategoryType === 'all'
                        ? 'bg-[#026dd9] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    🩺 Top Doctors
                  </button>

                  <button
                    onClick={() => setDoctorCategoryType('hospital')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      doctorCategoryType === 'hospital'
                        ? 'bg-[#026dd9] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    🏥 By Hospital
                  </button>

                  <button
                    onClick={() => setDoctorCategoryType('clinic')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      doctorCategoryType === 'clinic'
                        ? 'bg-[#026dd9] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    🏢 By Clinic
                  </button>
                </div>

                <Link
                  href="/doctors"
                  className="px-4 py-2 rounded-2xl text-xs font-black bg-[#026dd9] text-white hover:bg-[#0256ab] shadow-sm flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                >
                  <Stethoscope size={13} />
                  <span>Full Directory →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* CATEGORY VIEW 1: BY HOSPITAL (HOSPITAL -> DOCTOR) */}
          {doctorCategoryType === 'hospital' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hospitals.map(hosp => (
                  <div
                    key={hosp.id}
                    className="glass-card p-4 flex flex-col justify-between"
                  >
                    <div>
                      <img
                        src={hosp.imageUrl}
                        alt={hosp.name}
                        className="w-full h-24 rounded-2xl object-cover mb-2.5 border border-white/60 shadow-2xs"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-[#026dd9] bg-blue-50/90 px-2 py-0.5 rounded-md border border-blue-100">
                          {hosp.type}
                        </span>
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                          <Star size={11} fill="currentColor" /> {hosp.rating}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{hosp.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{hosp.address}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center gap-2">
                      <a
                        href={`tel:${hosp.phone || '07582-236200'}`}
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs active:scale-95 transition-all shrink-0 cursor-pointer"
                        title={`Call Hospital: ${hosp.phone || '07582-236200'}`}
                      >
                        <Phone size={13} className="fill-emerald-600 text-emerald-600" />
                      </a>
                      <Button asChild className="flex-1 bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl h-8 shadow-xs">
                        <Link href={`/doctors?hospital=${encodeURIComponent(hosp.name)}`}>
                          Select Doctors
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY VIEW 2: BY CLINIC (CLINIC -> DOCTOR) */}
          {doctorCategoryType === 'clinic' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Yuva Skin Clinic', address: 'Dwarika Vihar Chowk near BMC, Tilli, Sagar', count: 'Dr. Pawan Gupta', icon: '🧴', docId: 'SAG-D-0029', phone: '07772820400' },
                  { name: 'Arihant Smile Care', address: 'Sugandha Bhavan, Jawahar Ganj, Sagar', count: 'Dr. Kanchi Jain', icon: '🦷', docId: 'SAG-D-0031', phone: '08359980412' },
                  { name: "Dr Patel's Gastro Digestive Care", address: 'Medical College Road, Tilli, Sagar', count: 'Dr. Rajesh Patel', icon: '🍃', docId: 'SAG-D-0032', phone: '07240969347' },
                  { name: 'Deepshree Health & Eye Clinic', address: 'Near Chaitanya Hospital, Gopal Ganj, Sagar', count: 'Dr. Anurag Jain', icon: '👁️', docId: 'SAG-D-0037', phone: '07987044304' },
                ].map((clinic, idx) => (
                  <div key={idx} className="glass-card p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-2xl flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
                        {clinic.icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{clinic.name}</h4>
                        <p className="text-xs text-[#026dd9] font-bold">{clinic.count}</p>
                        <p className="text-[11px] text-slate-400">{clinic.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${clinic.phone}`}
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
                        title={`Call clinic: ${clinic.phone}`}
                      >
                        <Phone size={13} className="fill-emerald-600 text-emerald-600" />
                      </a>
                      <Button asChild size="sm" className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs">
                        <Link href={`/doctors?book=${clinic.docId}`}>Book</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY VIEW 3: TOP DOCTORS LISTING (SINGLE LINE HORIZONTAL CAROUSEL) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                    Top Doctor
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-[#026dd9] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <Stethoscope size={11} />
                    <span>Verified OPD Specialists</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">Verified specialists available for instant OPD consultation</p>
              </div>

              {/* Carousel Navigation Controls + See All Link */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => scrollDoctors('left')}
                    aria-label="Previous Doctors"
                    className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => scrollDoctors('right')}
                    aria-label="Next Doctors"
                    className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                <Link href="/doctors" className="text-xs font-black text-[#026dd9] hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
                  <span>See all</span>
                  <ChevronRight size={14} className="shrink-0" />
                </Link>
              </div>
            </div>

            {/* SINGLE LINE CAROUSEL (Never wraps to second row) */}
            <div
              ref={doctorsScrollRef}
              className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scrollbar-none scroll-smooth pb-1"
            >
              {doctors.map(doc => (
                <div key={doc.id} className="w-[210px] min-[380px]:w-[230px] sm:w-[250px] md:w-[260px] shrink-0">
                  <DoctorPortraitCard
                    doctor={doc}
                    onSelect={(d) => {
                      window.location.href = `/doctors?book=${d.id}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* PROMOTIONAL CAROUSEL BANNER 1: PATHOLOGY HOME COLLECTION & DIGITAL REPORTS */}
          <PromoCarouselBanner initialSlide={0} />

          {/* DIAGNOSTIC VIEW 1: TOP CT SCANS */}
          <TopCTScansSection />

          {/* PROMOTIONAL CAROUSEL BANNER 2: OPD TOKENS & LIVE QUEUE TRACKING */}
          <PromoCarouselBanner initialSlide={1} />

          {/* DIAGNOSTIC VIEW 2: TOP PATHOLOGIES & LAB TESTS */}
          <TopPathologySection />

          {/* PROMOTIONAL CAROUSEL BANNER 3: 128-SLICE CT & DIGITAL X-RAY FAST-TRACK */}
          <PromoCarouselBanner initialSlide={2} />

          {/* DIAGNOSTIC VIEW 3: TOP DIGITAL X-RAYS */}
          <TopXRaysSection />

          {/* DIAGNOSTIC VIEW 4: COMPARE PRICES SECTION */}
          <ComparePricesSection />
        </div>

        {/* Interactive Location Selector Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentAddress={deliveryAddress}
          onSelectAddress={(addr) => setDeliveryAddress(addr)}
        />
      </div>
    );
  }

  /* =========================================================================
   * 3. CARE / HEALTH CARE MODE COCKPIT (PATIENT CLINICAL HUB & VITALS)
   * ========================================================================= */
  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      {/* TOP HEADER FOR HEALTH CARE (INVERTED RICH CORAL/ROSE GRADIENT THEME - MOBILE ONLY) */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#BE123C] via-[#F43F5E] to-[#FF5E62] text-white pt-3.5 pb-6 px-4 shadow-[0_10px_30px_rgba(244,63,94,0.2)] border-b border-white/20 lg:hidden">
        {/* Ambient lighting glows for depth */}
        <div className="absolute -top-12 -left-12 w-52 h-52 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
            {/* Top Row: User Identity & Actions */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-3.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 min-w-[36px] rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs shrink-0 font-black text-sm ring-2 ring-white/20">
                  {activePatientName.charAt(0)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h2 className="font-black text-xs sm:text-sm text-white whitespace-nowrap leading-tight drop-shadow-xs truncate">
                      {activePatientName}
                    </h2>
                    <span className="text-[9px] bg-white text-[#E11D48] font-black px-1.5 py-0.2 rounded-full shadow-xs uppercase tracking-wider shrink-0">
                      {activeMember ? activeMember.relationship : 'Self'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-rose-100 font-semibold mt-0.5 truncate max-w-[85px] sm:max-w-none">
                    <ShieldCheck size={11} className="text-emerald-200 shrink-0" />
                    <span className="tracking-wide opacity-95 truncate">ABHA: {activeAbhaId}</span>
                  </div>
                </div>
              </div>

              {/* Actions: Location + Wishlist + Notification Bell */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-1.5 sm:px-2 py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <MapPin size={11} className="text-rose-200 shrink-0 sm:w-3 sm:h-3" />
                  <span className="max-w-[55px] sm:max-w-[110px] truncate">New Delhi</span>
                </button>

                {/* Wishlist Link for Care */}
                <Link
                  href="/wishlist?tab=doctors"
                  aria-label="Saved Wishlist"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
                  title="Saved Wishlist"
                >
                  <Heart size={14} className={wishlistDoctorIds.length + wishlistMedicineIds.length > 0 ? "fill-white text-white sm:w-4 sm:h-4" : "text-white sm:w-4 sm:h-4"} />
                  {wishlistDoctorIds.length + wishlistMedicineIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-[#E11D48] text-[9px] font-black flex items-center justify-center shadow-xs">
                      {wishlistDoctorIds.length + wishlistMedicineIds.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/inbox"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Bell size={14} className="sm:w-4 sm:h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-[#E11D48] text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

          {/* FAMILY MEMBER QUICK SWITCHER CHIPS */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            <button
              onClick={() => setActiveProfileId('usr-101')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                activeProfileId === 'usr-101'
                  ? 'bg-white text-[#E11D48] shadow-md font-black ring-2 ring-white/30'
                  : 'bg-white/20 text-white hover:bg-white/30 border border-white/20 backdrop-blur-md'
              }`}
            >
              <span>👤 Arjun (Self)</span>
            </button>
            {familyMembers.map(fam => (
              <button
                key={fam.id}
                onClick={() => setActiveProfileId(fam.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${
                  activeProfileId === fam.id
                    ? 'bg-white text-[#E11D48] shadow-md font-black ring-2 ring-white/30'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/20 backdrop-blur-md'
                }`}
              >
                <span>{fam.fullName.split(' ')[0]} ({fam.relationship})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-8">
        {/* 1. CLINICAL IDENTITY & BIOLOGICAL VITAL STATS */}
        {/* 1. BIOLOGICAL HEALTH PROFILE */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider truncate min-w-0">
              Biological Health Profile
            </span>
            <Link href="/profile" className="text-xs font-bold text-[#ff645e] hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
              <span>Edit Details</span>
              <ChevronRight size={13} className="shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Blood Group */}
            <div className="p-3 rounded-2xl bg-rose-50/80 backdrop-blur-md border border-rose-200/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#ff645e] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Droplet size={18} />
              </div>
              <div>
                <span className="text-[10px] text-rose-700 font-bold block uppercase">Blood Group</span>
                <span className="font-black text-base text-rose-950">{activeBloodGroup}</span>
              </div>
            </div>

            {/* Age / Gender */}
            <div className="p-3 rounded-2xl bg-blue-50/80 backdrop-blur-md border border-blue-200/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Users size={18} />
              </div>
              <div>
                <span className="text-[10px] text-blue-700 font-bold block uppercase">Age & Gender</span>
                <span className="font-black text-xs text-blue-950">34 Yrs • {activeGender}</span>
              </div>
            </div>

            {/* Height & Weight (BMI) */}
            <div className="p-3 rounded-2xl bg-emerald-50/80 backdrop-blur-md border border-emerald-200/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Weight size={18} />
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 font-bold block uppercase">BMI (Normal)</span>
                <span className="font-black text-xs text-emerald-950">74 kg • 23.4 BMI</span>
              </div>
            </div>

            {/* ABHA QR */}
            <Link
              href="/emergency"
              className="p-3 rounded-2xl bg-rose-50/80 backdrop-blur-md border border-rose-200/80 flex items-center gap-2.5 hover:bg-rose-100/80 transition-colors shadow-2xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ff645e] text-white flex items-center justify-center shrink-0 shadow-xs">
                <QrCode size={18} />
              </div>
              <div>
                <span className="text-[10px] text-rose-800 font-bold block uppercase">Emergency Card</span>
                <span className="font-black text-xs text-rose-950">Scan QR Code</span>
              </div>
            </Link>
          </div>

          {/* Allergies & Chronic Conditions Tags */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allergies:</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50/90 text-amber-800 border border-amber-200 text-[10px] font-black">
              ⚠️ Penicillin (Severe)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 text-slate-700 text-[10px] font-bold">
              Dust / Pollen
            </span>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-2">Conditions:</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-50/90 text-[#ff645e] border border-rose-200 text-[10px] font-bold">
              Hypertension (Stage 1)
            </span>
          </div>
        </div>

        {/* 2. HEALTH VITALS MATRIX (LIVE SENSORS) */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1 gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                ❤️ Live Health Vitals
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate">Logged today via clinical sensors & smart monitors</p>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs h-7 rounded-xl border-slate-200 hover:border-[#ff645e] hover:text-[#ff645e] whitespace-nowrap shrink-0">
              <Link href="/records">+ Log Vitals</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', color: 'emerald' },
              { label: 'Blood Glucose', value: '96', unit: 'mg/dL (Fasting)', status: 'Optimal', color: 'emerald' },
              { label: 'Heart Rate', value: '72', unit: 'bpm (Resting)', status: 'Normal', color: 'rose' },
              { label: 'Blood Oxygen', value: '99%', unit: 'SpO2', status: 'Optimal', color: 'blue' },
            ].map((v, i) => (
              <div key={i} className="glass-card p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{v.label}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                    v.color === 'rose' ? 'bg-rose-50 text-[#ff645e]' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900">{v.value}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{v.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ACTIVE MEDICATION REGIMEN & DAILY PILL ADHERENCE */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1 gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                💊 Active Prescribed Medication Regimen
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate">Daily doses, remaining stock & instant 10-minute refill</p>
            </div>
            <Link href="/medicines" className="text-xs font-black text-[#ff645e] hover:underline flex items-center gap-0.5 whitespace-nowrap shrink-0">
              <span>View Regimen</span>
              <ChevronRight size={13} className="shrink-0" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {schedules.map((schedule) => {
              const isTaken = justTakenMap[schedule.id];
              const isLow = schedule.remainingQuantity <= schedule.refillThreshold;

              return (
                <div
                  key={schedule.id}
                  className="glass-card p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#ff645e] flex items-center justify-center shrink-0 border border-rose-100 shadow-2xs">
                      <Pill size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {schedule.medicineName}
                        </h4>
                        {isLow && (
                          <span className="text-[9px] font-black bg-rose-50 text-[#E11D48] px-1.5 py-0.2 rounded animate-pulse shrink-0">
                            {schedule.remainingQuantity} Left
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {schedule.dosage} • {schedule.timesOfDay?.join(', ') || '09:00 AM'} • {schedule.instructions || 'After food'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isLow && (
                      <Button asChild size="sm" className="h-7 text-[10px] font-black bg-rose-50 hover:bg-rose-100 text-[#ff645e] border border-rose-200 rounded-lg whitespace-nowrap shrink-0">
                        <Link href="/pharmacies">Refill</Link>
                      </Button>
                    )}

                    <Button
                      onClick={() => handleTakeDose(schedule.id)}
                      size="sm"
                      className={`h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isTaken
                          ? 'bg-[#ff645e] text-white shadow-xs'
                          : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {isTaken ? <Check size={13} /> : 'Take Dose'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. ENCRYPTED ABHA HEALTH RECORDS VAULT */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FolderHeart size={18} className="text-[#ff645e] shrink-0" />
              <h3 className="font-black text-sm text-slate-900 truncate">ABHA Encrypted Document Vault</h3>
            </div>
            <Link href="/records" className="text-xs font-bold text-[#ff645e] hover:underline whitespace-nowrap shrink-0">
              View All ({documents.length})
            </Link>
          </div>

          <div className="space-y-2">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={15} className="text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 truncate block">{doc.title}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{doc.category} • {doc.doctorOrLabName || 'Apollo Clinic'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                  ABHA Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. FAMILY CAREGIVER NETWORK */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/70 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#ff645e] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">Family Caregiver Hub ({familyMembers.length} Dependents)</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">Manage proxy consultations, ABHA consents and refills.</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-[#ff645e] hover:bg-[#e84f49] text-white font-black text-xs rounded-xl shrink-0 shadow-xs whitespace-nowrap">
            <Link href="/family">Care Hub</Link>
          </Button>
        </div>

        {/* Interactive Location Selector Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentAddress={deliveryAddress}
          onSelectAddress={(addr) => setDeliveryAddress(addr)}
        />

        {/* Product Detail Sheet Modal (Expansive Desktop E-Commerce Experience) */}
        <ProductDetailSheet
          medicine={selectedMedicineForDetail}
          isOpen={!!selectedMedicineForDetail}
          onClose={() => setSelectedMedicineForDetail(null)}
        />
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Stethoscope,
  Star,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  MapPin,
  Plus,
  XCircle,
  Video,
  Building2,
  ShieldCheck,
  Globe,
  User,
  Users,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Check,
  AlertCircle,
  PhoneCall,
  Phone,
  MessageSquare,
  Share2,
  Filter,
  SlidersHorizontal,
  X,
  Heart,
  Bed,
  Sparkles
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { AppointmentService } from '../../server/services/appointment.service';
import { Doctor, AppointmentSlot, FamilyMember, UserProfile, Hospital } from '../../types';
import { initialHospitals, initialDoctors } from '../../lib/mockData';
import DoctorReviewSection from '@/components/doctors/DoctorReviewSection';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

// --- SUBCATEGORY DEFINITIONS ---
const SPECIALTY_SUB_CATEGORIES = [
  {
    id: 'all',
    name: 'All Specialists',
    shortName: 'All',
    icon: '🩺',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'All Top Verified Medical Specialists',
    bannerSubtitle: 'Browse senior consultants, surgeons, and specialists across all disciplines.'
  },
  {
    id: 'cardiology',
    name: 'Cardiology (Heart Care)',
    shortName: 'Cardio',
    icon: '❤️',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Cardiologists & Heart Specialists',
    bannerSubtitle: 'Consult certified cardiologists for ECG, ECHO, hypertension, and heart care.'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics (Child Health)',
    shortName: 'Pediatrics',
    icon: '👶',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Pediatricians & Child Specialists',
    bannerSubtitle: 'Gentle and trusted pediatric care, immunizations, and child wellness.'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics (Bone & Joint)',
    shortName: 'Ortho',
    icon: '🦴',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Orthopedic & Joint Replacement Surgeons',
    bannerSubtitle: 'Specialists in robotic joint replacements, fractures, sports injuries, and arthritis.'
  },
  {
    id: 'neurology',
    name: 'Neurology (Brain & Spine)',
    shortName: 'Neurology',
    icon: '🧠',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Neurologists & Neurosurgeons',
    bannerSubtitle: 'Expert consultations for headaches, nerve disorders, stroke, and spine care.'
  },
  {
    id: 'gynecology',
    name: "Gynecology & Women's Health",
    shortName: 'Gynecology',
    icon: '🤰',
    image: 'https://images.unsplash.com/photo-1594824813620-21f45610a26d?w=300&auto=format&fit=crop&q=80',
    bannerTitle: "Gynecologists & Obstetricians",
    bannerSubtitle: "Specialized care in pregnancy, PCOD management, laparoscopic surgery, and fertility."
  },
  {
    id: 'dental care',
    name: 'Dental & Maxillofacial',
    shortName: 'Dental',
    icon: '🦷',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Dental Surgeons & Orthodontists',
    bannerSubtitle: 'Advanced root canals, titanium dental implants, invisible aligners, and cosmetic dentistry.'
  },
  {
    id: 'dermatology',
    name: 'Dermatology (Skin & Hair)',
    shortName: 'Skin & Hair',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Dermatologists & Cosmetologists',
    bannerSubtitle: 'Clinical dermatology, acne treatment, laser therapies, and hair restoration.'
  },
  {
    id: 'endocrinology',
    name: 'Endocrinology & Diabetes',
    shortName: 'Diabetes',
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300&auto=format&fit=crop&q=80',
    bannerTitle: 'Endocrinologists & Diabetologists',
    bannerSubtitle: 'Metabolic disorder management, insulin regulation, thyroid care, and hormonal health.'
  }
];

const CLINIC_AREA_CATEGORIES = [
  {
    id: 'all',
    name: 'All Clinic Areas',
    shortName: 'All Areas',
    icon: '📍',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
    areaTag: '',
    bannerTitle: 'Verified Outpatient Clinics Across All Areas',
    bannerSubtitle: 'Find private clinics, polyclinics, and neighborhood health studios near you.'
  },
  {
    id: 'sagar',
    name: 'Khurai Road, Sagar (MP)',
    shortName: 'Sagar, MP',
    icon: '📍',
    image: '/images/hospitals/bhagyodaya-tirth.jpg',
    areaTag: 'sagar',
    bannerTitle: 'Clinics & OPDs in Sagar, Madhya Pradesh',
    bannerSubtitle: 'Accessible charitable health centers, specialized OPDs, and research facilities.'
  },
  {
    id: 'green_park',
    name: 'Green Park & South Extension',
    shortName: 'Green Park',
    icon: '📍',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&auto=format&fit=crop&q=80',
    areaTag: 'green park',
    bannerTitle: 'Clinics in Green Park & South Extension, Delhi',
    bannerSubtitle: 'Top private specialist clinics with instant token queues and direct walk-ins.'
  },
  {
    id: 'saket',
    name: 'Saket & Press Enclave',
    shortName: 'Saket',
    icon: '📍',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300&auto=format&fit=crop&q=80',
    areaTag: 'saket',
    bannerTitle: 'Clinics & Consultation Suites in Saket',
    bannerSubtitle: 'Modern surgical suites, diagnostic hubs, and specialty clinics.'
  },
  {
    id: 'gurugram',
    name: 'Sector 44, Gurugram (NCR)',
    shortName: 'Gurugram',
    icon: '📍',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
    areaTag: 'gurugram',
    bannerTitle: 'Health Institutes & Clinics in Gurugram',
    bannerSubtitle: 'Comprehensive multi-specialty OPDs with verified doctors.'
  },
  {
    id: 'sarita_vihar',
    name: 'Sarita Vihar / Mathura Rd',
    shortName: 'Sarita Vihar',
    icon: '📍',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&auto=format&fit=crop&q=80',
    areaTag: 'sarita vihar',
    bannerTitle: 'OPD Clinics in Sarita Vihar & South-East Delhi',
    bannerSubtitle: '24/7 emergency centers and specialty consultations.'
  },
  {
    id: 'indiranagar',
    name: 'Indiranagar & Central',
    shortName: 'Indiranagar',
    icon: '📍',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop&q=80',
    areaTag: 'indiranagar',
    bannerTitle: 'Mother & Child Clinics in Indiranagar',
    bannerSubtitle: 'Pediatric care and family health centers.'
  }
];

function DoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});

  // 3 Primary Modes for Doctors Discovery: 'specialty' | 'hospital' | 'clinic'
  const [activeMode, setActiveMode] = useState<'specialty' | 'hospital' | 'clinic'>('specialty');

  // Subcategory Selections
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('all');
  const [selectedClinicArea, setSelectedClinicArea] = useState<string>('all');

  // Secondary Quick Filters
  const [quickFilter, setQuickFilter] = useState<'all' | 'high_rated' | 'video' | 'in_person' | 'budget'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected doctor for detailed profile & appointment booking
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState('usr-101');
  const [consultType, setConsultType] = useState<'in_person' | 'video_teleconsult'>('in_person');
  const [selectedDate, setSelectedDate] = useState('2026-08-30');
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('09:30 AM');
  const [symptoms, setSymptoms] = useState('');
  const [bookingSuccessApt, setBookingSuccessApt] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    let docs = typeof window !== 'undefined' ? AarogyaStorage.getDoctors() : initialDoctors;
    if (!docs || docs.length === 0) docs = initialDoctors;
    const hosps = initialHospitals;
    const usr = AarogyaStorage.getUserProfile();
    const fam = AarogyaStorage.getFamilyMembers();
    const favs = AarogyaStorage.getWishlistDoctors();

    setDoctors(docs);
    setHospitals(hosps);
    setProfile(usr);
    setFamilyMembers(fam);

    const favMap: { [id: string]: boolean } = {};
    favs.forEach(id => {
      favMap[id] = true;
    });
    setFavorites(favMap);

    // Check if ?book=doc-id was passed in URL
    const bookId = searchParams.get('book');
    if (bookId) {
      const allD = docs.length > 0 ? docs : initialDoctors;
      const found = allD.find(d => d.id === bookId);
      if (found) setSelectedDoctor(found);
    }

    const spec = searchParams.get('specialty');
    if (spec) {
      setActiveMode('specialty');
      setSelectedSpecialty(spec);
    }

    const hosp = searchParams.get('hospital');
    if (hosp) {
      setActiveMode('hospital');
      setSelectedHospitalId(hosp);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('storage-update', handleUpdate);
    return () => window.removeEventListener('storage-update', handleUpdate);
  }, [searchParams]);

  // Load available slots dynamically whenever selected doctor or date changes
  useEffect(() => {
    if (selectedDoctor) {
      AppointmentService.getAvailableSlots(selectedDoctor.id, selectedDate)
        .then(slots => {
          setAvailableSlots(slots);
          const firstOpen = slots.find(s => s.isAvailable);
          if (firstOpen) setSelectedSlot(firstOpen.time);
        })
        .catch(console.error);
    }
  }, [selectedDoctor, selectedDate]);

  // Generate 7-day interactive calendar pills
  const bookingDates = useMemo(() => {
    const dates = [];
    const base = new Date('2026-08-30T00:00:00');
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tom' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ iso, dayName, dayNum, monthName });
    }
    return dates;
  }, []);

  const toggleFavorite = (docId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistDoctor(docId);
    setFavorites(prev => ({ ...prev, [docId]: updated.includes(docId) }));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor) return;
    setBookingError(null);
    setIsSubmitting(true);

    try {
      const patientName = selectedPatientId === 'usr-101'
        ? `${profile?.firstName || 'Arjun'} ${profile?.lastName || 'Sharma'}`
        : (familyMembers.find(f => f.id === selectedPatientId)?.fullName || 'Family Member');

      const apt = await AppointmentService.bookAppointment({
        doctorId: selectedDoctor.id,
        patientProfileId: selectedPatientId,
        patientName,
        date: selectedDate,
        timeSlot: selectedSlot,
        type: consultType,
        symptoms: symptoms || 'General Medical Consultation',
        consultationFee: selectedDoctor.consultationFee,
      });

      setBookingSuccessApt(apt);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book appointment. Please select another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Doctors Calculation based on Active Mode & Selected Subcategory
  const filteredDoctors = useMemo(() => {
    let list = doctors;

    // 1. Text Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.clinicAddress.toLowerCase().includes(q) ||
        (d.qualification && d.qualification.toLowerCase().includes(q))
      );
    }

    // 2. Mode-Based Subcategory Filter
    if (activeMode === 'specialty') {
      if (selectedSpecialty !== 'all') {
        list = list.filter(d => d.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      }
    } else if (activeMode === 'hospital') {
      if (selectedHospitalId !== 'all') {
        const activeHosp = hospitals.find(h => h.id === selectedHospitalId);
        if (activeHosp) {
          const hospName = activeHosp.name.toLowerCase().trim();
          list = list.filter(d => {
            if (d.hospitalId && d.hospitalId === activeHosp.id) return true;
            const docHosp = (d.hospitalName || '').toLowerCase().trim();
            return docHosp.includes(hospName) || hospName.includes(docHosp);
          });
        }
      }
    } else if (activeMode === 'clinic') {
      if (selectedClinicArea !== 'all') {
        const activeAreaObj = CLINIC_AREA_CATEGORIES.find(c => c.id === selectedClinicArea);
        if (activeAreaObj && activeAreaObj.areaTag) {
          const tag = activeAreaObj.areaTag.toLowerCase();
          list = list.filter(d =>
            d.clinicAddress.toLowerCase().includes(tag) ||
            d.hospitalName.toLowerCase().includes(tag)
          );
        }
      }
    }

    // 3. Quick Filter Pills
    if (quickFilter === 'high_rated') {
      list = list.filter(d => (d.ratingAverage || 0) >= 4.9);
    } else if (quickFilter === 'video') {
      list = list.filter(d => d.consultationTypes?.includes('video_teleconsult'));
    } else if (quickFilter === 'in_person') {
      list = list.filter(d => d.consultationTypes?.includes('in_person'));
    } else if (quickFilter === 'budget') {
      list = list.filter(d => d.consultationFee <= 600);
    }

    return list;
  }, [doctors, hospitals, searchQuery, activeMode, selectedSpecialty, selectedHospitalId, selectedClinicArea, quickFilter]);

  // Active Category Banner Details
  const activeBannerDetails = useMemo(() => {
    if (activeMode === 'specialty') {
      const obj = SPECIALTY_SUB_CATEGORIES.find(s => s.id === selectedSpecialty) || SPECIALTY_SUB_CATEGORIES[0];
      return {
        title: obj.bannerTitle,
        subtitle: obj.bannerSubtitle,
        badge: `${filteredDoctors.length} Specialists Available`
      };
    } else if (activeMode === 'hospital') {
      if (selectedHospitalId === 'all') {
        return {
          title: 'All Accredited Hospitals & Medical Centers',
          subtitle: 'Choose a partner hospital from the side list to view dedicated departments and specialists.',
          badge: `${hospitals.length} Hospitals Partnered`
        };
      }
      const hosp = hospitals.find(h => h.id === selectedHospitalId);
      return {
        title: hosp ? hosp.name : 'Hospital Specialists',
        subtitle: hosp ? `${hosp.type} • ${hosp.address}, ${hosp.city} • ${hosp.totalBeds} Beds • ${hosp.icuBedsAvailable} ICU Beds` : 'Verified hospital specialists.',
        badge: `${filteredDoctors.length} Doctors on Duty`
      };
    } else {
      const area = CLINIC_AREA_CATEGORIES.find(a => a.id === selectedClinicArea) || CLINIC_AREA_CATEGORIES[0];
      return {
        title: area.bannerTitle,
        subtitle: area.bannerSubtitle,
        badge: `${filteredDoctors.length} Clinics & Doctors Listed`
      };
    }
  }, [activeMode, selectedSpecialty, selectedHospitalId, selectedClinicArea, filteredDoctors.length, hospitals]);

  /* =========================================================================
   * 1. FULL-SCREEN DOCTOR PROFILE & BOOKING SCREEN
   * ========================================================================= */
  if (selectedDoctor) {
    if (bookingSuccessApt) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] pb-28 text-slate-900 select-none">
          {/* Top Bar with Back Button */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => {
                setBookingSuccessApt(null);
                setSelectedDoctor(null);
              }}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors border border-slate-200 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-sm font-black text-slate-900">Token Allocated</h1>
            <div className="w-9" />
          </header>

          <div className="max-w-lg mx-auto p-4 space-y-4">
            {/* Token Success Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#01478f] via-[#025bb5] to-[#026dd9] text-white text-center shadow-lg relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 size={36} className="text-[#93c5fd]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#93c5fd] bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Confirmed Consultation
              </span>
              <h2 className="text-2xl font-black">Token #{bookingSuccessApt.tokenNumber || '14'}</h2>
              <p className="text-xs text-blue-100 font-medium mt-1">
                Estimated Queue Wait Time: <strong>~15 Mins</strong>
              </p>

              <div className="mt-5 pt-4 border-t border-white/15 text-left text-xs space-y-1.5 bg-black/10 p-3 rounded-2xl">
                <div className="flex justify-between">
                  <span className="text-blue-200">Doctor:</span>
                  <span className="font-bold">{bookingSuccessApt.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Schedule:</span>
                  <span className="font-bold">{bookingSuccessApt.dateTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Type:</span>
                  <span className="font-bold capitalize">{bookingSuccessApt.type.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Hospital/Clinic:</span>
                  <span className="font-bold truncate max-w-[200px]">{bookingSuccessApt.hospitalName}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <Button asChild className="w-full h-12 bg-[#026dd9] hover:bg-[#0256ab] text-white font-black text-sm rounded-2xl shadow-md cursor-pointer">
                <Link href="/appointments">View Live Token Queue</Link>
              </Button>
              <Button
                onClick={() => {
                  setBookingSuccessApt(null);
                  setSelectedDoctor(null);
                }}
                variant="outline"
                className="w-full h-12 rounded-2xl border-slate-200 text-xs font-bold cursor-pointer"
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-32 text-slate-900 select-none">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
          {/* Top Breadcrumb & Back Action Bar */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-black text-xs transition-all border border-slate-200 shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
              <span>Back to Directory</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 hidden sm:inline">Booking Appointment with</span>
              <span className="text-xs font-black text-[#026dd9] bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                {selectedDoctor.name}
              </span>
            </div>
          </div>

          {/* DUAL-COLUMN DESKTOP BOOKING EXPERIENCE */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
            {/* Left 5 Columns: Doctor Portrait, Credentials, Clinic Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-sm">
                    <img src={selectedDoctor.avatarUrl} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="inline-flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        <Star size={12} fill="#D97706" />
                        <span>{selectedDoctor.ratingAverage}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">({selectedDoctor.ratingCount} reviews)</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">{selectedDoctor.name}</h2>
                    <p className="text-xs font-bold text-[#026dd9]">{selectedDoctor.specialization}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{selectedDoctor.qualification}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Experience</span>
                    <span className="text-xs font-black text-slate-900">{selectedDoctor.experienceYears}+ Yrs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Patients</span>
                    <span className="text-xs font-black text-slate-900">{selectedDoctor.patientCount || '5.2k+'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">OPD Fee</span>
                    <span className="text-xs font-black text-emerald-700">₹{selectedDoctor.consultationFee}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <Building2 size={15} className="text-[#026dd9] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">{selectedDoctor.hospitalName}</strong>
                      <span className="text-[11px] text-slate-500">{selectedDoctor.clinicAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Call Button on Doctor Profile */}
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${selectedDoctor.phone || '07582-472000'}`}
                    className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Phone size={15} className="fill-current" />
                    <span>Call Directly: {selectedDoctor.phone || '07582-472000'}</span>
                  </a>
                </div>
              </div>

              {/* Patient Ratings, Amazon-style Breakdown & AI Review Summary */}
              <DoctorReviewSection doctor={selectedDoctor} />
            </div>

            {/* Right 7 Columns: Slot Selection, Date & Confirmation */}
            <div className="lg:col-span-7 space-y-5">
              {/* Consultation Type Selector */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-5 space-y-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  1. Consultation Mode
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConsultType('in_person')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      consultType === 'in_person'
                        ? 'bg-blue-50/80 border-[#026dd9] text-[#026dd9] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Building2 size={18} />
                      {consultType === 'in_person' && <Check size={16} />}
                    </div>
                    <h4 className="font-extrabold text-xs">In-Person OPD Clinic</h4>
                    <p className="text-[10px] opacity-75">Walk-in with live token</p>
                  </button>

                  <button
                    onClick={() => setConsultType('video_teleconsult')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      consultType === 'video_teleconsult'
                        ? 'bg-blue-50/80 border-[#026dd9] text-[#026dd9] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Video size={18} />
                      {consultType === 'video_teleconsult' && <Check size={16} />}
                    </div>
                    <h4 className="font-extrabold text-xs">Video Teleconsult</h4>
                    <p className="text-[10px] opacity-75">Consult from home</p>
                  </button>
                </div>
              </div>

              {/* Date Selector */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-5 space-y-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  2. Select Consultation Date
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {bookingDates.map(d => (
                    <button
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`min-w-[70px] py-2.5 px-2 rounded-2xl text-center transition-all border shrink-0 cursor-pointer ${
                        selectedDate === d.iso
                          ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-md'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">{d.dayName}</span>
                      <span className="text-base font-black block mt-0.5">{d.dayNum}</span>
                      <span className="text-[9px] block opacity-75">{d.monthName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Grid */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-5 space-y-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  3. Available Time Slots ({availableSlots.filter(s => s.isAvailable).length} Available)
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.time}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all border flex items-center justify-center cursor-pointer ${
                        !slot.isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                          : selectedSlot === slot.time
                          ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-md'
                          : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Selector */}
              <div className="rounded-3xl bg-white border border-slate-200/90 shadow-md p-5 space-y-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  4. Patient Profile
                </span>
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setSelectedPatientId('usr-101')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedPatientId === 'usr-101'
                        ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    👤 Arjun (Self)
                  </button>
                  {familyMembers.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedPatientId(f.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                        selectedPatientId === f.id
                          ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      👥 {f.fullName.split(' ')[0]} ({f.relationship})
                    </button>
                  ))}
                </div>
              </div>

              {bookingError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold">
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Booking CTA Banner */}
              <div className="p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-200/90 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 shadow-md">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Consultation Fee</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">₹{selectedDoctor.consultationFee}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      ✓ Instant Token Generation
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 h-12 bg-[#026dd9] hover:bg-[#0256ab] text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 cursor-pointer shrink-0"
                >
                  {isSubmitting ? 'Allocating OPD Token...' : 'Confirm Appointment & Get Token'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * 2. MAIN DOCTORS E-COMMERCE STOREFRONT WITH DYNAMIC LEFT RAIL
   * ========================================================================= */
  return (
    <div className="min-h-screen pb-32 text-slate-900 select-none bg-[#F8FAFC]">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 space-y-2">
          {/* Top Bar: Title + Search + My Queue button */}
          <div className="flex items-center justify-between gap-2.5">
            <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 sm:hidden shrink-0">
              <ChevronLeft size={18} />
            </Link>

            {/* Search Box */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, hospital, or clinic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl text-xs font-medium placeholder:text-slate-400 border border-transparent focus:border-[#026dd9] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* My Queue Live Tokens Button */}
            <Button asChild size="sm" className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs shrink-0">
              <Link href="/appointments" className="flex items-center gap-1.5">
                <Clock size={13} />
                <span className="hidden sm:inline">My Queue Tokens</span>
                <span className="sm:hidden">Tokens</span>
              </Link>
            </Button>
          </div>

          {/* 3-WAY PRIMARY MODE TABS: [ 🩺 BY SPECIALTY | 🏥 BY HOSPITAL | 📍 BY CLINIC / AREA ] */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              <button
                onClick={() => {
                  setActiveMode('specialty');
                  setSelectedSpecialty('all');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeMode === 'specialty'
                    ? 'bg-[#026dd9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🩺</span>
                <span>By Specialty</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('hospital');
                  setSelectedHospitalId('all');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeMode === 'hospital'
                    ? 'bg-[#026dd9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>🏥</span>
                <span>By Hospital</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('clinic');
                  setSelectedClinicArea('all');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeMode === 'clinic'
                    ? 'bg-[#026dd9] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>📍</span>
                <span>By Clinic & Area</span>
              </button>
            </div>

            {/* Result count */}
            <span className="text-[11px] font-bold text-slate-400 hidden md:inline shrink-0">
              Showing {filteredDoctors.length} doctors
            </span>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5 text-[11px]">
            <button
              onClick={() => setQuickFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                quickFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Picks
            </button>
            <button
              onClick={() => setQuickFilter('high_rated')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                quickFilter === 'high_rated'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ⭐ 4.9+ Rated
            </button>
            <button
              onClick={() => setQuickFilter('video')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                quickFilter === 'video'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              📹 Video Teleconsult
            </button>
            <button
              onClick={() => setQuickFilter('in_person')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                quickFilter === 'in_person'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              🏥 In-Person OPD
            </button>
            <button
              onClick={() => setQuickFilter('budget')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                quickFilter === 'budget'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ₹ Under ₹600
            </button>
          </div>
        </div>
      </header>

      {/* 2. DUAL-COLUMN LAYOUT: DYNAMIC LEFT CATEGORY RAIL + RIGHT DOCTOR STOREFRONT */}
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-10 flex items-start">
        {/* Left Vertical Category Rail (Identical E-Commerce UX to Pharmacy Sector) */}
        <aside
          className="w-[88px] sm:w-[110px] md:w-[125px] shrink-0 bg-white border-r border-slate-200/80 sticky top-[138px] max-h-[calc(100vh-138px)] overflow-y-auto no-scrollbar scrollbar-none overscroll-contain touch-pan-y py-2 scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          <div className="flex flex-col space-y-1 pb-36">
            {/* SUB-MENU 1: SPECIALTIES */}
            {activeMode === 'specialty' &&
              SPECIALTY_SUB_CATEGORIES.map(spec => {
                const isSelected = selectedSpecialty === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpecialty(spec.id);
                      setSearchQuery('');
                    }}
                    className={`w-full py-2.5 px-1 flex flex-col items-center justify-center text-center relative transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 text-[#026dd9] font-black'
                        : 'text-slate-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isSelected && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#026dd9] rounded-r" />}

                    {/* Squircle Image Card */}
                    <div
                      className={`w-12 h-12 rounded-2xl overflow-hidden mb-1.5 p-0.5 border flex items-center justify-center transition-transform ${
                        isSelected ? 'border-[#026dd9] shadow-2xs scale-105 bg-white' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <img src={spec.image} alt={spec.name} className="w-full h-full object-cover rounded-xl" />
                    </div>

                    <span className="text-[10px] leading-tight line-clamp-2 px-0.5 font-bold">
                      {spec.shortName}
                    </span>
                  </button>
                );
              })}

            {/* SUB-MENU 2: HOSPITALS */}
            {activeMode === 'hospital' && (
              <>
                <button
                  onClick={() => {
                    setSelectedHospitalId('all');
                    setSearchQuery('');
                  }}
                  className={`w-full py-2.5 px-1 flex flex-col items-center justify-center text-center relative transition-all active:scale-95 cursor-pointer ${
                    selectedHospitalId === 'all'
                      ? 'bg-blue-50/80 text-[#026dd9] font-black'
                      : 'text-slate-600 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  {selectedHospitalId === 'all' && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#026dd9] rounded-r" />}
                  <div
                    className={`w-12 h-12 rounded-2xl overflow-hidden mb-1.5 p-0.5 border flex items-center justify-center transition-transform ${
                      selectedHospitalId === 'all' ? 'border-[#026dd9] shadow-2xs scale-105 bg-white' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&auto=format&fit=crop&q=80"
                      alt="All Hospitals"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="text-[10px] leading-tight line-clamp-2 px-0.5 font-bold">All Hospitals</span>
                </button>

                {hospitals.map(hosp => {
                  const isSelected = selectedHospitalId === hosp.id;
                  return (
                    <button
                      key={hosp.id}
                      onClick={() => {
                        setSelectedHospitalId(hosp.id);
                        setSearchQuery('');
                      }}
                      className={`w-full py-2.5 px-1 flex flex-col items-center justify-center text-center relative transition-all active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 text-[#026dd9] font-black'
                          : 'text-slate-600 hover:bg-slate-50 font-semibold'
                      }`}
                    >
                      {isSelected && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#026dd9] rounded-r" />}

                      <div
                        className={`w-12 h-12 rounded-2xl overflow-hidden mb-1.5 p-0.5 border flex items-center justify-center transition-transform ${
                          isSelected ? 'border-[#026dd9] shadow-2xs scale-105 bg-white' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <img
                          src={hosp.imageUrl || '/images/hospitals/bhagyodaya-tirth.jpg'}
                          alt={hosp.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      <span className="text-[10px] leading-tight line-clamp-2 px-0.5 font-bold">
                        {hosp.name.split(' ')[0]} {hosp.name.split(' ')[1] || ''}
                      </span>
                    </button>
                  );
                })}
              </>
            )}

            {/* SUB-MENU 3: CLINICS & AREAS */}
            {activeMode === 'clinic' &&
              CLINIC_AREA_CATEGORIES.map(area => {
                const isSelected = selectedClinicArea === area.id;
                return (
                  <button
                    key={area.id}
                    onClick={() => {
                      setSelectedClinicArea(area.id);
                      setSearchQuery('');
                    }}
                    className={`w-full py-2.5 px-1 flex flex-col items-center justify-center text-center relative transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 text-[#026dd9] font-black'
                        : 'text-slate-600 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    {isSelected && <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#026dd9] rounded-r" />}

                    <div
                      className={`w-12 h-12 rounded-2xl overflow-hidden mb-1.5 p-0.5 border flex items-center justify-center transition-transform ${
                        isSelected ? 'border-[#026dd9] shadow-2xs scale-105 bg-white' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <img src={area.image} alt={area.name} className="w-full h-full object-cover rounded-xl" />
                    </div>

                    <span className="text-[10px] leading-tight line-clamp-2 px-0.5 font-bold">
                      {area.shortName}
                    </span>
                  </button>
                );
              })}
          </div>
        </aside>

        {/* Right Main Content Area: Banner + Doctor Cards Grid */}
        <main className="flex-1 min-w-0 p-2.5 sm:p-4 lg:p-6 space-y-4">
          {/* Header Banner for Selected Category / Hospital / Clinic */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200/80 flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-[#026dd9] text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                  {activeMode === 'specialty' ? 'Specialty Filter' : activeMode === 'hospital' ? 'Hospital Filter' : 'Area Filter'}
                </span>
                <span className="text-[11px] font-black text-[#026dd9]">{activeBannerDetails.badge}</span>
              </div>
              <h2 className="text-sm sm:text-lg font-black text-slate-900 leading-tight">
                {activeBannerDetails.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 font-medium leading-snug">
                {activeBannerDetails.subtitle}
              </p>
            </div>

            <div className="shrink-0 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-black text-[#026dd9] flex items-center gap-1.5 shadow-2xs hidden sm:flex">
              <ShieldCheck size={14} />
              <span>Verified OPD</span>
            </div>
          </div>

          {/* DOCTOR CARDS GRID */}
          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-2xs space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Doctors Found</h3>
              <p className="text-xs text-slate-500">
                Try switching the side category filter or clearing your search.
              </p>
              <Button
                onClick={() => {
                  setSelectedSpecialty('all');
                  setSelectedHospitalId('all');
                  setSelectedClinicArea('all');
                  setSearchQuery('');
                  setQuickFilter('all');
                }}
                className="bg-[#026dd9] text-white text-xs font-bold rounded-xl mt-2"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredDoctors.map(doc => {
                const isFav = !!favorites[doc.id];

                return (
                  <div
                    key={doc.id}
                    className="bg-white/85 hover:bg-white/95 backdrop-blur-2xl h-[345px] rounded-3xl border border-white/70 hover:border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_40px_rgba(2,109,217,0.2)] transition-all p-3 flex flex-col justify-between group relative"
                  >
                    {/* Fixed Tall Uniform Image Placeholder Container */}
                    <div className="relative w-full h-[195px] min-h-[195px] max-h-[195px] rounded-2xl bg-slate-100/90 mb-2 overflow-hidden border border-white/80 shrink-0 shadow-2xs">
                      {/* Rating Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <Star size={10} fill="#FBBF24" className="text-amber-400" />
                        <span>{doc.ratingAverage}</span>
                      </div>

                      {/* Wishlist Toggle Button */}
                      <button
                        onClick={e => toggleFavorite(doc.id, e)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/85 backdrop-blur-md shadow-xs flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors border border-white/80 cursor-pointer"
                      >
                        <Heart size={13} className={isFav ? 'fill-rose-500 text-rose-500' : ''} />
                      </button>

                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80';
                        }}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Doctor Details (Fixed Uniform Heights) */}
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate leading-tight group-hover:text-[#026dd9] transition-colors">
                        {doc.name}
                      </h4>
                      <p className="text-[11px] font-extrabold text-[#026dd9] truncate">
                        {doc.specialization}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        {doc.experienceYears}+ Yrs Exp • {doc.qualification}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-0.5">
                        <MapPin size={10} className="shrink-0 text-slate-400" />
                        <span className="truncate">{doc.hospitalName}</span>
                      </p>
                    </div>

                    {/* Bottom Fee & Action Buttons */}
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <div>
                        <span className="text-xs font-black text-slate-900 block leading-none">₹{doc.consultationFee}</span>
                        <span className="text-[9px] text-slate-400 font-medium block mt-0.5">OPD Fee</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={`tel:${doc.phone || '07582-472000'}`}
                          onClick={e => e.stopPropagation()}
                          className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
                          title={`Call directly: ${doc.phone || '07582-472000'}`}
                        >
                          <Phone size={13} className="fill-emerald-600 text-emerald-600" />
                        </a>

                        <Button
                          onClick={() => setSelectedDoctor(doc)}
                          size="sm"
                          className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-xs active:scale-95 cursor-pointer"
                        >
                          Book Now
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
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-2 font-bold text-slate-600">
            <Stethoscope className="animate-spin text-[#026dd9]" />
            <span>Loading Doctors & Hospital Directory...</span>
          </div>
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}

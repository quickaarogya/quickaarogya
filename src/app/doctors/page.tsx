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
  MessageSquare,
  Share2,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { AarogyaStorage } from '../../lib/storage';
import { AppointmentService } from '../../server/services/appointment.service';
import { Doctor, AppointmentSlot, FamilyMember, UserProfile, Hospital } from '../../types';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { DoctorPortraitCard } from '../../components/doctor/DoctorPortraitCard';

function DoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Category filter: 'all' | 'hospital' | 'clinic'
  const [categoryType, setCategoryType] = useState<'all' | 'hospital' | 'clinic'>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected doctor for detailed profile & appointment booking (Full Screen Mobile UI)
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
    const docs = await AppointmentService.getDoctors();
    const hosps = AarogyaStorage.getHospitals();
    const usr = AarogyaStorage.getUserProfile();
    const fam = AarogyaStorage.getFamilyMembers();

    setDoctors(docs);
    setHospitals(hosps);
    setProfile(usr);
    setFamilyMembers(fam);

    // Check if ?book=doc-id was passed in URL
    const bookId = searchParams.get('book');
    if (bookId) {
      const found = docs.find(d => d.id === bookId);
      if (found) setSelectedDoctor(found);
    }

    const spec = searchParams.get('specialty');
    if (spec) setSelectedSpecialty(spec);

    const hosp = searchParams.get('hospital');
    if (hosp) {
      setCategoryType('hospital');
      setSelectedHospitalFilter(hosp);
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

  // Group Doctors by Hospital & Clinic
  const hospitalGroups = useMemo(() => {
    const map: { [hospName: string]: Doctor[] } = {};
    doctors.forEach(doc => {
      const hosp = doc.hospitalName || 'City Health Center';
      if (!map[hosp]) map[hosp] = [];
      map[hosp].push(doc);
    });
    return map;
  }, [doctors]);

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    let list = doctors;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.clinicAddress.toLowerCase().includes(q)
      );
    }

    if (selectedSpecialty !== 'all') {
      list = list.filter(d => d.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    }

    if (selectedHospitalFilter !== 'all') {
      list = list.filter(d => d.hospitalName.toLowerCase().includes(selectedHospitalFilter.toLowerCase()));
    }

    return list;
  }, [doctors, searchQuery, selectedSpecialty, selectedHospitalFilter]);

  /* =========================================================================
   * 1. FULL-SCREEN DOCTOR PROFILE & BOOKING SCREEN (MATCHING SCREENSHOTS 1B & 3)
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
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors border border-slate-200"
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
              <Button asChild className="w-full h-12 bg-[#026dd9] hover:bg-[#0256ab] text-white font-black text-sm rounded-2xl shadow-md">
                <Link href="/appointments">View Live Token Queue</Link>
              </Button>
              <Button
                onClick={() => {
                  setBookingSuccessApt(null);
                  setSelectedDoctor(null);
                }}
                variant="outline"
                className="w-full h-12 rounded-2xl border-slate-200 text-xs font-bold"
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-32 text-slate-900 select-none">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSelectedDoctor(null)}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-800 transition-colors border border-slate-200 active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-black text-slate-900 truncate max-w-[200px]">{selectedDoctor.name}</h1>
            <p className="text-[10px] text-[#026dd9] font-semibold">{selectedDoctor.specialization}</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-200">
            <Share2 size={16} />
          </button>
        </header>

        <div className="max-w-lg mx-auto p-4 space-y-4">
          {/* DOCTOR PORTRAIT & QUICK STATS HERO */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <img
                src={selectedDoctor.avatarUrl}
                alt={selectedDoctor.name}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mb-0.5">
                  <Star size={13} fill="currentColor" />
                  <span>{selectedDoctor.ratingAverage}</span>
                  <span className="text-slate-400 font-medium">({selectedDoctor.ratingCount} reviews)</span>
                </div>
                <h2 className="text-base font-black text-slate-900 truncate leading-tight">
                  {selectedDoctor.name}
                </h2>
                <p className="text-xs font-bold text-[#026dd9] truncate mt-0.5">
                  {selectedDoctor.specialization} • {selectedDoctor.qualification}
                </p>
                <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {selectedDoctor.experienceYears} Years Experience
                </p>
              </div>
            </div>

            {/* Quick Contact Action Pills */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setConsultType('in_person')}
                className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                  consultType === 'in_person'
                    ? 'bg-[#026dd9] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 size={14} />
                <span>Clinic Visit</span>
              </button>

              <button
                onClick={() => setConsultType('video_teleconsult')}
                className={`py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                  consultType === 'video_teleconsult'
                    ? 'bg-[#026dd9] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Video size={14} />
                <span>Teleconsult</span>
              </button>

              <Link
                href={`tel:+919810088899`}
                className="py-2 px-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 flex items-center justify-center gap-1.5"
              >
                <PhoneCall size={14} />
                <span>Helpline</span>
              </Link>
            </div>
          </div>

          {/* SELECT DATE (HORIZONTAL CALENDAR STRIP) */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Select Date
              </span>
              <span className="text-xs font-bold text-slate-500">August 2026</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {bookingDates.map(d => {
                const isSelected = selectedDate === d.iso;
                return (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`min-w-[56px] py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center transition-all border shrink-0 active:scale-95 ${
                      isSelected
                        ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-sm font-black'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold">{d.dayName}</span>
                    <span className="text-base font-black mt-0.5">{d.dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECT TIME */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Select Time Slot
              </span>
              <span className="text-xs font-bold text-[#026dd9] bg-blue-50 px-2 py-0.5 rounded-md">
                {availableSlots.filter(s => s.isAvailable).length} Slots Available
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map(slot => {
                const isSelected = selectedSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2 px-2 rounded-xl text-xs font-black transition-all border flex items-center justify-center ${
                      !slot.isAvailable
                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#026dd9] text-white border-[#026dd9] shadow-xs'
                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PATIENT PROFILE SELECTOR */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-2.5">
              Consultation For
            </span>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setSelectedPatientId('usr-101')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedPatientId === 'usr-101'
                    ? 'bg-[#026dd9] text-white border-[#026dd9]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                👤 Arjun (Self)
              </button>
              {familyMembers.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedPatientId(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedPatientId === f.id
                      ? 'bg-[#026dd9] text-white border-[#026dd9]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  👥 {f.fullName.split(' ')[0]} ({f.relationship})
                </button>
              ))}
            </div>
          </div>

          {/* ABOUT DOCTOR & CLINIC LOCATION */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                About Specialist
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedDoctor.about}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-start gap-2.5">
              <MapPin size={18} className="text-[#026dd9] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-slate-900">{selectedDoctor.hospitalName}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{selectedDoctor.clinicAddress}</p>
              </div>
            </div>
          </div>

          {bookingError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold">
              ⚠️ {bookingError}
            </div>
          )}
        </div>

        {/* BOTTOM FIXED STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Consult Fee</span>
              <span className="text-base font-black text-slate-900">₹{selectedDoctor.consultationFee}</span>
            </div>

            <Button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-[#026dd9] hover:bg-[#0256ab] text-white font-black text-sm rounded-2xl shadow-md active:scale-95"
            >
              {isSubmitting ? 'Allocating Token...' : 'Book an Appointment'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * 2. MAIN DOCTOR DISCOVERY DIRECTORY
   * ========================================================================= */
  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      {/* Search Bar & Discovery Filter Bar */}
      <div className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="px-4 py-2.5 max-w-5xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder='Search by doctor name, specialty, hospital, or clinic...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 glass-input text-slate-900 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 p-1 text-slate-400">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 3-WAY DISCOVERY HIERARCHY TABS: [ ALL DOCTORS | BY HOSPITAL | BY CLINIC ] */}
        <div className="bg-white/50 backdrop-blur-md border-t border-white/60 px-4 py-2 flex items-center gap-2 max-w-5xl mx-auto overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setCategoryType('all');
              setSelectedHospitalFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
              categoryType === 'all'
                ? 'bg-[#026dd9] text-white shadow-xs'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-white/80'
            }`}
          >
            🩺 All Specialists ({doctors.length})
          </button>

          <button
            onClick={() => setCategoryType('hospital')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
              categoryType === 'hospital'
                ? 'bg-[#026dd9] text-white shadow-xs'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-white/80'
            }`}
          >
            🏥 By Hospital ({Object.keys(hospitalGroups).length})
          </button>

          <button
            onClick={() => setCategoryType('clinic')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
              categoryType === 'clinic'
                ? 'bg-[#026dd9] text-white shadow-xs'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-white/80'
            }`}
          >
            🏢 By Clinic
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-5">
        {/* VIEW 1: BY HOSPITAL HIERARCHY (HOSPITAL -> DOCTOR) */}
        {categoryType === 'hospital' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">Browse by Verified Hospitals</h2>
                <p className="text-xs text-slate-500 font-medium">Select a hospital to view resident medical specialists</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {hospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="glass-card p-4 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={hosp.imageUrl}
                      alt={hosp.name}
                      className="w-full h-28 rounded-2xl object-cover mb-3 border border-white/60 shadow-2xs"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase text-[#026dd9] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {hosp.type}
                      </span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                        <Star size={12} fill="currentColor" /> {hosp.rating}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{hosp.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                      <MapPin size={12} className="shrink-0 text-slate-400" /> {hosp.address}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100/80">
                    <Button
                      onClick={() => {
                        setSelectedHospitalFilter(hosp.name);
                        setCategoryType('all');
                      }}
                      className="w-full bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl h-8 shadow-xs cursor-pointer"
                    >
                      View Doctors & OPD Slots
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: BY CLINIC HIERARCHY (CLINIC -> DOCTOR) */}
        {categoryType === 'clinic' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Private Specialty Clinics</h2>
              <p className="text-xs text-slate-500 font-medium">OPD consultations at neighborhood private clinics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Aarogya Dental & Ortho Studio', address: 'Green Park Market', count: '2 Specialists', icon: '🦷', docId: 'doc-6' },
                { name: 'Skin & Laser Clinical Center', address: 'Green Park Extension', count: '1 Specialist', icon: '🧴', docId: 'doc-8' },
                { name: 'Mother & Child Care Clinic', address: 'Indiranagar', count: '3 Specialists', icon: '👶', docId: 'doc-3' },
                { name: 'Joint Care & Ortho Clinic', address: 'Saket Joint Care Wing', count: '2 Specialists', icon: '🦴', docId: 'doc-4' },
              ].map((clinic, idx) => (
                <div key={idx} className="glass-card p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                      {clinic.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{clinic.name}</h4>
                      <p className="text-xs text-slate-500">{clinic.address} • {clinic.count}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const doc = doctors.find(d => d.id === clinic.docId);
                      if (doc) setSelectedDoctor(doc);
                    }}
                    size="sm"
                    className="bg-[#026dd9] hover:bg-[#0256ab] text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
                  >
                    Consult
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: TOP DOCTOR GRID */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1 gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-black text-slate-900 leading-tight truncate">
                Top Verified Specialists
              </h2>
              <p className="text-xs text-slate-500 font-medium truncate">Select a specialist for clinic consultation or video call</p>
            </div>
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap shrink-0">
              Showing {filteredDoctors.length} doctors
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredDoctors.map(doc => (
              <DoctorPortraitCard
                key={doc.id}
                doctor={doc}
                onSelect={(d) => setSelectedDoctor(d)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-bold text-slate-400">Loading Doctors Directory...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}

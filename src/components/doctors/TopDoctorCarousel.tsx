'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Stethoscope,
  ShieldCheck,
  Clock,
  Sparkles,
  PhoneCall,
  Bed,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Doctor, Hospital } from '../../types';
import { initialHospitals, initialDoctors } from '../../lib/mockData';
import { AarogyaStorage } from '../../lib/storage';
import { Button } from '../ui/button';

interface TopDoctorCarouselProps {
  doctors?: Doctor[];
  hospitals?: Hospital[];
  title?: string;
  autoPlayInterval?: number; // In milliseconds (15 to 20 seconds)
}

export default function TopDoctorCarousel({
  doctors = [],
  hospitals = [],
  title = 'Featured Hospitals & Specialists',
  autoPlayInterval = 18000 // 18 seconds default
}: TopDoctorCarouselProps) {
  const [allHospitals, setAllHospitals] = useState<Hospital[]>(initialHospitals);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>(initialDoctors);
  const [currentHospitalIndex, setCurrentHospitalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});
  const [hospitalFavorites, setHospitalFavorites] = useState<{ [id: string]: boolean }>({});
  const [mobileDoctorIndex, setMobileDoctorIndex] = useState(0);
  const [doctorPageIndex, setDoctorPageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Sync data from storage on client after initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedH = AarogyaStorage.getHospitals();
      if (storedH && storedH.length > 0) setAllHospitals(storedH);

      const storedD = AarogyaStorage.getDoctors();
      if (storedD && storedD.length > 0) setAllDoctors(storedD);

      const favDocs = AarogyaStorage.getWishlistDoctors();
      const docMap: { [id: string]: boolean } = {};
      favDocs.forEach(id => { docMap[id] = true; });
      setFavorites(docMap);

      const favHosps = AarogyaStorage.getWishlistHospitals();
      const hospMap: { [id: string]: boolean } = {};
      favHosps.forEach(id => { hospMap[id] = true; });
      setHospitalFavorites(hospMap);
    }
  }, []);

  const totalHospitals = allHospitals.length;
  const currentHospital = allHospitals[currentHospitalIndex] || allHospitals[0];

  // Filter all doctors associated with the current hospital (or matching hospital doctors)
  const hospitalDoctors = React.useMemo(() => {
    if (!currentHospital) return [];

    // Exact or substring match with hospital name or ID
    const directMatches = allDoctors.filter(d => {
      const docHosp = (d.hospitalName || '').toLowerCase();
      const currHosp = (currentHospital.name || '').toLowerCase();
      return (
        docHosp.includes(currHosp) ||
        currHosp.includes(docHosp) ||
        (currentHospital.id === 'hosp-bhagyodaya' && (d.id.startsWith('doc-bt') || docHosp.includes('bhagyodaya'))) ||
        (currentHospital.id === 'hosp-1' && (docHosp.includes('apollo') || d.id === 'doc-1' || d.id === 'doc-5' || d.id === 'doc-6' || d.id === 'doc-8')) ||
        (currentHospital.id === 'hosp-2' && (docHosp.includes('fortis') || d.id === 'doc-2' || d.id === 'doc-3' || d.id === 'doc-bt-1' || d.id === 'doc-bt-5')) ||
        (currentHospital.id === 'hosp-3' && (docHosp.includes('max') || d.id === 'doc-4' || d.id === 'doc-7' || d.id === 'doc-bt-3' || d.id === 'doc-bt-4'))
      );
    });

    if (directMatches.length > 0) return directMatches;

    // Fallback: Pad with all doctors
    return allDoctors;
  }, [allDoctors, currentHospital]);

  // Doctor carousel pagination calculations
  const totalDoctorPages = Math.ceil(hospitalDoctors.length / 4);
  const displayedDoctors = React.useMemo(() => {
    if (hospitalDoctors.length <= 4) return hospitalDoctors;
    const start = (doctorPageIndex % totalDoctorPages) * 4;
    const slice = hospitalDoctors.slice(start, start + 4);
    if (slice.length < 4) {
      return [...slice, ...hospitalDoctors.slice(0, 4 - slice.length)];
    }
    return slice;
  }, [hospitalDoctors, doctorPageIndex, totalDoctorPages]);

  // Reset doctor page & mobile index when hospital changes
  useEffect(() => {
    setDoctorPageIndex(0);
    setMobileDoctorIndex(0);
  }, [currentHospitalIndex]);

  // Auto-shuffle doctors every 6 seconds within the active hospital
  useEffect(() => {
    if (totalDoctorPages <= 1 || isPaused) return;
    const docInterval = setInterval(() => {
      setDoctorPageIndex(prev => (prev + 1) % totalDoctorPages);
    }, 6000);

    return () => clearInterval(docInterval);
  }, [totalDoctorPages, isPaused]);

  const handleNextHospital = useCallback(() => {
    if (totalHospitals <= 1) return;
    setCurrentHospitalIndex(prev => (prev + 1) % totalHospitals);
  }, [totalHospitals]);

  const handlePrevHospital = useCallback(() => {
    if (totalHospitals <= 1) return;
    setCurrentHospitalIndex(prev => (prev - 1 + totalHospitals) % totalHospitals);
  }, [totalHospitals]);

  // Auto-play timer for hospital shuffling (15 - 20 seconds)
  useEffect(() => {
    if (totalHospitals <= 1 || isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNextHospital();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [totalHospitals, isPaused, autoPlayInterval, handleNextHospital]);

  const toggleDoctorFavorite = (docId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistDoctor(docId);
    setFavorites(prev => ({ ...prev, [docId]: updated.includes(docId) }));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  const toggleHospitalFavorite = (hospId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHospitalFavorites(prev => ({ ...prev, [hospId]: !prev[hospId] }));
  };

  // Mobile Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const diff = touchStartX - touchEndX;
      const swipeThreshold = 40;
      if (diff > swipeThreshold) {
        if (hospitalDoctors.length > 1 && mobileDoctorIndex < hospitalDoctors.length - 1) {
          setMobileDoctorIndex(prev => prev + 1);
        } else {
          handleNextHospital();
        }
      } else if (diff < -swipeThreshold) {
        if (mobileDoctorIndex > 0) {
          setMobileDoctorIndex(prev => prev - 1);
        } else {
          handlePrevHospital();
        }
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  if (!currentHospital) return null;

  return (
    <div
      className="space-y-3 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Row: Title on Left, Controls and "See all" on Right */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <span className="text-[10px] font-black text-[#026dd9] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-wider hidden sm:inline-block">
            Auto-Shuffling ({currentHospitalIndex + 1}/{totalHospitals})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Arrow Navigation Controls */}
          {totalHospitals > 1 && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={handlePrevHospital}
                aria-label="Previous Hospital"
                className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#026dd9] flex items-center justify-center transition-all shadow-2xs active:scale-95 disabled:opacity-40 cursor-pointer"
                title="Previous Hospital"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextHospital}
                aria-label="Next Hospital"
                className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#026dd9] flex items-center justify-center transition-all shadow-2xs active:scale-95 disabled:opacity-40 cursor-pointer"
                title="Next Hospital"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <Link
            href="/doctors"
            className="text-xs font-bold text-slate-500 hover:text-[#026dd9] transition-colors px-2 py-1"
          >
            See all
          </Link>
        </div>
      </div>

      {/* MAIN HERO HOSPITAL & MULTI-DOCTOR SHOWCASE BANNER */}
      <div
        className="relative overflow-hidden rounded-3xl sm:rounded-[32px] text-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all duration-700 flex flex-col justify-between"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image of the Current Hospital - Natural, Clear & Bright Daylight Architecture */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={currentHospital.imageUrl || '/images/hospitals/bhagyodaya-tirth.jpg'}
            alt={currentHospital.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hospitals/bhagyodaya-tirth.jpg';
            }}
            className="w-full h-full object-cover object-center transition-all duration-700"
          />
          {/* Gentle Natural Scrim Gradient - Leaves Hospital Campus Clear & Prominent */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-black/20" />
          <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-slate-950/60 via-slate-950/15 to-transparent" />
        </div>

        {/* Content Layer (Z-10) */}
        <div className="relative z-10 p-3.5 sm:p-6 lg:p-7 flex flex-col justify-between flex-1 gap-3 sm:gap-6">
          {/* TOP ROW: Hospital Rating Pill on Left, Hospital Type Badge & Heart on Right */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Hospital Star Rating */}
              <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-slate-900 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-md border border-white/80">
                <Star size={13} fill="#FBBF24" className="text-amber-400 shrink-0" />
                <span>{currentHospital.rating || 4.9}</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">({currentHospital.totalBeds || 500}+ Beds)</span>
              </div>

              {/* 24/7 Emergency Badge */}
              {currentHospital.has24x7Emergency && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-emerald-300 bg-emerald-950/85 border border-emerald-500/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  24/7 Emergency
                </span>
              )}
            </div>

            {/* Hospital Wishlist / Heart Button */}
            <button
              onClick={(e) => toggleHospitalFavorite(currentHospital.id, e)}
              aria-label="Save Hospital"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer border border-white/30 shadow-sm shrink-0"
              title="Save Hospital"
            >
              <Heart
                size={15}
                fill={hospitalFavorites[currentHospital.id] ? '#E11D48' : 'none'}
                className={hospitalFavorites[currentHospital.id] ? 'text-rose-500 stroke-rose-500' : 'text-white'}
              />
            </button>
          </div>

          {/* MIDDLE SECTION: Hospital Info on Left + Multiple Doctor Cards on Right */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-center space-y-3 lg:space-y-0">
            {/* Left 4-5 Columns: Hospital Division / Pillar Card with Signature Theme Color */}
            <div className="lg:col-span-4 space-y-2.5 bg-gradient-to-br from-[#011a3c]/95 via-[#023368]/95 to-[#014f9e]/95 backdrop-blur-2xl p-3.5 sm:p-4 rounded-3xl border border-blue-400/40 shadow-[0_16px_40px_rgba(1,26,60,0.45)] flex flex-col justify-between h-auto sm:min-h-[350px]">
              {/* Taller Hospital Campus Image Thumbnail */}
              <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-md">
                <img
                  src={currentHospital.imageUrl || '/images/hospitals/bhagyodaya-tirth.jpg'}
                  alt={currentHospital.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hospitals/bhagyodaya-tirth.jpg';
                  }}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <Building2 size={11} className="text-[#38BDF8]" />
                  <span>Campus View</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-400/25 border border-blue-300/40 text-blue-100 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                  <Building2 size={12} />
                  <span>{currentHospital.type || 'Super Specialty Hospital'}</span>
                </div>

                <h1 className="text-sm sm:text-lg font-black text-white leading-tight tracking-tight drop-shadow-md">
                  {currentHospital.name}
                </h1>

                <p className="text-[11px] sm:text-xs text-blue-100/90 flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-[#38BDF8] shrink-0" />
                  <span className="truncate">{currentHospital.address}, {currentHospital.city}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-100">
                <span className="bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/15 flex items-center gap-1">
                  <Bed size={11} className="text-teal-300" />
                  {currentHospital.icuBedsAvailable || 12} ICU Beds
                </span>
                <span className="bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/15 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-300" />
                  ABDM Verified
                </span>
              </div>
            </div>

            {/* Right 7-8 Columns: Multiple Glassmorphic Doctor Cards from this Hospital */}
            <div className="lg:col-span-8 space-y-2">
              {/* Desktop Header Bar with Doctor Carousel Navigation when hospital has > 4 doctors */}
              {totalDoctorPages > 1 && (
                <div className="hidden sm:flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-white drop-shadow-xs">Specialists on Duty</span>
                    <span className="text-[10px] text-blue-200 font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                      {hospitalDoctors.length} Doctors
                    </span>
                  </div>

                  {/* Doctor Carousel controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDoctorPageIndex(prev => (prev - 1 + totalDoctorPages) % totalDoctorPages)}
                      className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-xs backdrop-blur-md transition-all active:scale-90 cursor-pointer border border-white/20"
                      title="Previous Batch"
                    >
                      ‹
                    </button>
                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: totalDoctorPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setDoctorPageIndex(i)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            doctorPageIndex === i ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setDoctorPageIndex(prev => (prev + 1) % totalDoctorPages)}
                      className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-xs backdrop-blur-md transition-all active:scale-90 cursor-pointer border border-white/20"
                      title="Next Batch"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}

              {/* DESKTOP VIEW: Multi-Column Glassmorphic Cards Grid */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {displayedDoctors.map((doc) => {
                  const isFav = !!favorites[doc.id];
                  return (
                    <div
                      key={doc.id}
                      className="group/card relative h-[350px] rounded-3xl bg-white/80 hover:bg-white/95 backdrop-blur-2xl border border-white/60 hover:border-white p-3 text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.16)] hover:shadow-[0_20px_45px_rgba(2,109,217,0.3)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                    >
                      {/* Fixed Tall Portrait Doctor Image Placeholder */}
                      <div className="relative w-full h-[195px] min-h-[195px] max-h-[195px] rounded-2xl overflow-hidden bg-slate-100/90 mb-2 border border-white/80 shrink-0 shadow-2xs">
                        {/* Doctor Star Rating Pill on top-left of image */}
                        <div className="absolute top-1.5 left-1.5 z-10 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs border border-white/15">
                          <Star size={10} fill="#FBBF24" className="text-amber-400" />
                          <span>{doc.ratingAverage || 4.9}</span>
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleDoctorFavorite(doc.id, e)}
                          className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/85 hover:bg-white text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors shadow-xs cursor-pointer border border-white/60"
                        >
                          <Heart size={12} className={isFav ? 'fill-rose-500 text-rose-500' : ''} />
                        </button>

                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
                        />
                      </div>

                      {/* Doctor Details (Fixed Height Rows for Alignment) */}
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate leading-tight group-hover/card:text-[#026dd9] transition-colors">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] font-extrabold text-[#026dd9] truncate">
                          {doc.specialization}
                        </p>
                        <p className="text-[10px] text-slate-600 font-medium truncate">
                          {doc.experienceYears}+ Yrs Exp • {doc.qualification}
                        </p>
                      </div>

                      {/* Bottom Fee & Book Appointment Action */}
                      <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1.5">
                        <span className="text-xs font-black text-slate-900">₹{doc.consultationFee}</span>
                        <Link
                          href={`/doctors?book=${doc.id}`}
                          className="px-3 py-1.5 bg-[#026dd9] hover:bg-[#0256ab] text-white text-[11px] font-black rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 text-center cursor-pointer"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOBILE VIEW: Compact Glassmorphic Doctor Card */}
              <div className="sm:hidden">
                {hospitalDoctors.length > 0 && (() => {
                  const doc = hospitalDoctors[mobileDoctorIndex] || hospitalDoctors[0];
                  const isFav = !!favorites[doc.id];
                  return (
                    <div className="rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/70 p-3 text-slate-900 shadow-xl space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs">
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80';
                            }}
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 border border-white/20">
                            <Star size={9} fill="#FBBF24" className="text-amber-400" />
                            <span>{doc.ratingAverage}</span>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-black text-slate-900 truncate">{doc.name}</h4>
                            <button
                              onClick={(e) => toggleDoctorFavorite(doc.id, e)}
                              className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"
                            >
                              <Heart size={12} className={isFav ? 'fill-rose-500 text-rose-500' : ''} />
                            </button>
                          </div>

                          <p className="text-[11px] font-extrabold text-[#026dd9] truncate mt-0.5">{doc.specialization}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{doc.experienceYears}+ Yrs Exp • {doc.qualification}</p>
                          <p className="text-xs font-black text-slate-900 mt-1">₹{doc.consultationFee} <span className="text-[10px] text-slate-400 font-normal">Fee</span></p>
                        </div>
                      </div>

                      {/* Mobile Booking CTA & Pagination */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Doctor switcher navigation controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setMobileDoctorIndex(prev => (prev - 1 + hospitalDoctors.length) % hospitalDoctors.length)}
                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold"
                          >
                            ‹ Prev
                          </button>
                          <span className="text-[10px] font-black text-slate-500 px-1">
                            {mobileDoctorIndex + 1}/{hospitalDoctors.length}
                          </span>
                          <button
                            onClick={() => setMobileDoctorIndex(prev => (prev + 1) % hospitalDoctors.length)}
                            className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold"
                          >
                            Next ›
                          </button>
                        </div>

                        <Link
                          href={`/doctors?book=${doc.id}`}
                          className="px-4 py-1.5 bg-[#026dd9] text-white text-[11px] font-black rounded-xl shadow-xs active:scale-95"
                        >
                          Book Appointment
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* BOTTOM HOSPITAL CAROUSEL DOTS */}
          <div className="flex items-center justify-between pt-2 border-t border-white/15">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                Hospitals:
              </span>
              <div className="flex items-center gap-1.5">
                {allHospitals.map((hosp, idx) => (
                  <button
                    key={hosp.id}
                    onClick={() => setCurrentHospitalIndex(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                      currentHospitalIndex === idx
                        ? 'w-5 sm:w-7 bg-white shadow-md'
                        : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    title={hosp.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

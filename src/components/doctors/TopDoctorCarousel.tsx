'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Doctor } from '../../types';
import { AarogyaStorage } from '../../lib/storage';

interface TopDoctorCarouselProps {
  doctors: Doctor[];
  title?: string;
  autoPlayInterval?: number;
}

// Creative punchy headline for each specialty (matching the screenshot's "Dr. Fresh Smile" style)
const SPECIALTY_HEADLINES: { [key: string]: string } = {
  'cardiology': 'Dr. Pure\nHeart',
  'pediatrics': 'Dr. Gentle\nCare',
  'dermatology': 'Dr. Skin\nGlow',
  'orthopedics': 'Dr. Joint\nActive',
  'neurology': 'Dr. Brain\nExpert',
  'dental care': 'Dr. Fresh\nSmile',
  'dental': 'Dr. Fresh\nSmile',
  'gynecology': 'Dr. Mother\nCare',
  'endocrinology': 'Dr. Vital\nHealth',
  'general physician': 'Dr. Family\nHealth',
  'default': 'Dr. Top\nSpecialist'
};

export default function TopDoctorCarousel({
  doctors = [],
  title = 'Popular Doctor',
  autoPlayInterval = 4500
}: TopDoctorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const validDoctors = doctors.length > 0 ? doctors : [];
  const totalSlides = validDoctors.length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDocs = AarogyaStorage.getWishlistDoctors();
      const favMap: { [id: string]: boolean } = {};
      savedDocs.forEach(id => {
        favMap[id] = true;
      });
      setFavorites(favMap);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFavorite = (docId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistDoctor(docId);
    setFavorites(prev => ({ ...prev, [docId]: updated.includes(docId) }));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage-update'));
    }
  };

  // Auto-play timer with pause on hover/interaction
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [totalSlides, isPaused, autoPlayInterval, handleNext]);

  // Touch swipe support for mobile
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
        handleNext();
      } else if (diff < -swipeThreshold) {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
    setIsPaused(false);
  };

  if (totalSlides === 0) return null;

  const currentDoctor = validDoctors[currentIndex];
  const specKey = (currentDoctor.specialization || '').toLowerCase();
  const headline = SPECIALTY_HEADLINES[specKey] || SPECIALTY_HEADLINES['default'];
  const isFav = !!favorites[currentDoctor.id];

  return (
    <div
      className="space-y-2.5 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Row: Title on Left, Controls and "See all" on Right */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-black text-slate-900 tracking-tight">
          {title}
        </h2>

        <div className="flex items-center gap-2">
          {/* Arrow Navigation Controls */}
          {totalSlides > 1 && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                onClick={handlePrev}
                aria-label="Previous Doctor"
                className="w-6 h-6 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-[#026dd9] flex items-center justify-center transition-all shadow-2xs active:scale-95 disabled:opacity-40 cursor-pointer"
                disabled={totalSlides <= 1}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Doctor"
                className="w-6 h-6 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-[#026dd9] flex items-center justify-center transition-all shadow-2xs active:scale-95 disabled:opacity-40 cursor-pointer"
                disabled={totalSlides <= 1}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          <Link
            href="/doctors"
            className="text-xs font-bold text-slate-400 hover:text-[#026dd9] transition-colors"
          >
            See all
          </Link>
        </div>
      </div>

      {/* Main Hero Doctor Card (1:1 with User's Reference Screenshot) */}
      <div
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#68A2F9] via-[#4D90F7] to-[#3B82F6] text-white shadow-[0_12px_32px_rgba(59,130,246,0.24)] p-4 sm:p-5 transition-all duration-300"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Soft fluid curved decorative backdrops */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-4 -left-12 w-48 h-48 rounded-full bg-blue-300/20 blur-xl pointer-events-none" />

        {/* Top Badges Row: Rating Pill on Left, Heart on Right */}
        <div className="flex items-center justify-between relative z-10 mb-2">
          {/* Rating Pill (White Pill with Gold Star) */}
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
            <Star size={13} fill="#FBBF24" className="text-amber-400" />
            <span>{currentDoctor.ratingAverage || 4.9}</span>
          </div>

          {/* Heart Favorite Button (Translucent Circle) */}
          <button
            onClick={(e) => toggleFavorite(currentDoctor.id, e)}
            aria-label="Add to favorites"
            className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer shadow-2xs"
          >
            <Heart
              size={16}
              fill={isFav ? '#E11D48' : 'none'}
              className={isFav ? 'text-rose-500 stroke-rose-500' : 'text-white'}
            />
          </button>
        </div>

        {/* Middle Section: Specialty + Large Headline on Left, Doctor Portrait on Right */}
        <div className="relative z-10 flex items-center justify-between gap-3 min-h-[145px]">
          {/* Left Text */}
          <div className="max-w-[55%] sm:max-w-[58%] py-1">
            <span className="text-xs sm:text-sm font-semibold text-blue-100 capitalize block tracking-wide">
              {currentDoctor.specialization}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mt-1 whitespace-pre-line drop-shadow-xs">
              {headline}
            </h3>
          </div>

          {/* Right Doctor Portrait */}
          <div className="relative shrink-0 w-32 h-36 sm:w-40 sm:h-44">
            <img
              key={currentDoctor.id}
              src={currentDoctor.avatarUrl}
              alt={currentDoctor.name}
              className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white/25 bg-blue-400/20"
            />
          </div>
        </div>

        {/* Bottom Frosted Glass Action Strip (Matching Reference) */}
        <div className="relative z-20 mt-3 p-2.5 sm:p-3 rounded-2xl bg-white/25 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-between gap-2">
          {/* Left Info inside Frosted Pill */}
          <div className="min-w-0 flex-1 pl-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-white truncate drop-shadow-xs">
              {currentDoctor.name}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-blue-100 font-medium truncate mt-0.5">
              {currentDoctor.specialization} • ₹{currentDoctor.consultationFee} Fee
            </p>
          </div>

          {/* Right Solid Blue "Booking Now" Button */}
          <Link
            href={`/doctors?book=${currentDoctor.id}`}
            className="inline-flex items-center justify-center h-8 sm:h-9 px-4 sm:px-5 bg-[#026dd9] hover:bg-[#005bb8] text-white font-black text-xs sm:text-sm rounded-full shadow-md active:scale-95 transition-all shrink-0"
          >
            Booking Now
          </Link>
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {validDoctors.map((doc, idx) => (
            <button
              key={doc.id || idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1} (${doc.name})`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 h-1.5 bg-[#026dd9] shadow-xs'
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Quick Jump Doctor Badges */}
      {totalSlides > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-0.5">
          {validDoctors.map((doc, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={doc.id || idx}
                onClick={() => goToSlide(idx)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50/95 border-[#026dd9] shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  className={`w-6 h-6 rounded-full object-cover shrink-0 border ${
                    isActive ? 'border-[#026dd9]' : 'border-slate-200'
                  }`}
                />
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold truncate max-w-[110px] ${
                    isActive ? 'text-[#026dd9] font-black' : 'text-slate-700'
                  }`}>
                    {doc.name}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate max-w-[110px]">
                    {doc.specialization}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

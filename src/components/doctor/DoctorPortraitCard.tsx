'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Heart, ArrowUpRight, ShieldCheck, Phone, Building2, MapPin } from 'lucide-react';
import { Doctor } from '@/types';
import { AarogyaStorage } from '@/lib/storage';

interface DoctorPortraitCardProps {
  doctor: Doctor;
  onSelect?: (doctor: Doctor) => void;
}

const SPECIALTY_ICONS: Record<string, string> = {
  Cardiology: '❤️',
  Endocrinology: '🩸',
  Pediatrics: '👶',
  Orthopedics: '🦴',
  Neurology: '🧠',
  Dentistry: '🦷',
  Ophthalmology: '👁️',
  Dermatology: '🧴',
  General: '🩺',
};

export function DoctorPortraitCard({ doctor, onSelect }: DoctorPortraitCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(AarogyaStorage.getWishlistDoctors().includes(doctor.id));

    const handleUpdate = () => {
      setIsWishlisted(AarogyaStorage.getWishlistDoctors().includes(doctor.id));
    };

    window.addEventListener('storage-update', handleUpdate);
    return () => window.removeEventListener('storage-update', handleUpdate);
  }, [doctor.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = AarogyaStorage.toggleWishlistDoctor(doctor.id);
    setIsWishlisted(updated.includes(doctor.id));
  };

  const specialtyIcon = SPECIALTY_ICONS[doctor.specialization] || '🩺';
  const doctorPhone = doctor.phone || '07582-472000';

  return (
    <div
      onClick={() => onSelect?.(doctor)}
      className="group relative h-[310px] sm:h-[335px] md:h-[345px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-white/80 dark:border-slate-700/80 shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Full Doctor Portrait Background */}
      <img
        src={doctor.avatarUrl}
        alt={doctor.name}
        className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 pointer-events-none"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          if (!target.src.includes('photo-1559839734-2b71ea197ec2')) {
            target.src =
              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80';
          }
        }}
      />
      {/* Ambient Gradient Overlay for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-black/5 to-black/10 pointer-events-none" />

      {/* Top Floating Glass Badges (Rating & Wishlist Heart) */}
      <div className="relative z-20 flex items-center justify-between p-2.5 pointer-events-none">
        <div className="px-2.5 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/20 shadow-xs flex items-center gap-1 pointer-events-auto">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-black text-slate-900 dark:text-slate-100">
            {doctor.ratingAverage}
          </span>
        </div>

        <button
          onClick={toggleWishlist}
          aria-label="Save to wishlist"
          className={`w-7 h-7 rounded-full backdrop-blur-xl flex items-center justify-center transition-transform active:scale-90 pointer-events-auto shadow-xs border ${
            isWishlisted
              ? 'bg-rose-500/90 border-rose-400 text-white'
              : 'bg-white/60 dark:bg-slate-900/70 border-white/80 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:bg-white/90'
          }`}
        >
          <Heart size={13} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Floating Ultra-Frosted Glassmorphic Bottom Panel */}
      <div className="relative z-20 mx-2 mb-2 p-3 rounded-2xl bg-gradient-to-b from-white/85 via-white/75 to-white/65 dark:from-slate-900/85 dark:via-slate-900/75 dark:to-slate-900/65 backdrop-blur-2xl border border-white/80 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.14)] space-y-1.5">
        <div>
          <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-[#026dd9] transition-colors leading-tight">
            {doctor.name}
          </h4>
          <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-bold truncate mt-0.5">
            {doctor.specialization} • <span className="font-extrabold text-slate-900 dark:text-slate-100">₹{doctor.consultationFee}</span>
          </p>
        </div>

        {/* Hospital or Locality Badge */}
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-extrabold text-[#026dd9] dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-200/80 dark:border-blue-800/60 truncate shadow-2xs">
          <Building2 size={11} className="shrink-0 text-[#026dd9] dark:text-blue-400" />
          <span className="truncate">{doctor.hospitalName || 'Bhagyodaya Tirth Hospital'}</span>
          {doctor.clinicAddress && (
            <>
              <span className="text-blue-300 dark:text-blue-600 shrink-0">•</span>
              <span className="truncate text-slate-500 dark:text-slate-400 font-medium shrink-0 max-w-[70px]">
                {doctor.clinicAddress.split(',')[0]}
              </span>
            </>
          )}
        </div>

        {/* Micro-Badges & Action Buttons (Compact Responsive Layout) */}
        <div className="pt-1.5 border-t border-white/60 dark:border-white/10 flex items-center justify-between gap-1">
          {/* Micro Glass Badges */}
          <div className="flex items-center gap-1 min-w-0">
            <span
              className="px-1.5 py-0.5 rounded-full bg-blue-50/90 dark:bg-blue-950/80 backdrop-blur-md text-[9px] font-black text-[#026dd9] dark:text-blue-300 flex items-center justify-center shadow-2xs border border-blue-200/80 dark:border-blue-800/80 shrink-0"
              title={`${doctor.experienceYears} Years Experience`}
            >
              {doctor.experienceYears}y exp
            </span>
            <span
              className="w-5 h-5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/80 backdrop-blur-md text-[10px] text-emerald-600 dark:text-emerald-300 hidden sm:flex items-center justify-center shadow-2xs border border-emerald-200/80 dark:border-emerald-800/80 shrink-0"
              title="Verified Specialist"
            >
              <ShieldCheck size={11} />
            </span>
          </div>

          {/* Action CTA Buttons: Call Directly & Book Slot (Solid Circular Icons) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={`tel:${doctorPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-[#059669] hover:bg-[#047857] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0 border border-emerald-400/40"
              title={`Call clinic directly: ${doctorPhone}`}
            >
              <Phone size={13} className="fill-white text-white" />
            </a>

            <Link
              href={`/doctors?book=${doctor.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-[#026dd9] hover:bg-[#0256ab] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0 border border-blue-400/40"
              title="Book Appointment Token"
            >
              <ArrowUpRight size={15} className="text-white stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Clock, Building2, ShieldCheck, Phone, ArrowUpRight, Home, Sparkles, CheckCircle2 } from 'lucide-react';
import { DiagnosticItem } from '@/types';

interface DiagnosticCardProps {
  item: DiagnosticItem;
  themeColor?: 'blue' | 'teal' | 'rose' | 'indigo' | 'amber';
  onBook?: (item: DiagnosticItem) => void;
}

export function DiagnosticCard({ item, themeColor = 'blue', onBook }: DiagnosticCardProps) {
  const [isBooked, setIsBooked] = useState(false);

  const themeClasses = {
    blue: {
      accent: 'text-[#026dd9]',
      border: 'border-blue-200/80 dark:border-blue-800/80',
      badgeBg: 'bg-blue-50/90 dark:bg-blue-950/80 text-[#026dd9] dark:text-blue-300',
      btnBg: 'bg-[#026dd9] hover:bg-[#0256ab]',
      tagBg: 'bg-blue-600 text-white',
      shadow: 'hover:shadow-[0_12px_36px_rgba(2,109,217,0.18)]',
    },
    teal: {
      accent: 'text-[#0F766E]',
      border: 'border-teal-200/80 dark:border-teal-800/80',
      badgeBg: 'bg-teal-50/90 dark:bg-teal-950/80 text-[#0F766E] dark:text-teal-300',
      btnBg: 'bg-[#0F766E] hover:bg-[#115E59]',
      tagBg: 'bg-teal-600 text-white',
      shadow: 'hover:shadow-[0_12px_36px_rgba(15,118,110,0.18)]',
    },
    indigo: {
      accent: 'text-indigo-600',
      border: 'border-indigo-200/80 dark:border-indigo-800/80',
      badgeBg: 'bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700',
      tagBg: 'bg-indigo-600 text-white',
      shadow: 'hover:shadow-[0_12px_36px_rgba(79,70,229,0.18)]',
    },
    rose: {
      accent: 'text-[#E11D48]',
      border: 'border-rose-200/80 dark:border-rose-800/80',
      badgeBg: 'bg-rose-50/90 dark:bg-rose-950/80 text-[#E11D48] dark:text-rose-300',
      btnBg: 'bg-[#E11D48] hover:bg-[#BE123C]',
      tagBg: 'bg-[#E11D48] text-white',
      shadow: 'hover:shadow-[0_12px_36px_rgba(225,29,72,0.18)]',
    },
    amber: {
      accent: 'text-amber-600',
      border: 'border-amber-200/80 dark:border-amber-800/80',
      badgeBg: 'bg-amber-50/90 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
      tagBg: 'bg-amber-600 text-white',
      shadow: 'hover:shadow-[0_12px_36px_rgba(217,119,6,0.18)]',
    },
  }[themeColor];

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBooked(true);
    if (onBook) {
      onBook(item);
    } else {
      setTimeout(() => {
        window.location.href = `/appointments?diagnostic=${item.id}&type=${item.type}`;
      }, 300);
    }
  };

  return (
    <div
      onClick={() => onBook ? onBook(item) : (window.location.href = `/appointments?diagnostic=${item.id}&type=${item.type}`)}
      className={`group relative h-[310px] sm:h-[335px] md:h-[345px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_6px_24px_rgba(0,0,0,0.06)] ${themeClasses.shadow} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer`}
    >
      {/* Top Banner Image with Spec / Accreditation Tag */}
      <div className="relative w-full h-[140px] sm:h-[155px] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80'}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

        {/* Top Left: Star Rating */}
        <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-black flex items-center gap-1 shadow-xs">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span>{item.ratingAverage}</span>
          <span className="text-[9px] text-slate-300 font-medium">({item.reviewsCount || 120})</span>
        </div>

        {/* Top Right: Discount Pill */}
        {item.discountPercentage && (
          <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-xs tracking-wider uppercase">
            {item.discountPercentage}% OFF
          </div>
        )}

        {/* Bottom Left on Image: Feature / Hardware Badge */}
        {item.badge && (
          <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[10px] font-extrabold text-white">
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 truncate max-w-[80%] flex items-center gap-1">
              <Sparkles size={10} className="text-amber-300 shrink-0" />
              <span className="truncate">{item.badge}</span>
            </span>
            {item.homeCollectionAvailable && (
              <span className="bg-emerald-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-black flex items-center gap-0.5 text-white shrink-0">
                <Home size={9} />
                <span>Home</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <div>
          <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-[#026dd9] transition-colors leading-tight">
            {item.name}
          </h4>
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold truncate mt-0.5 flex items-center gap-1">
            <Clock size={11} className="shrink-0 text-slate-400" />
            <span className="truncate">{item.reportTurnaround}</span>
          </p>
        </div>

        {/* Center / Hospital Locality Badge */}
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-extrabold text-[#026dd9] dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-200/80 dark:border-blue-800/60 truncate shadow-2xs">
          <Building2 size={11} className="shrink-0 text-[#026dd9] dark:text-blue-400" />
          <span className="truncate">{item.centerName}</span>
          {item.locality && (
            <>
              <span className="text-blue-300 dark:text-blue-600 shrink-0">•</span>
              <span className="truncate text-slate-500 dark:text-slate-400 font-medium shrink-0 max-w-[70px]">
                {item.locality}
              </span>
            </>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">₹{item.price}</span>
              {item.mrp > item.price && (
                <span className="text-[10px] text-slate-400 line-through font-semibold">₹{item.mrp}</span>
              )}
            </div>
            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
              {item.preparation || 'Instant Slot'}
            </span>
          </div>

          {/* Action CTA Buttons: Call Center Directly & Book Slot */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={`tel:${item.phone || '07582-472000'}`}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full bg-[#059669] hover:bg-[#047857] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0 border border-emerald-400/40"
              title={`Call scan center: ${item.phone || '07582-472000'}`}
            >
              <Phone size={13} className="fill-white text-white" />
            </a>

            <button
              onClick={handleBookClick}
              className={`w-8 h-8 rounded-full ${themeClasses.btnBg} text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0 border border-white/20`}
              title="Book Test / Scan Token"
            >
              {isBooked ? (
                <CheckCircle2 size={15} className="text-white" />
              ) : (
                <ArrowUpRight size={15} className="text-white stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { DiagnosticItem } from '@/types';
import { initialXRays } from '@/lib/diagnosticsData';
import { DiagnosticCard } from './DiagnosticCard';

interface TopXRaysSectionProps {
  items?: DiagnosticItem[];
}

export function TopXRaysSection({ items = initialXRays }: TopXRaysSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="space-y-3">
      {/* Header with Title, Spec Pill & Controls */}
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
              Top X-Rays
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              <Zap size={11} />
              <span>Direct Digital DR Film</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              <span>Low Radiation AERB</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            Instant digital film on mobile within 20 mins across Sagar diagnostic clinics
          </p>
        </div>

        {/* Carousel Navigation Arrows + See All Link */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous X-Rays"
              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next X-Rays"
              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <Link
            href="/appointments?type=x_ray"
            className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-0.5 whitespace-nowrap"
          >
            <span>See all</span>
            <ChevronRight size={14} className="shrink-0" />
          </Link>
        </div>
      </div>

      {/* SINGLE LINE CAROUSEL (Never wraps to second row) */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scrollbar-none scroll-smooth pb-1"
      >
        {items.map((item) => (
          <div key={item.id} className="w-[210px] min-[380px]:w-[230px] sm:w-[250px] md:w-[260px] shrink-0">
            <DiagnosticCard item={item} themeColor="indigo" />
          </div>
        ))}
      </div>
    </section>
  );
}

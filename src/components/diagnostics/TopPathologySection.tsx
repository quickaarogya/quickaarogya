'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, FlaskConical, Home } from 'lucide-react';
import { DiagnosticItem } from '@/types';
import { initialPathologyTests } from '@/lib/diagnosticsData';
import { DiagnosticCard } from './DiagnosticCard';

interface TopPathologySectionProps {
  items?: DiagnosticItem[];
}

export function TopPathologySection({ items = initialPathologyTests }: TopPathologySectionProps) {
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
              Top Pathologies
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              <FlaskConical size={11} />
              <span>NABL Certified Labs</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Home size={10} />
              <span>15-Min Home Collection</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            Routine hemograms, lipid panels, metabolic vitals & full body health checks
          </p>
        </div>

        {/* Carousel Navigation Arrows + See All Link */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => scroll('left')}
              aria-label="Previous Pathologies"
              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Next Pathologies"
              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <Link
            href="/appointments?type=pathology"
            className="text-xs font-black text-[#0F766E] hover:underline flex items-center gap-0.5 whitespace-nowrap"
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
            <DiagnosticCard item={item} themeColor="teal" />
          </div>
        ))}
      </div>
    </section>
  );
}

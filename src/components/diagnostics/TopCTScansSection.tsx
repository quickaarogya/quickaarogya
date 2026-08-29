'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Scan, Sparkles } from 'lucide-react';
import { DiagnosticItem } from '@/types';
import { initialCTScans } from '@/lib/diagnosticsData';
import { DiagnosticCard } from './DiagnosticCard';

interface TopCTScansSectionProps {
  items?: DiagnosticItem[];
  itemsPerPage?: number;
}

export function TopCTScansSection({ items = initialCTScans, itemsPerPage = 18 }: TopCTScansSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const currentBatch = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <section className="space-y-3">
      {/* Header with Title, Spec Pill & Controls */}
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
              Top CT Scans
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-[#026dd9] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              <Scan size={11} />
              <span>128-Slice Low Dose</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            Same-day digital film & radiologist report across verified Sagar hospitals
          </p>
        </div>

        {/* Carousel Pagination Controls + See All Link */}
        <div className="flex items-center gap-2 shrink-0">
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
                aria-label="Previous Page"
                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-40"
                disabled={currentPage === 0}
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[10px] font-black text-slate-600 px-1">
                {currentPage + 1}/{totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
                aria-label="Next Page"
                className="w-6 h-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-40"
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          <Link
            href="/appointments?type=ct_scan"
            className="text-xs font-black text-[#026dd9] hover:underline flex items-center gap-0.5 whitespace-nowrap"
          >
            <span>See all</span>
            <ChevronRight size={14} className="shrink-0" />
          </Link>
        </div>
      </div>

      {/* Grid: 3 Lines Max (Up to 18 Items) */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 animate-smooth-fade">
        {currentBatch.map((item) => (
          <DiagnosticCard key={item.id} item={item} themeColor="blue" />
        ))}
      </div>
    </section>
  );
}

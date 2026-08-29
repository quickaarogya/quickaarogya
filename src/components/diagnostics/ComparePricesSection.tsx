'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Building2,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';
import { initialPriceComparisonGroups } from '@/lib/diagnosticsData';
import { TestPriceComparisonGroup, CenterPriceComparison } from '@/types';

export function ComparePricesSection() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ct_scan' | 'pathology' | 'x_ray'>('all');
  const [selectedTestId, setSelectedTestId] = useState<string>(initialPriceComparisonGroups[0].testId);

  const filteredGroups = selectedCategory === 'all'
    ? initialPriceComparisonGroups
    : initialPriceComparisonGroups.filter(g => g.category === selectedCategory);

  // Active test group
  const activeGroup = initialPriceComparisonGroups.find(g => g.testId === selectedTestId) || filteredGroups[0] || initialPriceComparisonGroups[0];

  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#01254e] to-[#023b78] text-white p-4 sm:p-6 lg:p-7 shadow-[0_16px_40px_rgba(2,59,120,0.25)] border border-blue-400/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300">
              <Scale size={18} />
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
              Compare Diagnostic Prices
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-xs font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
              <TrendingDown size={12} />
              <span>Save up to 60%</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1">
            Real-time price transparency across hospitals & NABL certified diagnostic centers in Sagar
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTestId(initialPriceComparisonGroups[0].testId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            All Tests
          </button>
          <button
            onClick={() => {
              setSelectedCategory('ct_scan');
              const firstCT = initialPriceComparisonGroups.find(g => g.category === 'ct_scan');
              if (firstCT) setSelectedTestId(firstCT.testId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'ct_scan'
                ? 'bg-[#026dd9] text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            CT Scans
          </button>
          <button
            onClick={() => {
              setSelectedCategory('pathology');
              const firstPath = initialPriceComparisonGroups.find(g => g.category === 'pathology');
              if (firstPath) setSelectedTestId(firstPath.testId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'pathology'
                ? 'bg-[#0F766E] text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Pathologies
          </button>
          <button
            onClick={() => {
              setSelectedCategory('x_ray');
              const firstXray = initialPriceComparisonGroups.find(g => g.category === 'x_ray');
              if (firstXray) setSelectedTestId(firstXray.testId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === 'x_ray'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Digital X-Rays
          </button>
        </div>
      </div>

      {/* Test Selector Tabs (Select Which Test / Scan to Compare) */}
      <div className="relative z-10 py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none">
        <span className="text-xs font-black text-blue-200 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Filter size={13} /> Select:
        </span>
        {filteredGroups.map((group) => {
          const isSelected = group.testId === activeGroup.testId;
          return (
            <button
              key={group.testId}
              onClick={() => setSelectedTestId(group.testId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-white text-slate-900 border-white shadow-md scale-[1.02]'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md'
              }`}
            >
              {group.testName}
            </button>
          );
        })}
      </div>

      {/* Comparison Grid Section */}
      <div className="relative z-10 space-y-3">
        {/* Active Test Overview Banner */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
              <span>{activeGroup.testName}</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/20 text-blue-100">
                {activeGroup.category.replace('_', ' ')}
              </span>
            </h4>
            <p className="text-xs text-blue-100/90 font-medium mt-0.5">
              {activeGroup.description}
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-400/30 px-3 py-1.5 rounded-xl shrink-0 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-300" />
            <span>Comparing {activeGroup.centers.length} Certified Centers</span>
          </div>
        </div>

        {/* Center Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {activeGroup.centers.map((center) => (
            <div
              key={center.centerId}
              className={`relative rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 ${
                center.isLowestPrice
                  ? 'bg-gradient-to-b from-white to-slate-50 text-slate-900 shadow-[0_16px_36px_rgba(0,0,0,0.3)] border-2 border-emerald-400'
                  : 'bg-white/90 hover:bg-white text-slate-900 shadow-lg border border-white/80'
              }`}
            >
              {/* Highlight Badges on Top */}
              <div className="flex items-center justify-between gap-1 mb-2.5">
                {center.isLowestPrice ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                    <TrendingDown size={11} className="text-emerald-700" />
                    Lowest Price Guarantee
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    <Building2 size={11} className="text-[#026dd9]" />
                    {center.centerType}
                  </span>
                )}

                {/* Rating Badge */}
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                  <Star size={11} fill="#FBBF24" className="text-amber-400" />
                  <span>{center.rating}</span>
                </div>
              </div>

              {/* Center Info */}
              <div className="space-y-1">
                <h5 className="font-black text-sm text-slate-900 leading-tight">
                  {center.centerName}
                </h5>
                <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin size={12} className="text-[#026dd9] shrink-0" />
                  <span className="truncate">{center.locality} ({center.distanceKm} km)</span>
                </p>
                <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200/80">
                  <ShieldCheck size={11} className="inline mr-1" />
                  {center.accreditation}
                </p>
              </div>

              {/* Turnaround & Availability */}
              <div className="my-3 py-2 border-y border-slate-100 space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" /> Report Delivery:
                  </span>
                  <span className="font-black text-slate-900">{center.turnaroundTime}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Zap size={12} className="text-amber-500" /> Next Slot:
                  </span>
                  <span className="font-bold text-[#026dd9]">{center.availableSlot}</span>
                </div>
              </div>

              {/* Price Row & Action CTA */}
              <div className="pt-1 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-slate-900 leading-none">₹{center.price}</span>
                    <span className="text-xs text-slate-400 line-through font-semibold">₹{center.mrp}</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 block mt-0.5">
                    Save ₹{center.savings}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${center.phone}`}
                    className="w-8 h-8 rounded-full bg-[#059669] hover:bg-[#047857] text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer border border-emerald-400/40"
                    title={`Call center directly: ${center.phone}`}
                  >
                    <Phone size={13} className="fill-white text-white" />
                  </a>

                  <Link
                    href={`/appointments?center=${encodeURIComponent(center.centerName)}&test=${encodeURIComponent(activeGroup.testName)}&price=${center.price}`}
                    className={`px-3 py-2 rounded-xl text-xs font-black text-white shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                      center.isLowestPrice ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-[#026dd9] hover:bg-[#0256ab]'
                    }`}
                  >
                    <span>Book Slot</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

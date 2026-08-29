'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Building2,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Activity,
  Layers,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { initialCTScans, initialPathologyTests, initialXRays, initialHospitalAmenities, HospitalAmenityItem } from '@/lib/diagnosticsData';
import { DiagnosticCard } from './DiagnosticCard';
import { ComparePricesSection } from './ComparePricesSection';

interface AllAmenitiesViewProps {
  searchQuery?: string;
  onSelectSubCategory?: (cat: string) => void;
}

export function AllAmenitiesView({ searchQuery = '', onSelectSubCategory }: AllAmenitiesViewProps) {
  const [activeAmenityTab, setActiveAmenityTab] = useState<'all' | 'ct_scan' | 'pathology' | 'x_ray' | 'facilities' | 'compare_prices'>('all');

  const filteredCTScans = useMemo(() => {
    if (!searchQuery) return initialCTScans;
    const q = searchQuery.toLowerCase();
    return initialCTScans.filter(i => i.name.toLowerCase().includes(q) || i.centerName.toLowerCase().includes(q) || (i.locality || '').toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredPathology = useMemo(() => {
    if (!searchQuery) return initialPathologyTests;
    const q = searchQuery.toLowerCase();
    return initialPathologyTests.filter(i => i.name.toLowerCase().includes(q) || i.centerName.toLowerCase().includes(q) || (i.locality || '').toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredXRays = useMemo(() => {
    if (!searchQuery) return initialXRays;
    const q = searchQuery.toLowerCase();
    return initialXRays.filter(i => i.name.toLowerCase().includes(q) || i.centerName.toLowerCase().includes(q) || (i.locality || '').toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredAmenities = useMemo(() => {
    if (!searchQuery) return initialHospitalAmenities;
    const q = searchQuery.toLowerCase();
    return initialHospitalAmenities.filter(a => a.name.toLowerCase().includes(q) || a.centerName.toLowerCase().includes(q) || (a.locality || '').toLowerCase().includes(q));
  }, [searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. AMENITY FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pb-1 pt-0.5 text-xs font-black">
        <button
          onClick={() => setActiveAmenityTab('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeAmenityTab === 'all'
              ? 'bg-[#026dd9] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers size={13} />
          <span>All Amenities ({initialCTScans.length + initialPathologyTests.length + initialXRays.length + initialHospitalAmenities.length})</span>
        </button>

        <button
          onClick={() => setActiveAmenityTab('ct_scan')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeAmenityTab === 'ct_scan'
              ? 'bg-[#026dd9] text-white shadow-xs'
              : 'bg-blue-50 text-[#026dd9] border border-blue-200/60 hover:bg-blue-100'
          }`}
        >
          <span>🔬</span>
          <span>CT Scans ({initialCTScans.length})</span>
        </button>

        <button
          onClick={() => setActiveAmenityTab('pathology')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeAmenityTab === 'pathology'
              ? 'bg-[#0F766E] text-white shadow-xs'
              : 'bg-teal-50 text-[#0F766E] border border-teal-200/60 hover:bg-teal-100'
          }`}
        >
          <span>🧪</span>
          <span>Pathology & Labs ({initialPathologyTests.length})</span>
        </button>

        <button
          onClick={() => setActiveAmenityTab('x_ray')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeAmenityTab === 'x_ray'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 hover:bg-indigo-100'
          }`}
        >
          <span>⚡</span>
          <span>Digital X-Rays ({initialXRays.length})</span>
        </button>

        <button
          onClick={() => setActiveAmenityTab('facilities')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeAmenityTab === 'facilities'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          <span>🏥</span>
          <span>Hospital Facilities & ICU ({initialHospitalAmenities.length})</span>
        </button>

        <button
          onClick={() => setActiveAmenityTab('compare_prices')}
          className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
            activeAmenityTab === 'compare_prices'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100'
          }`}
        >
          <span>⚖️</span>
          <span>Price Comparison</span>
        </button>
      </div>

      {/* 2. SECTION: CT SCANS */}
      {(activeAmenityTab === 'all' || activeAmenityTab === 'ct_scan') && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#026dd9] flex items-center justify-center font-black text-sm shadow-2xs">
                🔬
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  High-Speed 128-Slice CT Scans
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Brain, Chest HRCT, Abdomen CECT & Spine 3D imaging with 2-hour digital films
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#026dd9] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hidden sm:inline">
              {filteredCTScans.length} Scans Available
            </span>
          </div>

          <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredCTScans.map(item => (
              <DiagnosticCard key={item.id} item={item} themeColor="blue" />
            ))}
          </div>
        </section>
      )}

      {/* 3. SECTION: PATHOLOGY & LAB TESTS */}
      {(activeAmenityTab === 'all' || activeAmenityTab === 'pathology') && (
        <section className="space-y-3 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-100 text-[#0F766E] flex items-center justify-center font-black text-sm shadow-2xs">
                🧪
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  NABL Accredited Pathology & Blood Tests
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  15-min free home blood collection • 6-hour verified digital reports on WhatsApp
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 hidden sm:inline">
              {filteredPathology.length} Lab Tests
            </span>
          </div>

          <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredPathology.map(item => (
              <DiagnosticCard key={item.id} item={item} themeColor="teal" />
            ))}
          </div>
        </section>
      )}

      {/* 4. SECTION: DIGITAL X-RAYS */}
      {(activeAmenityTab === 'all' || activeAmenityTab === 'x_ray') && (
        <section className="space-y-3 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm shadow-2xs">
                ⚡
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Direct Digital Radiography (DR) X-Rays
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Low-radiation instant imaging with 20-minute WhatsApp digital film delivery
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 hidden sm:inline">
              {filteredXRays.length} X-Rays
            </span>
          </div>

          <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredXRays.map(item => (
              <DiagnosticCard key={item.id} item={item} themeColor="indigo" />
            ))}
          </div>
        </section>
      )}

      {/* 5. SECTION: HOSPITAL FACILITIES & ICU AMENITIES */}
      {(activeAmenityTab === 'all' || activeAmenityTab === 'facilities') && (
        <section className="space-y-3 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-2xs">
                🏥
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Hospital Facilities, ICU & Critical Care Amenities
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Emergency Trauma, Intensive Care, Dialysis, Blood Bank & Cardiac Cath Lab
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 hidden sm:inline">
              {filteredAmenities.length} Hospital Amenities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredAmenities.map(amenity => (
              <div
                key={amenity.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image and Header */}
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 bg-slate-100 border border-slate-100">
                    <img
                      src={amenity.imageUrl}
                      alt={amenity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star size={10} fill="#FBBF24" className="text-amber-400" />
                      <span>{amenity.ratingAverage}</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 bg-[#026dd9] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      {amenity.badge}
                    </div>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 leading-snug group-hover:text-[#026dd9] transition-colors">
                    {amenity.name}
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 mt-1">
                    <Building2 size={12} className="text-[#026dd9] shrink-0" />
                    <span className="truncate">{amenity.centerName}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 mt-0.5">
                    <MapPin size={10} className="shrink-0" />
                    <span>{amenity.locality}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 font-medium line-clamp-2">
                    {amenity.description}
                  </p>

                  {/* Feature checklist */}
                  <div className="grid grid-cols-2 gap-1 mt-3 pt-2.5 border-t border-slate-100">
                    {amenity.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-[10px] font-bold text-slate-700">
                        <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                    <Clock size={11} />
                    <span className="truncate">{amenity.availability}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={`tel:${amenity.phone}`}
                      className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title={`Call directly: ${amenity.phone}`}
                    >
                      <Phone size={13} className="fill-emerald-600 text-emerald-600" />
                    </a>

                    <a
                      href={`tel:${amenity.phone}`}
                      className="px-3.5 py-1.5 bg-[#026dd9] hover:bg-[#0256ab] text-white text-[11px] font-black rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inquire</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. SECTION: PRICE COMPARISON TOOL */}
      {(activeAmenityTab === 'all' || activeAmenityTab === 'compare_prices') && (
        <section className="pt-4 border-t border-slate-200/80">
          <ComparePricesSection />
        </section>
      )}
    </div>
  );
}

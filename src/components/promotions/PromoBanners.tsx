'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Clock,
  FlaskConical,
  Scan,
  TrendingDown,
  Pill,
  FileText,
  Users,
  Ambulance
} from 'lucide-react';

/* =========================================================================
 * 1. OPD TOKENS & LIVE QUEUE BANNER (DOCTORS HUB - SPOT 1)
 * ========================================================================= */
export function OPDExpressPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(2,109,217,0.22)] border border-blue-400/25 transition-all group">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&auto=format&fit=crop&q=80"
          alt="Hospital OPD"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-[#01254e]/85 to-blue-950/65 backdrop-blur-2xs" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left Column */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border-blue-400/40">
              <Sparkles size={11} className="text-amber-300 fill-amber-300" />
              <span>LIVE OPD QUEUE TRACKING</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-white text-slate-950 shadow-2xs flex items-center gap-1">
              <Zap size={10} className="text-amber-500 fill-amber-500" />
              <span>ZERO HOSPITAL WAITING</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Skip Hospital Lines with Smart OPD Tokens
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            Track your live token number on your phone and arrive right on time across all verified Sagar hospital OPDs.
          </p>
        </div>

        {/* Right Action Button */}
        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/doctors"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sky-500/25"
          >
            <span>Book Doctor Token</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 2. FREE HOME PATHOLOGY SAMPLE COLLECTION BANNER (SPOT 2)
 * ========================================================================= */
export function HomePathologyPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(15,118,110,0.22)] border border-teal-400/25 transition-all group">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&auto=format&fit=crop&q=80"
          alt="Pathology Lab"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-teal-950/85 to-emerald-950/65 backdrop-blur-2xs" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left Column */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
              <FlaskConical size={11} className="text-emerald-300" />
              <span>FREE HOME SAMPLE PICKUP</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-emerald-400 text-slate-950 shadow-2xs flex items-center gap-1">
              <Clock size={10} className="text-slate-950" />
              <span>15-MIN DOORSTEP ARRIVAL</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Blood Tests at Home in 15 Minutes
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            A certified phlebotomist arrives at your home in 15 mins. Accurate NABL verified reports on WhatsApp in 6 hours.
          </p>
        </div>

        {/* Right Action Button */}
        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/doctors?mode=pathology"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25"
          >
            <span>Book Home Collection</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 3. 128-SLICE CT & DIGITAL X-RAY BANNER (SPOT 3)
 * ========================================================================= */
export function DigitalImagingPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(79,70,229,0.22)] border border-indigo-400/25 transition-all group">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1400&auto=format&fit=crop&q=80"
          alt="CT Scan & Imaging"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-indigo-950/85 to-purple-950/65 backdrop-blur-2xs" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left Column */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border-indigo-400/40">
              <Scan size={11} className="text-amber-300" />
              <span>128-SLICE CT & DIGITAL X-RAY</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-indigo-400 text-slate-950 shadow-2xs flex items-center gap-1">
              <Zap size={10} className="text-slate-950" />
              <span>20-MIN FAST REPORTS</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Instant HD Scans & X-Rays in 20 Mins
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            AERB certified low-radiation imaging with instant WhatsApp HD film delivery and senior radiologist verification.
          </p>
        </div>

        {/* Right Action Button */}
        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/doctors?mode=ct_scan"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-indigo-400 hover:bg-indigo-300 text-slate-950 shadow-indigo-500/25"
          >
            <span>Schedule Scan</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 4. 100% PRICE TRANSPARENCY & COMPARISON BANNER (SPOT 4)
 * ========================================================================= */
export function PriceComparisonPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(180,83,9,0.22)] border border-amber-400/25 transition-all group">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1400&auto=format&fit=crop&q=80"
          alt="Price Comparison"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-[#381E02]/85 to-amber-950/65 backdrop-blur-2xs" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left Column */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border-amber-400/40">
              <TrendingDown size={11} className="text-amber-300" />
              <span>100% PRICE TRANSPARENCY</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-amber-400 text-slate-950 shadow-2xs flex items-center gap-1">
              <ShieldCheck size={10} className="text-slate-950" />
              <span>SAVE UP TO 40%</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Compare Scan & Lab Rates Across Sagar
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            Compare verified prices across Sagar's top hospitals and labs. Save up to 40% with zero middleman hospital markups.
          </p>
        </div>

        {/* Right Action Button */}
        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/doctors?mode=compare_prices"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/25"
          >
            <span>Compare Prices Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 5. EXPRESS 10-MIN PHARMA BANNER (PHARMA HUB)
 * ========================================================================= */
export function ExpressPharmaPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(15,118,110,0.22)] border border-teal-400/25 transition-all group">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&auto=format&fit=crop&q=80"
          alt="Express Pharmacy"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-teal-950/85 to-cyan-950/65 backdrop-blur-2xs" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border-teal-400/40">
              <Pill size={11} className="text-teal-300" />
              <span>10-MIN DOORSTEP DELIVERY</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-emerald-400 text-slate-950 shadow-2xs">
              100% GENUINE MEDICINES
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Emergency Medicines Delivered in 10 Mins
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            Order from 24x7 local licensed chemist stores near you with temperature-controlled doorstep packaging.
          </p>
        </div>

        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/pharmacies"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-500/25"
          >
            <span>Order Medicines</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 6. PRESCRIPTION 1-CLICK UPLOAD BANNER
 * ========================================================================= */
export function PrescriptionUploadPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(2,109,217,0.22)] border border-blue-400/25 transition-all group">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1400&auto=format&fit=crop&q=80"
          alt="Prescription"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/85 to-indigo-950/65 backdrop-blur-2xs" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border-blue-400/40">
              <FileText size={11} className="text-amber-300" />
              <span>1-CLICK RX VAULT</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-sky-400 text-slate-950 shadow-2xs">
              60-SEC QUOTES
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Upload Prescription & Get Instant Quotes
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            Certified pharmacists review your Rx in 60 seconds and auto-schedule your regular dosage refills.
          </p>
        </div>

        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/prescriptions"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sky-500/25"
          >
            <span>Upload Prescription</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 7. FAMILY HEALTH & ABHA VAULT BANNER (CARE HUB)
 * ========================================================================= */
export function FamilyHealthPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(225,29,72,0.22)] border border-rose-400/25 transition-all group">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&auto=format&fit=crop&q=80"
          alt="Family Health"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-rose-950/85 to-red-950/65 backdrop-blur-2xs" />
      </div>

      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border-rose-400/40">
              <Users size={11} className="text-rose-300" />
              <span>FAMILY HEALTH VAULT</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-rose-400 text-slate-950 shadow-2xs">
              ABHA LINKED
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            Manage Your Family's Health in One Place
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            Track vital signs, chronic prescription refills, and medical history for parents & children in a single vault.
          </p>
        </div>

        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href="/family"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap bg-rose-400 hover:bg-rose-300 text-slate-950 shadow-rose-500/25"
          >
            <span>Manage Family Vault</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * BACKWARDS COMPATIBILITY EXPORTS
 * ========================================================================= */
export const FullBodyCheckupPromoBanner = HomePathologyPromoBanner;
export const DiagnosticFilmPromoBanner = DigitalImagingPromoBanner;
export const PromoCarouselBanner = HomePathologyPromoBanner;

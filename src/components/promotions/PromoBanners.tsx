'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  CheckCircle2,
  Copy,
  Percent,
  FlaskConical,
  Scan,
  HeartPulse,
  Activity,
  Home,
  Check
} from 'lucide-react';

/* =========================================================================
 * 1. OPD EXPRESS PROMO BANNER (DOCTORS & HOSPITAL OPD)
 * ========================================================================= */
export function OPDExpressPromoBanner() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText('QUICKOPD');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#01254e] via-[#0256ab] to-[#026dd9] text-white p-4 sm:p-6 shadow-[0_12px_36px_rgba(2,109,217,0.25)] border border-blue-300/30">
      {/* Glow shapes */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Message & Highlights */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider border border-white/30 backdrop-blur-md flex items-center gap-1">
              <Zap size={12} className="text-amber-300 fill-amber-300" />
              <span>Zero Waiting Time</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black tracking-wide shadow-2xs">
              ⚡ LIVE TOKEN TRACKING
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
            Skip Hospital OPD Lines with Quick Digital Tokens
          </h3>

          <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
            Get instant queue updates on WhatsApp, arrive right when your number is called, and enjoy verified direct specialist access across all Sagar hospitals.
          </p>

          {/* Perks list */}
          <div className="flex items-center gap-3 sm:gap-5 pt-1 text-[11px] sm:text-xs font-bold text-blue-100/90 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Live Queue Sync</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>100% Refund on Cancellation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Free Digital Prescription</span>
            </span>
          </div>
        </div>

        {/* Right: Coupon & CTA Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
          {/* Promo Code Box */}
          <div
            onClick={copyCode}
            className="group px-3.5 py-2 rounded-2xl bg-white/15 hover:bg-white/25 border border-dashed border-white/40 backdrop-blur-md flex items-center gap-2.5 cursor-pointer transition-all active:scale-95 shadow-inner"
            title="Click to copy promo code"
          >
            <Percent size={14} className="text-amber-300" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-blue-200 tracking-wider">Use Promo Code</span>
              <span className="text-xs font-black text-white font-mono tracking-wider">QUICKOPD</span>
            </div>
            <button className="ml-1 text-xs font-extrabold text-blue-200 group-hover:text-white flex items-center gap-1">
              {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <Link
            href="/doctors"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-blue-50 text-[#026dd9] text-xs sm:text-sm font-black shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Book Doctor OPD Token</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 2. FULL BODY HEALTH CHECKUP PROMO BANNER (PATHOLOGY & PREVENTIVE CARE)
 * ========================================================================= */
export function FullBodyCheckupPromoBanner() {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard?.writeText('HEALTH60');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#032e2a] via-[#09574f] to-[#0F766E] text-white p-4 sm:p-6 shadow-[0_12px_36px_rgba(15,118,110,0.25)] border border-teal-300/30">
      {/* Glow circles */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-teal-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Content */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 text-[10px] sm:text-xs font-black uppercase tracking-wider border border-emerald-300/40 backdrop-blur-md flex items-center gap-1">
              <Sparkles size={12} className="text-emerald-300" />
              <span>Full Body Master Checkup</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] sm:text-xs font-black tracking-wide shadow-2xs">
              SAVE 64% TODAY
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
            Comprehensive 84-Parameter Health Checkup Package
          </h3>

          <p className="text-xs sm:text-sm text-teal-100/90 font-medium leading-relaxed">
            Includes CBC, Lipid, Liver (LFT), Kidney (KFT), Thyroid, Blood Sugar, Vitamin D3 & B12 with free certified home blood sample collection in 15 minutes.
          </p>

          {/* Highlights */}
          <div className="flex items-center gap-3 sm:gap-5 pt-1 text-[11px] sm:text-xs font-bold text-teal-100 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Home size={14} className="text-emerald-300 shrink-0" />
              <span>Free 15-Min Home Sample Pickup</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-300 shrink-0" />
              <span>NABL & ISO Accredited Reports</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-300 shrink-0" />
              <span>Smart Digital Report in 12h</span>
            </span>
          </div>
        </div>

        {/* Right Pricing & Action */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">₹1,499</span>
            <span className="text-sm text-teal-200/80 line-through font-bold">₹4,200</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              64% OFF
            </span>
          </div>

          {/* Promo Code Box */}
          <div
            onClick={copyCode}
            className="group px-3.5 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-dashed border-white/40 backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            title="Click to copy promo code"
          >
            <span className="text-[10px] font-black text-teal-200">CODE:</span>
            <span className="text-xs font-black text-white font-mono tracking-wider">HEALTH60</span>
            <button className="ml-1 text-xs font-extrabold text-teal-200 group-hover:text-white flex items-center gap-1">
              {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <Link
            href="/appointments?type=pathology&package=full_body_84"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-teal-50 text-[#0F766E] text-xs sm:text-sm font-black shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Book Checkup @ ₹1,499</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 3. DIGITAL SCAN & X-RAY PROMO BANNER (IMAGING & SAME DAY FILMS)
 * ========================================================================= */
export function DiagnosticFilmPromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#3730A3] to-[#4F46E5] text-white p-4 sm:p-6 shadow-[0_12px_36px_rgba(79,70,229,0.25)] border border-indigo-300/30">
      {/* Background glow */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Section */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider border border-white/30 backdrop-blur-md flex items-center gap-1">
              <Scan size={12} className="text-amber-300" />
              <span>Digital Imaging Express</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] sm:text-xs font-black tracking-wide shadow-2xs">
              ⚡ 20-MIN DIGITAL REPORT
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
            Direct Digital Radiography (DR) & CT Scans with Instant Mobile Delivery
          </h3>

          <p className="text-xs sm:text-sm text-indigo-100/90 font-medium leading-relaxed">
            High-clarity digital X-ray films, 128-slice CT scans, and ultrasound reports delivered directly to your WhatsApp and Quick Aarogya health vault within 20 minutes.
          </p>

          <div className="flex items-center gap-3 sm:gap-5 pt-1 text-[11px] sm:text-xs font-bold text-indigo-100 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-300 shrink-0" />
              <span>Low Radiation AERB Certified</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-300 shrink-0" />
              <span>Senior Radiologist Signed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-indigo-200 shrink-0" />
              <span>No Prior Fasting for Plain X-Rays</span>
            </span>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0">
          <div className="text-left lg:text-right">
            <span className="text-xs text-indigo-200 font-bold block">Digital X-Rays Starting At</span>
            <span className="text-2xl sm:text-3xl font-black text-white block">₹299 <span className="text-xs text-indigo-200 font-normal">only</span></span>
          </div>

          <Link
            href="/appointments?type=x_ray"
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs sm:text-sm font-black shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore All Scan Centers</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

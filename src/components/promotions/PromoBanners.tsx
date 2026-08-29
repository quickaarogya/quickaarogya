'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Home,
  CheckCircle2
} from 'lucide-react';

export interface PromoSlide {
  id: string;
  tag: string;
  badge: string;
  title: string;
  highlightText: string;
  subtitle: string;
  promoCode: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  bgImage: string;
  overlayGradient: string;
  pillColor: string;
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'pathology-home',
    tag: 'FREE HOME SAMPLE PICKUP',
    badge: '15-MIN ARRIVAL',
    title: 'Blood Tests at Home in 15 Minutes',
    highlightText: 'Free Doorstep Sample Pickup',
    subtitle: 'A certified phlebotomist arrives at your home in 15 mins. NABL reports on WhatsApp in 6 hours.',
    promoCode: 'HOMEFREE',
    ctaText: 'Book Free Home Pickup',
    ctaLink: '/doctors?mode=pathology',
    ctaColor: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-300/60',
    bgImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&auto=format&fit=crop&q=80',
    overlayGradient: 'from-slate-950/95 via-slate-950/80 to-teal-950/60',
    pillColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
  },
  {
    id: 'opd-express',
    tag: 'LIVE OPD QUEUE TRACKING',
    badge: 'ZERO WAITING',
    title: 'Skip Hospital Lines with Smart OPD Tokens',
    highlightText: 'Live WhatsApp Queue Sync',
    subtitle: 'Track your live token number on your phone and arrive right on time across all Sagar hospitals.',
    promoCode: 'QUICKOPD',
    ctaText: 'Get Instant OPD Token',
    ctaLink: '/doctors',
    ctaColor: 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sky-500/30 ring-2 ring-sky-300/60',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&auto=format&fit=crop&q=80',
    overlayGradient: 'from-slate-950/95 via-slate-950/80 to-blue-950/60',
    pillColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40'
  },
  {
    id: 'scan-express',
    tag: '128-SLICE CT & DIGITAL X-RAY',
    badge: '20-MIN REPORTS',
    title: 'Instant CT Scans & X-Rays in 20 Mins',
    highlightText: 'Up to 40% Transparent Savings',
    subtitle: 'AERB certified digital radiography & 128-slice CT scans with instant WhatsApp film delivery.',
    promoCode: 'SCAN20',
    ctaText: 'Compare Scan Prices',
    ctaLink: '/doctors?mode=compare_prices',
    ctaColor: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-300/60',
    bgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1400&auto=format&fit=crop&q=80',
    overlayGradient: 'from-slate-950/95 via-slate-950/80 to-purple-950/60',
    pillColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40'
  }
];

/* =========================================================================
 * PROMO CAROUSEL BANNER (HIGH IMPACT, BIGGER TEXT, PUNCHY & ATTRACTIVE)
 * ========================================================================= */
export function PromoCarouselBanner({
  initialSlide = 0,
  autoPlay = true,
  interval = 5000
}: {
  initialSlide?: number;
  autoPlay?: boolean;
  interval?: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval]);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % PROMO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  };

  const slide = PROMO_SLIDES[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl text-white shadow-[0_16px_45px_rgba(0,0,0,0.22)] border border-white/20 transition-all group"
    >
      {/* Background Image with Dark Gradient Tint */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.bgImage}
          alt={slide.title}
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayGradient} backdrop-blur-2xs`} />
      </div>

      {/* Decorative ambient glowing spheres */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Slide Main Content */}
      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Column: Big Headline & Punchy Description */}
        <div className="space-y-1.5 max-w-2xl">
          {/* Top Chips Row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 ${slide.pillColor}`}>
              <Sparkles size={12} className="text-amber-300 fill-amber-300" />
              <span>{slide.tag}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wide bg-white text-slate-950 shadow-xs flex items-center gap-1">
              <Zap size={11} className="text-amber-500 fill-amber-500" />
              <span>{slide.badge}</span>
            </span>
          </div>

          {/* Big Bold Headline */}
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {slide.title}
          </h3>

          {/* Punchy Subtitle */}
          <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed drop-shadow-xs max-w-xl">
            {slide.subtitle}
          </p>
        </div>

        {/* Right Column: Promo Code Box + Big CTA Button */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          {/* Promo Code Pill */}
          <div
            onClick={() => copyCode(slide.promoCode)}
            className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-dashed border-white/40 backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-inner"
            title="Click to copy promo code"
          >
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-black uppercase text-slate-300 tracking-wider">Use Code</span>
              <span className="text-xs font-black text-white font-mono tracking-wider">{slide.promoCode}</span>
            </div>
            <button className="text-[11px] font-black text-slate-200 hover:text-white flex items-center gap-1 ml-1">
              {copiedCode === slide.promoCode ? (
                <Check size={13} className="text-emerald-300" />
              ) : (
                <Copy size={12} />
              )}
              <span>{copiedCode === slide.promoCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Big High-Converting CTA Button */}
          <Link
            href={slide.ctaLink}
            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${slide.ctaColor}`}
          >
            <span>{slide.ctaText}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Carousel Bottom Control Bar: Dots & Navigation Arrows */}
      <div className="relative z-10 px-4 sm:px-7 pb-2.5 pt-0 flex items-center justify-between">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {PROMO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-7 bg-white shadow-xs' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            className="w-7 h-7 rounded-full bg-black/45 hover:bg-black/75 border border-white/25 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
            title="Previous Promo"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextSlide}
            className="w-7 h-7 rounded-full bg-black/45 hover:bg-black/75 border border-white/25 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
            title="Next Promo"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * BACKWARDS COMPATIBILITY EXPORTS
 * ========================================================================= */
export function OPDExpressPromoBanner() {
  return <PromoCarouselBanner initialSlide={1} />;
}

export function FullBodyCheckupPromoBanner() {
  return <PromoCarouselBanner initialSlide={0} />;
}

export function DiagnosticFilmPromoBanner() {
  return <PromoCarouselBanner initialSlide={2} />;
}

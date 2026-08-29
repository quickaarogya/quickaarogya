'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  Percent,
  Home,
  Check,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Scan,
  Users
} from 'lucide-react';

export interface PromoSlide {
  id: string;
  tag: string;
  tagColor: string;
  badge: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  promoCode: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  bgImage: string;
  gradient: string;
  perks: string[];
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'pathology-home',
    tag: 'FREE HOME SAMPLE PICKUP',
    tagColor: 'text-teal-200 border-teal-300/40 bg-teal-900/50',
    badge: '⚡ 15-MIN DOORSTEP ARRIVAL',
    badgeBg: 'bg-emerald-400 text-slate-950',
    title: 'Get Pathology Reports Directly From the Comfort of Your Home',
    subtitle: 'A certified medical phlebotomist arrives at your doorstep in 15 minutes to collect your blood sample. Accurate NABL reports delivered straight to your WhatsApp in 6 hours.',
    promoCode: 'HOMEFREE',
    ctaText: 'Book Free Home Pickup',
    ctaLink: '/doctors?mode=pathology',
    ctaColor: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950',
    bgImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80',
    gradient: 'from-slate-950/95 via-teal-950/85 to-emerald-950/75',
    perks: ['Zero Home Visit Charges', 'NABL Accredited Lab Testing', 'Verified Digital WhatsApp Report']
  },
  {
    id: 'opd-express',
    tag: 'LIVE QUEUE TRACKING',
    tagColor: 'text-blue-200 border-blue-300/40 bg-blue-900/50',
    badge: '⚡ ZERO HOSPITAL WAITING',
    badgeBg: 'bg-amber-400 text-slate-950',
    title: 'Skip Crowded Hospital Lines with Smart Digital OPD Tokens',
    subtitle: 'Track live doctor consultation queues on your phone and arrive right when your number is called across top verified Sagar hospital departments.',
    promoCode: 'QUICKOPD',
    ctaText: 'Book Doctor OPD Token',
    ctaLink: '/doctors',
    ctaColor: 'bg-blue-500 hover:bg-blue-400 text-white',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    gradient: 'from-slate-950/95 via-[#01254e]/85 to-blue-950/75',
    perks: ['Live WhatsApp Queue Sync', '100% Refund on Cancellation', 'Free Digital Rx Storage']
  },
  {
    id: 'scan-express',
    tag: '128-SLICE CT & DIGITAL X-RAY',
    tagColor: 'text-indigo-200 border-indigo-300/40 bg-indigo-900/50',
    badge: '⚡ 20-MIN REPORT DELIVERY',
    badgeBg: 'bg-indigo-400 text-slate-950',
    title: 'Instant High-Resolution CT Scans & Digital X-Rays',
    subtitle: 'Ultra-low radiation AERB certified imaging with sub-millimeter precision. High-definition digital films delivered in 20 minutes with senior radiologist certification.',
    promoCode: 'SCAN20',
    ctaText: 'Compare Scan Prices',
    ctaLink: '/doctors?mode=compare_prices',
    ctaColor: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    bgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
    gradient: 'from-slate-950/95 via-indigo-950/85 to-purple-950/75',
    perks: ['Low Radiation DR Film', 'Same-Day Film & CD Handover', 'Up to 40% Transparent Savings']
  }
];

/* =========================================================================
 * PROMO CAROUSEL BANNER (COMPACT HEIGHT, RICH BACKGROUNDS, NATIVE ENGLISH)
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
      className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-white/15 transition-all group"
    >
      {/* Background Image with Dark Gradient Tint */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.bgImage}
          alt={slide.title}
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} backdrop-blur-2xs`} />
      </div>

      {/* Decorative ambient glowing radial spheres */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none z-0" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none z-0" />

      {/* Slide Content Container (Compact Height: min-h-[145px] sm:min-h-[155px]) */}
      <div className="relative z-10 p-3.5 sm:p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-h-[145px] sm:min-h-[155px]">
        {/* Left Column: Tag, Title, Subtitle, Perks */}
        <div className="space-y-1 sm:space-y-1.5 max-w-3xl">
          {/* Top Chips Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1 ${slide.tagColor}`}>
              <Sparkles size={11} className="text-amber-300" />
              <span>{slide.tag}</span>
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide shadow-2xs ${slide.badgeBg}`}>
              {slide.badge}
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white tracking-tight leading-snug drop-shadow-xs">
            {slide.title}
          </h3>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-slate-200/90 font-medium leading-relaxed line-clamp-2 max-w-2xl">
            {slide.subtitle}
          </p>

          {/* Perks Bar */}
          <div className="flex items-center gap-3 sm:gap-4 pt-0.5 text-[10px] sm:text-[11px] font-bold text-slate-200 flex-wrap">
            {slide.perks.map((perk, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <span className="truncate">{perk}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Promo Code Box + Action Button */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
          {/* Promo Code Box */}
          <div
            onClick={() => copyCode(slide.promoCode)}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-dashed border-white/35 backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-inner"
            title="Click to copy promo code"
          >
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-black uppercase text-slate-300 tracking-wider">Use Code</span>
              <span className="text-[11px] font-black text-white font-mono tracking-wider">{slide.promoCode}</span>
            </div>
            <button className="text-[10px] font-black text-slate-200 hover:text-white flex items-center gap-0.5 ml-1">
              {copiedCode === slide.promoCode ? (
                <Check size={12} className="text-emerald-300" />
              ) : (
                <Copy size={11} />
              )}
              <span>{copiedCode === slide.promoCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* CTA Button */}
          <Link
            href={slide.ctaLink}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs font-black shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${slide.ctaColor}`}
          >
            <span>{slide.ctaText}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Dot Indicators */}
      <div className="relative z-10 px-3.5 pb-2 pt-0 flex items-center justify-between">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {PROMO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-6 bg-white shadow-xs' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevSlide}
            className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/65 border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
            title="Previous Promo"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={nextSlide}
            className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/65 border border-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
            title="Next Promo"
          >
            <ChevronRight size={13} />
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

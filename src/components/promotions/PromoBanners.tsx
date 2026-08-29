'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

export interface PromoSlide {
  id: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
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
    subtitle: 'A certified phlebotomist arrives at your home in 15 mins. NABL reports on WhatsApp in 6 hours.',
    ctaText: 'Book Home Collection',
    ctaLink: '/doctors?mode=pathology',
    ctaColor: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/25',
    bgImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1400&auto=format&fit=crop&q=80',
    overlayGradient: 'from-slate-950/95 via-slate-950/80 to-teal-950/60',
    pillColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
  },
  {
    id: 'opd-express',
    tag: 'LIVE OPD QUEUE TRACKING',
    badge: 'ZERO WAITING',
    title: 'Skip Hospital Lines with Smart OPD Tokens',
    subtitle: 'Track your live token number on your phone and arrive right on time across all Sagar hospitals.',
    ctaText: 'Get OPD Token',
    ctaLink: '/doctors',
    ctaColor: 'bg-sky-400 hover:bg-sky-300 text-slate-950 shadow-sky-500/25',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1400&auto=format&fit=crop&q=80',
    overlayGradient: 'from-slate-950/95 via-slate-950/80 to-blue-950/60',
    pillColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40'
  },
  {
    id: 'scan-express',
    tag: '128-SLICE CT & DIGITAL X-RAY',
    badge: '20-MIN REPORTS',
    title: 'Instant CT Scans & X-Rays in 20 Mins',
    subtitle: 'AERB certified digital radiography & 128-slice CT scans with instant WhatsApp film delivery.',
    ctaText: 'Compare Prices',
    ctaLink: '/doctors?mode=compare_prices',
    ctaColor: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/25',
    bgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1400&auto=format&fit=crop&q=80',
    overlayGradient: 'from-slate-950/95 via-slate-950/80 to-purple-950/60',
    pillColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40'
  }
];

/* =========================================================================
 * PROMO CAROUSEL BANNER (MINIMAL, BIG TEXT, RIGHT-ALIGNED COMPACT BUTTON)
 * ========================================================================= */
export function PromoCarouselBanner({
  initialSlide = 0,
  autoPlay = true,
  interval = 5500
}: {
  initialSlide?: number;
  autoPlay?: boolean;
  interval?: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % PROMO_SLIDES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval]);

  const slide = PROMO_SLIDES[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl text-white shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-white/20 transition-all group"
    >
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slide.bgImage}
          alt={slide.title}
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayGradient} backdrop-blur-2xs`} />
      </div>

      {/* Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Main Content Row: Left Details + Right Minimal Button */}
      <div className="relative z-10 p-4 sm:p-5 lg:px-7 lg:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left Column: Chips, Big Headline & Subtitle */}
        <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
          {/* Top Chips */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 ${slide.pillColor}`}>
              <Sparkles size={11} className="text-amber-300 fill-amber-300" />
              <span>{slide.tag}</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide bg-white text-slate-950 shadow-2xs flex items-center gap-1">
              <Zap size={10} className="text-amber-500 fill-amber-500" />
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

        {/* Right Column: Minimal, Compact Action Button */}
        <div className="shrink-0 flex items-center self-start sm:self-center">
          <Link
            href={slide.ctaLink}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${slide.ctaColor}`}
          >
            <span>{slide.ctaText}</span>
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
export function OPDExpressPromoBanner() {
  return <PromoCarouselBanner initialSlide={1} />;
}

export function FullBodyCheckupPromoBanner() {
  return <PromoCarouselBanner initialSlide={0} />;
}

export function DiagnosticFilmPromoBanner() {
  return <PromoCarouselBanner initialSlide={2} />;
}

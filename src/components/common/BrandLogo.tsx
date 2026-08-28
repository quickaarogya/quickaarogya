'use client';

import React from 'react';

interface BrandLogoProps {
  brandId: string;
  className?: string;
}

export default function BrandLogo({ brandId, className = "w-5 h-5" }: BrandLogoProps) {
  switch (brandId) {
    case 'apollo':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#0F766E" />
          <path d="M50 18L64 42H36L50 18Z" fill="#FBBF24" />
          <path d="M50 36V78M30 54H70" stroke="white" strokeWidth="10" strokeLinecap="round" />
          <circle cx="50" cy="24" r="5" fill="#DC2626" />
        </svg>
      );

    case 'cipla':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#1E3A8A" />
          <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="8" strokeDasharray="16 6" />
          <text x="50" y="58" fill="white" fontSize="24" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            Cipla
          </text>
        </svg>
      );

    case 'gsk':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#EA580C" />
          <path
            d="M50 16C30 16 20 26 20 50C20 74 30 84 50 84C70 84 80 74 80 50C80 26 70 16 50 16Z"
            fill="#F97316"
          />
          <text x="50" y="58" fill="white" fontSize="22" fontWeight="900" textAnchor="middle" letterSpacing="-1" fontFamily="sans-serif">
            gsk
          </text>
        </svg>
      );

    case 'sun_pharma':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#B45309" />
          <circle cx="50" cy="50" r="22" fill="#F59E0B" />
          <path d="M50 12V24M50 76V88M12 50H24M76 50H88M23 23L32 32M68 68L77 77M77 23L68 32M32 68L23 77" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'dr_reddy':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#6D28D9" />
          <circle cx="36" cy="42" r="16" fill="#A78BFA" fillOpacity="0.8" />
          <circle cx="64" cy="42" r="16" fill="#C4B5FD" fillOpacity="0.8" />
          <circle cx="50" cy="66" r="16" fill="#EDE9FE" fillOpacity="0.9" />
          <text x="50" y="56" fill="#4C1D95" fontSize="14" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            DRL
          </text>
        </svg>
      );

    case 'abbott':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#0284C7" />
          <path
            d="M32 68V36C32 26 42 22 52 22C64 22 72 30 72 44V68M32 48H72"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="52" cy="48" r="7" fill="#38BDF8" />
        </svg>
      );

    case 'himalaya':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#047857" />
          <path
            d="M50 18C50 18 68 28 68 50C68 66 54 78 50 82C46 78 32 66 32 50C32 28 50 18 50 18Z"
            fill="#34D399"
          />
          <path
            d="M50 28V76M50 48L62 38M50 58L38 48"
            stroke="#064E3B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mankind':
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="100" height="100" rx="22" fill="#DC2626" />
          <path d="M26 72V32L50 56L74 32V72" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return (
        <div className={`rounded-lg bg-teal-600 text-white font-black text-[10px] flex items-center justify-center ${className}`}>
          {brandId.substring(0, 2).toUpperCase()}
        </div>
      );
  }
}

'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  Home,
  Briefcase,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Navigation,
  ShieldCheck,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  title: string;
  address: string;
  tag: string;
}

const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    type: 'home',
    title: 'Home (Default)',
    address: 'Flat 402, Heritage Heights, Green Park, New Delhi',
    tag: '10 Mins Delivery'
  },
  {
    id: 'addr-2',
    type: 'work',
    title: 'Work / Office',
    address: 'Tower B, Cyber City, Phase 2, Gurugram',
    tag: '12 Mins Delivery'
  },
  {
    id: 'addr-3',
    type: 'other',
    title: 'Parents House',
    address: 'B-14, Shivalik Enclave, Malviya Nagar, New Delhi',
    tag: '15 Mins Delivery'
  }
];

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (addr: string) => void;
}

export default function LocationModal({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddrId, setSelectedAddrId] = useState('addr-1');
  const [activeAddress, setActiveAddress] = useState(currentAddress);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectAddress(activeAddress);
    onClose();
  };

  const handleSelectSaved = (saved: SavedAddress) => {
    setSelectedAddrId(saved.id);
    setActiveAddress(saved.address);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col max-w-lg mx-auto shadow-2xl animate-in slide-in-from-bottom duration-250 select-none">
      {/* 1. NATIVE MOBILE APP TOP BAR WITH BACK BUTTON */}
      <header className="px-4 py-3 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors border border-slate-200/80 active:scale-95"
          >
            <ChevronLeft size={22} className="text-slate-800" />
          </button>

          <div>
            <h2 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
              Confirm map pin location
            </h2>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Accurate pin ensures 10-minute medicine dispatch
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold">
          <MapPin size={18} />
        </div>
      </header>

      {/* 2. SEARCH AREA BAR */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search for area, street name, apartment..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-medium placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 p-1 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 3. INTERACTIVE FULL-WIDTH MAP WITH VECTOR PIN & RADIUS */}
      <div className="relative h-56 sm:h-64 bg-[#EBF4F6] shrink-0 overflow-hidden flex items-center justify-center border-b border-slate-200">
        {/* Map Vector Grid Graphics */}
        <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="locMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="#F1F5F9" />
          <rect width="100%" height="100%" fill="url(#locMapGrid)" />
          {/* Road Paths */}
          <path d="M-50,80 Q120,60 220,130 T500,90" fill="none" stroke="#FFFFFF" strokeWidth="18" />
          <path d="M-50,80 Q120,60 220,130 T500,90" fill="none" stroke="#E2E8F0" strokeWidth="14" />
          <path d="M120,-20 Q160,100 180,300" fill="none" stroke="#FFFFFF" strokeWidth="14" />
          <path d="M120,-20 Q160,100 180,300" fill="none" stroke="#E2E8F0" strokeWidth="10" />
          {/* Delivery Radius Geo Polygon */}
          <polygon
            points="100,50 320,30 390,180 240,240 80,170"
            fill="#0F766E"
            fillOpacity="0.12"
            stroke="#0F766E"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Center Animated Map Pin */}
        <div className="relative z-10 flex flex-col items-center animate-bounce-subtle">
          {/* Tooltip Card */}
          <div className="bg-[#1C1C1C] text-white text-[11px] font-bold py-1 px-3 rounded-lg shadow-xl mb-1 text-center whitespace-nowrap border border-slate-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
            <span>Your order will be delivered here</span>
          </div>

          {/* Map Pin Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-[#0F766E]/20">
              <MapPin size={20} className="fill-white text-[#0F766E]" />
            </div>
            <div className="w-4 h-1.5 bg-black/25 rounded-full blur-xs absolute -bottom-1" />
          </div>
        </div>

        {/* GPS Locate Button */}
        <button
          onClick={() => {
            setActiveAddress('Flat 402, Heritage Heights, Green Park, New Delhi');
          }}
          className="absolute bottom-3 right-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Crosshair size={14} className="text-[#0F766E]" />
          <span>Use GPS Location</span>
        </button>
      </div>

      {/* 4. ACTIVE ADDRESS & SAVED ADDRESSES SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {/* Delivering Order To Card */}
        <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-200/80 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Navigation size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block">
                Delivering your order to:
              </span>
              <p className="text-xs font-extrabold text-slate-900 mt-0.5 leading-snug">
                {activeAddress}
              </p>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <ShieldCheck size={12} /> ⚡ Neighborhood Pharmacy 1.2 km away
              </span>
            </div>
          </div>
        </div>

        {/* Saved Addresses List */}
        <div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 block">
            Saved Delivery Addresses
          </span>

          <div className="space-y-2">
            {SAVED_ADDRESSES.map(saved => {
              const isSelected = selectedAddrId === saved.id;
              return (
                <div
                  key={saved.id}
                  onClick={() => handleSelectSaved(saved)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50/40 border-[#0F766E] ring-1 ring-[#0F766E]/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {saved.type === 'home' && <Home size={15} />}
                      {saved.type === 'work' && <Briefcase size={15} />}
                      {saved.type === 'other' && <Users size={15} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{saved.title}</span>
                        <span className="text-[10px] bg-teal-100 text-[#0F766E] px-1.5 py-0.2 rounded font-bold">
                          {saved.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-[280px]">
                        {saved.address}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 ml-2">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. FIXED BOTTOM STICKY ACTION BAR */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0 shadow-lg">
        <Button
          onClick={handleConfirm}
          className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
        >
          <span>Confirm Location & Continue</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

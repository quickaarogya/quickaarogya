'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ChevronRight, X, Zap } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';

export default function CartTopAlert() {
  const pathname = usePathname();
  const { isAlertOpen, dismissAlert, getTotalCount, getTotalPrice, lastActionItem } = useCartStore();

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  // Swipe / Drag state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Auto dismiss after 4.5 seconds
  useEffect(() => {
    if (isAlertOpen) {
      const timer = setTimeout(() => {
        dismissAlert();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isAlertOpen, totalCount, dismissAlert]);

  // If we are already on the /cart page, do not show top alert
  if (!isAlertOpen || totalCount === 0 || pathname === '/cart') {
    return null;
  }

  // Touch Drag Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPosRef.current.x;
    const dy = touch.clientY - startPosRef.current.y;
    // Allow dragging upwards, left, or right
    setDragOffset({ x: dx, y: Math.min(0, dy) });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged sufficiently up, left, or right -> dismiss
    if (
      Math.abs(dragOffset.x) > 60 ||
      dragOffset.y < -35
    ) {
      dismissAlert();
    }
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <aside
      aria-label="Cart Notification Alert"
      role="status"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 select-none animate-in slide-in-from-top-4 fade-in-50 duration-200"
    >
      <div className="bg-[#0F766E] text-white rounded-2xl p-3 shadow-2xl border border-teal-400/80 flex items-center justify-between gap-2.5 backdrop-blur-md">
        {/* Left: Icon / Thumbnail & Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-white relative">
            <ShoppingBag size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2DD4BF] text-[#0F766E] text-[10px] font-black rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-black text-xs sm:text-sm text-white tracking-tight truncate">
                {lastActionItem?.medicine?.brandName || `${totalCount} Items`}
              </span>
              <span className="text-xs font-bold text-teal-200">• ₹{totalPrice}</span>
            </div>
            <div className="text-[10px] text-teal-100 font-medium flex items-center gap-1 mt-0.5">
              <Zap size={11} className="text-[#2DD4BF] fill-[#2DD4BF]" />
              <span>⚡ 10 mins doorstep delivery</span>
            </div>
          </div>
        </div>

        {/* Right: View Cart Button & Cross Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/cart"
            onClick={dismissAlert}
            className="bg-white hover:bg-teal-50 text-[#0F766E] font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 active:scale-95"
          >
            <span>View Cart</span>
            <ChevronRight size={13} />
          </Link>

          <button
            onClick={dismissAlert}
            aria-label="Dismiss Cart Alert"
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors active:scale-95"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

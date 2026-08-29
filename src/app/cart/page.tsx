'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  FileText
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { AarogyaStorage } from '@/lib/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalCount, getTotalPrice } = useCartStore();
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Heritage Heights, Green Park, New Delhi');

  const totalMRP = items.reduce((sum, item) => sum + (item.medicine.mrp || item.medicine.price * 1.15) * item.quantity, 0);
  const totalPrice = getTotalPrice();
  const discountSavings = Math.max(0, Math.round(totalMRP - totalPrice));
  const deliveryFee = totalPrice >= 99 ? 0 : 25;
  const handlingFee = 4;
  const grandTotal = Math.round(totalPrice + deliveryFee + handlingFee);

  const hasRxItems = items.some(item => item.medicine.prescriptionRequired);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    const newOrderId = `QA-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newOrderId);

    AarogyaStorage.placePharmacyOrder({
      id: `ord-${Date.now()}`,
      orderNumber: newOrderId,
      patientProfileId: AarogyaStorage.getActiveProfileId() || 'usr-101',
      patientName: `${AarogyaStorage.getUserProfile()?.firstName || 'Arjun'} ${AarogyaStorage.getUserProfile()?.lastName || 'Sharma'}`,
      pharmacyId: 'pharma-1',
      pharmacyName: 'Apollo 24|7 Express Pharmacy',
      items: items.map(i => ({
        medicineId: i.medicine.id,
        medicineName: i.medicine.brandName,
        genericName: i.medicine.genericName,
        strength: i.medicine.strength,
        form: i.medicine.form,
        quantity: i.quantity,
        unitPrice: i.medicine.price,
        mrp: i.medicine.mrp,
        totalPrice: i.medicine.price * i.quantity,
        requiresPrescription: i.medicine.prescriptionRequired
      })),
      subtotal: totalPrice,
      deliveryFee: deliveryFee,
      totalAmount: grandTotal,
      deliveryType: 'delivery',
      deliveryAddress: deliveryAddress,
      status: 'confirmed',
      requiresPrescription: hasRxItems,
      prescriptionVerified: true,
      estimatedDeliveryTime: 'Arriving in ~10 mins',
      createdAt: new Date().toISOString(),
      paymentMethod: 'upi',
      paymentStatus: 'paid'
    });

    clearCart();
    setIsOrdered(true);
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto shadow-inner">
            <Zap className="w-8 h-8 fill-[#0F766E]" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#0F766E] text-white text-[11px] font-black uppercase tracking-wider">
              ⚡ 10-Minute Guaranteed Delivery
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">Order Confirmed!</h1>
            <p className="text-xs text-slate-500 mt-1">
              Order <strong className="text-slate-900 font-mono">#{orderId}</strong> is being packed by your neighborhood partner.
            </p>
          </div>

          <Card className="p-4 text-left space-y-2.5 bg-slate-50 border-slate-100 rounded-2xl">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Estimated Delivery:</span>
              <span className="font-extrabold text-[#0F766E] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Within 10 minutes
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Delivering To:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[160px]">{deliveryAddress}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-200 pt-2 font-black">
              <span>Total Paid:</span>
              <span className="text-[#0F766E] text-sm">₹{grandTotal}</span>
            </div>
          </Card>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/pharmacies">
              <Button className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                <span>Track 10-Min Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pharmacies">
              <Button variant="ghost" className="w-full text-xs font-bold text-slate-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 text-slate-900 select-none">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4 my-6 max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto shadow-inner border border-teal-100">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-black text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Medicines, first-aid essentials, and daily wellness items delivered to your doorstep in 10 minutes.
            </p>
            <Button asChild className="bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-black px-6 h-10 rounded-2xl shadow-md">
              <Link href="/pharmacies">
                Browse 10-Min Quick Meds
              </Link>
            </Button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start space-y-6 lg:space-y-0">
            {/* Left 8 Columns: Delivery Banner + Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {/* Delivery Banner */}
              <div className="glass-card p-4 flex items-center justify-between border-teal-200/80 bg-teal-50/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-[#0F766E] text-white p-2.5 rounded-2xl shadow-xs shrink-0">
                    <Zap className="w-5 h-5 fill-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-[#0F766E]">Delivery in 10 minutes</h3>
                    <p className="text-xs text-slate-600 font-medium truncate">{deliveryAddress}</p>
                  </div>
                </div>
                <Badge className="bg-[#0F766E] text-white text-xs font-black shrink-0 px-3 py-1">FASTEST 10-MIN</Badge>
              </div>

              {/* Cart Items List */}
              <div className="glass-card p-5 divide-y divide-slate-100/80">
                <div className="flex items-center justify-between pb-3 mb-2">
                  <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider">Cart Items ({getTotalCount()})</h2>
                  <Link href="/pharmacies" className="text-xs font-black text-[#0F766E] hover:underline flex items-center gap-1">
                    <span>+ Add More Items</span>
                  </Link>
                </div>

                {items.map(item => (
                  <div key={item.medicine.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-white p-1 shrink-0 border border-slate-100 shadow-2xs flex items-center justify-center overflow-hidden">
                        <img
                          src={item.medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80'}
                          alt={item.medicine.brandName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80';
                          }}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">{item.medicine.brandName}</h4>
                        <p className="text-xs text-slate-400 font-medium truncate">{item.medicine.strength || item.medicine.genericName}</p>
                        <span className="font-black text-sm text-slate-900 mt-1 block">
                          ₹{item.medicine.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-[#0F766E] text-white rounded-2xl p-1 shadow-xs shrink-0">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) removeItem(item.medicine.id);
                          else updateQuantity(item.medicine.id, item.quantity - 1);
                        }}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/20 rounded-xl font-bold cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="px-3 text-sm font-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white/20 rounded-xl font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Columns: Bill Details & Place Order CTA */}
            <div className="lg:col-span-4 space-y-4">
              {/* Bill Details */}
              <div className="glass-card p-5 space-y-3 text-xs">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-wider mb-2">Order Summary</h3>
                <div className="flex justify-between text-slate-600">
                  <span>Items Total (MRP ₹{totalMRP})</span>
                  <span className="font-semibold text-slate-800">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Total Discount Savings</span>
                  <span>-₹{discountSavings}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Partner Fee (⚡ 10 Mins)</span>
                  <span className="text-[#0F766E] font-bold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Handling & Packaging Fee</span>
                  <span>₹{handlingFee}</span>
                </div>
                <div className="pt-3 border-t border-slate-200/80 flex justify-between font-black text-base text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#0F766E]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Bottom Checkout CTA Button */}
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-black h-13 rounded-2xl flex items-center justify-between px-6 shadow-xl active:scale-[0.99] cursor-pointer"
              >
                <span>₹{grandTotal} • Place 10-Minute Order</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

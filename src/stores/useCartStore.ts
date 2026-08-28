'use client';

import { create } from 'zustand';
import { Medicine } from '../types';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  lastActionItem: { medicine: Medicine; quantity: number } | null;
  isAlertOpen: boolean;
  addItem: (medicine: Medicine, quantity?: number) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  dismissAlert: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  lastActionItem: null,
  isAlertOpen: false,

  addItem: (medicine: Medicine, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.medicine.id === medicine.id);
      let updatedItems: CartItem[];
      if (existing) {
        updatedItems = state.items.map((item) =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { medicine, quantity }];
      }

      return {
        items: updatedItems,
        lastActionItem: { medicine, quantity },
        isAlertOpen: true
      };
    });
  },

  removeItem: (medicineId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.medicine.id !== medicineId),
      isAlertOpen: false
    }));
  },

  updateQuantity: (medicineId: string, quantity: number) => {
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.medicine.id !== medicineId),
          isAlertOpen: false
        };
      }
      const target = state.items.find((item) => item.medicine.id === medicineId);
      return {
        items: state.items.map((item) =>
          item.medicine.id === medicineId ? { ...item, quantity } : item
        ),
        lastActionItem: target ? { medicine: target.medicine, quantity } : null,
        isAlertOpen: true
      };
    });
  },

  clearCart: () => set({ items: [], lastActionItem: null, isAlertOpen: false }),

  dismissAlert: () => set({ isAlertOpen: false }),

  getTotalCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  },
}));

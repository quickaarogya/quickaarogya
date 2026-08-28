'use client';

import { create } from 'zustand';
import { AarogyaStorage } from '../lib/storage';
import { UserProfile, FamilyMember } from '../types';

interface CareContextState {
  activeProfileId: string;
  isSosActive: boolean;
  theme: 'light' | 'dark';
  userProfile: UserProfile | null;
  familyMembers: FamilyMember[];
  setActiveProfileId: (id: string) => void;
  toggleSos: () => void;
  setSosActive: (active: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  refreshData: () => void;
}

export const useCareContextStore = create<CareContextState>((set) => ({
  activeProfileId: typeof window !== 'undefined' ? AarogyaStorage.getActiveProfileId() : 'usr-101',
  isSosActive: typeof window !== 'undefined' ? AarogyaStorage.isSosActive() : false,
  theme: typeof window !== 'undefined' ? AarogyaStorage.getTheme() : 'light',
  userProfile: typeof window !== 'undefined' ? AarogyaStorage.getUserProfile() : null,
  familyMembers: typeof window !== 'undefined' ? AarogyaStorage.getFamilyMembers() : [],

  setActiveProfileId: (id: string) => {
    AarogyaStorage.setActiveProfileId(id);
    set({ activeProfileId: id });
  },

  toggleSos: () => {
    set((state) => {
      const next = !state.isSosActive;
      AarogyaStorage.setSosActive(next);
      return { isSosActive: next };
    });
  },

  setSosActive: (active: boolean) => {
    AarogyaStorage.setSosActive(active);
    set({ isSosActive: active });
  },

  setTheme: (theme: 'light' | 'dark') => {
    AarogyaStorage.setTheme(theme);
    set({ theme });
  },

  refreshData: () => {
    set({
      activeProfileId: AarogyaStorage.getActiveProfileId(),
      isSosActive: AarogyaStorage.isSosActive(),
      theme: AarogyaStorage.getTheme(),
      userProfile: AarogyaStorage.getUserProfile(),
      familyMembers: AarogyaStorage.getFamilyMembers(),
    });
  }
}));

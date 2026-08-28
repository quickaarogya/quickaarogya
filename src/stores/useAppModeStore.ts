'use client';

import { create } from 'zustand';

export type AppMode = 'pharma' | 'doctors' | 'care';

interface AppModeState {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

export const useAppModeStore = create<AppModeState>((set) => ({
  appMode:
    typeof window !== 'undefined'
      ? (() => {
          const stored = localStorage.getItem('qa_active_app_mode');
          if (stored === 'appointments') return 'doctors';
          if (stored === 'pharma' || stored === 'doctors' || stored === 'care') return stored as AppMode;
          return 'pharma';
        })()
      : 'pharma',

  setAppMode: (mode: AppMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('qa_active_app_mode', mode);
      window.dispatchEvent(new CustomEvent('app-mode-change', { detail: mode }));
    }
    set({ appMode: mode });
  },
}));

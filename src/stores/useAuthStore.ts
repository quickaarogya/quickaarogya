'use client';

import { create } from 'zustand';
import { AuthService, AuthUser, AuthSession } from '@/server/services/auth.service';
import { UserProfile } from '@/types';
import { AarogyaStorage } from '@/lib/storage';

interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  initSession: () => void;
  login: (identifier: string, passwordPlain: string) => Promise<void>;
  register: (data: { fullName: string; email: string; phoneNumber: string; passwordPlain: string; role?: 'PATIENT' | 'CARE_PROXY' | 'DOCTOR' }) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  sessionToken: null,
  isAuthenticated: false,
  isOnboarded: true,
  isLoading: true,

  initSession: () => {
    const session = AuthService.getActiveSession();
    if (session) {
      set({
        user: session.user,
        profile: session.profile,
        sessionToken: session.token,
        isAuthenticated: true,
        isOnboarded: session.user.isOnboarded,
        isLoading: false,
      });
    } else {
      // Default to seeded demo session for frictionless testing unless logged out
      const defaultUser = {
        id: 'usr-101',
        email: 'arjun@aarogya.health',
        phoneNumber: '+91 98765 43210',
        role: 'PATIENT' as const,
        passwordHash: '',
        salt: '',
        isOnboarded: true,
        createdAt: '2026-01-10T10:00:00Z',
      };
      const defaultProfile = AarogyaStorage.getUserProfile();

      set({
        user: defaultUser,
        profile: defaultProfile,
        sessionToken: 'qa_demo_token',
        isAuthenticated: true,
        isOnboarded: true,
        isLoading: false,
      });
    }
  },

  login: async (identifier: string, passwordPlain: string) => {
    const session = await AuthService.login(identifier, passwordPlain);
    set({
      user: session.user,
      profile: session.profile,
      sessionToken: session.token,
      isAuthenticated: true,
      isOnboarded: session.user.isOnboarded,
      isLoading: false,
    });
  },

  register: async (data) => {
    const session = await AuthService.register(data);
    set({
      user: session.user,
      profile: session.profile,
      sessionToken: session.token,
      isAuthenticated: true,
      isOnboarded: false,
      isLoading: false,
    });
  },

  logout: () => {
    AuthService.logout();
    set({
      user: null,
      profile: null,
      sessionToken: null,
      isAuthenticated: false,
      isOnboarded: false,
      isLoading: false,
    });
  },

  completeOnboarding: (data: Partial<UserProfile>) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    const updatedProfile = { ...profile, ...data };
    const updatedUser = { ...user, isOnboarded: true };

    AarogyaStorage.updateUserProfile(updatedProfile);

    const session: AuthSession = {
      user: updatedUser,
      profile: updatedProfile,
      token: get().sessionToken || 'qa_sess',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('qa_auth_session', JSON.stringify(session));
    }

    set({
      user: updatedUser,
      profile: updatedProfile,
      isOnboarded: true,
    });
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;
    const updated = { ...profile, ...data };
    AarogyaStorage.updateUserProfile(updated);
    set({ profile: updated });
  }
}));

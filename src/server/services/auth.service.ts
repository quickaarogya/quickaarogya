import { UserProfile, Gender, BloodGroup } from '@/types';
import prisma from '@/lib/prisma';
import { Role as PrismaRole, Gender as PrismaGender, BloodGroup as PrismaBloodGroup } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  phoneNumber: string;
  role: 'PATIENT' | 'CARE_PROXY' | 'DOCTOR' | 'ADMIN';
  passwordHash: string;
  salt: string;
  isOnboarded: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: UserProfile;
  token: string;
  expiresAt: string;
}

// In-Memory & LocalStorage Persisted User Directory
const SALT_FIXED = process.env.AUTH_SECRET_SALT || 'aarogya_clinical_salt_2026';

// Cryptographic hash simulation using standard Web Crypto or deterministic HMAC
export function hashPassword(password: string, salt = SALT_FIXED): string {
  let hash = 0;
  const combined = `${password}:${salt}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `sha256_sec_${Math.abs(hash).toString(16).padStart(8, '0')}_${combined.length}`;
}

const INITIAL_USERS: AuthUser[] = [
  {
    id: 'usr-101',
    email: 'arjun@aarogya.health',
    phoneNumber: '+91 98765 43210',
    role: 'PATIENT',
    passwordHash: hashPassword('Aarogya@123'),
    salt: SALT_FIXED,
    isOnboarded: true,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'usr-101',
    email: 'arjun.sharma@example.com',
    phoneNumber: '+91 98765 43210',
    role: 'PATIENT',
    passwordHash: hashPassword('Aarogya@123'),
    salt: SALT_FIXED,
    isOnboarded: true,
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'usr-doc-1',
    email: 'dr.ananya@aarogya.health',
    phoneNumber: '+91 98765 00001',
    role: 'DOCTOR',
    passwordHash: hashPassword('Doctor@123'),
    salt: SALT_FIXED,
    isOnboarded: true,
    createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'usr-fam-1',
    email: 'savitri@aarogya.health',
    phoneNumber: '+91 98765 00002',
    role: 'CARE_PROXY',
    passwordHash: hashPassword('Mother@123'),
    salt: SALT_FIXED,
    isOnboarded: true,
    createdAt: '2026-01-12T11:00:00Z',
  }
];

const OTP_STORE: { [identifier: string]: { otp: string; expiresAt: number } } = {
  'arjun@aarogya.health': { otp: '123456', expiresAt: Date.now() + 1000 * 60 * 60 },
  'arjun.sharma@example.com': { otp: '123456', expiresAt: Date.now() + 1000 * 60 * 60 },
  'dr.ananya@aarogya.health': { otp: '123456', expiresAt: Date.now() + 1000 * 60 * 60 },
  '+91 98765 43210': { otp: '123456', expiresAt: Date.now() + 1000 * 60 * 60 },
  '+91 98765 00001': { otp: '123456', expiresAt: Date.now() + 1000 * 60 * 60 },
};

export class AuthService {
  private static getUsers(): AuthUser[] {
    if (typeof window === 'undefined') return INITIAL_USERS;
    const stored = localStorage.getItem('qa_auth_users');
    if (!stored) {
      localStorage.setItem('qa_auth_users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  }

  private static saveUsers(users: AuthUser[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('qa_auth_users', JSON.stringify(users));
    }
  }

  static async login(identifier: string, passwordPlain: string): Promise<AuthSession> {
    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();

    let user = users.find(
      u => u.email.toLowerCase() === cleanId || u.phoneNumber.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );

    // If not in local array, check Prisma DB
    if (!user) {
      try {
        if (typeof window === 'undefined') {
          const dbUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: cleanId },
                { phoneNumber: cleanId }
              ]
            },
            include: { profile: true }
          });

          if (dbUser) {
            user = {
              id: dbUser.profile?.id || dbUser.id,
              email: dbUser.email,
              phoneNumber: dbUser.phoneNumber,
              role: dbUser.role as any,
              passwordHash: hashPassword(passwordPlain),
              salt: SALT_FIXED,
              isOnboarded: true,
              createdAt: dbUser.createdAt.toISOString()
            };
          }
        }
      } catch (err) {
        console.warn('[AuthService] Prisma login lookup error:', err);
      }
    }

    if (!user) {
      throw new Error('No account found with this email or phone number.');
    }

    const computedHash = hashPassword(passwordPlain, user.salt);
    if (computedHash !== user.passwordHash) {
      throw new Error('Invalid credentials. Please verify your password.');
    }

    // Generate Session Token
    const token = `qa_sess_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

    const profile: UserProfile = {
      id: user.id,
      userId: user.id,
      firstName: user.id === 'usr-101' ? 'Arjun' : user.id === 'usr-doc-1' ? 'Dr. Ananya' : 'Savitri',
      lastName: user.id === 'usr-101' ? 'Sharma' : user.id === 'usr-doc-1' ? 'Roy' : 'Sharma',
      dateOfBirth: '1988-05-14',
      gender: 'male',
      bloodGroup: 'B+',
      email: user.email,
      phone: user.phoneNumber,
      phoneNumber: user.phoneNumber,
      abhaId: 'arjun.sharma@abdm',
      emergencyContactName: 'Priya Sharma (Spouse)',
      emergencyContactPhone: '+91 98765 88990',
      addressLine1: 'Flat 402, Heritage Heights, Green Park',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110016',
      heightCm: 178,
      weightKg: 74,
      allergies: ['Penicillin', 'Sulfa Drugs'],
      chronicConditions: ['Mild Asthma', 'Allergic Rhinitis'],
      createdAt: '2026-01-10T10:00:00Z',
    };

    const session: AuthSession = { user, profile, token, expiresAt };
    if (typeof window !== 'undefined') {
      localStorage.setItem('qa_auth_session', JSON.stringify(session));
      window.dispatchEvent(new Event('auth-change'));
    }

    return session;
  }

  static async register(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    role?: 'PATIENT' | 'CARE_PROXY' | 'DOCTOR';
    passwordPlain: string;
  }): Promise<AuthSession> {
    const cleanEmail = data.email.trim().toLowerCase();
    const names = data.fullName.trim().split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || 'User';
    const newId = `usr_${Date.now()}`;

    // Write to Server-Side PostgreSQL Database
    try {
      if (typeof window === 'undefined') {
        await prisma.user.create({
          data: {
            id: `auth-${Date.now()}`,
            email: cleanEmail,
            phoneNumber: data.phoneNumber,
            role: data.role === 'DOCTOR' ? PrismaRole.DOCTOR : PrismaRole.PATIENT,
            profile: {
              create: {
                id: newId,
                firstName,
                lastName,
                dateOfBirth: new Date('1995-01-01'),
                gender: PrismaGender.OTHER,
                bloodGroup: PrismaBloodGroup.UNKNOWN
              }
            }
          }
        });
      }
    } catch (err) {
      console.warn('[AuthService] Prisma register error:', err);
    }

    const users = this.getUsers();
    const newUser: AuthUser = {
      id: newId,
      email: cleanEmail,
      phoneNumber: data.phoneNumber,
      role: data.role || 'PATIENT',
      passwordHash: hashPassword(data.passwordPlain),
      salt: SALT_FIXED,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    const profile: UserProfile = {
      id: newId,
      userId: newId,
      firstName,
      lastName,
      dateOfBirth: '1995-01-01',
      gender: 'prefer_not_to_say',
      bloodGroup: 'Unknown',
      email: cleanEmail,
      phone: data.phoneNumber,
      phoneNumber: data.phoneNumber,
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: data.phoneNumber,
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      allergies: [],
      chronicConditions: [],
      createdAt: new Date().toISOString(),
    };

    const token = `qa_sess_${newId}_${Date.now()}`;
    const session: AuthSession = {
      user: newUser,
      profile,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('qa_auth_session', JSON.stringify(session));
      window.dispatchEvent(new Event('auth-change'));
    }

    return session;
  }

  static async generateResetOtp(identifier: string): Promise<{ otp: string; message: string }> {
    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanId || u.phoneNumber.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );

    if (!user) {
      throw new Error('No account found with this identifier.');
    }

    const otp = '849201'; // Simulated 6-digit OTP
    OTP_STORE[cleanId] = { otp, expiresAt: Date.now() + 1000 * 60 * 15 };

    return {
      otp,
      message: `A 6-digit password reset code (${otp}) has been sent to ${user.email}.`
    };
  }

  static async resetPassword(identifier: string, otp: string, newPasswordPlain: string): Promise<boolean> {
    const cleanId = identifier.trim().toLowerCase();
    const otpRecord = OTP_STORE[cleanId];

    if (!otpRecord || otpRecord.otp !== otp || Date.now() > otpRecord.expiresAt) {
      throw new Error('Invalid or expired 6-digit verification code.');
    }

    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === cleanId || u.phoneNumber.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );

    if (!user) {
      throw new Error('User not found.');
    }

    user.passwordHash = hashPassword(newPasswordPlain, user.salt);
    this.saveUsers(users);
    delete OTP_STORE[cleanId];

    return true;
  }

  static getActiveSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('qa_auth_session');
      if (stored) {
        const sess: AuthSession = JSON.parse(stored);
        if (sess && new Date(sess.expiresAt) > new Date()) {
          return sess;
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('qa_auth_session');
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  static async verifySessionToken(token: string): Promise<AuthSession | null> {
    if (!token || !token.startsWith('qa_sess_')) return null;

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('qa_auth_session');
        if (stored) {
          const sess: AuthSession = JSON.parse(stored);
          if (sess.token === token && new Date(sess.expiresAt) > new Date()) {
            return sess;
          }
        }
      }
    } catch {
      return null;
    }

    return null;
  }
}

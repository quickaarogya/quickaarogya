import { describe, it, expect } from 'vitest';
import { hashPassword, AuthService } from '../src/server/services/auth.service';
import { loginSchema, registerSchema } from '../src/lib/validations/auth.schema';

describe('Phase 1 Authentication & Security Tests', () => {
  it('should hash passwords non-trivially and never store plaintext', () => {
    const rawPass = 'Aarogya@123';
    const hash = hashPassword(rawPass);

    expect(hash).not.toBe(rawPass);
    expect(hash).toContain('sha256_sec_');
    expect(hashPassword(rawPass)).toBe(hash); // Deterministic
    expect(hashPassword('DifferentPassword')).not.toBe(hash);
  });

  it('should validate registration schemas with Zod', () => {
    const validRegistration = {
      fullName: 'Priya Verma',
      email: 'priya@aarogya.health',
      phoneNumber: '+91 98765 11223',
      role: 'PATIENT' as const,
      password: 'SecurePassword123',
      confirmPassword: 'SecurePassword123',
      agreeTerms: true,
    };

    const result = registerSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);

    const invalidMismatch = {
      ...validRegistration,
      confirmPassword: 'WrongPassword',
    };
    const mismatchResult = registerSchema.safeParse(invalidMismatch);
    expect(mismatchResult.success).toBe(false);
  });

  it('should authenticate seeded demo patient account successfully', async () => {
    const session = await AuthService.login('arjun@aarogya.health', 'Aarogya@123');

    expect(session).toBeDefined();
    expect(session.user.id).toBe('usr-101');
    expect(session.user.role).toBe('PATIENT');
    expect(session.token).toContain('qa_sess_');
    expect(session.profile.firstName).toBe('Arjun');
  });

  it('should throw clear error on incorrect login password', async () => {
    await expect(
      AuthService.login('arjun@aarogya.health', 'IncorrectPassword')
    ).rejects.toThrow('Invalid credentials');
  });

  it('should generate a 6-digit OTP for password recovery', async () => {
    const res = await AuthService.generateResetOtp('arjun@aarogya.health');
    expect(res.otp).toHaveLength(6);
    expect(res.message).toContain('6-digit password reset code');
  });
});

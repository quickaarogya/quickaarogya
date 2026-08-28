import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Please enter a valid email or phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(true),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['PATIENT', 'CARE_PROXY', 'DOCTOR']).default('PATIENT'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to HIPAA & ABDM terms of service'
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, 'Please enter your registered email or phone number'),
});

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const onboardingStep1Schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
});

export const onboardingStep2Schema = z.object({
  addressLine1: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid postal code is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactRelation: z.string().min(2, 'Relationship is required'),
});

export const onboardingStep3Schema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN']).default('UNKNOWN'),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  abhaId: z.string().optional(),
  organDonor: z.boolean().default(false),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  bloodGroup: z.string(),
  abhaId: z.string().optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

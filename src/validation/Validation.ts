import { z } from 'zod';

// ==========================================
// LOGIN FORM VALIDATION SCHEMA
// ==========================================

export const loginSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, 'Employee ID is required')
    .max(6, 'Employee ID must be exactly 6 characters')
    .regex(
      /^[A-Z]{3}\d{3}$/,
      'Employee ID must start with 3 uppercase letters followed by 3 digits (e.g., ABC123)'
    )
    .transform((val) => val.toUpperCase()),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password must be less than 50 characters long')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Password must contain at least one letter and one number',
    ),
});

// Export TypeScript type inferred from schema
export type LoginFormData = z.infer<typeof loginSchema>;

// ==========================================
// SIGNUP FORM VALIDATION SCHEMA
// ==========================================
export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Full name must contain only letters and spaces'),
  
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
  
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit number starting with 6, 7, 8, or 9'),
  
  employeeId: z
    .string()
    .trim()
    .min(1, 'Employee ID is required')
    .max(6, 'Employee ID must be exactly 6 characters')
    .regex(
      /^[A-Z]{3}\d{3}$/,
      'Employee ID must start with 3 uppercase letters followed by 3 digits (e.g., ABC123)'
    )
    .transform((val) => val.toUpperCase()),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password must be less than 50 characters long')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Password must contain at least one letter and one number',
    ),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  gender: z
    .enum(['Male', 'Female'], {
      message: 'Please select a gender',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ==========================================
// PROFILE UPDATE VALIDATION SCHEMA
// ==========================================
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'),
  
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase(),
  
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit number starting with 6, 7, 8, or 9'),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// ==========================================
// FORGOT PASSWORD VALIDATION SCHEMA
// ==========================================
export const forgetPasswordSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, 'Employee ID is required')
    .refine(
      (val) => /^[A-Z]{3}\d{3}$/.test(val.toUpperCase()),
      'Employee ID must 3 uppercase letters followed by 3 digits (e.g., ABC123)'
    )
    .transform((val) => val.toUpperCase()),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

// ==========================================
// OTP VALIDATION SCHEMA
// ==========================================
export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export type OtpFormData = z.infer<typeof otpSchema>;

// ==========================================
// VEHICLE NUMBER VALIDATION SCHEMA (Indian Format)
// ==========================================
export const vehicleNumberSchema = z.object({
  vehicleNumber: z
    .string()
    .trim()
    .min(1, 'Vehicle number is required')
    // First check: Length after removing spaces
    .refine(
      (val) => {
        const cleaned = val.replace(/\s+/g, '').toUpperCase();
        return cleaned.length === 10;
      },
      {
        message: 'Vehicle number must be exactly 10 characters (e.g., MH12AB1234)',
      }
    )
    // Second check: Format validation
    .refine(
      (val) => {
        const cleaned = val.replace(/\s+/g, '').toUpperCase();
        return /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(cleaned);
      },
      {
        message: 'Invalid vehicle number format. Use Indian format: XX##XX#### (e.g., MH12AB1234)',
      }
    )
    // Third check: State code validation
    .refine(
      (val) => {
        const cleaned = val.replace(/\s+/g, '').toUpperCase();
        const stateCode = cleaned.substring(0, 2);
        const commonStateCodes = [
          'MH', 'DL', 'UP', 'KA', 'TN', 'AP', 'GJ', 'RJ', 'MP', 'WB',
          'OR', 'PB', 'HR', 'BR', 'AS', 'JK', 'HP', 'UT', 'CH', 'NL',
          'TR', 'GA', 'MN', 'ML', 'MZ', 'SK', 'AN', 'LD', 'DN', 'PY',
        ];
        return commonStateCodes.includes(stateCode);
      },
      {
        message: 'Invalid state code. Please enter a valid Indian state code (e.g., MH, DL, UP, KA)',
      }
    )
    // Transform after validation
    .transform((val) => val.replace(/\s+/g, '').toUpperCase()),
});

export type VehicleNumberFormData = z.infer<typeof vehicleNumberSchema>;


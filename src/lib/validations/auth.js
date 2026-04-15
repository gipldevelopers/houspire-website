import { z } from 'zod';

export const userSignupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'Please accept the terms and privacy policy' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });


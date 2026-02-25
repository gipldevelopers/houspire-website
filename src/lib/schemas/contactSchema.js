import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[+]?[\d\s-]{10,15}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  subject: z
    .string()
    .min(1, 'Please select a subject'),
  message: z
    .string()
    .trim()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'project', label: 'Project Support' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'payment', label: 'Payment Question' },
  { value: 'revision', label: 'Revision Request' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'feedback', label: 'Feedback' },
];

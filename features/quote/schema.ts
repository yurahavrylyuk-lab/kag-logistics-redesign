import { z } from 'zod';

export const quoteSchema = z.object({
  freightType: z.string().min(1, 'Select a freight type.'),
  origin: z.object({ city: z.string().min(1), region: z.string().min(1), postalCode: z.string().optional(), country: z.string().min(1) }),
  destination: z.object({ city: z.string().min(1), region: z.string().min(1), postalCode: z.string().optional(), country: z.string().min(1) }),
  pickup: z.object({ date: z.string().optional(), flexibility: z.enum(['scheduled', 'flexible', 'urgent']) }),
  contact: z.object({ firstName: z.string().min(1), lastName: z.string().min(1), company: z.string().min(1), email: z.string().email('Enter a valid email.'), phone: z.string().optional() }),
  notes: z.string().optional(),
  consent: z.object({ privacyAccepted: z.boolean().refine((accepted) => accepted, 'Accept the privacy notice to continue.'), marketingOptIn: z.boolean().optional() }),
  source: z.object({ page: z.string().min(1), campaign: z.string().optional() }),
});

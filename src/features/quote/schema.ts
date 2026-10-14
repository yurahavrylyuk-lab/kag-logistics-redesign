import { z } from 'zod';

export const quoteSchema = z.object({
  freightType: z.string().min(1, 'Select a freight type.'),
  origin: z.object({ city: z.string().min(1, 'Enter an origin city.'), region: z.string().min(1, 'Enter an origin state or province.'), postalCode: z.string().optional(), country: z.string().min(1, 'Select an origin country.') }),
  destination: z.object({ city: z.string().min(1, 'Enter a destination city.'), region: z.string().min(1, 'Enter a destination state or province.'), postalCode: z.string().optional(), country: z.string().min(1, 'Select a destination country.') }),
  pickup: z.object({ date: z.string().optional(), flexibility: z.enum(['scheduled', 'flexible', 'urgent']) }),
  contact: z.object({ firstName: z.string().min(1, 'Enter a first name.'), lastName: z.string().min(1, 'Enter a last name.'), company: z.string().min(1, 'Enter a company.'), email: z.string().email('Enter a valid email.'), phone: z.string().optional() }),
  notes: z.string().optional(),
  consent: z.object({ privacyAccepted: z.boolean().refine((accepted) => accepted, 'Confirm the prototype acknowledgement to continue.'), marketingOptIn: z.boolean().optional() }),
  source: z.object({ page: z.string().min(1), campaign: z.string().optional() }),
});

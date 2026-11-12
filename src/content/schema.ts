import { z } from 'zod';

export const phoneSchema = z.object({
  label: z.string(),
  number: z.string(),
  href: z.string(),
});

export const siteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  description: z.string(),
  domain: z.string(),
  contact: z.object({
    email: z.email(),
    phones: z.array(phoneSchema),
  }),
  socials: z.object({
    youtube: z.url(),
    instagram: z.url(),
  }),
  announcement: z.object({
    text: z.string(),
    href: z.string(),
    dismissible: z.boolean(),
  }),
  web3forms: z.object({
    accessKeyFallback: z.string(),
  }),
});

export const serviceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const analyticsComponentSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const processStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
});

// photo/gallery hold imported ImageMetadata objects (from `src/assets`), not
// plain path strings, so Astro's <Image> can optimize them — left unvalidated
// by zod since they're build-time objects rather than content-editor input.
export const teamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
  credentials: z.array(z.string()),
  bio: z.string(),
  photo: z.any(),
  gallery: z.array(z.any()).optional(),
});

export const partnerSchema = z.object({
  name: z.string(),
  logo: z.string(),
});

export const videoCategorySchema = z.enum(['11v11', 'indoor', 'highlights']);

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: videoCategorySchema,
});

export const faqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const locationStatusSchema = z.enum(['active', 'coming-soon']);

export const locationSchema = z.object({
  slug: z.string(),
  city: z.string(),
  status: locationStatusSchema,
  heading: z.string(),
  summary: z.string(),
  bullets: z.array(z.string()),
});

export type Site = z.infer<typeof siteSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type AnalyticsComponent = z.infer<typeof analyticsComponentSchema>;
export type ProcessStep = z.infer<typeof processStepSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Location = z.infer<typeof locationSchema>;

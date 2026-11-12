import { siteSchema } from './schema';

// A non-developer can update contact details, socials, and the
// announcement banner by editing this file only.
export const site = siteSchema.parse({
  name: 'Matchday Live',
  legalName: 'Matchday Live',
  tagline: 'Your matchday, broadcast like the pros.',
  description:
    'Matchday Live brings broadcast-grade livestream production to youth clubs, leagues, tournaments, and schools across Dallas–Fort Worth.',
  domain: 'https://matchdayliveofficial.com',

  contact: {
    email: 'matchday.livee@gmail.com',
    phones: [
      { label: 'Office', number: '469-390-9656', href: 'tel:+14693909656' },
      { label: 'Bookings', number: '972-282-5750', href: 'tel:+19722825750' },
    ],
  },

  socials: {
    youtube: 'https://www.youtube.com/@MATCHDAYLIVE-m3f',
    instagram: 'https://www.instagram.com/matchdaylive_/',
  },

  announcement: {
    text: 'Coming to Houston, TX',
    href: '/houston',
    dismissible: true,
  },

  web3forms: {
    // Public (client-safe) access key. Overridden by PUBLIC_WEB3FORMS_KEY at build time.
    accessKeyFallback: 'b4eba4d6-9f63-42a9-9fae-192c37063696',
  },
});

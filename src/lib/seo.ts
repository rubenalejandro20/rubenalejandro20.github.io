import { site } from '../content/site';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function canonicalUrl(path: string): string {
  return new URL(path, site.domain).toString();
}

export function pageTitle(title: string): string {
  return title === site.name ? title : `${title} | ${site.name}`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.domain,
    email: site.contact.email,
    telephone: site.contact.phones[0]?.number,
    sameAs: [site.socials.youtube, site.socials.instagram],
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    url: site.domain,
    email: site.contact.email,
    telephone: site.contact.phones[0]?.number,
    areaServed: [
      { '@type': 'City', name: 'Dallas–Fort Worth' },
      { '@type': 'City', name: 'Houston' },
    ],
    sameAs: [site.socials.youtube, site.socials.instagram],
  };
}

export function personJsonLd(params: { name: string; jobTitle: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.name,
    jobTitle: params.jobTitle,
    description: params.description,
    worksFor: { '@type': 'Organization', name: site.name },
  };
}

export function serviceJsonLd(params: { name: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: params.name,
    description: params.description,
    provider: { '@type': 'Organization', name: site.name },
    areaServed: [
      { '@type': 'City', name: 'Dallas–Fort Worth' },
      { '@type': 'City', name: 'Houston' },
    ],
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

// uploadDate is intentionally omitted: we don't have the real publish dates
// and won't fabricate one (Google's rich-result validator will flag this as
// a missing recommended field, which is the honest state here).
export function videoObjectJsonLd(video: { id: string; title: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.title,
    thumbnailUrl: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
  };
}

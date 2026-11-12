import { partnerSchema } from './schema';
import { z } from 'zod';

// Partner logos are shown, never linked (no partner URLs). The wall hides
// automatically if this array is ever empty.
// TODO(content): add further partners here as new ones are confirmed.
export const partners = z.array(partnerSchema).parse([
  { name: 'Metroplex Premier League', logo: '/brand/MPL-partner-logo.png' },
  { name: 'MLIS', logo: '/brand/mlis-logo-partner.png' },
]);

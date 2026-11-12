import { locationSchema } from './schema';
import { z } from 'zod';

export const locations = z.array(locationSchema).parse([
  {
    slug: 'dallas-fort-worth',
    city: 'Dallas–Fort Worth',
    status: 'active',
    heading: 'Serving clubs and leagues across DFW',
    summary:
      'Matchday Live covers youth clubs, amateur and adult leagues, tournament hosts, and schools throughout the Dallas–Fort Worth area.',
    bullets: [
      'Youth club and academy matchdays',
      'Amateur and adult league fixtures',
      'Tournament and showcase coverage',
      'School and college matches',
    ],
  },
  {
    slug: 'houston',
    city: 'Houston',
    status: 'coming-soon',
    heading: 'Coming to Houston, TX',
    summary:
      'Matchday Live is bringing the same broadcast-grade livestream production to Houston. Reach out now to be among the first Houston events on the schedule.',
    bullets: [
      'Multi-camera HD livestreaming',
      'Real-time broadcasting on YouTube',
      'Full matchday production setup',
    ],
  },
]);

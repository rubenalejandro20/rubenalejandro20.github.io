import { serviceSchema } from './schema';
import { z } from 'zod';

export const services = z.array(serviceSchema).parse([
  {
    title: 'Multi-Camera HD Livestreaming',
    description:
      'Multiple HD camera angles capture the full width of the pitch, so no key moment gets missed.',
    icon: '🎥',
  },
  {
    title: 'Real-Time Broadcasting on YouTube',
    description:
      'Matches go live on YouTube as they happen, ready for parents, scouts, and fans to watch from anywhere.',
    icon: '⚡',
  },
  {
    title: 'Instant Highlights & Replay Clips',
    description: 'Key moments are cut and delivered as shareable clips, right after the final whistle.',
    icon: '🎬',
  },
  {
    title: 'Professional Score Graphics',
    description:
      'A broadcast-style scorebug and overlays keep every viewer oriented on score, time, and teams.',
    icon: '📊',
  },
  {
    title: 'Social Media Game Coverage',
    description:
      'Match-day content built for Instagram and YouTube, so your club shows up looking the part online.',
    icon: '📱',
  },
  {
    title: 'Full Matchday Production Setup',
    description:
      'Cameras, audio, graphics, and crew — Matchday Live handles the full production from arrival to final whistle.',
    icon: '🏟️',
  },
]);

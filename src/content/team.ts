import { teamMemberSchema } from './schema';
import { z } from 'zod';
import rubenZurdaPhoto from '../assets/rubenzurda.png';
import teamAtm from '../assets/teamatm.png';
import teamAtm2 from '../assets/teamatm2.png';

// Real, verified team entries only — nothing fabricated. Additional staff
// bios can be appended here later; the team grid hides automatically if
// this array is ever empty.
// TODO(content): add further staff/analyst bios here as the roster grows.
export const team = z.array(teamMemberSchema).parse([
  {
    name: 'Ruben Zurda',
    role: 'Analysis Coach, Matchday Analytics',
    credentials: [
      'UEFA PRO Licensed Coach',
      "Master's in Sports Direction & Scouting (UCAM)",
      'Certified International Women’s Soccer Specialist (G-SE)',
      'International camp experience across 7+ countries',
    ],
    bio: 'Ruben has served as head coach, tactical analyst, data scientist, and scout across seven seasons with Atlético de Madrid Women — one of Europe’s most competitive environments. His expertise lies in performance optimization, structured tactical development, and measurable team evolution.',
    photo: rubenZurdaPhoto,
    gallery: [teamAtm, teamAtm2],
  },
]);

import { analyticsComponentSchema, processStepSchema } from './schema';
import { z } from 'zod';

export const analyticsComponents = z.array(analyticsComponentSchema).parse([
  {
    title: 'Tactical Analysis',
    description:
      'Phase-by-phase, video-supported review of build-up, progression, final third, defensive organization, and transitions.',
    icon: '🔎',
  },
  {
    title: 'Team Stats',
    description:
      'Performance indicators tied to your game model: pressing, chance creation, defensive efficiency, and progression.',
    icon: '📊',
  },
  {
    title: 'Monthly Evolution Report',
    description:
      'Progress tracking across matches, with trends, strengths, vulnerabilities, and clear objectives for the next cycle.',
    icon: '📈',
  },
  {
    title: 'Monthly Strategic Sync',
    description:
      'A monthly strategy session with coaching staff and captains to align identity, adjustments, and priorities.',
    icon: '🧠',
  },
]);

export const analyticsDeliverables = [
  'Match breakdowns with key moments',
  'Actionable metrics tied to your game model',
  'Evolution tracking with clear KPIs',
  'Strategy session plus a next-step roadmap',
];

export const analyticsProcess = z.array(processStepSchema).parse([
  {
    step: 1,
    title: 'Discovery',
    description: 'We define goals, competition level, tactical identity, and KPIs with your staff.',
  },
  {
    step: 2,
    title: 'Analysis Cycle',
    description: 'We break down matches and deliver insights that connect directly to training priorities.',
  },
  {
    step: 3,
    title: 'Monthly Sync',
    description:
      'We meet with staff and captains to review evolution, adjust strategy, and set the next roadmap.',
  },
]);

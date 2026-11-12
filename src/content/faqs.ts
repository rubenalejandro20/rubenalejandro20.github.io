import { faqSchema } from './schema';
import { z } from 'zod';

export const livestreamingFaqs = z.array(faqSchema).parse([
  {
    question: 'What do you need from us on matchday?',
    answer:
      'Field access ahead of kickoff and a power source near the sideline. The Matchday Live crew handles cameras, graphics, and the broadcast from arrival to final whistle.',
  },
  {
    question: 'Where does the stream go?',
    answer:
      'Matches broadcast live on the Matchday Live YouTube channel, so players, parents, and fans can watch from anywhere.',
  },
  {
    question: 'Do we get footage afterward?',
    answer:
      'Yes — highlights and replay clips are cut from the match and shared for your club or organization to use.',
  },
  {
    question: 'What kind of events do you cover?',
    answer:
      'Youth club matchdays, amateur and adult league fixtures, tournaments, showcases, and school or college matches — 11v11 and indoor.',
  },
  {
    question: 'How do we get a quote?',
    answer: 'Request a quote and share your event details — we’ll follow up to confirm coverage and scope.',
  },
]);

export const analyticsFaqs = z.array(faqSchema).parse([
  {
    question: 'Who is Matchday Analytics for?',
    answer:
      'Competitive soccer clubs looking for tactical clarity, measurable improvement, and a structured development program for coaching staff and captains.',
  },
  {
    question: 'What happens during Discovery?',
    answer:
      'We define your goals, competition level, tactical identity, and KPIs together with your staff before the first analysis cycle begins.',
  },
  {
    question: 'How is the analysis delivered?',
    answer:
      'Through video-supported tactical breakdowns, team stats tied to your game model, a monthly evolution report, and a monthly strategic sync with your staff and captains.',
  },
  {
    question: 'Who leads the analysis?',
    answer:
      'Ruben Zurda, a UEFA PRO licensed coach with 12+ years of experience, including seven seasons with Atlético de Madrid Women as head coach, tactical analyst, data scientist, and scout.',
  },
  {
    question: 'How do we get started?',
    answer:
      'Book a discovery call — we’ll walk through your current setup and outline how the monthly program would apply to your team.',
  },
]);

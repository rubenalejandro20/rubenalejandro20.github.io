import { videoSchema } from './schema';
import { z } from 'zod';

// Real YouTube video IDs extracted from the legacy site — do not invent IDs.
// TODO(content): add more video IDs here as new highlights are published.
export const videos = z.array(videoSchema).parse([
  { id: 'wHeWikuiIr0', title: '11v11 Full Livestream', category: '11v11' },
  { id: 'ZeixX2MbccY', title: 'Indoor Soccer Livestream', category: 'indoor' },
  { id: 'eQ4apRTIdNE', title: 'Professional Hype Video', category: 'highlights' },
]);

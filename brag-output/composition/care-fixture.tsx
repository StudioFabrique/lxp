/** Offline fixture of the learner feeling card: the genuine FeelingFeedback component,
 * rendered with a pre-filled query cache and no session, so no API or socket call runs. */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeelingFeedback from '../../front/src/features/dashboard-student/components/right-side/feeling-feedback';
import FeelingLevel from '../../front/src/components/UI/feeling-level';
import { writeFileSync } from 'node:fs';

const client = new QueryClient({ defaultOptions: { queries: { enabled: false, retry: false } } });
// An earlier day's feedback: today's form stays open, as for a learner who has not answered yet.
client.setQueryData(['own-feedback'], { data: null });
const fragments: Record<string, string> = {
  card: renderToStaticMarkup(<QueryClientProvider client={client}><FeelingFeedback /></QueryClientProvider>),
};
for (const value of [1, 2, 3, 4, 5]) fragments[`level-${value}`] = renderToStaticMarkup(<FeelingLevel value={value} />);
writeFileSync(new URL('./assets/care-fragments.json', `file://${process.cwd()}/`), JSON.stringify(fragments, null, 2));
console.log('FeelingFeedback rendered offline.');

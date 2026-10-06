/** Offline fixture of the genuine instance settings page (superadministration).
 * Server rendering runs no effect: no settings request, logo fetch or theme change. */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Settings } from 'lucide-react';
import Header from '../../front/src/components/headers/Header';
import InstanceGeneralSettings from '../../front/src/features/profile/components/instance-general-settings';
import EmailTemplateSettings from '../../front/src/features/profile/components/email-template-settings';
import { EmailPreview } from '../../front/src/features/profile/components/email-preview';
import { emailTemplates } from '../../front/src/features/profile/components/email-template-settings.utils';
import { writeFileSync } from 'node:fs';

const fragments: Record<string, string> = {
  header: renderToStaticMarkup(<Header title="Paramètres de l’instance" description="Personnalisez l’identité et l’accueil de votre organisme." icon={Settings} />),
  settings: renderToStaticMarkup(<InstanceGeneralSettings />),
  emails: renderToStaticMarkup(<EmailTemplateSettings selectedTemplate="minimal" draftTemplate="minimal" instanceName="Institut Horizon" website="https://horizon.example" hasInstanceLogo={false} instanceColor="#1f5f8b" isOpen isSaving={false} isSendingTest={false} onOpen={() => {}} onClose={() => {}} onSelect={() => {}} onSave={() => {}} onSendTest={() => {}} />),
};
for (const template of emailTemplates) {
  fragments[`email-${template.id}`] = renderToStaticMarkup(<EmailPreview template={template} instanceName="Institut Horizon" website="https://horizon.example" hasInstanceLogo={false} instanceColor="#1f5f8b" />);
}
fragments.templates = JSON.stringify(emailTemplates.map(({ id, name }) => ({ id, name })));
// The film is laid out at 1920 px but tiles play it in narrow frames: keep the
// desktop layout of the page instead of its breakpoints.
const desktop = (html: string) => html
  .replaceAll('xl:grid-cols-2', 'grid-cols-2')
  .replaceAll('sm:grid-cols-2 2xl:grid-cols-4', 'grid-cols-4')
  .replaceAll('sm:flex-row sm:items-center', 'flex-row items-center')
  .replaceAll('md:grid-cols-2 xl:grid-cols-3', 'grid-cols-3');
for (const key of ['settings', 'emails']) fragments[key] = desktop(fragments[key]);
writeFileSync(new URL('./assets/instance-fragments.json', `file://${process.cwd()}/`), JSON.stringify(fragments, null, 2));
console.log('Instance settings rendered offline.');

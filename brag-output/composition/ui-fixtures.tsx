/** Offline presentation fixtures. Imports only presentational LXP components. */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CursorGlowCard from '../../front/src/components/UI/cursor-glow-card';
import BoxWrapper from '../../front/src/components/wrappers/BoxWrapper';
import HierarchicalListCard from '../../front/src/components/UI/hierarchical-list-card/HierarchicalListCard';
import HeaderChatbot from '../../front/src/features/chatbot/components/chatbot-parts/header-chatbot';
import * as icons from 'lucide-react';
import { writeFileSync } from 'node:fs';

const fragments: Record<string, string> = {};
const levels = [
  ['Organisme de formation', 'Institut Horizon', 'Parcours', ['Développeur web', 'Designer numérique', 'Chef de projet digital']],
  ['Parcours', 'Développeur web', 'Module', ['Construire une interface', 'Développer une API', 'Déployer une application']],
  ['Module', 'Construire une interface', 'Cours', ['Les bases du HTML', 'Mettre en forme avec CSS', 'Concevoir une page accessible']],
  ['Cours', 'Les bases du HTML', 'Leçon', ['La structure d’une page', 'Les liens et les images', 'Les formulaires']],
  ['Leçon', 'La structure d’une page', 'Activité', ['Comprendre la structure HTML', 'Observer une page commentée', 'Consulter la fiche de synthèse']],
] as const;
levels.forEach(([label, title, child, names], index) => {
  fragments[`level-${index}`] = renderToStaticMarkup(<HierarchicalListCard label={label} title={title} description={`${names.length} ${child.toLowerCase()}${child.endsWith('s') ? '' : 's'}`} disableHoverScale items={names.map((name, row) => ({ id: row, title: name, description: `${child} ${row + 1}`, icon: React.createElement(icons.BookOpen), action: React.createElement(icons.ChevronRight, {size: 18}) }))} />);
});
for (const color of ['primary', 'secondary', 'error', 'accent'] as const) {
  fragments[`glow-${color}`] = renderToStaticMarkup(<CursorGlowCard glowColor={color} glowSize={2.4} disableHoverScale className="fixture-glow"><div className="fixture-content">{'{{BODY}}'}</div></CursorGlowCard>);
}
fragments.box = renderToStaticMarkup(<BoxWrapper>{'{{BODY}}'}</BoxWrapper>);
fragments['chat-header'] = renderToStaticMarkup(<HeaderChatbot size="large" showFullScreenButton showNewChatButton onClose={() => {}} onChangeSize={() => {}} onNewChat={() => {}} />);
for (const name of ['BookOpen', 'Layers', 'GraduationCap', 'Building2', 'FileText', 'Play', 'Image', 'Code', 'Link', 'Download', 'Bold', 'Italic', 'Underline', 'List', 'ListChecks', 'Table', 'Bot', 'ArrowUpRight', 'ChevronRight', 'Send', 'Check', 'CalendarDays', 'Users', 'Award', 'FolderOpen', 'Search', 'Sparkles', 'SlidersHorizontal', 'CloudLightning', 'CloudRain', 'CloudSunRain', 'CloudSun', 'Sun', 'Bell', 'ShieldCheck', 'Upload', 'CheckCheck', 'MessageSquare', 'GripVertical', 'CircleHelp', 'ChartNoAxesCombined'] as const) {
  fragments[`icon-${name}`] = renderToStaticMarkup(React.createElement(icons[name], { size: 24, strokeWidth: 1.7, 'aria-hidden': true }));
}
writeFileSync(new URL('./assets/ui-fragments.json', `file://${process.cwd()}/`), JSON.stringify(fragments, null, 2));

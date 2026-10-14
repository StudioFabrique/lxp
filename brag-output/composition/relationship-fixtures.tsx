/** Offline fixtures from the real group, tag and glow components. */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { writeFileSync } from 'node:fs';
import GroupTeachers from '../../front/src/features/group/components/group-form/GroupTeachers';
import TagItem from '../../front/src/components/UI/tag-item/tag-item';
import CursorGlowCard from '../../front/src/components/UI/cursor-glow-card';
import type Group from '../../front/src/utils/interfaces/group';
import type Course from '../../front/src/utils/interfaces/course';
import JournalTimeline from '../../front/src/features/profile/components/journal/journal-timeline';
import { Users, UserRound, Rocket, Tag, BookOpen, GraduationCap, Building2, FileText, ChevronRight, Check, Plus, Search, Link2, Mail, Settings, Palette, Bell, ShieldCheck, PartyPopper, CircleCheck, Award } from 'lucide-react';

const journalCourse: Course = {
  id: 1, title: 'Les bases du HTML', tags: [], contacts: [], lessons: [], dates: [], isPublished: true, bonusSkills: [],
  module: {
    title: 'Construire une interface', description: '', duration: 1, contacts: [], bonusSkills: [], courses: [], tags: [],
    parcours: {
      id: 1, title: 'Développeur web', formation: { title: 'Concepteur développeur d’applications', level: '6', code: 'demo', tags: [] },
      tags: [], contacts: [], skills: [], bonusSkills: [], objectives: [], modules: [], groups: [], isPublished: true, author: 'Équipe pédagogique', visibility: true,
    },
  },
  accomplishments: [{
    id: 1, name: 'Les bases du HTML', description: 'Vous avez terminé le cours Les bases du HTML.', accomplishedAt: new Date('2026-10-05T12:30:00Z'),
    student: { _id: 'demo-camille', firstname: 'Camille', lastname: 'Martin', email: 'camille@example.invalid', roles: [], isActive: true, invitationSent: false, abilityRules: [] },
  }],
};

const group: Group = {
  name: 'Promotion octobre', desc: 'Développeur web', tags: [],
  startDate: '2026-10-05', endDate: '2027-06-30', parcoursId: 1,
  teachers: [
    { _id: 'demo-alex', firstname: 'Alex', lastname: 'Bernard', email: 'alex@example.invalid', isActive: true, isCreator: false, parcours: [{ id: 1, title: 'Développeur web' }] },
    { _id: 'demo-samira', firstname: 'Samira', lastname: 'Diallo', email: 'samira@example.invalid', isActive: true, isCreator: false, parcours: [{ id: 1, title: 'Développeur web' }] },
  ],
};
const fragments: Record<string, string> = {
  journal: renderToStaticMarkup(<JournalTimeline course={journalCourse} />),
  teachers: renderToStaticMarkup(<MemoryRouter><GroupTeachers group={group} /></MemoryRouter>).replace(/href="([^"]+)"/g, 'data-app-route="$1"'),
  tag: renderToStaticMarkup(<TagItem tag={{ id: 1, name: 'Accessibilité', color: 'var(--color-primary)' }} noIcon />),
  glow: renderToStaticMarkup(<CursorGlowCard glowColor="primary" glowSize={2.4} disableHoverScale className="fixture-glow"><div className="fixture-content">{'{{BODY}}'}</div></CursorGlowCard>),
};
for (const [name, icon] of Object.entries({ Users, UserRound, Rocket, Tag, BookOpen, GraduationCap, Building2, FileText, ChevronRight, Check, Plus, Search, Link2, Mail, Settings, Palette, Bell, ShieldCheck, PartyPopper, CircleCheck, Award })) {
  fragments[name] = renderToStaticMarkup(React.createElement(icon, { size: 24, strokeWidth: 1.7, 'aria-hidden': true }));
}
writeFileSync('assets/relationship-fragments.json', JSON.stringify(fragments, null, 2));

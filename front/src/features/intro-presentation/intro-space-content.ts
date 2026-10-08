import type { SidebarItemConfig } from "../../config/sidebarItems";
import type { ModuleSummary } from "../dashboard-admin/api/dashboard-admin.api";
import type { FormationParcoursSummary } from "../dashboard-admin/interfaces/parcours-summary";
import type { IntroRoleOption, IntroSpace } from "./intro-role";

/**
 * Contenu réel du dashboard du rôle, envoyé à la séquence Hyperframes pour
 * remplacer ses données d'exemple. La mise en page 3D reste celle du film :
 * seuls les textes et les entrées de la barre latérale changent.
 */
export type IntroSpaceRow = { title: string; subtitle: string };

export type IntroSpaceCardId =
  | "dash-actions"
  | "dash-alerts"
  | "dash-latest"
  | "dash-feedback"
  | "dash-paths";

export type IntroSpaceCard = {
  id: IntroSpaceCardId;
  title: string;
  rows: IntroSpaceRow[];
};

export type IntroSpaceNavEntry = {
  /** Intitulé d'origine dans le film, qui sert de clé. */
  label: string;
  displayLabel: string;
};

export type IntroSpaceResume = {
  course: string;
  lesson: string;
  action: string;
};

export type IntroSpaceContent = {
  space: IntroSpace;
  spaceLabel: string;
  userName: string;
  initials: string;
  roleLabel: string;
  title: string;
  message: string;
  /** Bouton de l'en-tête, absent quand le vrai dashboard n'en affiche pas. */
  headerAction: string | null;
  nav: IntroSpaceNavEntry[];
  cards: IntroSpaceCard[];
  resume?: IntroSpaceResume;
};

/** Le film affiche deux lignes par carte : ce plafond évite de déborder. */
const MAX_ROWS = 2;

type PersonInput = {
  firstname?: string;
  lastname?: string;
};

export const capitalizeWords = (text: string): string =>
  text.replace(/(^|\s)(\p{L})/gu, (_, space: string, letter: string) =>
    `${space}${letter.toUpperCase()}`,
  );

export const buildInitials = ({ firstname, lastname }: PersonInput): string =>
  [firstname, lastname]
    .map((name) => name?.trim().charAt(0).toUpperCase() ?? "")
    .join("");

export const buildUserName = ({ firstname, lastname }: PersonInput): string =>
  [firstname, lastname].filter(Boolean).join(" ");

/** Entrées de la barre latérale que le rôle peut réellement ouvrir. */
export const buildNavEntries = (
  items: readonly SidebarItemConfig[],
  options: {
    canRead: (item: SidebarItemConfig) => boolean;
    isTeacher: boolean;
    displayLabel?: (item: SidebarItemConfig) => string;
  },
): IntroSpaceNavEntry[] =>
  items
    .filter((item) => (!item.teacherOnly || options.isTeacher) && options.canRead(item))
    .map((item) => ({
      label: item.label,
      displayLabel: options.displayLabel?.(item) ?? item.label,
    }));

const limitRows = (rows: IntroSpaceRow[], empty: IntroSpaceRow): IntroSpaceRow[] =>
  rows.length ? rows.slice(0, MAX_ROWS) : [empty];

export const buildParcoursRows = (
  formations: readonly FormationParcoursSummary[],
): IntroSpaceRow[] =>
  limitRows(
    formations.flatMap((formation) =>
      formation.parcours.map((parcours) => ({
        title: parcours.title,
        subtitle: formation.title,
      })),
    ),
    { title: "Aucun parcours", subtitle: "Créez le premier depuis l'onglet Parcours." },
  );

export const buildModuleRows = (modules: readonly ModuleSummary[]): IntroSpaceRow[] =>
  limitRows(
    modules.map((module) => ({ title: module.title, subtitle: module.parcours })),
    { title: "Aucun module", subtitle: "Les derniers modules créés apparaîtront ici." },
  );

export type TeamContentInput = {
  role: IntroRoleOption;
  person: PersonInput;
  isTeacher: boolean;
  title: string;
  message: string;
  nav: IntroSpaceNavEntry[];
  recommended: ReadonlyArray<{ title: string; description: string }>;
  modules: readonly ModuleSummary[];
  modulesTitle: string;
  parcours: readonly FormationParcoursSummary[];
  feedbacks: ReadonlyArray<{ name: string; comment?: string }>;
  canCreateFormation: boolean;
  canCreateParcours: boolean;
};

/**
 * Équipe (root, administrateur, pédagogique). Les quatre cartes du film
 * reprennent celles du vrai dashboard : actions recommandées, derniers modules,
 * derniers parcours, puis les retours des apprenants (équipe pédagogique) ou
 * les raccourcis de création (administrateurs).
 */
export const buildTeamContent = (input: TeamContentInput): IntroSpaceContent => {
  const shortcuts: IntroSpaceRow[] = [
    ...(input.canCreateFormation
      ? [{ title: "Créer une formation", subtitle: "Structurer un nouveau cursus" }]
      : []),
    ...(input.canCreateParcours
      ? [{ title: "Créer un parcours", subtitle: "Ajouter un parcours à une formation" }]
      : []),
  ];
  const lastCard: IntroSpaceCard = input.isTeacher
    ? {
        id: "dash-feedback",
        title: "Retours des apprenants",
        rows: limitRows(
          input.feedbacks.map((feedback) => ({
            title: feedback.name,
            subtitle: feedback.comment?.trim() || "Sans commentaire",
          })),
          { title: "Aucun retour récent", subtitle: "Les retours des apprenants arriveront ici." },
        ),
      }
    : {
        id: "dash-feedback",
        title: "Actions rapides",
        rows: limitRows(shortcuts, {
          title: "Voir les feedbacks",
          subtitle: "Suivre le ressenti des apprenants",
        }),
      };

  return {
    space: "team",
    spaceLabel: input.role.spaceLabel,
    userName: buildUserName(input.person),
    initials: buildInitials(input.person),
    roleLabel: input.role.label,
    title: capitalizeWords(input.title),
    message: input.message,
    headerAction: input.isTeacher ? "Actions rapides" : null,
    nav: input.nav,
    cards: [
      {
        id: "dash-actions",
        title: "Actions recommandées",
        rows: limitRows(
          input.recommended.map((action) => ({
            title: action.title,
            subtitle: action.description,
          })),
          { title: "Tout est en ordre", subtitle: "Aucune action recommandée pour le moment." },
        ),
      },
      { id: "dash-alerts", title: input.modulesTitle, rows: buildModuleRows(input.modules) },
      { id: "dash-latest", title: "Derniers parcours", rows: buildParcoursRows(input.parcours) },
      lastCard,
    ],
  };
};

export type StudentContentInput = {
  role: IntroRoleOption;
  person: PersonInput;
  title: string;
  message: string;
  nav: IntroSpaceNavEntry[];
  lastLesson?: { course?: string; lesson: string };
  parcours: ReadonlyArray<{ title: string; formation?: string }>;
};

export const buildStudentContent = (input: StudentContentInput): IntroSpaceContent => ({
  space: "student",
  spaceLabel: input.role.spaceLabel,
  userName: buildUserName(input.person),
  initials: buildInitials(input.person),
  roleLabel: input.role.label,
  title: capitalizeWords(input.title),
  message: input.message,
  headerAction: "Mon avancement",
  nav: input.nav,
  resume: input.lastLesson
    ? {
        course: input.lastLesson.course ?? "Votre dernière leçon",
        lesson: input.lastLesson.lesson,
        action: "Reprendre la leçon",
      }
    : {
        course: "Commencez votre apprentissage",
        lesson: "Votre première leçon vous attend.",
        action: "Découvrir mes parcours",
      },
  cards: [
    {
      id: "dash-paths",
      title: "Mes parcours",
      rows: limitRows(
        input.parcours.map((parcours) => ({
          title: parcours.title,
          subtitle: parcours.formation ?? "Parcours",
        })),
        { title: "Aucun parcours", subtitle: "Vos parcours apparaîtront ici." },
      ),
    },
  ],
});

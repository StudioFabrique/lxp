import type { LucideIcon } from "lucide-react";

import { INTRO_DETAILS } from "./intro-details";
import { INTRO_LEVELS, type IntroLevelId } from "./intro-levels";
import type { IntroLesson } from "./intro-content.schema";

export type IntroItem = {
  title: string;
  /** Vrai pour un exemple : le contenu réel de l'utilisateur est absent. */
  isPlaceholder: boolean;
};

/** Composant d'un niveau (groupes, tags, objectifs...), réel ou d'exemple. */
export type IntroDetail = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: IntroItem[];
  /** Vrai quand aucune valeur réelle n'a pu être lue : ce sont des exemples. */
  isPlaceholder: boolean;
  explanation: string;
};

/** Carte d'un niveau : l'élément retenu, ce qu'il contient et ses composants. */
export type IntroCard = {
  levelId: IntroLevelId;
  title: string;
  isPlaceholder: boolean;
  rows: IntroItem[];
  details: IntroDetail[];
};

/**
 * Éléments réels connus de l'utilisateur, tous facultatifs. Pour chaque niveau,
 * le premier titre est celui que suit la présentation, les suivants ne servent
 * que de lignes voisines.
 */
export type IntroSource = {
  organisationName?: string;
  formationTitles?: string[];
  parcoursTitles?: string[];
  moduleTitles?: string[];
  courseTitles?: string[];
  lessonTitles?: string[];
  activities?: IntroLesson["activities"];
  /**
   * Valeurs réelles des composants, par clé `niveau.détail` (voir `INTRO_DETAILS`).
   * Une clé absente ou vide laisse place aux exemples.
   */
  details?: Record<string, string[] | undefined>;
};

export const INTRO_ROW_COUNT = 3;
const MAX_DETAIL_ITEMS = 4;

const PLACEHOLDER_TITLES: Record<IntroLevelId, string> = {
  organisation: "Votre organisme",
  formation: "Métiers du numérique",
  parcours: "Développeur web",
  module: "Les bases du web",
  cours: "Structurer une page",
  lecon: "Comprendre le HTML",
  activites: "Lire la leçon",
};

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  text: "Texte",
  image: "Image",
  video: "Vidéo",
  iframe: "Contenu intégré",
  resource: "Ressource",
  file: "Fichier",
};

/** Types d'activités réellement proposés : ce ne sont pas des exemples. */
const ACTIVITY_TYPES: IntroItem[] = ["Texte", "Vidéo", "Image", "Ressource"].map(
  (title) => ({ title, isPlaceholder: false }),
);

/** Les titres saisis peuvent commencer par une minuscule : on n'affiche que leur première lettre en majuscule. */
const capitalizeFirst = (title: string): string =>
  title.charAt(0).toLocaleUpperCase("fr") + title.slice(1);

const placeholder = (title: string): IntroItem => ({
  title,
  isPlaceholder: true,
});

/**
 * Complète une liste d'éléments réels avec des exemples jusqu'à trois lignes.
 * Un niveau sans contenu réel n'affiche donc que des exemples.
 */
const buildRows = (
  titles: string[] | undefined,
  placeholderTitle: string,
): IntroItem[] => {
  const rows: IntroItem[] = (titles ?? [])
    .map((title) => title.trim())
    .filter(Boolean)
    .slice(0, INTRO_ROW_COUNT)
    .map((title) => ({ title: capitalizeFirst(title), isPlaceholder: false }));

  for (let index = rows.length; index < INTRO_ROW_COUNT; index += 1) {
    rows.push(placeholder(`${placeholderTitle} ${index + 1} (exemple)`));
  }

  return rows;
};

const firstTitle = (
  titles: string[] | undefined,
  fallback: string,
): IntroItem => {
  const title = titles?.map((value) => value.trim()).find(Boolean);
  return title
    ? { title: capitalizeFirst(title), isPlaceholder: false }
    : placeholder(fallback);
};

const activityTitles = (activities: IntroSource["activities"]): string[] =>
  (activities ?? []).map(
    (activity) =>
      activity.title?.trim() ||
      ACTIVITY_TYPE_LABELS[activity.type] ||
      "Activité",
  );

const realOrPlaceholder = (
  value: string | undefined,
  fallback: string,
): IntroItem =>
  value?.trim()
    ? { title: value.trim(), isPlaceholder: false }
    : placeholder(fallback);

/**
 * Construit les sept cartes de la présentation le long d'un seul chemin :
 * l'organisme, une formation, un parcours, un module, un cours, une leçon puis
 * une activité. Chaque niveau absent de `source` est remplacé par un exemple.
 */
export const buildIntroCards = (source: IntroSource = {}): IntroCard[] => {
  const activities = activityTitles(source.activities);
  const organisation = realOrPlaceholder(
    source.organisationName,
    PLACEHOLDER_TITLES.organisation,
  );
  const selected: IntroItem[] = [
    organisation,
    firstTitle(source.formationTitles, PLACEHOLDER_TITLES.formation),
    firstTitle(source.parcoursTitles, PLACEHOLDER_TITLES.parcours),
    firstTitle(source.moduleTitles, PLACEHOLDER_TITLES.module),
    firstTitle(source.courseTitles, PLACEHOLDER_TITLES.cours),
    firstTitle(source.lessonTitles, PLACEHOLDER_TITLES.lecon),
    firstTitle(activities, PLACEHOLDER_TITLES.activites),
  ];
  const rows: IntroItem[][] = [
    buildRows(source.formationTitles, "Formation"),
    buildRows(source.parcoursTitles, "Parcours"),
    buildRows(source.moduleTitles, "Module"),
    buildRows(source.courseTitles, "Cours"),
    buildRows(source.lessonTitles, "Leçon"),
    buildRows(activities, "Activité"),
    ACTIVITY_TYPES,
  ];

  return selected.map((item, index) => {
    const levelId = INTRO_LEVELS[index].id;
    return {
      levelId,
      title: item.title,
      isPlaceholder: item.isPlaceholder,
      rows: rows[index],
      details: INTRO_DETAILS[levelId].map((definition) => {
        const real = (source.details?.[definition.id] ?? [])
          .map((value) => value.trim())
          .filter(Boolean)
          .slice(0, MAX_DETAIL_ITEMS);
        return {
          id: definition.id,
          label: definition.label,
          icon: definition.icon,
          explanation: definition.explanation,
          isPlaceholder: real.length === 0,
          items: (real.length ? real : definition.placeholders).map((title) => ({
            title,
            isPlaceholder: real.length === 0,
          })),
        };
      }),
    };
  });
};

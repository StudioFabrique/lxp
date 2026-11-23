/**
 * Repère, dans un chemin d'API, les identifiants qui désignent un contenu
 * (leçon, cours, groupe...) pour pouvoir afficher son titre à la place d'un
 * numéro. Aucun accès aux bases ici : ce module ne fait qu'analyser du texte.
 */
export const TARGET_KINDS = [
  "lesson",
  "course",
  "module",
  "parcours",
  "formation",
  "activity",
  "resource",
  "group",
  "user",
] as const;
export type TargetKind = (typeof TARGET_KINDS)[number];

export type TargetRef = { kind: TargetKind; id: string };

/** Libellé français du type, affiché avant le titre (« Leçon : Introduction »). */
export const TARGET_KIND_LABELS: Record<TargetKind, string> = {
  lesson: "Leçon",
  course: "Cours",
  module: "Module",
  parcours: "Parcours",
  formation: "Formation",
  activity: "Activité",
  resource: "Ressource",
  group: "Groupe",
  user: "Utilisateur",
};

/** Les entités PostgreSQL ont un identifiant entier, celles de MongoDB un ObjectId. */
const NUMERIC_KINDS: ReadonlySet<TargetKind> = new Set([
  "lesson",
  "course",
  "module",
  "parcours",
  "formation",
  "activity",
  "resource",
]);

/**
 * Segment qui précède l'identifiant, éventuellement précédé d'un autre
 * (`modules/image/:id`). Les routes de l'API suivent presque toutes ce schéma.
 */
const BY_PREVIOUS_SEGMENT: Record<string, TargetKind> = {
  lesson: "lesson",
  lessons: "lesson",
  course: "course",
  courses: "course",
  module: "module",
  modules: "module",
  parcours: "parcours",
  "parcours-by-id": "parcours",
  formation: "formation",
  "parcours-by-formation": "formation",
  activity: "activity",
  resources: "resource",
  group: "group",
  groups: "group",
  indicators: "user",
  user: "user",
};

const BY_TWO_SEGMENTS: Record<string, TargetKind> = {
  "lesson/rate": "lesson",
  "course/publish": "course",
  "parcours/publish": "parcours",
  "detail/limited": "module",
  "modules/image": "module",
  "user/data": "user",
};

const NUMERIC_ID = /^[1-9]\d{0,9}$/;
const OBJECT_ID = /^[0-9a-f]{24}$/;

const kindBefore = (segments: string[], index: number): TargetKind | null => {
  const previous = segments[index - 1];
  const beforePrevious = segments[index - 2];
  if (!previous) return null;
  return (
    BY_TWO_SEGMENTS[`${beforePrevious}/${previous}`] ??
    // `activity/<type>/:id` : texte, vidéo, ressource... désignent tous une activité.
    (beforePrevious === "activity" ? "activity" : undefined) ??
    BY_PREVIOUS_SEGMENT[previous] ??
    null
  );
};

/** Les références d'un chemin, sans doublon. Un identifiant du mauvais format est ignoré. */
export function extractTargets(path: string): TargetRef[] {
  const segments = path.split("?")[0].split("/").filter(Boolean);
  const found = new Map<string, TargetRef>();

  segments.forEach((segment, index) => {
    const kind = kindBefore(segments, index);
    if (!kind) return;
    const valid = NUMERIC_KINDS.has(kind)
      ? NUMERIC_ID.test(segment)
      : OBJECT_ID.test(segment);
    if (valid) found.set(`${kind}:${segment}`, { kind, id: segment });
  });
  return [...found.values()];
}

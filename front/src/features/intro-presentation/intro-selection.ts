import type { IntroItem, IntroSelection } from "./intro-content";
import { INTRO_LEVELS, type IntroLevelId } from "./intro-levels";

/** Une sélection par identifiant, y compris quand plusieurs titres sont identiques. */
export function selectedIntroEntity<T extends { id?: number; title: string }>(
  items: readonly T[],
  selected?: IntroItem,
): T | undefined {
  if (selected?.isPlaceholder) return undefined;
  if (!selected) return items.find((item) => Boolean(item.title.trim()));
  return items.find((item) => selected.id !== undefined
    ? item.id === selected.id
    : item.title.trim().toLocaleLowerCase("fr") === selected.title.toLocaleLowerCase("fr"));
}

/** Changer de branche invalide les sélections de tous ses descendants. */
export function selectIntroChild(
  selection: IntroSelection,
  levelId: IntroLevelId,
  item: IntroItem,
): IntroSelection {
  const next: IntroSelection = {};
  const levelIndex = INTRO_LEVELS.findIndex((level) => level.id === levelId);
  for (const level of INTRO_LEVELS.slice(0, levelIndex)) {
    if (selection[level.id]) next[level.id] = selection[level.id];
  }
  next[levelId] = item;
  return next;
}

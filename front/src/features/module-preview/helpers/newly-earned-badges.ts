import type Module from "../../../utils/interfaces/module";

export function newlyEarnedBadges(previous: Module, current: Module) {
  if (
    previous.id !== current.id ||
    previous.stats?.isCompleted ||
    !current.stats?.isCompleted
  ) return [];

  return current.bonusSkills.filter((skill) =>
    skill.badge && skill.isEarned &&
    !previous.bonusSkills.some((before) => before.id === skill.id && before.isEarned),
  );
}

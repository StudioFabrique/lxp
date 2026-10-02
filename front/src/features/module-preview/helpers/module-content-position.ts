export type ModuleContentPosition = {
  lessonId: number;
  activityId?: number;
};

export function readModuleContentPosition(key: string): ModuleContentPosition | null {
  try {
    const position: unknown = JSON.parse(sessionStorage.getItem(key) ?? "null");
    if (!position || typeof position !== "object" || !("lessonId" in position)) return null;
    const { lessonId } = position;
    const activityId = "activityId" in position ? position.activityId : undefined;
    if (typeof lessonId !== "number" || !Number.isSafeInteger(lessonId) || lessonId <= 0) return null;
    if (activityId !== undefined &&
      (typeof activityId !== "number" || !Number.isSafeInteger(activityId) || activityId <= 0)) return null;
    return { lessonId, activityId };
  } catch {
    return null;
  }
}

export function saveModuleContentPosition(key: string, position: ModuleContentPosition) {
  try {
    sessionStorage.setItem(key, JSON.stringify(position));
  } catch {
    // La navigation reste disponible lorsque le stockage du navigateur est désactivé.
  }
}

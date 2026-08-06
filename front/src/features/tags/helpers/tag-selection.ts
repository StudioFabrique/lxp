import type Tag from "../../../utils/interfaces/tag";
import { createTag } from "../hooks/create-tag";

export function addPendingTag(
  currentTags: Tag[],
  initialTags: Tag[],
  pendingName: string,
): Tag[] {
  const name = pendingName.trim();
  if (!name) return currentTags;

  const isAlreadySelected = currentTags.some(
    (tag) => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
  if (isAlreadySelected) return currentTags;

  const existingTag = initialTags.find(
    (tag) => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );

  return [
    ...currentTags,
    existingTag ?? createTag(name, initialTags.length + currentTags.length),
  ];
}

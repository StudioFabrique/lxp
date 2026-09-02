import type Tag from "../../../utils/interfaces/tag";
import { createTag } from "../hooks/create-tag";

export function splitTagNames(value: string): string[] {
  return value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

export function partitionTagInput(value: string): {
  committed: string;
  pending: string;
} {
  const containsSeparator = value.includes(",");

  return {
    committed: containsSeparator ? value : "",
    pending: containsSeparator ? "" : value,
  };
}

export function addPendingTag(
  currentTags: Tag[],
  initialTags: Tag[],
  pendingName: string,
): Tag[] {
  return splitTagNames(pendingName).reduce((selectedTags, name) => {
    const isAlreadySelected = selectedTags.some(
      (tag) => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
    if (isAlreadySelected) return selectedTags;

    const existingTag = initialTags.find(
      (tag) => tag.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );

    return [
      ...selectedTags,
      existingTag ?? createTag(name, initialTags.length + selectedTags.length),
    ];
  }, currentTags);
}

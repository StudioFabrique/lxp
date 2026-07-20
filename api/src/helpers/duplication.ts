type TitledContent = { title: string | null; duplicationIndex: number };

/** Builds the next available duplicate title and index in a given container. */
export function getDuplicateIdentity(
  source: TitledContent,
  existingTitles: Array<string | null>,
) {
  const normalizedTitles = new Set(
    existingTitles.filter(Boolean).map((title) => title!.trim().toLocaleLowerCase()),
  );
  let duplicationIndex = source.duplicationIndex + 1;
  let title = `${source.title ?? "Sans titre"} ${duplicationIndex}`;

  while (normalizedTitles.has(title.trim().toLocaleLowerCase())) {
    duplicationIndex += 1;
    title = `${source.title ?? "Sans titre"} ${duplicationIndex}`;
  }

  return { title, duplicationIndex };
}


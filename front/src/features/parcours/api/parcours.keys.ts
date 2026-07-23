export const parcoursKeys = {
  all: ["parcours"] as const,
  detail: (id: number) => [...parcoursKeys.all, "detail", id] as const,
  availableTags: () => [...parcoursKeys.all, "available-tags"] as const,
  availableContacts: () =>
    [...parcoursKeys.all, "available-contacts"] as const,
};

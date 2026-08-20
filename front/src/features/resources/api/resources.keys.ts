export const resourcesKeys = {
  all: ["resources"] as const,
  list: () => [...resourcesKeys.all, "list"] as const,
  detail: (id: number) => [...resourcesKeys.all, "detail", id] as const,
};

export const moduleKeys = {
  all: ["module"] as const,
  list: () => [...moduleKeys.all, "list"] as const,
  detail: (id: number) => [...moduleKeys.all, "detail", id] as const,
};

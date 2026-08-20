import type { MediathequeQuery } from "./mediatheque.api";

export const mediathequeKeys = {
  all: ["mediatheque"] as const,
  page: (params: MediathequeQuery) =>
    [...mediathequeKeys.all, "page", params] as const,
};

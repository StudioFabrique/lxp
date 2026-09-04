const PAGINATION_STORAGE_PREFIX = "lxp:pagination";

export const getPaginationStorageKey = (location: string) =>
  `${PAGINATION_STORAGE_PREFIX}:${location}:items-per-page`;

export const getStoredItemsPerPage = (
  location: string | undefined,
  fallback: number,
) => {
  if (!location) return fallback;

  const storedValue = Number(
    localStorage.getItem(getPaginationStorageKey(location)),
  );

  return Number.isInteger(storedValue) && storedValue > 0
    ? storedValue
    : fallback;
};

export const storeItemsPerPage = (
  location: string | undefined,
  value: number,
) => {
  if (!location) return;
  localStorage.setItem(getPaginationStorageKey(location), String(value));
};

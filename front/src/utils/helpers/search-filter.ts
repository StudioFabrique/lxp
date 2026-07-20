// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SearchFilter = { field: string; property: string; value: string };

export function createSearchFilter(
  fieldMap: Record<string, SearchFilter>,
  entityToSearch: string,
  searchValue: string,
): SearchFilter | undefined {
  return fieldMap[entityToSearch]
    ? { ...fieldMap[entityToSearch], value: searchValue.toLowerCase() }
    : undefined;
}

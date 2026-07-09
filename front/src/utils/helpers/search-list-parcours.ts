// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchListParcours(
  entityToSearch: string,
  searchValue: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filters: any;
  switch (entityToSearch) {
    case "formation":
      filters = {
        field: "formation",
        property: "title",
        value: searchValue.toLowerCase(),
      };
      break;
    case "level":
      filters = {
        field: "formation",
        property: "level",
        value: searchValue.toLowerCase(),
      };
      break;
    case "author":
      filters = {
        field: "author",
        property: "",
        value: searchValue.toLowerCase(),
      };
      break;
  }
  return filters;
}

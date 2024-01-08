export function searchListCourse(entityToSearch: string, searchValue: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filters: any;
  switch (entityToSearch) {
    case "title":
      filters = {
        field: "titre",
        property: "title",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
    case "module":
      filters = {
        field: "module",
        property: "module",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
    case "parcours":
      filters = {
        field: "parcours",
        property: "parcours",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
    case "auteur":
      filters = {
        field: "auteur",
        propeerty: "author",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
  }
  return filters;
}

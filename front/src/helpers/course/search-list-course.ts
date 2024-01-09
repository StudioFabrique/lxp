export function searchListCourse(entityToSearch: string, searchValue: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filters: any;
  switch (entityToSearch) {
    case "title":
      filters = {
        field: "title",
        property: "",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
    case "module":
      filters = {
        field: "module",
        property: "",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
    case "parcours":
      filters = {
        field: "parcours",
        property: "",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
    case "auteur":
      filters = {
        field: "author",
        propeerty: "",
        value: searchValue.toLocaleLowerCase(),
      };
      break;
  }
  return filters;
}

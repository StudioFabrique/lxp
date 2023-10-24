import { sortArray } from "../utils/sortArray";

/**
 * insère des éléments d'un tableau dans un autre tableau s'ils n'y sont pas déjà présent
 * @param oldTab unknown[]
 * @param newTab unknown[]
 * @returns unknown[]
 */
export function arrayNoDoublon(oldTab: unknown[], newTab: unknown[]) {
  let tmp = Array<any>();
  newTab.forEach((item: any) => {
    const data = oldTab.find((elem: any) => elem.id === item.id);
    if (!data) {
      tmp = [...tmp, item];
    }
  });
  return sortArray([...oldTab, ...tmp], "createdAt");
}

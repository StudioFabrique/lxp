import type Module from "../../../utils/interfaces/module";

export function sortModulesByStartDate<T extends Pick<Module, "minDate">>(
  modules: T[],
): T[] {
  return modules
    .map((module, index) => ({ module, index }))
    .sort((left, right) => {
      const leftDate = left.module.minDate
        ? new Date(left.module.minDate).getTime()
        : Number.POSITIVE_INFINITY;
      const rightDate = right.module.minDate
        ? new Date(right.module.minDate).getTime()
        : Number.POSITIVE_INFINITY;

      const dateDifference =
        (Number.isNaN(leftDate) ? Number.POSITIVE_INFINITY : leftDate) -
        (Number.isNaN(rightDate) ? Number.POSITIVE_INFINITY : rightDate);

      return dateDifference || left.index - right.index;
    })
    .map(({ module }) => module);
}

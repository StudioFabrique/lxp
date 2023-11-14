export const sumPropertiesAsNumber: any = (object: unknown[]) => {
  return Object.values(object).reduce(
    (a, b) => (a as number) + (b as number),
    0
  );
};

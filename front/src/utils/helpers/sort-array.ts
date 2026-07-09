export const sortArray = (
  tab: Array<Record<string, unknown>>,
  property: string,
  direction = true,
) => {
  const sortedArray = [...tab];

  if (direction) {
    sortedArray.sort((a, b) => {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    });
  } else {
    sortedArray.sort((a, b) => {
      if (a[property] > b[property]) return -1;
      if (a[property] < b[property]) return 1;
      return 0;
    });
  }
  return sortedArray;
};

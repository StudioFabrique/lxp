export const sortArray = (
  tab: Array<any>,
  property: string,
  direction = true
) => {
  // Créer une copie modifiable du tableau
  const sortedArray = [...tab];

  if (direction) {
    sortedArray.sort(function compare(a: any, b: any) {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    });
  } else {
    sortedArray.sort(function compare(a: any, b: any) {
      if (a[property] > b[property]) return -1;
      if (a[property] < b[property]) return 1;
      return 0;
    });
  }
  return sortedArray;
};

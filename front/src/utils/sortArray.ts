export const sortArray = (tab: Array<any>, property: string) => {
  tab.sort(function compare(a: any, b: any) {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
  return tab;
};

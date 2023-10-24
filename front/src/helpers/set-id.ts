export default function setId(tab: any[]) {
  let i = 0;
  tab.forEach((item: any) => {
    if (item.id !== undefined && item.id >= i) {
      i = item.id + 1;
    }
  });
  return i;
}

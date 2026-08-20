 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function setId(tab: any[]) {
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tab.forEach((item: any) => {
    if (item.id !== undefined && item.id >= i) {
      i = item.id + 1;
    }
  });
  return i;
}

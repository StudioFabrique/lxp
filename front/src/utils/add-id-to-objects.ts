export function addIdToObject(items: Array<any>) {
  let i = 0;
  return items.map((item: any) => {
    i++;
    return { ...item, id: i };
  });
}

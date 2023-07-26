export function addIdToObject(items: Array<any>) {
  let i = 0;
  return items.map((item: any) => {
    if (!item.id) {
      i++;
      return { ...item, id: i };
    } else {
      return item;
    }
  });
}

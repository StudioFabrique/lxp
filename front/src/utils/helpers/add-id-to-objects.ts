export function addIdToObject(items: Array<Record<string, unknown>>) {
  let i = 0;
  return items.map((item) => {
    i++;
    return { ...item, id: i };
  });
}

import { randomUUID } from "crypto";

export function addUuidToObject(items: Array<any>) {
  return items.map((item: any) => {
    return { ...item, _id: randomUUID() };
  });
}

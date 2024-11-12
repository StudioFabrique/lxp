import { localeDate } from "./locale-date";

export const displayDate = (createdAt: string, updatedAt: string) => {
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  if (updatedDate.getTime() === createdDate.getTime()) {
    return "Créé le " + localeDate(createdAt);
  }
  return "Modifié le " + localeDate(updatedAt);
};

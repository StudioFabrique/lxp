export function localeDate(date: string | Date) {
  return new Date(date).toLocaleDateString("fr");
}

export function localeTime(date: string | Date) {
  return new Date(date).toLocaleTimeString();
}

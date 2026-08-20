export function localeDate(date: string | Date) {
  return new Date(date).toLocaleDateString();
}

export function localeTime(date: string | Date) {
  return new Date(date).toLocaleTimeString();
}

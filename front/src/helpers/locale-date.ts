export function localeDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function localeTime(date: string) {
  return new Date(date).toLocaleTimeString();
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

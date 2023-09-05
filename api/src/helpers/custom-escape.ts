export function customEscape(text: string) {
  return text.replace(/[^\w\s'éàèùçêâû()./:-_]/g, "");
}

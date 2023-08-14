export function customEscape(text: string) {
  return text.replace(/[^\w\s'éàè-ùçêâû()]/g, "");
}

export function checkCSV(expectedFields: string[], actualFields: string[]): boolean {
  return expectedFields.every((field) => actualFields.includes(field));
}

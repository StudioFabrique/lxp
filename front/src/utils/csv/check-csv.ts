export function checkCSV(fields: Array<string>, fieldsFromFile: Array<string>) {
  let result = true;
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] !== fieldsFromFile[i]) {
      return false;
    }
  }
  return result;
}

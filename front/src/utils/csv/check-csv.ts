export function checkCSV(fields: Array<string>, fieldsFromFile: Array<string>) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] !== fieldsFromFile[i]) {
      console.log(fields[i] + " n'est pas " + fieldsFromFile[i]);
      return false;
    }
  }
  return true;
}

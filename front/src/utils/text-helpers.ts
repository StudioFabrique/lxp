function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function toUpperFirstLetter(value: string | undefined | null) {
  return value
    ? `${value?.substring(0, 1).toUpperCase()}${value?.slice(1)}`
    : undefined;
}

export { toTitleCase, toUpperFirstLetter };

export default function toUpperFirstLetter(value: string | undefined | null) {
  return `${value?.substring(0, 1).toUpperCase()}${value?.slice(1)}`;
}

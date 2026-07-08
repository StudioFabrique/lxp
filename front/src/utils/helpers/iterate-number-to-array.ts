export default function iterateNumberToArray(
  number: number,
  increment: number = 1,
): Array<number> {
  const array: number[] = [1];

  for (let i = increment; i <= number; i += increment) {
    array.push(i);
  }

  return [...new Set([...array, number])];
}

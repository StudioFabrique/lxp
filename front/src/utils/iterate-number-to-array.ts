export default function iterateNumberToArray(
  number: number,
  increment: number = 1,
): Array<number> {
  const array: number[] = [1]; // Default step to 1 if not provided

  for (let i = increment; i <= number; i += increment) {
    array.push(i);
  }

  console.log({ array });

  return [...new Set([...array, number])];
}

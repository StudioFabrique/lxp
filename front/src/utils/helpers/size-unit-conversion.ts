export const displaySize = (size: number) => {
  const convertedSize = size / 1024;

  return convertedSize < 1024
    ? `${convertedSize.toFixed(2)} ko`
    : `${(convertedSize / 1024).toFixed(2)} mo`;
};

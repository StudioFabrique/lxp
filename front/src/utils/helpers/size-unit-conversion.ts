import { formatNumber } from "./format-number";

const TWO_DECIMALS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const displaySize = (size: number) => {
  const convertedSize = size / 1024;

  return convertedSize < 1024
    ? `${formatNumber(convertedSize, TWO_DECIMALS)} ko`
    : `${formatNumber(convertedSize / 1024, TWO_DECIMALS)} mo`;
};

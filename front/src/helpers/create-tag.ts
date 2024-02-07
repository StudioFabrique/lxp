import { getRandomNumber } from "./get-random-number";

const colors = [
  "rgba(255, 0, 0, 0.5)", // Red
  "rgba(0, 255, 0, 0.5)", // Green
  "rgba(0, 0, 255, 0.5)", // Blue
  "rgba(255, 255, 0, 0.5)", // Yellow
  "rgba(255, 0, 255, 0.5)", // Magenta
  "rgba(0, 255, 255, 0.5)", // Cyan
  "rgba(128, 0, 0, 0.5)", // Maroon
  "rgba(0, 128, 0, 0.5)", // Green (dark)
  "rgba(0, 0, 128, 0.5)", // Navy
  "rgba(128, 128, 0, 0.5)", // Olive
  "rgba(128, 0, 128, 0.5)", // Purple
  "rgba(0, 128, 128, 0.5)", // Teal
  "rgba(255, 165, 0, 0.5)", // Orange
  "rgba(139, 69, 19, 0.5)", // Saddle Brown
  "rgba(220, 20, 60, 0.5)", // Crimson
  "rgba(46, 139, 87, 0.5)", // Sea Green
  "rgba(255, 215, 0, 0.5)", // Gold
  "rgba(139, 0, 139, 0.5)", // Dark Magenta
  "rgba(0, 100, 0, 0.5)", // Dark Green
  "rgba(0, 0, 139, 0.5)", // Dark Blue
];

export function createTag(name: string, value: number) {
  const id = value + 1;

  return {
    id,
    name,
    color: colors[getRandomNumber(0, colors.length - 1)],
  };
}

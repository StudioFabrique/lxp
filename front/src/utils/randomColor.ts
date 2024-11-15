export function getRandomHexColor(): string {
  const randomColor = Math.floor(Math.random() * 16777216);

  const hexColor = randomColor.toString(16).toUpperCase();

  return "#" + "0".repeat(6 - hexColor.length) + hexColor;
}

export function getRandomGradientColor(): string {
  const useGradient = Math.random() > 0.6; // Slightly less chance of gradient
  if (useGradient) {
    return softGradients[Math.floor(Math.random() * softGradients.length)];
  }
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

const pastelColors = [
  "#FF9AA2", // Soft red
  "#B5EAD7", // Mint green
  "#C7CEEA", // Periwinkle blue
  "#FFDAC1", // Peach
  "#FFB7B2", // Coral pink
  "#E2F0CB", // Light lime
];

const softGradients = [
  "linear-gradient(135deg, #FFE259, #FFA751)", // Warm yellow-orange
  "linear-gradient(135deg, #00C6FB, #005BEA)", // Vibrant blue
  "linear-gradient(135deg, #F093FB, #F5576C)", // Pink-red
  "linear-gradient(135deg, #81FBB8, #28C76F)", // Fresh green
  "linear-gradient(135deg, #FF9A9E, #FAD0C4)", // Soft coral
  "linear-gradient(135deg, #A8EDEA, #C5D1EB)", // Aqua-blue
];

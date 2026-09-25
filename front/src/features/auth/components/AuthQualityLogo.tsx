import { useId } from "react";
import logoSvg from "../../../assets/andria-logo/logo-lightmode.svg?raw";

// Read the original local asset: no duplicate or redrawn logo geometry.
const paths = [...logoSvg.matchAll(/<path\b([^>]+)\/?\s*>/g)].map(([, attributes]) => ({
  d: attributes.match(/\bd="([^"]+)"/)![1],
  fill: attributes.match(/\bfill="([^"]+)"/)?.[1],
  evenodd: attributes.includes('fill-rule="evenodd"'),
}));
// The first path contains ANDR. Clip the accent overlay to the chosen letter.
const letters = [
  { letter: "A", x: 0, width: 41 },
  { letter: "N", x: 41, width: 43 },
  { letter: "D", x: 84, width: 39 },
  { letter: "R", x: 123, width: 39 },
  { letter: "I", x: 162, width: 30 },
  { letter: "A", x: 192, width: 49 },
];

const tileColors = ["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)"];
const logoColor = (tileColor: string, amount: number) => `color-mix(in srgb, ${tileColor} ${amount}%, #0F172A)`;

export default function AuthQualityLogo({ quality, color = 0 }: { quality: number; color?: number }) {
  const clipId = useId();
  const { letter, x, width } = letters[quality];
  const tileColor = color % tileColors.length;
  return (
      <svg viewBox="0 0 241 78" className="mb-5 block h-auto w-32" role="img" aria-label={`ANDRIA — lettre ${letter} mise en avant`}>
        <defs><clipPath id={clipId}><rect x={x} y="0" width={width} height="78" /></clipPath></defs>
        {paths.map((path, index) => <path key={index} d={path.d} fill={index === 1 ? "#0F172A" : path.fill === "white" ? "#FFFFFF" : "#000000"} fillRule={path.evenodd ? "evenodd" : undefined} />)}
        <g clipPath={`url(#${clipId})`} style={{ color: quality >= 4 ? "#60A5FA" : logoColor(tileColors[tileColor], 45) }} data-highlight-letter={quality}>
          {paths.map((path, index) => (quality < 4 ? index === 0 : quality === 4 ? index === 3 || index === 6 : index === 4 || index === 5)
            ? <path key={index} d={path.d} fill="currentColor" fillRule={path.evenodd ? "evenodd" : undefined} /> : null)}
        </g>
      </svg>
  );
}

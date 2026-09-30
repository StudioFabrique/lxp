import logoSvg from "../../../assets/andria-logo/logo-lightmode.svg?raw";

// Keep the original logo geometry while tinting all of its dark shapes.
const paths = [...logoSvg.matchAll(/<path\b([^>]+)\/?\s*>/g)].map(([, attributes]) => ({
  d: attributes.match(/\bd="([^"]+)"/)![1],
  fill: attributes.match(/\bfill="([^"]+)"/)?.[1],
  evenodd: attributes.includes('fill-rule="evenodd"'),
}));
const tileColors = ["#1e40af", "var(--color-secondary)", "var(--color-accent)"];
const logoColor = (tileColor: string, amount: number) => `color-mix(in srgb, ${tileColor} ${amount}%, #0F172A)`;

export default function AuthQualityLogo({ color = 0 }: { color?: number }) {
  const tileColor = color % tileColors.length;
  return (
    <svg
      viewBox="0 0 241 78"
      className="mb-5 block h-auto w-32"
      role="img"
      aria-label="ANDRIA"
      style={{ color: tileColor === 0 ? tileColors[0] : logoColor(tileColors[tileColor], 45) }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill={path.fill === "white" ? "#FFFFFF" : "currentColor"}
          fillRule={path.evenodd ? "evenodd" : undefined}
        />
      ))}
    </svg>
  );
}

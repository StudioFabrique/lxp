import logoSvg from "../../assets/andria-logo/logo-lightmode.svg?raw";

// Géométrie du logo d'origine : les formes sombres suivent la couleur de texte de la barre latérale,
// les formes blanches (le « iA » dans son cadre) prennent le fond de la barre latérale.
const paths = [...logoSvg.matchAll(/<path\b([^>]+)\/?\s*>/g)].map(([, attributes]) => ({
  d: attributes.match(/\bd="([^"]+)"/)![1],
  fill: attributes.match(/\bfill="([^"]+)"/)?.[1],
  evenodd: attributes.includes('fill-rule="evenodd"'),
}));

export default function SidebarLogo() {
  return (
    <svg
      viewBox="0 0 241 78"
      className="block h-auto w-full"
      role="img"
      aria-label="logo ANDRIA"
      style={{ color: "var(--sidebar-content)" }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path.d}
          fill={path.fill === "white" ? "var(--sidebar-bg)" : "currentColor"}
          fillRule={path.evenodd ? "evenodd" : undefined}
        />
      ))}
    </svg>
  );
}

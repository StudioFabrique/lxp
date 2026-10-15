import { cn } from "../../utils/cn";
import { sidebarTransitionClassName } from "./sidebar-styles";

type Props = {
  logoUrl: string;
  backgroundColor?: string;
  /** Site de l'organisme : le logo en devient le lien. */
  websiteUrl: string | null;
  /** `rail` : barre latérale ; `drawer` : menu déployé du mobile ; `bar` : barre du haut du mobile. */
  variant: "rail" | "drawer" | "bar";
  animated?: boolean;
};

/**
 * Logo de l'organisme en tête de la barre latérale, élargi en rectangle lorsque la barre est étendue, et repris dans la barre du haut du mobile (même hauteur, plus de largeur pour les logos horizontaux).
 * S'il y a un site, un clic l'ouvre dans un nouvel onglet, sauf dans la barre du haut du mobile.
 */
const SidebarOrganisationLogo = ({
  logoUrl,
  backgroundColor,
  websiteUrl: organisationWebsiteUrl,
  variant,
  animated = false,
}: Props) => {
  // Dans la barre du haut du mobile, le logo n'est qu'un repère : un clic accidentel en quittant l'application serait gênant.
  const websiteUrl = variant === "bar" ? null : organisationWebsiteUrl;
  const logo = (
    <img
      className={cn(
        "block rounded-lg border object-contain p-1 bg-white border-(--sidebar-border)",
        variant === "bar" && "h-8 w-16",
        variant === "drawer" && "h-12.5 w-32",
        variant === "rail" && "2xl:h-12.5 2xl:w-32 h-8 w-8",
        animated &&
          variant === "rail" &&
          cn("transition-[width,height]", sidebarTransitionClassName),
      )}
      src={logoUrl}
      style={{ backgroundColor }}
      alt={websiteUrl ? "" : "Logo de l’organisme"}
    />
  );

  return (
    <div className={cn("shrink-0", variant !== "bar" && "mb-3 self-start")}>
      {websiteUrl ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Site de l’organisme (s’ouvre dans un nouvel onglet)"
          className="block rounded-lg transition-opacity hover:opacity-80"
        >
          {logo}
        </a>
      ) : (
        logo
      )}
    </div>
  );
};

export default SidebarOrganisationLogo;

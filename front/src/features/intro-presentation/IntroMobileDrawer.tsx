import { useContext, useEffect, useRef, type ReactNode } from "react";
import { ClipboardList, DoorOpen, LogOutIcon, Moon, Presentation, Sparkles, Sun, X } from "lucide-react";

import SidebarLogo from "../../components/sidebar/SidebarLogo";
import SidebarOrganisationLogo from "../../components/sidebar/SidebarOrganisationLogo";
import {
  sidebarControlClassName,
  sidebarLabelClassName,
  sidebarListClassName,
} from "../../components/sidebar/sidebar-styles";
import { sidebarItems, type SidebarLayout } from "../../config/sidebarItems";
import { ThemeContext } from "../../store/ThemeProvider";
import { useDemoMode } from "../../store/DemoContext";
import { cn } from "../../utils/cn";
import type { IntroSpaceContent } from "./intro-space-content";

type Props = {
  content: IntroSpaceContent;
  layout: SidebarLayout;
  /** Entrée du menu mise en avant, pour une explication ; sans elle, seule la page courante est marquée. */
  explainedKey?: string;
  branding: { logoUrl: string | null; backgroundColor?: string };
  /** Voile sombre derrière le menu, comme sur la page ; absent quand le menu est présenté seul, incliné. */
  scrim?: boolean;
};

const tileClassName = cn(sidebarControlClassName, "pointer-events-none text-sm");
const iconSlotClassName = "flex size-4 shrink-0 items-center justify-center [&>svg]:size-4";
const currentPageClassName =
  "bg-(--sidebar-active) font-medium text-(--sidebar-active-content) ring-1 ring-inset ring-(--sidebar-border)";

type TileProps = { icon: ReactNode; label: string };

const Tile = ({ icon, label }: TileProps) => (
  <li className="block w-full">
    <span className={tileClassName}>
      <span className={iconSlotClassName}>{icon}</span>
      <span className={sidebarLabelClassName}>{label}</span>
    </span>
  </li>
);

/**
 * Reproduction fidèle du menu déployé du mobile (`SidebarDrawer`) pour le tutoriel : mêmes classes de
 * cartes carrées, mêmes blocs du bas (profil, consommation IA ou questionnaire, présentation, sortie,
 * logo, thème) et même bouton de fermeture. Rien n'y est interactif : le tutoriel la pilote seul.
 */
const IntroMobileDrawer = ({ content, layout, explainedKey, branding, scrim = true }: Props) => {
  const { theme } = useContext(ThemeContext);
  const { demoMode, aiDisabled } = useDemoMode();
  const navRef = useRef<HTMLUListElement>(null);
  const items = sidebarItems[layout];
  const currentKey = content.nav[0]?.key;
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  // Une longue liste de sections reste lisible : l'entrée expliquée est ramenée dans la vue du menu.
  useEffect(() => {
    navRef.current?.querySelector("[data-explained]")?.scrollIntoView?.({ block: "nearest" });
  }, [explainedKey]);

  return (
    <div className={cn("absolute inset-0 z-10", scrim && "bg-black/50")} aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-[90%] max-w-md p-2 pb-[13rem]">
        <nav
          data-variant="drawer"
          className="group/sidebar flex h-full w-full flex-col justify-between gap-4 overflow-y-auto overflow-x-hidden rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-4 text-(--sidebar-content) shadow-sm"
        >
          <div>
            {branding.logoUrl && (
              <SidebarOrganisationLogo
                logoUrl={branding.logoUrl}
                backgroundColor={branding.backgroundColor}
                websiteUrl={null}
                variant="drawer"
              />
            )}
            <ul ref={navRef} className={sidebarListClassName}>
              {content.nav.map((entry) => {
                const Icon = items.find((item) => item.key === entry.key)?.icon;
                const isExplained = explainedKey === entry.key;
                const isCurrent = !explainedKey && entry.key === currentKey;
                return (
                  <li key={entry.key} className="block w-full" data-explained={isExplained || undefined}>
                    <span
                      className={cn(
                        tileClassName,
                        (isCurrent || isExplained) && currentPageClassName,
                        isExplained && "ring-2 ring-(--sidebar-content)",
                      )}
                    >
                      <span className={iconSlotClassName}>{Icon && <Icon />}</span>
                      <span className={sidebarLabelClassName}>{entry.displayLabel}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <ul className={sidebarListClassName}>
            <li className="block w-full">
              <span className={cn(tileClassName, "capitalize")}>
                <span className={iconSlotClassName}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-content">
                    {content.initials || "?"}
                  </span>
                </span>
                <span className={sidebarLabelClassName}>{content.userName}</span>
              </span>
            </li>
            {layout === "admin" && !aiDisabled && <Tile icon={<Sparkles />} label="Consommation IA" />}
            {layout === "student" && !demoMode && (
              <Tile icon={<ClipboardList />} label="Questionnaire (Bêta Testeurs)" />
            )}
            <Tile icon={<Presentation />} label="Revoir la présentation" />
            {demoMode ? (
              <Tile icon={<DoorOpen />} label="Sortir de la démo" />
            ) : (
              <Tile icon={<LogOutIcon />} label="Déconnexion" />
            )}
            <li className="col-span-2 flex w-full items-center px-3 [&>svg]:max-w-36">
              <SidebarLogo />
            </li>
            <li className="col-end-[-1] flex aspect-square items-center justify-center rounded-xl border border-(--sidebar-border)">
              <ThemeIcon className="size-4" />
            </li>
          </ul>
        </nav>
        <span className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-lg text-(--sidebar-content)">
          <X className="size-4" />
        </span>
      </div>
    </div>
  );
};

export default IntroMobileDrawer;

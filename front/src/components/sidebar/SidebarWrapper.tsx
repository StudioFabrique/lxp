import type { ReactNode } from "react";
import SidebarBottom from "./SidebarBottom";
import { useInstanceBranding } from "../../hooks/useInstanceBranding";
import { useDemoMode } from "../../store/DemoContext";
import DemoModeIndicator from "../../features/demo/components/DemoModeIndicator";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";
import { sidebarTransitionClassName } from "./sidebar-styles";

type Props = {
  children: ReactNode;
  interfaceType: string;
  /** `drawer` : menu déployé du mobile, qui occupe toute la largeur de son conteneur. */
  variant?: "rail" | "drawer";
};

const SidebarWrapper = ({
  children,
  interfaceType,
  variant = "rail",
}: Props) => {
  const { demoMode } = useDemoMode();
  const { animations } = useVisualPreferences();

  const { logoUrl, backgroundColor } = useInstanceBranding();
  const isDrawer = variant === "drawer";

  return (
    // Largeur explicite dans les deux modes (compact : un contrôle de 2rem + padding + bordure)
    // pour que le passage de l'un à l'autre soit interpolé par le navigateur.
    <nav
      data-animated={animations}
      data-variant={variant}
      aria-label={isDrawer ? "Navigation principale" : undefined}
      className={cn(
        "group/sidebar h-full flex flex-col justify-between gap-4 p-4 rounded-xl border bg-(--sidebar-bg) text-(--sidebar-content) border-(--sidebar-border) shadow-sm transition-colors duration-200",
        isDrawer ? "w-full overflow-y-auto" : "w-[calc(4rem+2px)] 2xl:w-[20rem]",
        animations &&
          !isDrawer &&
          cn("transition-[width,background-color,border-color]", sidebarTransitionClassName),
      )}
    >
      <div>
        {logoUrl && (
          <img
            className={cn(
              "self-start rounded-full border object-contain p-1 mb-3 bg-white border-(--sidebar-border)",
              isDrawer ? "h-12.5 w-12.5" : "2xl:h-12.5 2xl:w-12.5 h-8 w-8",
              animations &&
                !isDrawer &&
                cn("transition-[width,height]", sidebarTransitionClassName),
            )}
            src={logoUrl}
            style={{ backgroundColor }}
            alt="Logo de l’organisme"
          />
        )}
        {demoMode && <DemoModeIndicator />}
        {children}
      </div>
      <SidebarBottom interfaceType={interfaceType} />
    </nav>
  );
};

export default SidebarWrapper;

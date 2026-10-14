import type { ReactNode } from "react";
import SidebarBottom from "./SidebarBottom";
import { useInstanceBranding } from "../../hooks/useInstanceBranding";
import { useDemoMode } from "../../store/DemoContext";
import DemoModeIndicator from "../../features/demo/components/DemoModeIndicator";

const SidebarWrapper = ({
  children,
  interfaceType,
}: {
  children: ReactNode;
  interfaceType: string;
}) => {
  const { demoMode } = useDemoMode();

  const { logoUrl, backgroundColor } = useInstanceBranding();

  return (
    <nav
      className="h-full 2xl:w-[20rem] flex flex-col justify-between gap-4 p-4 rounded-xl border bg-(--sidebar-bg) text-(--sidebar-content) border-(--sidebar-border) shadow-sm transition-colors duration-200"
    >
      <div>
        {logoUrl && (
          <img
            className="self-start 2xl:h-12.5 2xl:w-12.5 h-8 w-8 rounded-full border object-contain p-1 mb-3 bg-white border-(--sidebar-border)"
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

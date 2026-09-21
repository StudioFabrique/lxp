import { ReactNode, useEffect, useState } from "react";
import SidebarBottom from "./SidebarBottom";
import { INSTANCE_LOGO, INSTANCE_LOGO_COLOR } from "../../config/urls";
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

  const [logoExists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);

  const [logoBgColor, setBgColor] = useState<string>();

  const showLogo = logoExists || loading;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setExists(true);
      setLoading(false);
    };
    img.onerror = () => {
      setExists(false);
      setLoading(false);
    };
    img.src = INSTANCE_LOGO;

    fetch(INSTANCE_LOGO_COLOR)
      .then(async (response) => {
        if (response.ok) setBgColor(await response.text());
      })
      .catch(() => undefined);
  }, []);

  return (
    <nav
      data-onboarding="sidebar-navigation"
      className="h-full 2xl:w-[20rem] flex flex-col justify-between gap-4 p-4 rounded-xl border bg-(--sidebar-bg) text-(--sidebar-content) border-(--sidebar-border) shadow-sm transition-colors duration-200"
    >
      <div>
        {showLogo && (
          <img
            className="self-start 2xl:h-12.5 2xl:w-12.5 h-8 w-8 rounded-full border object-contain p-1 mb-3 bg-white border-(--sidebar-border)"
            src={INSTANCE_LOGO}
            style={{ backgroundColor: logoBgColor }}
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

import { ReactNode, useEffect, useState } from "react";
import SidebarBottom from "./SidebarBottom";
import { COMPANY_LOGO, COMPANY_LOGO_COLOR } from "../../config/urls";
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

  const showLogo = (logoExists || loading) && COMPANY_LOGO;

  useEffect(() => {
    if (!COMPANY_LOGO) {
      setExists(false);
      setLoading(false);
      return;
    }

    if (!COMPANY_LOGO_COLOR) {
      setExists(false);
      setLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setExists(true);
      setLoading(false);
    };
    img.onerror = () => {
      setExists(false);
      setLoading(false);
    };
    img.src = COMPANY_LOGO;

    fetch(COMPANY_LOGO_COLOR).then(async (response) =>
      setBgColor(await response.text()),
    );
  }, []);

  return (
    <nav
      data-onboarding="sidebar-navigation"
      className="h-full xl:w-[20rem] flex flex-col justify-between gap-4 p-4 rounded-xl border bg-[var(--sidebar-bg)] text-[var(--sidebar-content)] border-[var(--sidebar-border)] shadow-sm transition-colors duration-200"
    >
      <div>
        {showLogo && (
          <img
            className="self-start xl:h-12.5 xl:w-12.5 h-8 w-8 rounded-full border object-contain p-1 mb-3 bg-white border-[var(--sidebar-border)]"
            src={COMPANY_LOGO}
            style={{ backgroundColor: logoBgColor }}
            alt="Company logo"
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

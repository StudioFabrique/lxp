import { useLocation } from "react-router";
import SidebarWrapper from "./SidebarWrapper";
import SidebarMobile from "./SidebarMobile";
import SidebarTopAdmin from "./SidebarTopAdmin";
import SidebarTopStudent from "./SidebarTopStudent";
import SidebarIntroBar from "./SidebarIntroBar";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
import { useIsMobile } from "../../hooks/useMediaQuery";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { sidebarPhase } = useIntroPresentation();
  // Sous le point de rupture `md`, la barre latérale laisse place à une barre en haut et à un tiroir.
  const isMobile = useIsMobile();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const isSkeleton = sidebarPhase !== "normal";

  if (isSkeleton) {
    return <SidebarIntroBar />;
  }

  const navigation =
    currentRoute[0] === "admin" ? (
      <SidebarTopAdmin currentRoute={currentRoute} />
    ) : (
      <SidebarTopStudent currentRoute={currentRoute} />
    );

  if (isMobile) {
    return (
      <SidebarMobile interfaceType={currentRoute[0]}>{navigation}</SidebarMobile>
    );
  }

  return (
    <SidebarWrapper interfaceType={currentRoute[0]}>{navigation}</SidebarWrapper>
  );
};

export default Sidebar;

import { useLocation } from "react-router";
import SidebarWrapper from "./SidebarWrapper";
import SidebarTopAdmin from "./SidebarTopAdmin";
import SidebarTopStudent from "./SidebarTopStudent";
import SidebarIntroBar from "./SidebarIntroBar";
import { useDemoMode } from "../../store/DemoContext";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
const Sidebar = () => {
  const { pathname } = useLocation();
  const { sidebarPhase } = useIntroPresentation();
  const { demoMode } = useDemoMode();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  // La démonstration partage son compte : sa barre reste complète pendant la présentation.
  const isSkeleton = sidebarPhase !== "normal" && !demoMode;

  if (isSkeleton) {
    return <SidebarIntroBar />;
  }

  return (
    <SidebarWrapper interfaceType={currentRoute[0]}>
      {currentRoute[0] === "admin" ? (
        <SidebarTopAdmin currentRoute={currentRoute} />
      ) : (
        <SidebarTopStudent currentRoute={currentRoute} />
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;

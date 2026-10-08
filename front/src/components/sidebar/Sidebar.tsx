import { useLocation } from "react-router";
import SidebarWrapper from "./SidebarWrapper";
import SidebarTopAdmin from "./SidebarTopAdmin";
import SidebarTopStudent from "./SidebarTopStudent";
import SidebarIntroBar from "./SidebarIntroBar";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
const Sidebar = () => {
  const { pathname } = useLocation();
  const { sidebarPhase } = useIntroPresentation();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const isSkeleton = sidebarPhase !== "normal";

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

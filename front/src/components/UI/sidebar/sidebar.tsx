import { useLocation } from "react-router-dom";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarBottom from "./sidebar-bottom";
import SidebarTopStudent from "./sidebar-top-student";
import SidebarTopAdmin from "./sidebar-top-admin";

const Sidebar = () => {
  const { pathname } = useLocation();

  const currentRoute = pathname.split("/").slice(1) ?? [];

  return (
    <SidebarWrapper>
      {currentRoute[0] === "admin" ? (
        <SidebarTopAdmin currentRoute={currentRoute} />
      ) : (
        <SidebarTopStudent currentRoute={currentRoute} />
      )}
      <SidebarBottom interfaceType={currentRoute[0]} />
    </SidebarWrapper>
  );
};

export default Sidebar;

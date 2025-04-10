import { useLocation } from "react-router-dom";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarTopStudent from "./sidebar-top-student";
import SidebarTopAdmin from "./sidebar-top-admin";

const Sidebar = () => {
  const { pathname } = useLocation();

  const currentRoute = pathname.split("/").slice(1) ?? [];

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

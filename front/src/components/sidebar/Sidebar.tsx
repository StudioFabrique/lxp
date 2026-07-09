import { useLocation } from "react-router";
import SidebarWrapper from "./SidebarWrapper";
import SidebarTopAdmin from "./SidebarTopAdmin";
import SidebarTopStudent from "./SidebarTopStudent";
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

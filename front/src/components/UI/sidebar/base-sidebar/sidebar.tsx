import { useContext } from "react";
import { Context } from "../../../../store/context.store";
import SharedSideBar from "./shared-sidebar";
import SidebarParcours from "../sidebar-parcours";
import { useLocation } from "react-router-dom";
import SidebarCourse from "../sidebar-course";
import SidebarWrapper from "./sidebar-wrapper";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useContext(Context);

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const SidebarRoute = () => {
    switch (currentRoute[1]) {
      case "parcours":
        return <SidebarParcours />;
      case "course":
        return <SidebarCourse />;

      default:
        return undefined;
    }
  };

  return (
    <SidebarWrapper>
      {SidebarRoute() && (
        <>
          <SidebarRoute />
          <div className="divider" />
        </>
      )}
      <SharedSideBar onLogout={logout} />
    </SidebarWrapper>
  );
};

export default Sidebar;

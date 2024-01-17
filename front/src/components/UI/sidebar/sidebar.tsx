import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../../../store/context.store";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarBottom from "./sidebar-bottom";
import SidebarTopStudent from "./sidebar-top-student";
import SidebarTopAdmin from "./sidebar-top-admin";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useContext(Context);

  const currentRoute = pathname.split("/").slice(1) ?? [];

  /* const SidebarRoute = () => {
    switch (currentRoute[1]) {
      case "parcours":
        return <SidebarParcours interfaceType={currentRoute[0]} />;
      case "course":
        return <SidebarCourse interfaceType={currentRoute[0]} />;
      case "user":
        return <SidebarUser interfaceType={currentRoute[0]} />;
      case "group":
        return <SidebarGroup interfaceType={currentRoute[0]} />;
      case "profil":
        return <SidebarProfile interfaceType={currentRoute[0]} />;
      default:
        return undefined;
    }
  }; */

  return (
    <SidebarWrapper>
      {currentRoute[0] === "admin" ? (
        <SidebarTopAdmin interfaceType={currentRoute[0]} />
      ) : (
        <SidebarTopStudent interfaceType={currentRoute[0]} />
      )}
      <SidebarBottom interfaceType={currentRoute[0]} onLogout={logout} />
    </SidebarWrapper>
  );
};

export default Sidebar;

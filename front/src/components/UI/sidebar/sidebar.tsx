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

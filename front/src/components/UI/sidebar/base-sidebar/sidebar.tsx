import { motion, useCycle } from "framer-motion";

import { useContext } from "react";
import { Context } from "../../../../store/context.store";
import SharedSideBar from "./shared-sidebar";
import SidebarParcours from "../sidebar-parcours";
import { useLocation } from "react-router-dom";
import SidebarCourse from "../sidebar-course";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarUser from "../sidebar-user";
import SidebarGroup from "../sidebar-group";
import SidebarProfile from "../sidebar-profile";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useContext(Context);

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const SidebarRoute = () => {
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
  };

  return (
    <SidebarWrapper>
      <SharedSideBar interfaceType={currentRoute[0]} onLogout={logout} />
      <motion.div
        transition={{ duration: 0.2 }}
        animate={{
          height: SidebarRoute() ? "auto" : 0,
          opacity: SidebarRoute() ? 1 : 0,
        }}
        className="-my-2 h-auto"
      >
        <div className="divider" />
        <SidebarRoute />
      </motion.div>
    </SidebarWrapper>
  );
};

export default Sidebar;

import { motion } from "framer-motion";

import { useContext } from "react";
import { Context } from "../../../../store/context.store";
import SharedSideBar from "./shared-sidebar";
import SidebarParcours from "../sidebar-parcours";
import { useLocation } from "react-router-dom";
import SidebarCourse from "../sidebar-course";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarUser from "../sidebar-user";
import SidebarGroup from "../sidebar-group";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useContext(Context);

  const currentRoute = pathname.split("/").slice(1) ?? [];

  const SidebarRoute = () => {
    switch (currentRoute[1]) {
      case "parcours":
        return <SidebarParcours interfaceType={currentRoute[0]} />;
      case "course":
        return <SidebarCourse />;
      case "user":
        return <SidebarUser />;
      case "group":
        return <SidebarGroup />;
      default:
        return undefined;
    }
  };

  return (
    <SidebarWrapper>
      {
        <motion.div
          initial={{ opacity: 0, height: "0px" }}
          animate={{
            opacity: SidebarRoute() ? 1 : 0,
            height: SidebarRoute() ? "100px" : "0px",
          }}
        >
          <SidebarRoute />
          <div className="divider" />
        </motion.div>
      }
      <SharedSideBar interfaceType={currentRoute[0]} onLogout={logout} />
    </SidebarWrapper>
  );
};

export default Sidebar;

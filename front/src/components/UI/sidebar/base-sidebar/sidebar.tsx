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

  const [variant, toggleVariant] = useCycle("a", "b");
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const SidebarRoute = () => {
    switch (currentRoute[1]) {
      case "parcours":
        toggleVariant(1);
        return <SidebarParcours interfaceType={currentRoute[0]} />;
      case "course":
        toggleVariant(1);
        return <SidebarCourse interfaceType={currentRoute[0]} />;
      case "user":
        toggleVariant(1);
        return <SidebarUser interfaceType={currentRoute[0]} />;
      case "group":
        toggleVariant(1);
        return <SidebarGroup interfaceType={currentRoute[0]} />;
      case "profil":
        toggleVariant(1);
        return <SidebarProfile interfaceType={currentRoute[0]} />;
      default:
        toggleVariant(0);
        return undefined;
    }
  };

  return (
    <SidebarWrapper>
      <SharedSideBar interfaceType={currentRoute[0]} onLogout={logout} />
      <motion.div
        variants={{
          a: { maxHeight: 0, opacity: 0 },
          b: { maxHeight: 1000, opacity: 1 }, // Adjust the max height as needed
        }}
        animate={variant}
        className="-my-2"
      >
        <div className="divider" />
        <SidebarRoute />
      </motion.div>
    </SidebarWrapper>
  );
};

export default Sidebar;

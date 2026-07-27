import { useLocation } from "react-router";
import { getSidebarItemForPath } from "../../config/sidebarItems";

const SidebarRouteIcon = () => {
  const { pathname } = useLocation();
  const sidebarItem = getSidebarItemForPath(pathname);

  if (!sidebarItem) {
    return null;
  }

  const Icon = sidebarItem.icon;

  return <Icon aria-hidden className="size-7 shrink-0" />;
};

export default SidebarRouteIcon;

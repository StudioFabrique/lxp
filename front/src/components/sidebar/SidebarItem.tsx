import { Link } from "react-router";
import { PropsWithChildren } from "react";
import {
  sidebarControlClassName,
  sidebarLabelClassName,
} from "./sidebar-styles";
import { cn } from "../../utils/cn";

type Props = {
  linkTo: string;
  currentRoute: string[];
  itemPath: string | undefined;
  icon: React.ReactNode;
  textSize?: "text-sm" | "text-lg";
  tooltipText?: string;
};

const SidebarItem = ({
  linkTo,
  currentRoute,
  itemPath,
  icon,
  textSize = "text-sm",
  tooltipText,
  children,
}: PropsWithChildren<Props>) => {
  const currentPath = currentRoute.slice(1).join("/");
  const isActive = Boolean(
    itemPath &&
    (currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)),
  );

  return (
    <li className="block w-full">
      <Link
        to={linkTo}
        aria-label={tooltipText}
        data-tip={tooltipText}
        className={cn(sidebarControlClassName, textSize, "max-2xl:tooltip max-2xl:tooltip-right", isActive && "bg-(--sidebar-active) text-(--sidebar-active-content) font-medium ring-1 ring-inset ring-(--sidebar-border)")}
      >
        <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
          {icon}
        </span>
        <span className={sidebarLabelClassName}>{children}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;

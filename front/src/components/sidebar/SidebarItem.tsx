import { Link } from "react-router";
import { PropsWithChildren } from "react";
import { sidebarControlClassName } from "./sidebar-styles";

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
  return (
    <li className="flex w-full justify-center xl:block">
      <Link
        to={linkTo}
        aria-label={tooltipText}
        data-tip={tooltipText}
        className={`${sidebarControlClassName} ${textSize} max-xl:tooltip max-xl:tooltip-right ${
          currentRoute[1] === itemPath
            ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-content)] font-medium ring-1 ring-inset ring-[var(--sidebar-border)]"
            : ""
        }`}
      >
        <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
          {icon}
        </span>
        <span className="xl:block hidden">{children}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;

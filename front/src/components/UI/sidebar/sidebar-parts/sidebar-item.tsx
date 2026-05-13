import { Link } from "react-router";
import { PropsWithChildren } from "react";

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
    <li>
      <Link to={linkTo}>
        <div data-tip="Accueil LXP">
          <div
            data-tip={tooltipText}
            className={`${textSize} max-xl:tooltip max-xl:tooltip-right flex gap-5 p-1 px-2 rounded-lg hover:bg-primary/50 items-center select-none ${
              currentRoute[1] === itemPath && "bg-primary/50"
            }`}
          >
            <span>{icon}</span>
            <span className="xl:block hidden">{children}</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;

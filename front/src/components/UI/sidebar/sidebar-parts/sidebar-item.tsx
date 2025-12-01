import { Link } from "react-router-dom";
import { PropsWithChildren } from "react";

type Props = {
  linkTo: string;
  currentRoute: string[];
  itemPath: string | undefined;
  icon: React.ReactNode;
  textSize?: "text-sm" | "text-lg";
};

const SidebarItem = ({
  linkTo,
  currentRoute,
  itemPath,
  icon,
  textSize = "text-sm",
  children,
}: PropsWithChildren<Props>) => {
  return (
    <li>
      <Link to={linkTo}>
        <div data-tip="Accueil LXP">
          <div
            className={`${textSize} flex gap-5 p-1 px-2 rounded-lg hover:bg-primary/50 ${
              currentRoute[1] === itemPath && "bg-primary/50"
            }`}
          >
            <span>{icon}</span>
            {children}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;

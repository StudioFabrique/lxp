import { Link } from "react-router-dom";
import { PropsWithChildren } from "react";

type Props = {
  linkTo: string;
  currentRoute: string[];
  itemPath: string | undefined;
  icon: React.ReactNode;
};

const SidebarItem = ({
  linkTo,
  currentRoute,
  itemPath,
  icon,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <li>
      <Link to={linkTo}>
        <div data-tip="Accueil LXP">
          <div className="flex gap-2 py-1 items-center">
            <span
              className={`p-2 rounded-lg hover:bg-primary/50 ${
                currentRoute[1] === itemPath && "bg-primary/50"
              }`}
            >
              {icon}
            </span>
            {children}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;

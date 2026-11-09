import { Link, useLocation } from "react-router";

import { formatTitle } from "../../../utils/helpers/text-helpers";

type ModuleContentBreadcrumbsProps = {
  parcoursId?: number | string;
  parcoursTitle?: string;
  moduleTitle: string;
};

const ModuleContentBreadcrumbs = ({
  parcoursId,
  parcoursTitle,
  moduleTitle,
}: ModuleContentBreadcrumbsProps) => {
  const { pathname } = useLocation();
  const baseRoute = pathname.split("/")[1];

  return (
    <nav aria-label="Fil d'Ariane" className="breadcrumbs max-w-full py-0 text-sm [&_ul]:max-sm:flex-wrap">
      <ul>
        <li>
          <Link to={`/${baseRoute}/parcours`} className="link-hover">
            Parcours
          </Link>
        </li>
        {parcoursId !== undefined && parcoursTitle ? (
          <li className="min-w-0">
            <Link
              to={`/${baseRoute}/parcours/view/${parcoursId}`}
              className="link-hover break-words sm:max-w-80 sm:truncate"
              title={formatTitle(parcoursTitle)}
            >
              {formatTitle(parcoursTitle)}
            </Link>
          </li>
        ) : null}
        <li className="min-w-0">
          <span
            aria-current="page"
            className="max-w-48 truncate font-medium sm:max-w-80"
            title={formatTitle(moduleTitle)}
          >
            {formatTitle(moduleTitle)}
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default ModuleContentBreadcrumbs;

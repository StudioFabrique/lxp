import { Edit, Trash2 } from "lucide-react";
import React, { useContext } from "react";
import { ResourceListItem } from "../../views/resources/resources-home";
import { DOWNLOAD_URL } from "../../config/urls";
import { Context } from "../../store/context.store";
import hasPermission from "../../utils/hasPermission";
import { Link } from "react-router-dom";

type Props = {
  resourcesList?: ResourceListItem[] | null;
  children?: React.ReactNode;
};

export default function ResourcesListCard({ resourcesList, children }: Props) {
  // Defensive: if resourcesList is not an array treat as empty
  const list = Array.isArray(resourcesList) ? resourcesList : [];
  const { theme } = useContext(Context);
  const baseStyle = "card glass image-full w-62 shadow-sm h-42";
  const { user } = useContext(Context);

  const style = theme === "light" ? baseStyle + " bg-primary/75" : baseStyle;

  const isAllowed =
    user &&
    user.permissions &&
    hasPermission(user.permissions, "write", "lesson");

  // If no data, render the provided children (fallback UI) if valid
  if (list.length === 0) {
    // If children is a valid React node, render it, otherwise render null
    return (
      <>
        {React.isValidElement(children) || typeof children === "string"
          ? children
          : null}
      </>
    );
  }

  console.log({ isAllowed });

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-10 text-lg font-semibold text-center">
        {list.map((item) => (
          <div key={item.id ?? JSON.stringify(item)} className={style}>
            {item.imageUrl ? (
              <figure>
                <img
                  src={DOWNLOAD_URL + "/activities/images/" + item.imageUrl}
                  alt="Shoes"
                />
              </figure>
            ) : null}
            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>

              <div className="flex justify-around items-end h-full">
                {isAllowed ? (
                  <>
                    <button
                      aria-label="modifier la ressource"
                      className="tooltip tooltip-bottom cursor-pointer"
                      data-tip="Modifier la ressource"
                    >
                      <Edit className="text-primary w-4 h-4" />
                    </button>
                    <button
                      aria-label="supprimer la ressource tooltip-bottom"
                      className="tooltip tooltip-bottom cursor-pointer"
                      data-tip="Supprimer la ressource"
                    >
                      <Trash2 className="text-error w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <Link
                    to={`/student/ressources/details/${item.id}`}
                    className="text-primary text-xs underline cursor-pointer"
                  >
                    Voir les détails
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

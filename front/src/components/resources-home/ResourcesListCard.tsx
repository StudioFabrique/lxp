import { Edit, Trash2 } from "lucide-react";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import React, { useContext } from "react";
import { ResourceListItem } from "../../views/resources/resources-home";
import { DOWNLOAD_URL } from "../../config/urls";
import { Context } from "../../store/context.store";
import Wrapper from "../UI/wrapper/wrapper.component";

type Props = {
  resourcesList?: ResourceListItem[] | null;
  children?: React.ReactNode;
};

export default function ResourcesListCard({ resourcesList, children }: Props) {
  // Defensive: if resourcesList is not an array treat as empty
  const list = Array.isArray(resourcesList) ? resourcesList : [];
  const { theme } = useContext(Context);
  const baseStyle = "card glass image-full w-72 shadow-sm h-42";

  const style = theme === "light" ? baseStyle + " bg-primary/75" : baseStyle;

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

  return (
    <Wrapper>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 text-lg font-semibold text-center">
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
                <button
                  className="text-primary w-4 h-4 cursor-pointer tooltip tooltip-bottom"
                  data-tip="Aperçu de la ressource"
                  aria-label="Aperçu de la ressource"
                >
                  <ArrowTopRightIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Wrapper>
  );
}

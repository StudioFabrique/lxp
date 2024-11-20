import { PropsWithChildren } from "react";
import { ValueAsLink } from "./interfaces/table-list-item";
import { Link } from "react-router-dom";

type CellProps = {
  property: string;
  valuesAsLink: ValueAsLink[];
};

/**
 * Composant qui représente une cellule générique dans le tableau.
 *
 * @component
 * @param {string} props.property - Une propriété spécifique de la cellule.
 * @param {React.ReactNode} props.children - Le contenu à afficher dans la cellule.
 *
 */
const TableListCell = (props: PropsWithChildren<CellProps>) => {
  const valueAsLink = props.valuesAsLink.find(
    (value) => value.property === props.property,
  );
  return (
    <td className="text-primary font-semibold whitespace-nowrap capitalize">
      <div
        data-tip={
          props.children && props.children?.toLocaleString().length > 10
            ? props.children
            : null
        }
        className="tooltip max-w-[18vw] flex"
      >
        {valueAsLink ? (
          <Link
            to={valueAsLink.link}
            className="hover:underline truncate w-full"
          >
            {props.children}
          </Link>
        ) : (
          <p className="truncate">{props.children}</p>
        )}
      </div>
    </td>
  );
};

export default TableListCell;

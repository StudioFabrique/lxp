import { PropsWithChildren } from "react";

type CellProps = {
  property: string;
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
  return (
    <td className="text-primary font-semibold whitespace-nowrap capitalize">
      {props.children}
    </td>
  );
};

export default TableListCell;

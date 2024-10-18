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
const GenericCell = (props: PropsWithChildren<CellProps>) => {
  return <td>{props.children}</td>;
};

export default GenericCell;

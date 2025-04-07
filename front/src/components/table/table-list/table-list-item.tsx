import { PropsWithChildren, ReactNode } from "react";
import TableListAction from "./interfaces/table-list-action";
import TableListCell from "./cell-type/table-list-cell";
import TableListActionCell from "./cell-type/table-list-action-cell";
import {
  CustomModuleComponent,
  DataItem,
  ValueAsLink,
} from "./interfaces/table-list-item";
import TableListAvatarCell from "./cell-type/table-list-avatar-cell";
import TableListCheckboxCell from "./cell-type/table-list-checkbox-cell";

type ItemProps<TData extends Record<string, DataItem>> = {
  id: string;
  data: TData;
  actions?: TableListAction[];
  valuesAsLink: ValueAsLink[];
  avatar?: string;
  style?: { showAvatar?: boolean };
  isAllChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;

  // child components custom modules
  customCellComponents?: CustomModuleComponent[];
};

/**
 * Représente une ligne de données dans le composant TableList
 *
 * @param props Les propriétés du composant
 * @param props.id L'identifiant unique de la ligne
 * @param props.data Les données à afficher dans la ligne
 * @param props.actions Les actions disponibles pour la ligne
 * @param props.avatar L'URL de l'avatar à afficher
 * @param props.style Les options de style de la ligne
 * @param props.isAllChecked Si la checkbox est cochée ou non
 * @param props.onCheck Appelé lors d'un changement de la case à cocher
 */
const TableListItem = <TData extends Record<string, DataItem>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
  const dataEntries = Object.entries(props.data);

  return (
    <tr className="bg-base-100 hover:bg-base-100/60 text-base-content rounded-xl">
      <td className="rounded-l-xl w-0" />

      {/* Affichage de la cellule de checkbox si activé */}
      {props.onCheck ? (
        <TableListCheckboxCell
          id={props.id}
          isAllChecked={props.isAllChecked}
          onCheck={props.onCheck}
        />
      ) : null}

      {/* Affichage d'une cellule d'un avatar si activé */}
      {props.style?.showAvatar ? (
        <TableListAvatarCell avatar={props.avatar} />
      ) : null}

      {/* Affichage des cellules avec valeurs */}
      {dataEntries.map(([key, cell]) =>
        !props.customCellComponents || cell.type === "text" ? (
          <TableListCell
            key={key}
            property={key}
            valuesAsLink={props.valuesAsLink}
          >
            {cell.value as ReactNode}
          </TableListCell>
        ) : (
          (() => {
            const CustomComponent = props.customCellComponents.find(
              (comp) => comp.type === cell.type,
            )?.component;
            return CustomComponent ? (
              <CustomComponent data={cell.value} />
            ) : null;
          })()
        ),
      )}

      {/* Affichage des cellules d'actions */}
      {props.actions?.map((action) => (
        <TableListActionCell key={action.property} id={props.id} {...action} />
      ))}
      <td className="rounded-r-xl w-0" />
    </tr>
  );
};

export default TableListItem;

import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import TableListAction from "./interfaces/table-list-action";
import TableListCell from "./table-list-cell";
import TableListActionCell from "./table-list-action-cell";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import { ValueAsLink } from "./interfaces/table-list-item";

type ItemProps<TData extends Record<string, unknown>> = {
  id: string;
  data: TData;
  actions?: TableListAction[];
  valuesAsLink: ValueAsLink[];
  avatar?: string;
  style?: { showAvatar?: boolean };
  isAllChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
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
const TableListItem = <TData extends Record<string, unknown>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
  console.log({ valuesAsLink: props.valuesAsLink });

  const [isChecked, setCheckedState] = useState<boolean>(false);

  const dataEntries = Object.entries(props.data);

  const handleChangeCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    props.onCheck && props.onCheck(props.id, checked);
    setCheckedState(checked);
  };

  useEffect(() => {
    setCheckedState(props.isAllChecked ?? false);
  }, [props.isAllChecked]);

  return (
    <tr className="h-14 bg-secondary/10 hover:bg-primary/20">
      <td className="rounded-l-xl w-0" />

      {/* Affichage de la cellule de checkbox si activé */}
      {props.onCheck ? (
        <td className="px-0">
          <div className="h-full flex flex-col justify-center">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checkbox-primary"
              onChange={handleChangeCheckbox}
              checked={isChecked}
            />
          </div>
        </td>
      ) : null}

      {/* Affichage d'une cellule d'un avatar si activé */}
      {props.style?.showAvatar ? (
        <td className="pl-4 pr-1">
          <div className="flex justify-center items-center h-full">
            {props.avatar ? (
              <AvatarSmall url={`data:image/jpeg;base64,${props.avatar}`} />
            ) : null}
          </div>
        </td>
      ) : null}

      {/* Affichage des cellules avec valeurs */}
      {dataEntries.map(([key, value]) => (
        <TableListCell
          key={key}
          property={key}
          valuesAsLink={props.valuesAsLink}
        >
          {value as ReactNode}
        </TableListCell>
      ))}

      {/* Affichage des cellules d'actions */}
      {props.actions?.map((action) => (
        <TableListActionCell key={action.property} id={props.id} {...action} />
      ))}
      <td className="rounded-r-xl w-0" />
    </tr>
  );
};

export default TableListItem;

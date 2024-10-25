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

type ItemProps<TData extends Record<string, unknown>> = {
  id: string;
  data: TData;
  actions?: TableListAction[];
  avatar?: string;
  style?: { showAvatar?: boolean };
  isAllChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
};

const TableListItem = <TData extends Record<string, unknown>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
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
    <tr className="h-16 bg-secondary/10 hover:bg-primary/20">
      <td className="rounded-l-xl w-0" />

      {/* Affichage de la checkbox si activé */}
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

      {/* Affichage d'un avatar si activé */}
      {props.style?.showAvatar ? (
        <td className="px-0">
          <div className="flex justify-center items-center h-full">
            {props.avatar ? (
              <AvatarSmall url={`data:image/jpeg;base64,${props.avatar}`} />
            ) : null}
          </div>
        </td>
      ) : null}

      {dataEntries.map(([key, value]) => (
        <TableListCell key={key} property={key}>
          {value as ReactNode}
        </TableListCell>
      ))}

      {props.actions?.map((action) => (
        <TableListActionCell key={action.property} id={props.id} {...action} />
      ))}
      <td className="rounded-r-xl w-0" />
    </tr>
  );
};

export default TableListItem;

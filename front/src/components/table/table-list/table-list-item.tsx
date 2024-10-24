import { PropsWithChildren, ReactNode } from "react";
import TableListAction from "./interfaces/table-list-action";
import TableListCell from "./table-list-cell";
import TableListActionCell from "./table-list-action-cell";
import { AvatarSmall } from "../../UI/avatar/avatar.component";
import imageProfileReplacement from "../../../config/image-profile-replacement";

type ItemProps<TData extends Record<string, unknown>> = {
  id: string;
  data: TData;
  actions?: TableListAction[];
  avatar?: string;
  style?: { showCheckbox?: boolean; showAvatar?: boolean };
};

const TableListItem = <TData extends Record<string, unknown>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
  const dataEntries = Object.entries(props.data);

  return (
    <tr className="h-16 bg-secondary/10 hover:bg-primary/20">
      <td className="rounded-l-xl w-0" />

      {/* Affichage de la checkbox si activé */}
      {props.style?.showCheckbox ? (
        <td className="px-0">
          <div className="h-full flex flex-col justify-center">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checkbox-primary"
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

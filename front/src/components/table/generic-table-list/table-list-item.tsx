import { PropsWithChildren, ReactNode } from "react";
import TableListAction from "./interfaces/table-list-action";
import TableListCell from "./table-list-cell";
import TableListActionCell from "./table-list-action-cell";

type ItemProps<TData extends Record<string, unknown>> = {
  id: string;
  data: TData;
  actions?: TableListAction[];
};

const TableListItem = <TData extends Record<string, unknown>>(
  props: PropsWithChildren<ItemProps<TData>>,
) => {
  const dataEntries = Object.entries(props.data);

  return (
    <tr className="bg-primary-content/50 hover:bg-primary-content">
      <td className="rounded-l-xl w-0" />
      <td>
        <div className="h-full flex flex-col justify-center">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
          />
        </div>
      </td>
      {dataEntries.map(([key, value]) => (
        <TableListCell key={key} property={key}>
          {value as ReactNode}
        </TableListCell>
      ))}
      {props.actions?.map((action) => (
        <TableListActionCell key={action.property} {...action} id={props.id} />
      ))}
      <td className="rounded-r-xl w-0" />
    </tr>
  );
};

export default TableListItem;

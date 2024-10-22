import useTableList from "./hooks/use-table-list";
import { TableListActionConfig } from "./interfaces/table-list-action";
import { TableListItemConfig } from "./interfaces/table-list-item";
import TableListHead from "./table-list-head";
import TableListItem from "./table-list-item";

export type TableListProps<TData extends Record<string, unknown>> = {
  idProperty: string;
  data: TData[];
  tableItems: TableListItemConfig[];
  actionsItems?: TableListActionConfig[];
  style?: { showCheckbox?: boolean; showAvatar?: boolean };
};

const TableList = <TData extends Record<string, string>>(
  props: TableListProps<TData>,
) => {
  // custom hook
  const { labels, tableItems } = useTableList<TData>(
    props.idProperty,
    props.data,
    props.tableItems,
    props.actionsItems,
  );

  return (
    <div className="overflow-auto">
      <table className="table w-full border-separate border-spacing-y-5 ">
        <TableListHead labels={labels} style={props.style} />
        <tbody>
          {tableItems?.map((item) => (
            <TableListItem
              key={item.id}
              id={item.id}
              data={item.data}
              actions={item.actions}
              style={props.style}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableList;

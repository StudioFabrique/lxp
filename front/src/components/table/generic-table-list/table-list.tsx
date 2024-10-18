import useTableList from "./hooks/use-table-list";
import { TableListActionConfig } from "./interfaces/table-list-action";
import { TableListItemConfig } from "./interfaces/table-list-item";
import TableListHead from "./table-list-head";
import TableListItem from "./table-list-item";

type TableListProps<TData extends Record<string, unknown>> = {
  idProperty: string;
  data: TData[];
  tableItems: TableListItemConfig[];
  actionsItems?: TableListActionConfig[];
};

const TableList = <TData extends Record<string, string>>(
  props: TableListProps<TData>,
) => {
  const { labels, tableItems } = useTableList<TData>(
    props.idProperty,
    props.data,
    props.tableItems,
    props.actionsItems,
  );

  return (
    <table className="table w-full border-separate border-spacing-y-5">
      <TableListHead items={labels} />
      <tbody>
        {tableItems?.map((item) => (
          <TableListItem
            key={item.id}
            id={item.id}
            data={item.data}
            actions={item.actions}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TableList;

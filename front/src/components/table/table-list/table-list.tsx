import useTableList from "./hooks/use-table-list";
import { TableListActionConfig } from "./interfaces/table-list-action";
import { TableListItemConfig } from "./interfaces/table-list-item";
import Head from "./table-list-head";
import Body from "./table-list-body";

export type TableListProps<TData extends Record<string, unknown>> = {
  idProperty: string;
  data: TData[];
  tableItems: TableListItemConfig[];
  actionsItems?: TableListActionConfig[];
  style?: {
    emptyArrayMessage?: string;
    showCheckbox?: boolean;
    showAvatar?: boolean;
  };
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
        <Head labels={labels} style={props.style} />
        <Body tableItems={tableItems} style={props.style} />
      </table>
    </div>
  );
};

export default TableList;

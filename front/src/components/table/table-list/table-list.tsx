import useTableList from "./hooks/use-table-list";
import { TableListActionConfig } from "./interfaces/table-list-action";
import { TableListItemConfig } from "./interfaces/table-list-item";
import Head from "./table-list-head";
import Body from "./table-list-body";

export type TableListProps<TData extends Record<string, unknown>> = {
  idProperty: string;
  avatar?: TableListItemConfig;
  data: TData[];
  tableItemsConfig: TableListItemConfig[];
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
    props.tableItemsConfig,
    props.actionsItems,
    props.avatar?.property,
  );

  return (
    <div className="overflow-auto">
      <table className="table w-full border-separate border-spacing-y-5 ">
        <Head
          labels={labels}
          avatar={props.avatar}
          showCheckbox={props.style?.showCheckbox}
          showAvatar={props.style?.showAvatar}
        />
        <Body tableItems={tableItems} style={props.style} />
      </table>
    </div>
  );
};

export default TableList;

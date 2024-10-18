import GenericTableHead from "./generic-table-head";
import GenericTableItem from "./generic-table-item";
import useGenericTable from "./hooks/use-generic-table";
import { GenericActionConfig } from "./interfaces/generic-action";
import GenericItem from "./interfaces/generic-item";

type TableProps<TData extends ArrayLike<string>> = {
  data: TData[];
  tableItems: GenericItem[];
  actionsItems?: GenericActionConfig[];
};

const GenericTable = <TData extends ArrayLike<string>>(
  props: TableProps<TData>,
) => {
  const { labels, filteredData, actions } = useGenericTable<TData>(
    props.data,
    props.tableItems,
    props.actionsItems,
  );

  return (
    <table>
      <GenericTableHead labels={labels} />
      <tbody>
        {filteredData.map((item) => (
          <GenericTableItem data={item} actions={actions} />
        ))}
      </tbody>
    </table>
  );
};

export default GenericTable;

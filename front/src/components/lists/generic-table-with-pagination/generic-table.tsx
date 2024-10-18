import GenericTableHead from "./generic-table-head";
import GenericTableItem from "./generic-table-item";
import useGenericTable from "./hooks/use-generic-table";
import { GenericActionConfig } from "./interfaces/generic-action";
import { GenericItemConfig } from "./interfaces/generic-item";

type TableProps<TData extends Record<string, unknown>> = {
  idProperty: string;
  data: TData[];
  tableItems: GenericItemConfig[];
  actionsItems?: GenericActionConfig[];
};

const GenericTable = <TData extends Record<string, string>>(
  props: TableProps<TData>,
) => {
  const { labels, tableItems } = useGenericTable<TData>(
    props.idProperty,
    props.data,
    props.tableItems,
    props.actionsItems,
  );

  console.log({ labels, tableItems });

  return (
    <table>
      <GenericTableHead items={labels} />
      <tbody>
        {tableItems?.map((item) => (
          <GenericTableItem
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

export default GenericTable;

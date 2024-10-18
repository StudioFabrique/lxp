import { TableListItemConfig } from "./interfaces/table-list-item";

type TableListHeadProps = { items: TableListItemConfig[] };

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead>
      {props.items.map((item) => (
        <th key={item.property}>{item.label ?? ""}</th>
      ))}
    </thead>
  );
};

export default TableListHead;

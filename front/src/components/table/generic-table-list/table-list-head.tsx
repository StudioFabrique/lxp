import { TableListItemConfig } from "./interfaces/table-list-item";

type TableListHeadProps = { items: TableListItemConfig[] };

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead className="">
      <tr>
        {props.items.map((item) => (
          <th key={item.property}>{item.label ?? ""}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableListHead;

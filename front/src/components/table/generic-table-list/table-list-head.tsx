import { TableListItemConfig } from "./interfaces/table-list-item";

type TableListHeadProps = { items: TableListItemConfig[] };

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead className="">
      <tr>
        <th />
        {props.items.map((item) => (
          <th className="text-base-content font-bold" key={item.property}>
            {item.label ?? ""}
          </th>
        ))}
        <th />
      </tr>
    </thead>
  );
};

export default TableListHead;

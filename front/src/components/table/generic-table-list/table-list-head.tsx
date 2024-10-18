import { TableListItemConfig } from "./interfaces/table-list-item";

type TableListHeadProps = { items: TableListItemConfig[] };

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead>
      <tr>
        <th />
        <th>
          <div className="h-full flex flex-col justify-center">
            <input type="checkbox" className="checkbox" />
          </div>
        </th>
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

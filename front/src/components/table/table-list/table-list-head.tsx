import { TableListItemConfig } from "./interfaces/table-list-item";

type TableListHeadProps = {
  items: TableListItemConfig[];
  style?: { showCheckbox?: boolean; showAvatar?: boolean };
};

const TableListHead = (props: TableListHeadProps) => {
  return (
    <thead>
      <tr>
        <th />
        {props.style?.showCheckbox ? (
          <th className="pl-0 w-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
              />
            </div>
          </th>
        ) : null}
        {props.items.map((item) => (
          <th className="text-base-content font-bold" key={item.property}>
            {item.label ?? ""}
          </th>
        ))}
        <th className="px-0" />
      </tr>
    </thead>
  );
};

export default TableListHead;

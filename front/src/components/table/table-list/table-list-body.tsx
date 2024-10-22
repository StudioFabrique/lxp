import TableListItem from "./interfaces/table-list-item";
import Item from "./table-list-item";

type TableListBodyProps = {
  tableItems: TableListItem[] | null;
  style?: {
    emptyArrayMessage?: string;
    showCheckbox?: boolean;
    showAvatar?: boolean;
  };
};

const TableListBody = (props: TableListBodyProps) => {
  if (props.tableItems)
    return (
      <tbody>
        {props.tableItems?.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            data={item.data}
            actions={item.actions}
            style={props.style}
          />
        ))}
      </tbody>
    );

  return (
    <tbody>
      <tr>
        <td />
        <td />
        <td className="text-nowrap">
          {props.style?.emptyArrayMessage ?? "Aucune données"}
        </td>
      </tr>
    </tbody>
  );
};

export default TableListBody;

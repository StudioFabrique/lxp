import TableListItem from "./interfaces/table-list-item";
import Item from "./table-list-item";

type TableListBodyProps = {
  tableItems: TableListItem[] | null;
  propertiesLength: number;
  style?: {
    emptyArrayMessage?: string;
    showAvatar?: boolean;
  };
  isAllChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
};

const TableListBody = (props: TableListBodyProps) => {
  // Si les données sont présentes, alors les items de
  // tableaux sont affichés.
  if (props.tableItems && props.tableItems.length > 0)
    return (
      <tbody>
        {props.tableItems.map((item) => (
          <Item
            key={item.id}
            {...item}
            style={props.style}
            isAllChecked={props.isAllChecked}
            onCheck={props.onCheck}
          />
        ))}
      </tbody>
    );

  // Si aucune donnée, alors afficher un message dans
  // le corps du tableau.
  return (
    <tbody>
      <tr>
        <td />
        <td
          colSpan={props.propertiesLength}
          className="text-nowrap text-center text-secondary"
          style={{ verticalAlign: "middle" }}
        >
          {props.style?.emptyArrayMessage ?? "Aucune données"}
        </td>
      </tr>
    </tbody>
  );
};

export default TableListBody;

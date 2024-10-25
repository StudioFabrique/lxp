import TableListItem from "./interfaces/table-list-item";
import Item from "./table-list-item";

type TableListBodyProps = {
  tableItems: TableListItem[] | null;
  propertiesLength: number;
  style?: {
    emptyArrayMessage?: string;
    showCheckbox?: boolean;
    showAvatar?: boolean;
  };
};

const TableListBody = (props: TableListBodyProps) => {
  // Si les données sont présentes, alors les items de
  // tableaux sont affichés.
  if (props.tableItems && props.tableItems.length > 0)
    return (
      <tbody>
        {props.tableItems.map((item) => (
          <Item key={item.id} {...item} style={props.style} />
        ))}
      </tbody>
    );

  // Si aucune donnée, alors afficher un message dans
  // le corps du tableau.
  return (
    <tbody>
      <tr>
        <td />
        <td colSpan={props.propertiesLength} className="text-nowrap">
          {props.style?.emptyArrayMessage ?? "Aucune données"}
        </td>
      </tr>
    </tbody>
  );
};

export default TableListBody;

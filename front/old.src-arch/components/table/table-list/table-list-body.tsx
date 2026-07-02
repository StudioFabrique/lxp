import TableListItem, {
  CustomModuleComponent,
} from "./interfaces/table-list-item";
import Item from "./table-list-item";

type TableListBodyProps = {
  tableItems: TableListItem[] | null;
  style?: {
    showAvatar?: boolean;
  };
  isAllChecked?: boolean;
  onCheck?: (id: string, checked: boolean) => void;

  // child components custom modules
  customCellComponents?: CustomModuleComponent[];
};

const TableListBody = (props: TableListBodyProps) => {
  // Si les données sont présentes, alors les items de
  // tableaux sont affichés.
  if (props.tableItems)
    return (
      <tbody>
        {props.tableItems.map((item) => (
          <Item
            key={item.id}
            {...item}
            style={props.style}
            isAllChecked={props.isAllChecked}
            onCheck={props.onCheck}
            customCellComponents={props.customCellComponents}
          />
        ))}
      </tbody>
    );
};

export default TableListBody;

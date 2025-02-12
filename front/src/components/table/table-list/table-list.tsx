import useTableList from "./hooks/use-table-list";
import { TableListActionConfig } from "./interfaces/table-list-action";
import { TableListItemConfig } from "./interfaces/table-list-item";
import Head from "./table-list-head";
import Body from "./table-list-body";
import TableEmpty, { TableEmptyProps } from "./table-empty";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";

export type TableListProps<TData> = {
  idProperty: string;
  avatar?: TableListItemConfig;
  data: TData[];
  tableItemsConfig: TableListItemConfig[];
  actionsItems?: TableListActionConfig[];
  style?: {
    emptyArrayMessage?: TableEmptyProps;
    showAvatar?: boolean;
  };
  isAllChecked?: boolean;
  sortProperty?: string | null;
  isAscDirection?: boolean;
  onCheck?: (id: string, checked: boolean) => void;
  onCheckAll?: (checked: boolean) => void;
  onSortProperty?: (property: string) => void;
};

/**
 * Représente un tableau avec des listes d'éléments configurables et des actions
 * @template TData - Type générique des données du tableau
 * @param props.idProperty - Propriété unique pour identifier chaque ligne
 * @param props.avatar - Configuration de l'avatar (optionnel)
 * @param props.data - Données à afficher dans le tableau
 * @param props.tableItemsConfig - Configuration des colonnes du tableau
 * @param props.actionsItems - Actions disponibles pour chaque ligne (optionnel)
 * @param props.style - Options de style du tableau (optionnel)
 *
 * @component
 */
const TableList = <TData extends Record<string, string>>(
  props: TableListProps<TData>,
) => {
  // custom hook
  const { labels, tableItems } = useTableList<TData>(
    props.idProperty,
    props.data,
    props.tableItemsConfig,
    props.actionsItems,
    props.avatar?.property,
  );

  const itemsLength = tableItems?.length || 0;

  return itemsLength > 0 ? (
    <div className="w-full overflow-x-auto">
      <table className="table border-separate border-spacing-y-5">
        <Head
          labels={labels}
          avatar={props.avatar}
          showAvatar={props.style?.showAvatar}
          isAllChecked={props.isAllChecked}
          sortProperty={props.sortProperty}
          isAscDirection={props.isAscDirection}
          onCheckAll={props.onCheckAll}
          onSortProperty={props.onSortProperty}
        />

        <Body
          tableItems={tableItems}
          style={props.style}
          isAllChecked={props.isAllChecked}
          onCheck={props.onCheck}
        />
      </table>
    </div>
  ) : (
    <FadeWrapper>
      <TableEmpty {...props.style?.emptyArrayMessage} />
    </FadeWrapper>
  );
};

export default TableList;

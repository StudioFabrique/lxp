import useTableList from "./hooks/use-table-list";
import { TableListActionConfig } from "./interfaces/table-list-action";
import { TableListItemConfig } from "./interfaces/table-list-item";
import Head from "./table-list-head";
import Body from "./table-list-body";

export type TableListProps<TData> = {
  idProperty: string;
  avatar?: TableListItemConfig;
  data: TData[];
  tableItemsConfig: TableListItemConfig[];
  actionsItems?: TableListActionConfig[];
  style?: {
    emptyArrayMessage?: string;
    showCheckbox?: boolean;
    showAvatar?: boolean;
  };
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

  return (
    <div className="carousel carousel-vertical h-[55vh]">
      <table className="table border-separate border-spacing-y-5">
        <Head
          labels={labels}
          avatar={props.avatar}
          showCheckbox={props.style?.showCheckbox}
          showAvatar={props.style?.showAvatar}
        />
        <Body
          tableItems={tableItems}
          propertiesLength={labels.length}
          style={props.style}
        />
      </table>
    </div>
  );
};

export default TableList;

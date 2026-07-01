import { useCallback, useEffect, useState } from "react";
import {
  constructLabels,
  generateTableActions,
  generateTableItem,
} from "../services/generic-table-service";
import TableListItem, {
  TableListItemConfig,
  TableListItemLabels,
} from "../interfaces/table-list-item";
import { TableListActionConfig } from "../interfaces/table-list-action";

/**
 * Un hook personnalisé pour gérer une table générique
 *
 * @template TData - Le type des données de la table (exemple: Group, User)
 * @param idProperty - La propriété de l'objet qui permet l'identification de l'id
 * @param data - Les données à afficher dans la table
 * @param itemsConfig - Les éléments de configuration de la table
 * @param actionsItems - Les éléments de configuration des actions de chaque élément
 * @param avatarProperty - La propriété pour trouver l'avatar (optionnel)
 * @returns labels - Les labels des données dans l'entête du tableau
 * @returns tableItems - Les données filtrées en fonction de l'entrée de configuration
 *
 */
function useTableList<TData extends Record<string, string>>(
  idProperty: string,
  data: TData[],
  itemsConfig: TableListItemConfig[],
  actionsItems?: TableListActionConfig[],
  avatarProperty?: string,
) {
  const [tableItems, setTableItems] = useState<TableListItem[] | null>(null);

  const labels: TableListItemLabels[] = constructLabels(
    itemsConfig,
    actionsItems,
  );

  const handleGenerateItems = useCallback(() => {
    setTableItems(null);

    data.forEach((item) => {
      const filteredData = generateTableItem(
        item,
        itemsConfig,
        idProperty,
        actionsItems ? generateTableActions(item, actionsItems) : undefined,
        avatarProperty,
      );

      setTableItems((prevItems) => [...(prevItems ?? []), filteredData]);
    });
  }, [data, actionsItems, idProperty, itemsConfig, avatarProperty]);

  useEffect(() => {
    handleGenerateItems();
  }, [handleGenerateItems]);

  return { labels, tableItems };
}

export default useTableList;

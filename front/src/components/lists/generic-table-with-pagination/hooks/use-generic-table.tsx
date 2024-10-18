import { useCallback, useEffect, useState } from "react";
import { GenericActionConfig } from "../interfaces/generic-action";
import GenericItem, { GenericItemConfig } from "../interfaces/generic-item";
import {
  constructLabels,
  generateTableActions,
  generateTableItem,
} from "../services/generic-table-services";

/**
 * Un hook personnalisé pour gérer une table générique
 *
 * @template TData - Le type des données de la table (exemple: Group, User)
 * @param idProperty - La propriété de l'objet qui permet l'identification de l'id
 * @param data - Les données à afficher dans la table
 * @param items - Les éléments de configuration de la table
 * @param actionsItems -
 * @returns labels - Les labels des données dans l'entête du tableau
 * @returns filteredData - Les données filtrées en fonction
 * @returns actions - Les actions dans chaque lignes du tableau avec les données
 *
 */
function useGenericTable<TData extends Record<string, string>>(
  idProperty: string,
  data: TData[],
  itemsConfig: GenericItemConfig[],
  actionsItems?: GenericActionConfig[],
) {
  const [tableItems, setTableItems] = useState<GenericItem[] | null>(null);

  const labels: GenericItemConfig[] = constructLabels(
    itemsConfig,
    actionsItems,
  );

  // for each items :
  // - add the id
  // - add data with selected properties
  // - add actions (Array)
  //

  const handleGenerateItems = useCallback(() => {
    setTableItems(null);
    data.forEach((d) => {
      const filteredData = generateTableItem(
        d,
        itemsConfig,
        idProperty,
        actionsItems ? generateTableActions(d, actionsItems) : undefined,
      );
      setTableItems((prevItems) => [...(prevItems ?? []), filteredData]);
    });
  }, [data, actionsItems, idProperty, itemsConfig]);

  useEffect(() => {
    handleGenerateItems();
  }, [handleGenerateItems]);

  return { labels, tableItems };
}

export default useGenericTable;

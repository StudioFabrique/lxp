import TableListAction, {
  TableListActionConfig,
} from "../interfaces/table-list-action";
import TableListItem, {
  DataItem,
  TableListItemConfig,
  TableListItemLabels,
  ValueAsLink,
} from "../interfaces/table-list-item";

/**
 * Construit les labels pour l'en-tête du tableau à partir de la configuration
 *
 * @param items - Les éléments de configuration de base du tableau
 * @param actionsItems - Les éléments de configuration des actions (optionnel)
 * @returns Un tableau de labels avec leurs propriétés
 */
export function constructLabels(
  items: TableListItemConfig[],
  actionsItems?: TableListActionConfig[],
): TableListItemLabels[] {
  return actionsItems
    ? [
        ...items.map((item) => ({
          label: item.label,
          property: item.property,
          isAction: false,
          sortAllowed: item.sortAllowed,
        })),
        ...actionsItems.map((item) => ({
          label: item.label,
          property: item.property,
          isAction: true,
        })),
      ]
    : items.map((item) => ({
        label: item.label,
        property: item.property,
        isAction: false,
        sortAllowed: item.sortAllowed,
      }));
}

/**
 * Génère un élément du tableau à partir des données et de la configuration
 *
 * @param dataToTransform - Les données brutes à transformer
 * @param itemsConfig - La configuration des colonnes du tableau
 * @param idProperty - La propriété servant d'identifiant
 * @param actions - Les actions associées à la ligne (optionnel)
 * @param avatarProperty - La propriété pour l'avatar (optionnel)
 * @returns Un élément formaté pour le tableau
 */
export function generateTableItem(
  dataToTransform: Record<string, string>,
  itemsConfig: TableListItemConfig[],
  idProperty: string,
  actions?: TableListAction[],
  avatarProperty?: string,
): TableListItem {
  const id = dataToTransform[idProperty] || "1";
  const avatar = avatarProperty ? dataToTransform[avatarProperty] : undefined;

  // Create an ordered object based on itemsConfig
  const orderedData: Record<string, DataItem> = {};
  const valuesAsLink: ValueAsLink[] = [];
  itemsConfig.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(dataToTransform, item.property)) {
      // Dans le cas la propriété existe
      orderedData[item.property] = {
        type: item.type ?? "text",
        value: dataToTransform[item.property] || "-",
      };
    } else {
      // Dans le cas la propriété n'existe pas
      orderedData[item.property] = {
        type: "text",
        value: "-",
      };
    }

    if (item.valueAsLink) {
      const valueFromIdentifier: string | null | undefined =
        dataToTransform[item.valueAsLink.identifier];
      if (valueFromIdentifier)
        valuesAsLink.push({
          property: item.property,
          link: item.valueAsLink.link.replace("[:id]", valueFromIdentifier),
        });
    }
  });

  return {
    id,
    data: orderedData,
    actions,
    avatar,
    valuesAsLink,
  };
}

/**
 * Génère les actions du tableau à partir des données et de la configuration
 *
 * @param dataToTransform - Les données brutes à transformer
 * @param actionsConfig - La configuration des actions
 * @returns Un tableau d'actions formatées
 */
export function generateTableActions(
  dataToTransform: Record<string, string>,
  actionsConfig: TableListActionConfig[],
): TableListAction[] {
  const entries = Object.entries(dataToTransform);
  const actions: TableListAction[] = actionsConfig.map((action) => {
    const inputEntry = entries.find(([key]) => key === action.property);
    if (!inputEntry) {
      return action;
    }
    const inputValue = inputEntry[1];

    return { ...action, inputValue };
  });
  return actions;
}

/**
 * Extrait les IDs des données fournies
 *
 * @param data - Les données sources
 * @param idProperty - La propriété servant d'identifiant
 * @returns Un tableau des IDs extraits
 */
export function generateTableIdsFromData<TData>(
  data: TData[],
  idProperty: string,
): string[] {
  const ids: string[] = [];
  for (const item in data) {
    if (data[item][idProperty as keyof TData]) {
      const currentId = data[item][idProperty as keyof TData];
      if (currentId) {
        ids.push(String(currentId));
      }
    }
  }

  return ids;
}

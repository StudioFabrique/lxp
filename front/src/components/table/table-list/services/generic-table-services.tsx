import TableListAction, {
  TableListActionConfig,
} from "../interfaces/table-list-action";
import TableListItem, {
  TableListItemConfig,
  TableListItemLabels,
} from "../interfaces/table-list-item";

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
      }));
}

export function generateTableItem(
  dataToTransform: Record<string, string>,
  itemsConfig: TableListItemConfig[],
  idProperty: string,
  actions?: TableListAction[],
): TableListItem {
  const entries = Object.entries(dataToTransform);
  const properties = itemsConfig.map((item) => item.property);
  const filteredEntries = entries.filter(([key]) => properties.includes(key));
  const filteredData = Object.fromEntries(filteredEntries);
  const idEntry = entries.find(([key]) => key === idProperty);
  if (!idEntry) {
    return { id: "1", data: filteredData, actions: actions };
  }
  const id = idEntry[1];

  return { id: id, data: filteredData, actions: actions };
}

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

import GenericAction, {
  GenericActionConfig,
} from "../interfaces/generic-action";
import GenericItem, { GenericItemConfig } from "../interfaces/generic-item";

export function constructLabels(
  items: GenericItemConfig[],
  actionsItems?: GenericActionConfig[],
) {
  return actionsItems
    ? [
        ...items.map((item) => ({
          label: item.label,
          property: item.property,
        })),
        ...actionsItems.map((item) => ({
          label: item.label,
          property: item.property,
        })),
      ]
    : items.map((item) => ({
        label: item.label,
        property: item.property,
      }));
}

export function generateTableItem(
  dataToTransform: Record<string, string>,
  itemsConfig: GenericItemConfig[],
  idProperty: string,
  actions?: GenericAction[],
): GenericItem {
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
  actionsConfig: GenericActionConfig[],
): GenericAction[] {
  const entries = Object.entries(dataToTransform);
  const actions: GenericAction[] = actionsConfig.map((action) => {
    const inputEntry = entries.find(([key]) => key === action.property);
    if (!inputEntry) {
      return action;
    }
    const inputValue = inputEntry[1];

    return { ...action, inputValue };
  });
  return actions;
}

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
  avatarProperty?: string,
): TableListItem {
  const id = dataToTransform[idProperty] || "1";
  const avatar = avatarProperty ? dataToTransform[avatarProperty] : undefined;

  // Create an ordered object based on itemsConfig
  const orderedData: Record<string, string> = {};
  itemsConfig.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(dataToTransform, item.property)) {
      orderedData[item.property] = dataToTransform[item.property];
    }
  });

  return { id, data: orderedData, actions, avatar };
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

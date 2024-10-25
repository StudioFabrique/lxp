import TableListAction from "./table-list-action";

export interface TableListItemConfig {
  property: string;
  label?: string;
}

export type TableListItemLabels = TableListItemConfig & { isAction: boolean };

export interface TableListItem {
  id: string;
  data: Record<string, string>;
  actions?: TableListAction[];
  avatar?: string;
}

export default TableListItem;

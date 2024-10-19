import TableListAction from "./table-list-action";

export interface TableListItemConfig {
  property: string;
  label?: string;
}

export interface TableListItem {
  id: string;
  data: Record<string, string>;
  actions?: TableListAction[];
}

export default TableListItem;

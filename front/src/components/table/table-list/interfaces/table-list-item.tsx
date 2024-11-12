import TableListAction from "./table-list-action";

export type ValueAsLink = {
  link: string; // example : /parcours/[:id]
  identifier: string; // example : parcoursId
};

export interface TableListItemConfig {
  property: string;
  label?: string;
  valueAsLink?: ValueAsLink; // Rediriger l'utilisateur vers un lien au clic de la valeur du tableau
  sortAllowed?: boolean;
}

export type TableListItemLabels = TableListItemConfig & { isAction: boolean };

export interface TableListItem {
  id: string;
  data: Record<string, string>;
  actions?: TableListAction[];
  avatar?: string;
}

export default TableListItem;

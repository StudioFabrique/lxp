import TableListAction from "./table-list-action";

export type ValueAsLinkConfig = {
  link: string; // example : /parcours/[:id]
  identifier: string; // example : parcoursId
};

export type ValueAsLink = {
  property: string;
  link: string;
};

export interface TableListItemConfig {
  property: string;
  label?: string;
  valueAsLink?: ValueAsLinkConfig; // Rediriger l'utilisateur vers un lien au clic de la valeur du tableau
  sortAllowed?: boolean;
}

export type TableListItemLabels = TableListItemConfig & { isAction: boolean };

export interface TableListItem {
  id: string;
  data: Record<string, string>;
  valuesAsLink: ValueAsLink[];
  actions?: TableListAction[];
  avatar?: string;
}

export default TableListItem;

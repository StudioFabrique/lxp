import GenericAction from "./generic-action";

export interface GenericItemConfig {
  property: string;
  label?: string;
}

export interface GenericItem {
  id: string;
  data: Record<string, string>;
  actions?: GenericAction[];
}

export default GenericItem;

import { LucideIcon } from "lucide-react";

export type TableListActionType = "button" | "link" | "toggle" | "checkbox";

export interface TableListActionConfig {
  type: TableListActionType;
  property: string;
  label?: string;
  title?: string;
  tooltip?: string;
  icon?: LucideIcon;
  additionnalClassname?: string;
  withConfirmationModal?: boolean;
  request?: { path: string; method: string };
  onSuccessfulSubmit?: (id: string, value?: string | boolean) => void;
  onFailedSubmit?: (id: string, value?: string | boolean) => void;
}

interface TableListActionData {
  inputValue?: string;
}

type TableListAction = TableListActionConfig & TableListActionData;

export default TableListAction;

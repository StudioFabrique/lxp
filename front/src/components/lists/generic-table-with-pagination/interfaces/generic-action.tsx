import { LucideIcon } from "lucide-react";

export type GenericActionType = "button" | "link" | "toggle" | "checkbox";

export interface GenericActionConfig {
  type: GenericActionType;
  property: string;
  label?: string;
  withConfirmationModal?: boolean;
  icon?: LucideIcon;
  request?: { path: string; method: string };
  onSuccessfulSubmit?: (id: string, value?: string | boolean) => void;
  onFailedSubmit?: (id: string, value?: string | boolean) => void;
}

interface GenericActionData {
  inputValue?: string;
}

type GenericAction = GenericActionConfig & GenericActionData;

export default GenericAction;

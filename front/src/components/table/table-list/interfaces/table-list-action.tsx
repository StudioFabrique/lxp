import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { LucideIcon } from "lucide-react";
import { PaginatedResponse } from "../../../../api-queries/table.api";

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
  modal?: { title?: string; description?: string };
  request?: { path: string; method?: "get" | "post" | "put" | "delete" };
  rbacObject?: string;
  rbacAction?: string;
  onSuccessfulSubmit?: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<NoInfer<PaginatedResponse<unknown>>, Error>>;
  onFailedSubmit?: (id: string, value?: string | boolean) => void;
}

interface TableListActionData {
  inputValue?: string;
}

type TableListAction = TableListActionConfig & TableListActionData;

export default TableListAction;

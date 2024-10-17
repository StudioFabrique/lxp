interface GenericActionData {
  id: string;
  property: string;
  label?: string;
  state?: boolean;
}

type ActionType = "button" | "link" | "toggle" | "checkbox";
// include list selecter type later

export type GenericAction = {
  data: GenericActionData;
  type: ActionType;
  request?: { path: string; method: string };
  onSuccessfulSubmit?: (data: GenericActionData) => void;
  onFailedSubmit?: (data: GenericActionData) => void;
};

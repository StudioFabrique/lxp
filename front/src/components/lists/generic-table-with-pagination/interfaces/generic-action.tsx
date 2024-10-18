export type GenericActionType = "button" | "link" | "toggle" | "checkbox";
// include list selecter type later

export interface GenericActionConfig<TData = void> {
  property: string;
  type: GenericActionType;
  label?: string;
  request?: { path: string; method: string };
  onSuccessfulSubmit?: (id: string, data?: TData) => void;
  onFailedSubmit?: (id: string, data?: TData) => void;
}

interface GenericActionData<TData = void> {
  id?: string;
  data?: TData;
  inputValue?: string;
}

type GenericAction<TData = void> = GenericActionConfig<TData> &
  GenericActionData<TData>;

export default GenericAction;

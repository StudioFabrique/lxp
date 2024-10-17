export default interface GenericAction {
  id: string;
  type: ActionType;
  submitUrl?: string;
  state?: boolean;
  onSuccessfulSubmit?: (id: string) => void;
  onFailedSubmit?: (id: string) => void;
}

type ActionType = "submit" | "button" | "toggle" | "checkbox";

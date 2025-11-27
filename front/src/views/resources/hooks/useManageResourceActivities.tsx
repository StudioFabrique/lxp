import { useState } from "react";
import { Activity } from "../../../utils/interfaces/activity";
import { initialState } from "../../../components/edit-parcours/modules/useNewModuleReducer";

type State = {
  mode: "read" | "write" | "edit";
  activity: Activity | null;
  toggleTipTapEditor: () => void;
  showTipTapEditor: boolean;
};

type Action =
  | { type: "SET_MODE"; payload: "read" | "write" | "edit" }
  | { type: "SET_ACTIVITY"; payload: Activity | null }
  | { type: "TOGGLE_TIPTAP_EDITOR" };

initialState: State = {
  mode: "read",
  activity: null,
  showTipTapEditor: false,
  toggleTipTapEditor: () => {},
};

const activityReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_ACTIVITY":
      return { ...state, activity: action.payload };
    case "TOGGLE_TIPTAP_EDITOR":
      return { ...state, showTipTapEditor: !state.showTipTapEditor };
    default:
      return state;
  }

const useManageResourceActivities = (
  data: Activity,
  activityState: "read" | "write" | "edit"
) => {};

export default useManageResourceActivities;

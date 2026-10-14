import { useContext } from "react";
import {
  MobileHeaderActionsContext,
  type MobileHeaderActions,
} from "../store/MobileHeaderActionsProvider";

export const useMobileHeaderActions = (): MobileHeaderActions | null =>
  useContext(MobileHeaderActionsContext);

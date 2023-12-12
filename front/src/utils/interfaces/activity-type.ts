import { ReactNode } from "react";

export default interface ActivityType {
  id?: number;
  icon: ReactNode;
  label: string;
  tooltip: string;
  type: string;
}

import { PropsWithChildren } from "react";
import { theme } from "./calendar-configuration";
import { cn } from "../../../utils/cn";

const CalendarHeader = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={cn("flex items-center justify-between px-4 py-3 border-b", theme.border, theme.headerBg)}
    >
      {Array.isArray(children) ? children.map((node) => node) : children}
    </div>
  );
};

export default CalendarHeader;

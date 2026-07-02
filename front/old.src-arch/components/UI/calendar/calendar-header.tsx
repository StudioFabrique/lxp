import { PropsWithChildren, ReactNode } from "react";
import { theme } from "./calendar-configuration";

type Props = {
  darkMode?: boolean;
};

const CalendarHeader = ({
  darkMode,
  children,
}: PropsWithChildren<Props> | ({ children: ReactNode[] } & Props)) => {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 border-b ${
        theme(darkMode).border
      } ${theme(darkMode).headerBg}`}
    >
      {Array.isArray(children) ? children.map((node) => node) : children}
    </div>
  );
};

export default CalendarHeader;

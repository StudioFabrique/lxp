import { ReactNode, useContext } from "react";
import { Context } from "../../../store/context.store";
import SidebarBottom from "./sidebar-bottom";

const SidebarWrapper = ({
  children,
  interfaceType,
}: {
  children: ReactNode;
  interfaceType: string;
}) => {
  const { theme } = useContext(Context);

  return (
    <nav
      className={`w-[20rem] flex flex-col justify-between gap-y-4 px-2 py-4 rounded-xl gap-2 ${
        theme === "dark" ? "text-white bg-slate-500" : "text-white bg-slate-800"
      }`}
    >
      {children}
      <SidebarBottom interfaceType={interfaceType} />
    </nav>
  );
};

export default SidebarWrapper;

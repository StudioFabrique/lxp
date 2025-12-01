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
    <nav className="w-[18rem] h-screen pt-2 flex flex-col gap-2">
      <div
        className={`flex flex-col justify-between gap-y-4 px-2 py-4 rounded-xl h-full relative ${
          theme === "dark"
            ? "text-white bg-slate-500"
            : "text-white bg-slate-800"
        }`}
      >
        {children}
        <SidebarBottom interfaceType={interfaceType} />
      </div>
    </nav>
  );
};

export default SidebarWrapper;

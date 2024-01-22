import { ReactNode, useContext } from "react";
import { Context } from "../../../store/context.store";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useContext(Context);

  return (
    <nav className="w-fit h-full fixed p-5 z-10">
      <div
        className={`flex flex-col gap-y-4 p-5 rounded-lg h-full relative ${
          theme === "dark"
            ? "text-white bg-slate-500"
            : "text-white bg-slate-800"
        }`}
      >
        <div className="h-full flex flex-col justify-between">{children}</div>
      </div>
    </nav>
  );
};

export default SidebarWrapper;

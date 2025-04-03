import { ReactNode, useContext } from "react";
import { Context } from "../../../store/context.store";
import logo from "./logo.png";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useContext(Context);

  return (
    <nav className="w-24 h-screen fixed p-4 z-10 flex flex-col gap-2">
      <div className="w-full bg-slate-100 rounded-lg">
        <img
          className="h-full w-full object-contain rounded-lg border-slate-700 border-2 p-1"
          src={logo}
        />
      </div>
      <div
        className={`flex flex-col gap-y-4 p-4 pt-6 rounded-lg h-full relative ${
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

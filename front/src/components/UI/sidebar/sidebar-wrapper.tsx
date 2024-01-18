import { ReactNode } from "react";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="w-fit h-full fixed p-5">
      <div className="flex flex-col gap-y-4 p-5 rounded-lg h-full relative text-white bg-slate-800">
        <div className="h-full flex flex-col justify-between">{children}</div>
      </div>
    </nav>
  );
};

export default SidebarWrapper;

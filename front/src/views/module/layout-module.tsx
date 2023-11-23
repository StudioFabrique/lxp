import { Outlet } from "react-router-dom";

const LayoutModule = () => {
  return (
    <div className="w-full flex p-2">
      <div className="flex-1 min-h-screen pl-10">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutModule;

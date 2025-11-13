import { Outlet } from "react-router-dom";

const LayoutModule = () => {
  return (
    <div className="flex-1 min-h-screen flex justify-center p-2">
      <Outlet />
    </div>
  );
};

export default LayoutModule;
